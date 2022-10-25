Ext.define('App.modules.admin.UI.view.plugin.metacodeMaintenanceForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.admin-plugin-metacodeMaintenanceForm',
    
    requires: [

    ],
          
    accept: false,
    current_record: null,
    trans: null,
    
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
                title: me.trans.common.main,
                anchor: '100%',
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
                        xtype: 'textfield',
                        name: 'icon',
                        allowBlank: true,
                        fieldLabel: 'Icon',
                        labelAlign: 'right',
                        value: 'x-fa fa-question',
                        width: '75%'
                    }
                ]
            }/*,
            {
                xtype: 'gridpanel',
                itemId: 'pluginMaintenanceFormTabGrid',
                frame: true,
                border: false,
                width: 810,
                height: 225,
                title: me.trans.plugin.tabs,
                store: Ext.create('Ext.data.Store', {
                    storeId: 'pluginMaintenanceTabs',
                    fields:[ 'code', 'maintenance_code', 'name_ca', 'name_es']
                }),
                columns: [
                    { text: me.trans.common.code, dataIndex: 'code' },
                    { text: me.trans.plugin.maintenance, dataIndex: 'maintenance_code' },
                    { text: me.trans.common.name, dataIndex: 'name_ca' },
                    { text: me.trans.common.name, dataIndex: 'name_es' }
                ],
                dockedItems: [
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
                                    text: me.trans.plugin.add_tab,
                                    handler: this.newTab
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'pluginMaintenanceFormRemoveTabButton',
                                    text: me.trans.plugin.remove_tab,
                                    handler: this.removeTab,
                                    disabled: true
                                }
                            ]
                    }
                ],
                listeners: {
                    select: function ( this_grid, record, eOpts )
                    {
                        var addFieldGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormFieldGrid');
                        var addFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormAddFieldButton');
                        var removeFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormRemoveFieldButton');
                        //console.log(addFieldButton[0]);
                        //console.log(addFieldGrid[0]);
                        addFieldButton[0].setDisabled(false);
                        removeFieldButton[0].setDisabled(false);
                        addFieldGrid[0].getStore().filter([
                            {
                                property : 'tab',
                                value    : record.get('code')
                            }
                        ]);

                    },
                    render: function(field, eOpts)
                    {

                    }
                }
            },
            {
                xtype: 'gridpanel',
                itemId: 'pluginMaintenanceFormFieldGrid',
                frame: true,
                border: false,
                width: 810,
                height: 300,
                margin: '10 0 5 0',
                title: me.trans.plugin.fields,
                store: Ext.create('Ext.data.Store', {
                    storeId: 'pluginMaintenanceFields',
                    fields:[ 'plugin', 'tab', 'code', 'name_ca', 'name_es',
                        'value_type', 'grid_visible', 'filterable', 'filter_type',
                        'filter_combo_store_alias']
                }),
                columns: [
                    { text: 'Plugin', dataIndex: 'plugin' },
                   // { text: me.trans.plugin.maintenance, dataIndex: 'maintenance_code' },
                    { text: me.trans.common.code, dataIndex: 'code' },
                    { text: me.trans.common.name, dataIndex: 'name_ca' },
                    { text: me.trans.common.name, dataIndex: 'name_es' },
                    { text: me.trans.plugin.value_type, dataIndex: 'value_type' },
                    { text: me.trans.plugin.grid_visible, dataIndex: 'grid_visible' },
                    { text: me.trans.plugin.filterable, dataIndex: 'filterable' },
                    { text: me.trans.plugin.filter_type, dataIndex: 'filter_type' },
                    { text: me.trans.plugin.filter_combo_store_alias, dataIndex: 'filter_combo_store_alias' }
                ],
                dockedItems: [
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
                                    itemId: 'pluginMaintenanceFormAddFieldButton',
                                    text: me.trans.plugin.new_field,
                                    handler: this.newField,
                                    disabled: true
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'pluginMaintenanceFormRemoveFieldButton',
                                    text: me.trans.plugin.remove_field,
                                    handler: this.removeField,
                                    disabled: true
                                }
                            ]
                    }
                ]
            }*/
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

   /* newTab: function(button, eventObject)
    {
        var me = button.up('form');
        var tabsGrid = button.up('grid');
        var title, msg;

        title = me.trans.plugin.add_tab;

        //var record = me.current_record;
        if (Ext.isEmpty(me.current_record))
        {
            msg = me.trans.plugin.firstly_you_must_select_one_plugin;
            me.msgBox(title, msg);
            return;
        }

        var window = Ext.widget('common-window');
        var form = Ext.widget('admin-plugin-metacodeTabForm', {
            current_record: me.current_record,
            trans: me.trans,
            target_store: tabsGrid.getStore()
        });
        window.setTitle(title);
        window.setWidth(850);
        window.setHeight(350);
        window.add(form);

        //form.getForm().loadRecord(record);
        //form.getForm().findField('plugin_name').setValue(me.current_record.get('description'));

        window.on('close', function(){
            if (form.accept)
            {
                tabsGrid.getStore().reload();
            }
        });

        window.show();
    },

    removeTab: function (button, eObject)
    {
        var me = button.up('form');
        var tabsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormTabGrid')[0];
        var selection = tabsGrid.getSelectionModel().getSelection()[0];
        var fieldsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormFieldGrid')[0];
        var fields_records = [];
        var addFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormAddFieldButton')[0];
        var removeFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormRemoveFieldButton')[0];
        var removeTabButton = Ext.ComponentQuery.query('#pluginMaintenanceFormRemoveTabButton')[0];

        Ext.MessageBox.show({
            title: me.trans.plugin.remove_tab,
            msg: me.trans.plugin.sure_delete_tab,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn, text)
            {
                if(btn == 'no')
                {
                    return;
                }


                // First remove fields assigned to this tab
                fieldsGrid.getStore().each(function(record, id)
                {
                    if(record.get('tab') == selection.get('code'))
                    {
                        fields_records.push(record);
                    }
                });

                Ext.each(fields_records, function(record)
                {
                    fieldsGrid.getStore().remove(record);
                });

                // Then remove tab
                if (selection)
                {
                    tabsGrid.getStore().remove(selection);
                }

                if(tabsGrid.getStore().getCount() == 0)
                {
                    removeTabButton.setDisabled(true);
                }

                if(fieldsGrid.getStore().getCount() == 0)
                {
                    addFieldButton.setDisabled(true);
                    removeFieldButton.setDisabled(true);
                }
            }
        });
    },

    newField: function(button, eventObject)
    {
        var me = button.up('form');
        var fieldsGrid = button.up('grid');
        var tabsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormTabGrid')[0];
        var tabSelected = tabsGrid.getSelectionModel().getSelection()[0];

        var title, msg;

        title = me.trans.plugin.new_field;

        //var record = me.current_record;
        if (Ext.isEmpty(me.current_record))
        {
            msg = me.trans.plugin.firstly_you_must_select_one_plugin;
            me.msgBox(title, msg);
            return;
        }

        var window = Ext.widget('common-window');
        var form = Ext.widget('admin-plugin-metacodeFieldForm', {
            current_record: me.current_record,
            trans: me.trans,
            target_store: fieldsGrid.getStore(),
            tab: tabSelected.get('code')
        });
        window.setTitle(title);
        window.setWidth(850);
        window.setHeight(600);
        window.add(form);

        //form.getForm().loadRecord(record);
        form.getForm().findField('plugin_name').setValue(me.current_record.get('description'));

        window.on('close', function(){
            if (form.accept)
            {
                fieldsGrid.getStore().reload();
            }
        });

        window.show();

    },

    removeField: function (button, eObject)
    {
        var me = button.up('form');
        var fieldsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormFieldGrid')[0];
        var selection = fieldsGrid.getSelectionModel().getSelection()[0];
        //var addFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormAddFieldButton')[0];
        var removeFieldButton = Ext.ComponentQuery.query('#pluginMaintenanceFormRemoveFieldButton')[0];

        Ext.MessageBox.show({
            title: me.trans.plugin.remove_field,
            msg: me.trans.plugin.sure_remove_field,
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function (btn, text)
            {
                if (btn == 'no')
                {
                    return;
                }

                if (selection)
                {
                    fieldsGrid.getStore().remove(selection);
                }

                if(fieldsGrid.getStore().getCount() == 0)
                {
                    removeFieldButton.setDisabled(true);
                }
            }
        });

    }, */

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
        //var tabsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormTabGrid')[0];
        //var fieldsGrid = Ext.ComponentQuery.query('#pluginMaintenanceFormFieldGrid')[0];
        
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
        
        // Get tabs and fields values
        //var tabs = Ext.encode(Ext.pluck(tabsGrid.getStore().data.items, 'data'));
        //var fields = Ext.encode(Ext.pluck(fieldsGrid.getStore().data.items, 'data'));

        Ext.MessageBox.show({
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
                        url: restpath + 'admin/plugin/createMaintenance',
                        params:
                        {
                            plugin_code: me.current_record.get('code'),
                            code: me.getForm().findField('code').getValue(),
                            name_ca: me.getForm().findField('name_ca').getValue(),
                            name_es: me.getForm().findField('name_es').getValue(),
                            icon: me.getForm().findField('icon').getValue()//,
                            //tabs: tabs,
                            //fields: fields
                        },
                        success: function(result, request)
                        {
                            Ext.getBody().unmask();

                            var obj = Ext.JSON.decode(result.responseText);
                            if (obj.success)
                            {
                                me.accept = true;
                                
                                msg = me.trans.plugin.maintenance_created_successfully;
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
        });     
        
        return true;
    }
        
});