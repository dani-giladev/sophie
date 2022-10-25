Ext.define('App.controller.maintenance.dynamicFilterForm', {
    extend: 'App.controller.maintenance.maintenance',

    refreshFilterForm: function(config)
    {        
        var me = this, store, proxy;
        var thisForm = me.getComponentQuery('dynamicFilterForm', config);
        var fields = thisForm.query('combo');
        Ext.each(fields, function(field)
        {
            store = field.getStore();
            proxy = store.getProxy();
            if (proxy.endpoint)
            {
                proxy.url = restpath + proxy.endpoint;
            }
            store.reload();
        });
    },

    resetFilterForm: function(config)
    {        
        var me = this;
        var thisForm = me.getComponentQuery('dynamicFilterForm', config);
        thisForm.getForm().reset();
    },
    
    disableFilterForm: function(config)
    {
        var me = this;
        var thisForm = me.getComponentQuery('dynamicFilterForm', config);
        thisForm.disable();
    },
    
    getGridColumns: function(store)
    {
        var me = this;
        var ret = [];
        
        var fields = me.getModelFields(store);
        
        Ext.each(fields, function(field) {
            if (field.gridcolumn)
            {
//                console.log(field); 
                field.gridcolumn.text = me.transLabel(field.label);
                field.gridcolumn.dataIndex = field.name;
//                field.gridcolumn.filterable = true;
//                field.gridcolumn.filter = {type: field.filtertype};
                ret.push(field.gridcolumn);
            }
        }); 
        
//        console.log(ret);
        return ret;
    },
    
    renderPanelFilter: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        var container = me.getComponentQuery('dynamicFilterForm_container', config);
        var store = grid.getStore();
        
        var fields = me.getModelFields(store);
        var panelfilters = [];
        Ext.each(fields, function(field) {
            if (field.panelfilter)
            {
                field.panelfilter.label = field.label;
                field.panelfilter.name = field.name;
                field.panelfilter.filtertype = field.filtertype;
                if (field.filteroperators)
                {
                    field.panelfilter.filteroperators = field.filteroperators;
                }
                field.panelfilter._initialized = false;
                panelfilters.push(field.panelfilter);                
            }
        });
        
        //console.log(panelfilters);

        // Set mask to container
        if(!container)
        {
            return;
        }
        
        try {
            container.getEl().mask();
        } catch (exception) {} 

        // Remove all items before add new ones
        if (container)
        {
            container.removeAll(true);
        }
        
        //console.log("Starting render");
        container._is_all_initialized = false;
        container._update_filters_is_needed = false;
        
        Ext.each(panelfilters, function(panelfilter) {
            //console.log(panelfilter);
            panelfilter.fieldLabel = me.transLabel(panelfilter.label);
            if (!panelfilter.listeners)
            {
                panelfilter.listeners = {};
            }
            panelfilter.listeners['change'] = function(field, newValue, oldValue, eOpts) {
                if (newValue === oldValue) return;
                if (container._is_all_initialized)
                {
                    //console.log("Change event", field.fieldLabel, newValue)
                    me.updateFilters(config);
                }
                if (field._secondChangeListener)
                {
                    field._secondChangeListener();
                }
            };

            panelfilter.value = '';
            panelfilter.disabled = false;

            // Set default values
            var any_filters = (!Ext.isEmpty(config.filters) && !Ext.isEmpty(config.filters[panelfilter.name]));
            var filter_with_default_value = (any_filters || panelfilter._default_value);
            if (filter_with_default_value)
            {
                container._update_filters_is_needed = true;
                var value;
                if (!Ext.isEmpty(config.filters) && !Ext.isEmpty(config.filters[panelfilter.name]))
                {
                    value = config.filters[panelfilter.name];
                }//if (panelfilter._default_value)
                else
                {
                    value = panelfilter._default_value;
                }
                if (panelfilter.xtype === 'combo' && !panelfilter._has_local_data)
                {
                    me.onAddContainer(container, value, panelfilters, config, true);
                }
                else
                {
                    me.onAddContainer(container, value, panelfilters, config, false);
                }
                if (any_filters)
                {
                    panelfilter.disabled = true;
                }
            }
            else
            {
                me.onAddContainer(container, "*!¿", panelfilters, config, false);
            }

            panelfilter._is_filter = true;
            panelfilter._filtertype = panelfilter.filtertype;
            panelfilter._name = panelfilter.name;
            panelfilter.labelWidth = 100;

            if (container)
            {
                if (panelfilter.filteroperators)
                {
                    me.addFilterOperator(container, panelfilter, config);
                }
                else
                {
                    container.add(panelfilter);
                }
            }
        });
                    
        me.updateStoreLabels(config);
        
        //console.log("End render");
    },
    
    addFilterOperator: function(container, panelfilter, config)
    {
        var me = this;
        panelfilter.fieldLabel = '';

        // Translate filteroperators names
        var operators = [];

        Ext.each(panelfilter.filteroperators, function(operator) {
            var item = {
                "code": operator.code,
                "name": me.transLabel(operator.name)
            };

            operators.push(item);
        });

        container.add({
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.transLabel(panelfilter.label),
            anchor: '100%',
            items: [
                {
                    xtype: 'combo',
                    itemId: 'dynamic_filtering_operator_combo_' + panelfilter._name,
                    anchor: '100%',
                    labelAlign: 'right',
                    //labelWidth: 0,
                    //fieldLabel: '',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['code', 'name'],
                        data: operators
                    }),
                    queryMode: 'local',
                    //autoSelect: true,
                    displayField: 'name',
                    valueField: 'code',
                    listeners: {
                        afterrender: function(field, eOpts)
                        {
                            field.setValue(field.getStore().getAt(0).get('code'));
                            //console.log(filtering_field.name);
                        },
                        change: function(field, newValue, oldValue, eOpts)
                        {
                            if (newValue === oldValue) return;
                            if (container._is_all_initialized)
                            {
                                me.updateFilters(config);
                            }
                        }
                    }
                },
                panelfilter
            ]
        });        
    },
    
    onAddContainer: function(container, value, panelfilters, config, with_combo)
    {
        var me = this;
        if (with_combo)
        {
            container.on('add', function(thiscontainer, item, index, eOpts)
            {
                item.getStore().on('load', function(store, records, success, operation) {
                    me.setValueAndMarkAsInitialized(item, value, panelfilters, config, container);
                });                        
            }, this, {single: true});  
        }
        else
        {
            container.on('add', function(thiscontainer, item, index, eOpts)
            {
                me.setValueAndMarkAsInitialized(item, value, panelfilters, config, container);
            }, this, {single: true});                
        }
    },
    
    setValueAndMarkAsInitialized: function(item, value, panelfilters, config, container)
    {
        var me = this;
        if (value !== "*!¿")
        {
            item.setValue(value);
        }
        me.markFieldAsInitialized(panelfilters, item._name);
        me.onInitialized(config, panelfilters, container);        
    },
    
    markFieldAsInitialized: function(panelfilters, name)
    {
        Ext.each(panelfilters, function(panelfilter) {
            if (panelfilter._name === name)
            {
                panelfilter._initialized = true;
                return;
            }
        });
    },
    
    isInitialized: function(panelfilters)
    {
        var initiazed = true;
        Ext.each(panelfilters, function(panelfilter) {
            //console.log(panelfilter._initialized, panelfilter);
            if (!panelfilter._initialized && !panelfilter.filteroperators)
            {
                initiazed = false;
                return false;
            }
        });
        
        return initiazed;
    },
    
    onInitialized: function(config, panelfilters, container)
    {
        var me = this;
        
        if (!me.isInitialized(panelfilters))
        {
            return;
        }
        
        if (container._update_filters_is_needed)
        {
            me.updateFilters(config);
        } 
        
        var task = new Ext.util.DelayedTask(function() {
            container._is_all_initialized = true;
            console.log('All initialized!!!!');
            
            // Unmask
            try {
                container.getEl().unmask();
            } catch (exception) {}             
        
        });        
        task.delay(500); 
    },
    
    updateStoreLabels: function(config)
    {
        var me = this;
        var container = me.getComponentQuery('dynamicFilterForm_container', config);

        if(container)
        {
            var fields = container.query('[_has_local_data=true]');

            Ext.each(fields, function(field)
            {
                var store = field.getStore();
                Ext.each(store.data.items, function(item) {
                    var index = store.indexOf(item);
                    var record = store.getAt(index);
                    //console.log(record);
                    var label = me.transLabel(record.get('name'));
                    record.set('name', label);
                });
            });
        }
    },
    
    updateFilters: function(config)
    {
        var me = this;
        var values, filter;
        var is_boolean, is_date;

        // Remove filters
        var grid = me.getComponentQuery('grid', config);
        var store = grid.getStore();
        var filters = store.getFilters();
        filters.removeAll();
        //console.log("Removed filters");

        // Add filters
        var container = me.getComponentQuery('dynamicFilterForm_container', config);
        var fields = container.query('[_is_filter=true]');
        //console.log(fields);

        Ext.each(fields, function(field) {
            var op = "like";
            var operator_combo_id = "dynamic_filtering_operator_combo_" + field._name;
            var operator_combo = Ext.ComponentQuery.query("#"+operator_combo_id)[0];

            is_boolean = (field._filtertype === 'boolean');
            is_date = (field._filtertype === 'date');

            if (is_boolean) // || is_date)
            {
                op = "=";
            }

            if(operator_combo)
            {
                op = operator_combo.getValue();
            }

            values = me.getFilterValues(field, field.getValue());

            if (values.active)
            {
                //console.log(is_boolean, field, values, op);
                
                filter = {
                    anyMatch: !is_boolean,
                    exactMatch: is_boolean,
                    property: field._name,
                    value: values.value,
                    disabled: !values.active,
                    operator: op
                };

                store.addFilter(filter);
                //console.log("Added filter", filter);
            }

        });
    },
    
    getFilterValues: function(field, newValue)
    {
        var value, active;
        
        if (field.xtype === 'combo')
        {                           
            if (field._filtertype === 'boolean')
            {
                if (newValue === 'yes')
                {
                    value = true;
                    active = true;
                }
                else if (newValue === 'no')
                {
                    value = false;
                    active = true;
                }
                else
                {
                    value = '';
                    active = false;
                }
            }
            else
            {
                if (newValue === 'all' || Ext.isEmpty(newValue))
                {
                    value = '';
                    active = false;
                }
                else
                {
                    value = newValue;
                    active = true;
                }
            }
        }
        else if (field.xtype === 'datefield')
        {
            value = Ext.Date.format(newValue, 'Y-m-d');
            //console.log(newValue, value);
            active = !Ext.isEmpty(newValue);
        }        
        else
        {
            value = newValue;
            active = !Ext.isEmpty(newValue);
        }
                        
        return {
            value: value,
            active: active
        };
    },
    
    transLabel: function(label)
    {
        var me = this;
        if(label.indexOf(".") === -1)
        {
            return label;
        }
        var pieces = label.split(".");
        var module = pieces[0];
        var trans = me.getTrans(module);
        if (!trans)
        {
            return '';
        }
        
        var ret = '';
        if (pieces.length === 2)
        {
            if (!trans[pieces[1]])
            {
                return '';
            }            
            ret = trans[pieces[1]];
        }
        else if (pieces.length === 3)
        {
            if (!trans[pieces[1]] || !trans[pieces[1]][pieces[2]])
            {
                return '';
            } 
            ret = trans[pieces[1]][pieces[2]];
        }
        else
        {
            if (!trans[pieces[1]] || !trans[pieces[1]][pieces[2]] || !trans[pieces[1]][pieces[2]][pieces[3]])
            {
                return '';
            } 
            ret = trans[pieces[1]][pieces[2]][pieces[3]];
        }
        
        return ret;
    }

});