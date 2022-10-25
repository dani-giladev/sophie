Ext.define('App.modules.admin.UI.view.plugin.metacodeFieldForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.admin-plugin-metacodeFieldForm',
    
    requires: [
        'App.modules.admin.UI.store.maintenance'
    ],
          
    accept: false,
    current_record: null,
    trans: null,
    target_store: null,
    tab: null,
    
    border: false,
    frame: false,
    autoHeight: true,
    autoScroll: true,
    bodyPadding: 10,
    required_indication: '<font size="4" color="red">*</font>',

    initComponent: function() {
        var me = this;

        me.items = 
        [
            {
                xtype: 'fieldset',
                autoHeight: true,
                padding: 5,
                title: me.trans.plugin.location,
                anchor: '100%',
                items: 
                [
                    {
                        xtype: 'panel',
                        layout: 'vbox',
                        border: false,
                        frame: false,
                        margin: '10 0 5 0',
                        bodyStyle: {
                            'background-color': '#f6f6f6'
                        },
                        items:
                        [
                            {
                                xtype: 'textfield',
                                name: 'plugin_name',
                                allowBlank: true,
                                fieldLabel: 'Plugin',
                                labelAlign: 'right',
                                disabled: true,
                                width: '75%'
                            },
                            {
                                xtype: 'textfield',
                                name: 'maintenance_code',
                                allowBlank: true,
                                fieldLabel: me.trans.plugin.maintenance,
                                labelAlign: 'right',
                                disabled: true,
                                width: '75%',
                                value: me.getMaintenanceCode()
                            },
                            {
                                xtype: 'textfield',
                                name: 'tab',
                                allowBlank: true,
                                fieldLabel: me.trans.plugin.tab,
                                labelAlign: 'right',
                                disabled: true,
                                width: '75%',
                                value: me.getTabCode()
                            }
                           /* {
                                xtype: 'combobox',
                                name: 'maintenance_code',
                                fieldLabel: me.trans.plugin.maintenance + me.required_indication,
                                labelAlign: 'right',
                                store: {
                                    type: 'adminMaintenance'
                                },
                                queryMode: 'local',
                                valueField: 'code',
                                displayField: 'description',
                                allowBlank: false,
                                //typeAhead: true,
                                //forceSelection: true,
                                editable: true,
                                width: '100%',
                                emptyText: me.trans.plugin.select_maintenance,
                                //bug when allowBlank is true//emptyText: me.trans.user.select_group,
                                listeners: {
                                    render: function (field, eOpts) {
                                        field.store.on('load', function (this_store, records, successful, eOpts) {
                                            field.forceSelection = true;
                                            field.typeAhead = true;
                                        }, this, {single: true});
                                        var proxy = field.store.getProxy();
                                        proxy.url = restpath + proxy.endpoint;
                                        field.store.load({
                                            params: {
                                                module: me.current_record.get('code')
                                            }
                                        });
                                    },
                                    beforequery: function (record) {
                                        try {
                                            record.query = new RegExp(record.query, 'i');
                                            record.forceAll = true;
                                        } catch (exception) {} 
                                    }
                                }
                            } */
                        ]}
                        ]
                    },

                    {
                        xtype: 'fieldset',
                        autoHeight: true,
                        padding: 5,
                        title: me.trans.common.main,
                        anchor: '100%',
                        items:
                            [

                                {
                                    xtype: 'textfield',
                                    name: 'code',
                                    allowBlank: false,
                                    fieldLabel: me.trans.common.code + me.required_indication,
                                    labelAlign: 'right',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'name_ca',
                                    allowBlank: false,
                                    fieldLabel: me.trans.common.name + ' (ca)' + me.required_indication,
                                    labelAlign: 'right',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'name_es',
                                    allowBlank: false,
                                    fieldLabel: me.trans.common.name + ' (es)' + me.required_indication,
                                    labelAlign: 'right',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'value_type',
                                    fieldLabel: me.trans.plugin.value_type,
                                    labelAlign: 'right',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['code', 'name'],
                                        data: [
                                            {"code": "string", "name": "String"},
                                            {"code": "numeric", "name": "Numeric"},
                                            {"code": "boolean", "name": "Boolean"},
                                            {"code": "combo", "name": "Combo"},
                                            {"code": "array", "name": "List"},
                                            {"code": "selection_array", "name": "Selection List"}
                                        ]
                                    }),
                                    queryMode: 'local',
                                    valueField: 'code',
                                    displayField: 'name',
                                    allowBlank: true,
                                    //typeAhead: true,
                                    //forceSelection: true,
                                    editable: true,
                                    width: '100%',
                                    emptyText: me.trans.plugin.select_value_type,
                                    listeners: {
                                        beforequery: function (record) {
                                            try {
                                                record.query = new RegExp(record.query, 'i');
                                                record.forceAll = true;
                                            } catch (exception) {} 
                                        }
                                    }
                                },
                                {
                                    xtype: 'checkboxfield',
                                    name: 'grid_visible',
                                    fieldLabel: '',
                                    labelAlign: 'right',
                                    boxLabel: me.trans.plugin.grid_visible,
                                    checked: false,
                                    margin: '0 0 0 30',
                                    anchor: '100%'
                                }
                            ]
                    },
                    {
                        xtype: 'fieldset',
                        autoHeight: true,
                        padding: 5,
                        title: me.trans.plugin.filtering,
                        anchor: '100%',
                        items:
                            [
                                {
                                    xtype: 'checkboxfield',
                                    name: 'filterable',
                                    fieldLabel: '',
                                    labelAlign: 'right',
                                    boxLabel: me.trans.plugin.filterable,
                                    checked: false,
                                    margin: '0 0 0 30',
                                    anchor: '100%'
                                },
                                {
                                    xtype: 'combobox',
                                    name: 'filter_type',
                                    fieldLabel: me.trans.plugin.filter_type,
                                    labelAlign: 'right',
                                    store: Ext.create('Ext.data.Store', {
                                        fields: ['code', 'name'],
                                        data: [
                                            {"code": "string", "name": "String"},
                                            {"code": "numeric", "name": "Numeric"},
                                            {"code": "boolean", "name": "Boolean"},
                                            {"code": "combo", "name": "Combo"}
                                        ]
                                    }),
                                    queryMode: 'local',
                                    valueField: 'code',
                                    displayField: 'name',
                                    allowBlank: true,
                                    //typeAhead: true,
                                    //forceSelection: true,
                                    editable: true,
                                    width: '100%',
                                    emptyText: me.trans.plugin.select_filter_type,
                                    listeners: {
                                        beforequery: function (record) {
                                            try {
                                                record.query = new RegExp(record.query, 'i');
                                                record.forceAll = true;
                                            } catch (exception) {} 
                                        }
                                    }
                                },
                                {
                                    xtype: 'textfield',
                                    name: 'filter_combo_store_alias',
                                    allowBlank: true,
                                    fieldLabel: me.trans.plugin.filter_combo_store_alias,
                                    labelAlign: 'right',
                                    width: '75%'
                                }
                            ]
                    }
                ];
        
             me.dockedItems = [
            {
                xtype: 'toolbar',
                anchor: '100%',
                dock: 'bottom',
                items: 
                [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.accept,
                        formBind: true,
                        disabled: true,
                        handler: this.acceptData
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.cancel,
                        handler: this.closeWindow
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },

    getMaintenanceCode: function()
    {
        var tabsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormTabGrid')[0];
        var selection = tabsGrid.getSelectionModel().getSelection()[0];

        return selection.get('maintenance_code');
    },

    getTabCode: function()
    {
        var tabsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormTabGrid')[0];
        var selection = tabsGrid.getSelectionModel().getSelection()[0];

        return selection.get('code');
    },

    closeWindow: function(button, eventObject)
    {
        button.up('window').close();
    },

    doLastValidation: function()
    {
//        var me = this;
//        var code = me.getForm().findField('code').getValue();
        
        return true;      
    },
    
    acceptData: function(button, eventObject)
    {
        var me = button.up('form');
        var title, msg;
        
        title = me.trans.plugin.new_maintenance;
        
        if (!me.getForm().isValid())
        {
            return false;
        }
        
        // The last Validation
        if (!me.doLastValidation())
        {
            return false;
        }

        me.target_store.add({
            plugin: me.current_record.get('code'),
            tab: me.tab,
            //maintenance_code: me.getForm().findField('maintenance_code').getValue(),
            code: me.getForm().findField('code').getValue(),
            name_ca: me.getForm().findField('name_ca').getValue(),
            name_es: me.getForm().findField('name_es').getValue(),
            value_type: me.getForm().findField('value_type').getValue(),
            grid_visible: me.getForm().findField('grid_visible').getValue(),
            filterable: me.getForm().findField('filterable').getValue(),
            filter_type: me.getForm().findField('filter_type').getValue(),
            filter_combo_store_alias: me.getForm().findField('filter_combo_store_alias').getValue()
        });

        me.up('window').close();

        return true;
    }
        
});






