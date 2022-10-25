Ext.define('App.modules.cryptos.UI.view.marketCoin.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-marketCoin-form',
    
    requires: [
        'App.modules.cryptos.UI.store.fiatCoin'
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
            me.getInitialBuyingFieldset(),
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
    
    getInitialBuyingFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Initial buying (feeding)',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'numberfield',
                    name: 'buying_amount',
                    allowBlank: true,
                    fieldLabel: 'Amount',
                    labelAlign: 'right',
                    width: 250,
                    minValue: 0,
                    decimalPrecision: 4,
                    enableKeyEvents : true,
                    decimalSeparator: '.'
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
//                    hideTrigger: true,
//                    keyNavEnabled: false,
//                    mouseWheelEnabled: false  
                },
                {
                    xtype: 'combobox',
                    name: 'buying_fiat_coin',
                    fieldLabel: 'FIAT coin',
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: true,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 300,
                    store: {
                        type: 'cryptos_fiatCoin'
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
                    name: 'buying_price',
                    allowBlank: true,
                    fieldLabel: 'Price',
                    labelAlign: 'right',
                    width: 250,
                    minValue: 0,
                    decimalPrecision: 6,
                    enableKeyEvents : true,
                    decimalSeparator: '.'
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
//                    hideTrigger: true,
//                    keyNavEnabled: false,
//                    mouseWheelEnabled: false  
                },
                {
                    xtype: 'datefield',
                    name: 'buying_date',
                    format: 'd/m/Y',
                    submitFormat: 'Y-m-d',
                    fieldLabel: 'Date',
                    labelAlign: 'right',
                    allowBlank: true,
                    editable: false,
                    width: 240,
                    fieldStyle: {
                        'text-align': 'center'
                    },
                    startDay: 1
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
                    xtype: 'numberfield',
                    name: 'reserve',
                    allowBlank: true,
                    fieldLabel: 'Reserve',
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
        var controller = App.app.getController('App.modules.cryptos.UI.controller.marketCoin');
        return controller;
    }
        
});
