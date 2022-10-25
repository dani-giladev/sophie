Ext.define('App.modules.[MODULE_NAME].UI.view.user.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.[MODULE_NAME]-user-form',
    
    requires: [

    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('[MODULE_NAME]');
        //console.log(me.trans);
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset()
        ];
        
        return ret;
    },
    
    getMainFieldset: function()
    {
        var me = this;
        
        var ret = 
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
                    itemId: me.config.itemId + '_form_code_field',
                    name: 'code',
                    maskRe: /[a-zA-Z0-9\-\_]/,
                    allowBlank: false,
                    fieldLabel: me.trans.common.code + me.required_indication,
                    labelAlign: 'right',
                    width: 250
                },
                {
                    xtype: 'textfield',
                    name: 'login',
                    allowBlank: false,
                    fieldLabel: me.trans.user.login + me.required_indication,
                    labelAlign: 'right',
                    width: 250
                },
                {
                    xtype: 'textfield',
                    name: 'pass',
                    allowBlank: true,
                    fieldLabel: me.trans.user.password + me.required_indication,
                    labelAlign: 'right',
                    inputType: 'password',
                    width: 250
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: me.trans.common.name + me.required_indication,
                    labelAlign: 'right',
                    anchor: '100%'
                }
            ]
        };

        return ret;
    },
    
    getPropertiesFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.common.properties,
            anchor: '100%',
            items: 
            [         
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: 
                    [
                        {
                            xtype: 'combobox',
                            name: '[MODULE_NAME]_grants_group',
                            fieldLabel: me.trans.user.group,
                            labelAlign: 'right',
                            store: {
                                type: '[MODULE_NAME]UserGroup'
                            },
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            //typeAhead: true,
                            //forceSelection: true,
                            editable: false,
                            width: 300,
                            //bug//emptyText: me.trans.user.select_group,
                            listeners: {
                                render: function(field, eOpts)
                                {
                                    field.store.on('load', function(this_store, records, successful, eOpts)
                                    {                                  
                                        field.forceSelection = true;
                                        field.typeAhead = true;
                                    }, this, {single: true});
                                    var proxy = field.store.getProxy();
                                    proxy.url = restpath + proxy.endpoint;
                                    field.store.load({
                                        params: {

                                        }
                                    });                                        
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 5',
                            text: "X",
                            handler: function()
                            {
                                var field = me.getForm().findField('[MODULE_NAME]_grants_group');
                                field.setValue('');
                            }
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.[MODULE_NAME].UI.controller.user');
        return controller;
    }
        
});