Ext.define('App.controller.maintenance.maintenance', {
    extend: 'App.controller.controller',
    
    requires: [
        'Ext.ux.grid.Printer'
    ],

    getObjectId: function(record)
    {
        var object_id = record.get('_id');
        return object_id;
    },
    
    printGrid: function(config)
    {
        var me = this;
        me.setPrintGridTitle(config);
        me.doPrintGrid(config);
    },
    
    setPrintGridTitle: function(config)
    {
        Ext.ux.grid.Printer.mainTitle = '';
    },
    
    doPrintGrid: function(config)
    {
        var me = this;  
        Ext.ux.grid.Printer.printAutomatically = false;
        Ext.ux.grid.Printer.stylesheetPath = 'resources/css/plugins/ux/grid/gridPrinterCss/print.css';
        Ext.ux.grid.Printer.print(me.getComponentQuery('grid', config));
        Ext.ux.grid.Printer.mainTitle = '';
    },
    
    resetFilterForm: function(config)
    {        
        var me = this;
        var thisForm = me.getComponentQuery('filterForm', config);
        thisForm.getForm().reset();
    },
    
    isFilterFormValid: function(config)
    {
        var me = this;
        var filterForm = me.getComponentQuery('filterForm', config);
        
        if (Ext.isEmpty(filterForm))
        {
            return true;
        }
        
        if(!filterForm.getForm().isValid())
        {
            return false;
        }
        
        return true;
    },
    
    doFilterFormValidation: function(config, no_msg)
    {
        return true;            
    },
    
    isFormValid: function(config)
    {
        return true;
    },
    
    refresh: function(config, no_msg)
    {
        var me = this;
        
        if (!me.isFilterFormValid(config))
        {
            return;
        }
        
        // The filter form Validation
        if (!me.doFilterFormValidation(config, no_msg))
        {
            return;
        }
        
        me.doRefresh(config);
    },
    
    doRefresh: function(config)
    {
        var me = this;
        var thisGrid = me.getComponentQuery('grid', config);
        var filterForm = me.getComponentQuery('filterForm', config);
        var start_time, last_time;
        var store = thisGrid.getStore();
        
        // The ajax params
        var params = {
            module_id: config.moduleId,
            start: 0,
            limit: 9999
        };
       
        if (!Ext.isEmpty(filterForm))
        {
            var formValues = filterForm.getValues();
            //console.log(formValues);   

            // Add data form values to params
            for (var key in formValues) {
                params[key] = formValues[key];
            }

            // Add disabled fields
            me.addDisabledFields(params, filterForm);
            // Add unchecked fields
            me.addUncheckedFields(params, filterForm);
        }
        
        // Add extra params (from config)
        if (!Ext.isEmpty(config.extraParams))
        {
            for (var key in config.extraParams) {
                params[key] = config.extraParams[key];
            }             
        }
        
        // Add model
        if (config.enableBigData)
        {
            var name_fields = me.getModelNameFields(store, true, false);
            //console.log(name_fields);
            params['model'] = Ext.JSON.encode(name_fields);            
        }

        // Load!
        Utilities.selectPreviousRecord(thisGrid); // Get back to selecting previous record
        
        /*store.on('load', function(store, records, success, operation) {
            last_time = (new Date()).getTime();
            console.log((last_time - start_time) + ' milliseconds');
        }, this, {single: true});*/
        var proxy = store.getProxy();
        if (!Ext.isEmpty(proxy.endpoint))
        {
            proxy.url = restpath + proxy.endpoint;
        }
        start_time = (new Date()).getTime();
        store.load({
            params: params
        });
        
    },
    
    exportGrid: function(type, config, no_msg)
    {
        var me = this;
        
        if (!me.isFilterFormValid(config))
        {
            return;
        }
        
        // The filter form Validation
        if (!me.doFilterFormValidation(config, no_msg))
        {
            return;
        }
        
        me.doExportGrid(type, config);
    },
    
    doExportGrid: function(type, config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var title = config.title;
        var filename = title + '.' + type;
        //console.log(filename);
        
        grid.saveDocumentAs({
            type: type,
            title: title,
            fileName: filename
        });
    },
    
    getDeleteMethod: function()
    {
        return 'deleteRecord';
    },
    
    getSelectedRecord: function(config)
    {
        var me = this;
        
        var selected = me.getComponentQuery('grid', config).getSelectionModel().getSelection();
        if(!selected[0])
        {
            return null;
        }
        
        return selected[0];
    },
    
    getSelectedRecords: function(config)
    {
        var me = this;
        var selected = me.getComponentQuery('grid', config).getSelectionModel().getSelection();
        return selected;
    },
    
    selectAll: function(config)
    {
        var me = this;
        me.getComponentQuery('grid', config).getSelectionModel().selectAll();
    },
    
    isDeleteAllowed: function(config)
    {
        var me = this;
        var record = me.getSelectedRecord(config);
        if(!record)
        {
            return false;
        } 
        
        return true;
    },
    
    deleteRecord: function(config)
    {
        var me = this;
        var title, msg;
        
        if (!me.isDeleteAllowed(config))
        {
            return;
        }
        
        var trans = me.getTrans('base').maintenance;
        
        var records = me.getSelectedRecords(config);
        if (records.length > 1)
        {
            title = 'Deleting registers';
            msg = 'Are you sure to delete the selected registers?';
        }
        else
        {
            title = trans.record_delete;
            msg = trans.sure_delete;
        }
        
        Ext.MessageBox.show({
            title: title,
            msg: msg,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn, text)
            {
                if (btn != 'yes')
                {
                    return;
                }
                
                var counter = 0;
                var total_records = records.length;
                Ext.each(records, function(record)
                {
                    var object_id = me.getObjectId(record);
                    //console.log(object_id);
                    var url = restpath + config.moduleId + '/' + config.modelId + '/delete/' + object_id;
                    //console.log(url);

                    Ext.Ajax.request({
                        type: 'ajax',
                        method: 'GET',
                        url: url,
                        success: function(response)
                        {
                            counter++;
                            var result = Ext.JSON.decode(response.responseText);
                            if (result.success)
                            {
                                if (counter >= total_records)
                                {
                                    me.refresh(config, true);
                                }
                            }
                            else
                            {
                                var msg;
                                if (Ext.isEmpty(result.msg))
                                {
                                    msg = trans.error_deleting;
                                }
                                else
                                {
                                    msg = result.msg;
                                }
                                Ext.MessageBox.show({
                                    title: trans.record_delete,
                                    msg: msg,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        }
                    });
                });                 
            }
        });
    },
    
    getSaveMethod: function()
    {
        return 'addRecord';
    },
    
    saveRecord: function(config, close_form_and_refresh_grid)
    {
        var me = this;
        var form = me.getComponentQuery('form', config);
        
        if (!form.getForm().isValid() || !me.isFormValid(config))
        {
            me.fireEvent('editedRecord', false);
            return;
        }
        
        var object_id = form.object_id;
        var params = {
            id: object_id                
        };

        params = me.addParams(params, config, form);

        me.on('checkedRequirementsBeforeSaving', function(success)
        {
            if (!success) {
                me.fireEvent('editedRecord', false);
                return;
            }
            
            // Finally save!
            me.savingRecord(config, close_form_and_refresh_grid, form, params);

        }, this, {single: true});
        me.checkRequirementsBeforeSaving(params, config, form);
    },
    
    checkRequirementsBeforeSaving: function(params, config, form)
    {
        var me = this;
        me.fireEvent('checkedRequirementsBeforeSaving', true);
    },
    
    savingRecord: function(config, close_form_and_refresh_grid, form, params)
    {
        var me = this;
        var trans = me.getTrans('base').maintenance;
        var record = form.getForm().getValues();
        var url = restpath + config.moduleId + '/' + config.modelId + '/save';
        var refresh_status = form.getRefreshStatus();
        var refresh_combo = form.getRefreshCombo();
        
        me.doJustBeforeSaving();
        
        form.getForm().submit(
            {
                type: 'ajax',
                method: 'POST',
                url: url,
                params: params,
                waitMsg : trans.saving_data,

                success: function (form, action)
                {
                    var result = Ext.JSON.decode(action.response.responseText);
                    //console.log(result);
                    if (result.success)
                    {
                        if (close_form_and_refresh_grid)
                        {
                            me.closeFormAndRefreshGrid(config);
                        }
                        
                        // In a few cases editedRecord event does'nt shot anything, so... this is a crappy workaround...
                        if (refresh_status)
                        {
                            var refreshToValue = result.data.id.split('-').pop();
                            me.selectedRecords(refresh_combo, refreshToValue, null, null, null, null, null)
                        }
                        else
                        {
                            // Fire saved record event
                            me.fireEvent('editedRecord', true, record, result.data.id);
                        }
                    }
                    else
                    {
                        me.fireEvent('editedRecord', false);
                    }
                },
                failure: function (form, action)
                {
                    me.fireEvent('editedRecord', false);
                    var result = Ext.JSON.decode(action.response.responseText);
                    Ext.MessageBox.show({
                        title: trans.title_error,
                        msg: result.msg,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        );        
    },
    
    doJustBeforeSaving: function()
    {

    },
    
    closeFormAndRefreshGrid: function(config)
    {
        var me = this;
        me.refreshGrid(config);
        me.closeForm(config);
    },
    
    refreshGrid: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        if (grid)
        {
            me.refresh(config, true);
        }
    },
    
    addParams: function(params, config, form)
    {
        // console.log(config.formExtraParams);
        Ext.Object.each(config.formExtraParams, function(key, value, myself)
        {
            params[key] = value;
        });

        return params;
    },
    
    cancelForm: function(config)
    {        
        var me = this;
        
        me.fireEvent('editedRecord', false);
        
        me.closeForm(config);
    },
    
    closeForm: function(config)
    {        
        var me = this;
        var thisForm = me.getComponentQuery('form', config);
        var window = thisForm.up('window');
//        window.on('close', function() {
//
//        }, this);       
        window.close();
    },
    
    selectRecs: function(config, records)
    {        
        var me = this; 
        var widget = me.getComponentQuery('', config);
        var trans = me.getTrans('base').maintenance;
        
        if(!records)
        {
            Ext.MessageBox.show({
                title: trans.record_selection,
                msg: trans.select_record_please,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.INFO
            });
            return false;
        }
                     
        if (config.enableBigData)
        {
            var ids = [];
            Ext.each(records, function(record) {
                var id = me.getObjectId(record);
                ids.push(id);
            });
            
            me.on('receivedRecords', function(success, records_with_all_properties)
            {
                if (!success) return;
                widget.fireEvent('selectedRecords', records_with_all_properties);
            }, this, {single: true});

            me.getRecords(ids, config);
        }
        else
        {
            widget.fireEvent('selectedRecords', records);
        }
        
    },

    selectedRecords: function(field_code, field_code_value,
                              field_name, field_name_value,
                              window, trigger_object, rec)
    {
        var any_store = false;
        if (field_code)
        {
            any_store = (field_code.getXType() === 'combobox');
            if (any_store)
            {
                var field_store = field_code.getStore();
                field_store.on('load', function(this_store, records, successful, eOpts)
                {
                    field_code.setValue(field_code_value);
                    field_code.focus();
                }, this, {single: true});
                field_store.reload();
            }
            else
            {
                field_code.setValue(field_code_value);
            }
        }

        if (field_name)
        {
            var xtype_field_name = field_name.getXType();
            if (xtype_field_name === 'label')
            {
                field_name.setText(field_name_value);
            }
            else
            {
                field_name.setValue(field_name_value);
            }
        }

        if (trigger_object)
        {
            trigger_object.fireEvent('selectedRecord', rec);
            window.close();
            return;
        }

        if(window)
        {
            window.close();
        }

        if (field_code && !any_store)
        {
            field_code.focus();
        }
    },

    addDisabledFields: function(params, form)
    {
        var fields = form.query('textfield[disabled=true], ' +
                                'numberfield[disabled=true], ' +
                                'checkboxfield[disabled=true], ' +
                                'combo[disabled=true]');
        var name, value;
        
        if (fields)
        {
            Ext.each(fields, function(item) {
                name = item.name;
                value = item.value;
                params[name] = value;
            }, this);
        }
        
        return params;
    },
            
    addUncheckedFields: function(params, form)
    {
        var fields = form.query('checkboxfield[checked=false]');
        var name, value;
        
        if (fields)
        {
            Ext.each(fields, function(item) {
                name = item.name;
                value = '';
                params[name] = value;
            });
        }
        
        return params;
    },
    
    addFilterFormListeners: function(config, form)
    {        
        var me = this; 
        var fields = form.query('textfield, numberfield, combo, checkboxfield');
        if (fields)
        {
            Ext.each(fields, function(field) {
                field.on('specialkey', function(fld, e, eOpts)
                {
                    if (e.getKey() === e.ENTER) 
                    {
                        me.refresh(config);
                    }                    
                }, this);
            });
        }          
    },
    
    updateFilterFormProperties: function(config, form)
    {        
        var me = this; 
        var fields = form.query('textfield, numberfield, combo, checkboxfield');
        if (fields)
        {
            Ext.each(fields, function(field) {
                // Set filters
                if (!Ext.isEmpty(config.filters) && !Ext.isEmpty(config.filters[field.name]))
                {
                    field.setValue(config.filters[field.name]);
                    field.setDisabled(true);
                }    
            });
        }  
    },
    
    addFormListeners: function(config, form)
    {        
        var me = this; 
        var form_id = form.getId();
        var fields = form.query('textfield, numberfield, combo');
        
        if (fields)
        {
            Ext.each(fields, function(item) {
                var specialkey_event_allowed = true;
                if (!Ext.isEmpty(item._discardListeners))
                {
                    if (Ext.Array.contains(item._discardListeners, 'specialkey'))
                    {
                        specialkey_event_allowed = false;
                    }
                }
                if (specialkey_event_allowed)
                {
                    item.on('specialkey', function(field, e, eOpts)
                    {
                        if (e.getKey() === e.ENTER && field.isValid()) 
                        {
                            e.stopEvent();

                            //var f = me.getComponentQuery('form', config);
                            var f = Ext.getCmp(form_id);
                            
                            // Focus the next field if it exists
                            var nextField = me.getNextField(field, f);
                            nextField && nextField.focus();                      
                        }                    
                    }, this);                      
                }
            });
        }        
    },
    
    getNextField: function(field, form)
    {
        var me = this;
        var fields = form.query('textfield, numberfield, combo');
        if (!fields)
        {
            return false;
        }   
        
        var currentFieldIdx = fields.indexOf(field);    
        if(currentFieldIdx <= -1) 
        {
            return false;
        }
        
        // Jump to specific field?
        var current_field = fields[currentFieldIdx];
        if (!Ext.isEmpty(current_field._onEnterJumpTo))
        {
            return form.getForm().findField(current_field._onEnterJumpTo);
        }
        else if (current_field._onEnterJumpToSubmitButton)
        {
            var submitButton = me.getSubmitButton(form);
            if (submitButton && submitButton.isVisible() && !submitButton.isDisabled())
            {
                return submitButton;
            }
        }
        
        
        // Get the next form field
        var nextField, i=1;
        while (true) {
            //console.log(i);
            nextField = fields[currentFieldIdx + i];
            
            if (!nextField || nextField.getXType() === 'textareafield')
            {
                var submitButton = me.getSubmitButton(form);
                if (submitButton && submitButton.isVisible() && !submitButton.isDisabled())
                {
                    return submitButton;
                }
                return false;
            }
            
            var value = nextField.getValue();
            if (!nextField.isHidden() && !nextField.isDisabled() && !nextField.readOnly && (Ext.isEmpty(value) || value == 0 || nextField._notJumpEvenIfThisFieldHasValue))
            {
                //console.log(nextField);
                return nextField;
            }
            i += 1;
        };

        return false;
    },
    
    getSubmitButton: function(form)
    {
        var submitButton = form.down('button[_isSubmitButton=true]');
        if (submitButton) return submitButton;
        
        submitButton = form.down('button[formBind=true]');
        if (submitButton) return submitButton;
            
        submitButton = form.down('button[iconCls=x-fa fa-save]');
        if (submitButton) return submitButton;
        
        return null;
    },
    
    getComponentQuery: function(id, config)
    {
        var itemId = Ext.isEmpty(id)? config.itemId : (config.itemId + '_' + id);
//        console.log(itemId);
        return Ext.ComponentQuery.query('#' + itemId)[0];
    },
    
    getAliasPrefix: function(config)
    {
        var prefix = config.moduleId + '-' + config.modelId;
        return prefix;
    },

    showForm: function(config, is_edition, record, fieldToRefresh)
    {
        var me = this;
        
        if (config.enableBigData && is_edition)
        {
            var id = me.getObjectId(record);
            me.on('receivedRecord', function(success, record)
            {
                if (!success) return;
                me.nowShowForm(config, true, record, fieldToRefresh);
            }, this, {single: true});
            me.getRecord(id, config);  
        }
        else
        {
            me.nowShowForm(config, is_edition, record, fieldToRefresh);
        }
    },
    
    nowShowForm: function(config, is_edition, record, fieldToRefresh)
    {
        var me = this;
        var prefix = me.getAliasPrefix(config);
        var trans = me.getTrans('base').maintenance;
        var formConfig = me.getFormConfig(config, is_edition, record);
        
        var window_params = {
            height: formConfig.height,
            width: formConfig.width,
            title: formConfig.title            
        };
        if (formConfig.constrain)
        {
            var parent = me.getComponentQuery('', config);
            if (parent)
            {
                window_params.modal = false;
                window_params.constrain = true;
                window_params.constrainTo = parent.getEl();
                window_params.renderTo = parent.body;                
            }
            
        }
        if (config.color)
        {
            window_params.header = {
                cls: 'maintenance-color-' + config.color
            };
        }        
        
        var window = Ext.widget('common-window', window_params);
        
        if (is_edition)
        {
            if(!record)
            {
                return false;
            }

            if (!me.validationBeforeEditing(config, record))
            {
                return false;
            }

            var last_modification_text = 
                    trans.last_modification + ': ' + record.get('modified_by_user_name') + 
                    ' (' + record.get('last_modification_date') + ')';

            var form = Ext.widget(prefix + '-form', {
                config: config,
                object_id: me.getObjectId(record),
                current_record: record,
                is_edition: is_edition
            });
            window.add(form);
            me.getComponentQuery('form_last_modification_field', config).setText(last_modification_text, false);
            form.getForm().loadRecord(record);   
            me.onEditForm(config, record, window, form);
        }
        else
        {
            var form = Ext.widget(prefix + '-form', {
                config: config
            });
            window.add(form);
            me.onAddForm(config, window, form);
        }

        // In any case, we have to refresh original combo with the new value after saving form
        if(fieldToRefresh)
        {
            me.on('editedRecord', function(suc, rec, newItemId) {

                var refreshToValue = newItemId.split('-').pop();
                me.selectedRecords(fieldToRefresh, refreshToValue, null, null, null, null, null);

            }, this, {single: true});
        }
        
        me.addWindowFormListeners(config, window, form);
        window.show();
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 500,
            width: 500
        };
    },
    
    validationBeforeEditing: function(config, record)
    {
        return true;
    },
    
    onEditForm: function(config, record, window, form)
    {

    },
    
    onAddForm: function(config, window, form)
    {

    },
    
    addWindowFormListeners: function(config, window, form)
    {

    },
    
    getRecord: function(id, config)
    {
        var me = this;
        
        var url = restpath + config.moduleId + '/' + config.modelId + '/get/' + id;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'GET',
            url: url,
            success: function(response)
            {
                var result = Ext.JSON.decode(response.responseText);
                
                if (!result.success)
                {
                    me.fireEvent('receivedRecord', false, null);
                    return;
                }
                
                var store = me.getStore();
                store.add(result.data);
                var record = store.data.items[0];                
                
                me.fireEvent('receivedRecord', true, record);
            },
            failure: function(response)
            {
                me.fireEvent('receivedRecord', false, null);   
            }
        });        
    },
    
    getRecords: function(ids, config)
    {
        var me = this;
        
        var url = restpath + config.moduleId + '/' + config.modelId + '/getRecords';
        
        var params = {
            ids: Ext.JSON.encode(ids)
        };
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: url,
            params: params,
            success: function(response)
            {
                var result = Ext.JSON.decode(response.responseText);
                if (!result.success)
                {
                    me.fireEvent('receivedRecords', false, null);
                    return;
                }
                
                var store = me.getStore();
                store.add(result.data);
                var records = store.data.items;                
                
                me.fireEvent('receivedRecords', true, records);
            },
            failure: function(response)
            {
                me.fireEvent('receivedRecords', false, null);   
            }
        });      
    },
    
    getModelFields: function(store)
    {
        var modelName = store.model.$className;
        var model = App.app.getModel(modelName);
        var fields = model.getFields();
        //var fields = store.model.prototype.fields;
        return fields;
    },
    
    getModelNameFields: function(store, add_gridcolumn_fields, add_panelfilter_fields)
    {
        var me = this;
        var ret = [];
        var fields = me.getModelFields(store);
        
        ret.push('_id');
        Ext.each(fields, function(field) {
            if ((add_gridcolumn_fields && field.gridcolumn) || (add_panelfilter_fields && field.panelfilter))
            {
                ret.push(field.name);
            }
        });
        
        return ret;
    },
    
    addRelatedRecord: function (source_form)
    {
        var me = this;

        me.relatedRecord(source_form, 'add');
    },

    editRelatedRecord: function(source_form)
    {
        var me = this;

        me.relatedRecord(source_form, 'update');
    },

    relatedRecord: function(source_form, action)
    {
        var me = this;

        if(!source_form.updateRecord.xtype || !source_form.updateRecord.source_combo) { return; }

        var new_form_xtype = source_form.updateRecord.xtype;

        var source_combo = Ext.ComponentQuery.query("#" + source_form.updateRecord.source_combo)[0];

        if(!source_combo) { return; }

        var new_form_item_id = me.getNewItemId(source_form);

        var trans = me.getTrans('base').maintenance;
        //var target_combos = [];
        var record = null;

        // Generate new form
        var widget = Ext.create({
            xtype: new_form_xtype,
            itemId: new_form_item_id
        });

        if(!widget) { return; }

        var widget_config = widget.config;
        widget.destroy();

        //console.log(widget_config);

        if(action == "add")
        {
            var form = Ext.widget(new_form_xtype + '-form', {
                config: widget_config
            });
        }

        if(action == 'update')
        {
            record = source_combo.getStore().findRecord('code', source_combo.getValue());

            if(!record || !me.validationBeforeEditing(widget_config, record)) { return; }

            var last_modification_text =
                trans.last_modification + ': ' + record.get('modified_by_user_name') +
                ' (' + record.get('last_modification_date') + ')';

            var form = Ext.widget(new_form_xtype + '-form', {
                config: widget_config,
                object_id: me.getObjectId(record),
                current_record: record
            });

            me.getComponentQuery('form_last_modification_field', widget_config).setText(last_modification_text, false);
            form.getForm().loadRecord(record);
        }

        // Maybe we have to force values in combo/s of new form
        if(source_form.updateRecord.target_combos && source_form.updateRecord.target_combos.length > 0)
        {
            // Check for right values in all combos
            if(!me.checkTargetCombos(source_form))
            {
                me.msgBox(trans.record_selection, trans.select_parent);
                form.destroy();
                return;
            }

            // Everything Ok. We can continue.
            for (var i = 0, l = source_form.updateRecord.target_combos.length; i < l; i++)
            {
                me.processTargetCombo(source_form.updateRecord.target_combos[i]);
            }
        }

        var params = {
            action: action,
            sourceCombo: source_combo,
            sourceForm: source_form,
            newForm: form,
            record: record
        };

        me.showRelatedForm(params);
    },

    showRelatedForm: function(params)
    {
        var me = this;

        var new_form_config = params.newForm.config;
        var window = Ext.widget('common-window');

        window.setHeight(new_form_config.height);
        window.setWidth(new_form_config.width);
        window.setTitle(new_form_config.title);
        window.add(params.newForm);

       /* if(params.action == 'add')
        {
            me.onAddForm(new_form_config, window, params.newForm);
        }

        if(params.action == "update")
        {
            me.onEditForm(new_form_config, params.record, window, params.newForm);
        } */

        // After new value is saved we have to refresh store of source combo in original form
        params.newForm.setRefreshExternalCombo(true, params.sourceCombo);

        me.addWindowFormListeners(params.newForm.config, window, params.newForm);
        window.show();
    },

    getNewItemId: function(source_form)
    {
        var me = this;

        return me.getAliasPrefix(source_form.config) + '_' + me.getRandom(1, 100);
    },

    checkTargetCombos: function(source_form)
    {
        for (var i = 0, l = source_form.updateRecord.target_combos.length; i < l; i++)
        {
            var combo_obj = source_form.updateRecord.target_combos[i];

            if(source_form.updateRecord.target_combos.length == 1 && !combo_obj.source && !combo_obj.target)
            {
                return true;
            }

            var s_combo = Ext.ComponentQuery.query("#" + combo_obj.source)[0];
            var t_combo = Ext.ComponentQuery.query("#" + combo_obj.target)[0];
            if (!s_combo || !t_combo) {
                //form.destroy();
                return false;
            }
            var s_combo_value = s_combo.getValue();
            // console.log(s_combo_value);
            if (Ext.isEmpty(s_combo_value) || !s_combo_value) {
                return false;
            }
        }

        return true;
    },

    processTargetCombo: function(target_combo)
    {
        var me = this;

        var trans = me.getTrans('base').maintenance;
        var combo_obj = target_combo;
        var s_combo = Ext.ComponentQuery.query("#" + combo_obj.source)[0];
        var t_combo = Ext.ComponentQuery.query("#" + combo_obj.target)[0];
        if(!s_combo || !t_combo) {
            //form.destroy();
            return false;
        }
        var s_combo_value = s_combo.getValue();
        // console.log(s_combo_value);
        if(Ext.isEmpty(s_combo_value) || !s_combo_value) {
            me.msgBox(trans.record_selection, trans.select_parent);
            //form.destroy();
            return false;
        }

        var t_combo_store = t_combo.getStore();
        t_combo_store.on("load", function() {
            t_combo.setValue(s_combo_value);
            t_combo.setReadOnly(true);
            //console.log(t_combo);
        }, me, {single: true});

        var proxy = t_combo_store.getProxy();
        proxy.url = restpath + proxy.endpoint;
        t_combo_store.reload();

        return true;
    },
    
    setInfoTotalNumberOfRecords: function(config, store)
    {
        var me = this;

        var field = me.getComponentQuery('info_total_number_of_records', config);
        if (field)
        {
            var trans = me.getTrans('base').maintenance;
            var html = trans.number_of_records + ':' + '&nbsp;&nbsp;' + '<b>' + store.getCount() + '</b>';
            field.update(html);
        }

    },

    getViewSize: function()
    {
        var me = this;

        return me.getSize();
    },

    showBalloon: function(text, title)
    {
        var me = this;

        if(title == null)
        {
            title = me.getMainController().getAppName() + " v." + me.getMainController().getAppVersion();
        }

        v = Ext.getCmp("app_main_viewport");

        var t = new Ext.ToolTip({
            floating: {
                shadow: false
            },
            title: title,
            html: text,
            hideDelay: 150000,
            closable: true
        });
        t.showAt([0,0]);
        t.showAt(t.el.getAlignToXY(v.el, 'bl-bl', [v.getWidth() - 150, -50]));
        t.el.slideIn('b');
    },

    getMainController: function()
    {
        var controller = App.app.getController('App.controller.main.Main');
        return controller;
    }
    
});