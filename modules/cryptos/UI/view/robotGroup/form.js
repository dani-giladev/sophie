Ext.define('App.modules.cryptos.UI.view.robotGroup.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-robotGroup-form',
    
    requires: [
        'App.modules.cryptos.UI.model.coin',
        'App.modules.cryptos.UI.store.marketCoin'
    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('cryptos');
        
        var ret = me.getMainTab();
        
        return ret;
    },
    
    getMainTab: function()
    {
        var me = this;
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset(),
            me.getNotesFieldset()
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
                    xtype: 'combobox',
                    name: 'market_coin',
                    fieldLabel: 'Market coin' + me.required_indication,
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: false,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 300,
                    store: {
                        type: 'cryptos_marketCoin'
                    },
                    listeners: {
                        render: function(field, eOpts)
                        {
                            var proxy = field.store.getProxy();
                            proxy.url = restpath + proxy.endpoint;
                            field.store.load();
                        },
                        change: function(field, newValue, oldValue, eOpts)
                        {

                        }
                    }
                },
                {
                    xtype: 'numberfield',
                    name: 'fund',
                    allowBlank: true,
                    fieldLabel: 'Fund',
                    labelAlign: 'right',
                    width: 250,
                    minValue: 0,
                    decimalPrecision: 2,
                    enableKeyEvents : true,
                    decimalSeparator: '.'
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
//                    hideTrigger: true,
//                    keyNavEnabled: false,
//                    mouseWheelEnabled: false  
                },
                {
                    xtype: 'numberfield',
                    name: 'max_buying_price',
                    allowBlank: true,
                    fieldLabel: 'Max buying price',
                    labelAlign: 'right',
                    width: 250,
                    minValue: 0,
                    decimalPrecision: 10,
                    enableKeyEvents : true,
                    decimalSeparator: '.'
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
//                    hideTrigger: true,
//                    keyNavEnabled: false,
//                    mouseWheelEnabled: false  
                }
            ]
        };
        
        return ret;
    },
    
    getNotesFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.common.notes,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'textareafield',
                    name: 'notes',
                    anchor: '100%',
                    height: 60
                }
            ]
        };

        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robotGroup');
        return controller;
    }
        
});