/* Ext.MessageBox.show({
            title: title,
            msg: me.trans.plugin.are_you_sure_to_create_new_maintenance,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text)
            {
                if (btn == 'yes')
                {
                    Ext.getBody().mask(me.trans.common.wait_please);

                    Ext.Ajax.request({
                        type: 'ajax',
                        method: 'POST',
                        url: restpath + 'admin/plugin/createField',
                        params:
                        {
                            plugin_code: me.current_record.get('code'),
                            maintenance_code: me.getForm().findField('maintenance_code').getValue(),
                            code: me.getForm().findField('code').getValue(),
                            name_ca: me.getForm().findField('name_ca').getValue(),
                            name_es: me.getForm().findField('name_es').getValue(),
                            icon: me.getForm().findField('icon').getValue(),
                            value_type: me.getForm().findField('value_type').getValue(),
                            grid_visible: me.getForm().findField('grid_visible').getValue(),
                            filterable: me.getForm().findField('filterable').getValue(),
                            filter_type: me.getForm().findField('filter_type').getValue(),
                            filter_combo_store_alias: me.getForm().findField('filter_combo_store_alias').getValue()
                        },
                        success: function(result, request)
                        {
                            Ext.getBody().unmask();

                            var obj = Ext.JSON.decode(result.responseText);
                            if (obj.success)
                            {
                                me.accept = true;

                                msg = me.trans.plugin.field_created_successfully;
                                Ext.MessageBox.show({
                                    title: title,
                                    msg: msg,
                                    buttons: Ext.MessageBox.OK
                                });

                                me.up('window').close();
                            }
                            else
                            {
                                Ext.MessageBox.show({
                                    title: title,
                                    msg: obj.msg,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        },
                        failure: function(result, request)
                        {
                            Ext.getBody().unmask();
                            me.up('window').close();
                        }
                    });
                }
            }
        });   */