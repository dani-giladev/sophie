Ext.define('App.modules.admin.UI.view.plugin.metacodeTabForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.admin-plugin-metacodeTabForm',
    
    requires: [

    ],
          
    accept: false,
    current_record: null,
    trans: null,
    target_store: null,

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
                            name: 'code',
                            allowBlank: false,
                            fieldLabel: me.trans.common.code + me.required_indication,
                            labelAlign: 'right',
                            anchor: '100%'
                        },
                        {
                            xtype: 'combobox',
                            name: 'maintenance_code',
                            fieldLabel: me.trans.plugin.maintenance, //+ me.required_indication,
                            labelAlign: 'right',
                            store: {
                                type: 'adminMaintenance'
                            },
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'description',
                            allowBlank: true,
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
                        }
                ]
            },
        
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
            }]
        ];

        me.callParent(arguments);
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
            code: me.getForm().findField('code').getValue(),
            maintenance_code: me.getForm().findField('maintenance_code').getValue(),
            name_ca: me.getForm().findField('name_ca').getValue(),
            name_es: me.getForm().findField('name_es').getValue()
        });

        me.up('window').close();

        return true;
    }
        
});