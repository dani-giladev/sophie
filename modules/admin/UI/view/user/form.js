Ext.define('App.modules.admin.UI.view.user.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.admin-user-form',
    
    requires: [
        'App.modules.admin.UI.view.user.modules.admin',
        'App.modules.admin.UI.view.user.modules.cryptos'
    ],
          
    trans: null,
    
    initComponent: function() 
    {
        var me = this;
        
        this.callParent(arguments);
        
        // Load plugin store
        var plugins_list_field = me.down('#admin-user-form-plugins-list');
        var store = plugins_list_field.getStore();
        var proxy = store.getProxy();
        proxy.url = restpath + proxy.endpoint; 
        store.load({
            params: {
                
            }
        });
    },
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('admin');
        //console.log(me.trans);
        var modules = me.getMaintenanceController().getUIData().modules;
        //console.log(modules);

        var items = [
            {
                title: me.trans.common.main,
                items: me.getMainTab()
            }
        ];

        var modules_arr = Object.keys(modules).map(function (key) { return modules[key]; });

        modules_arr.forEach( function(moduleObject) {

            if(moduleObject.code)
            {
                try {
                    var da_class = 'admin-user-modules-' + moduleObject.code.toLowerCase();

                    items.push({
                        title: moduleObject.description,
                        items: Ext.widget(da_class, {
                            trans: me.trans,
                            selected_user: me.getMaintenanceController().getComponentQuery('grid', me.config).getSelectionModel().getSelection()
                        })
                    });

                }
                catch (exception) {

                }
            }
        });

        var ret =
            {
                xtype: 'tabpanel',
                activeTab: 0,
                defaults: {
                    padding: 5
                },
                items: items
            };

        return ret;
    },

    sleep: function(delay)
    {
        var start = new Date().getTime();
        while (new Date().getTime() < start + delay);
    },
    
    getMainTab: function()
    {
        var me = this;
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset(),
            me.getGrantsFieldset()
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
                    xtype: 'checkboxfield',
                    name: 'active',
                    fieldLabel: me.trans.common.available,
                    labelAlign: 'right',
                    boxLabel: '',
                    checked: true,
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    name: 'email',
                    allowBlank: true,
                    fieldLabel: me.trans.user.email,
                    vtype: 'email',
                    labelAlign: 'right'
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    name: 'phone',
                    allowBlank: true,
                    fieldLabel: 'Phone number',
                    labelAlign: 'right'
                },
                {
                    xtype: 'textfield',
                    anchor: '100%',
                    name: 'telegram_user',
                    allowBlank: true,
                    fieldLabel: 'Telegram user',
                    labelAlign: 'right'
                }
            ]
        };

        return ret;
    },
    
    getGrantsFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.user.grants,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'multiselect',
                    itemId: 'admin-user-form-plugins-list',
                    name: 'granted_plugins',                    
                    width: '100%',
                    minHeight: 80,
                    maxHeight: 180,
                    msgTarget: 'side',
                    fieldLabel: me.trans.user.authorized_modules,
                    labelAlign: 'top',
                    allowBlank: true,
                    store: {
                        type: 'adminPlugin'
                    },
                    valueField: '_id',
                    displayField: 'description'
                }
            ]
        };

        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.user');
        return controller;
    }
        
});