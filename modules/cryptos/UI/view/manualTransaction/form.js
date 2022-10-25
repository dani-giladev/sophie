Ext.define('App.modules.cryptos.UI.view.manualTransaction.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-manualTransaction-form',
    
    requires: [
        'App.modules.cryptos.UI.model.coin',
        'App.modules.cryptos.UI.model.coinpair',
        'App.modules.cryptos.UI.store.marketCoin',
        'App.modules.cryptos.UI.store.coinpair'
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
            me.getTradingFieldset(),
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
                    xtype: 'combobox',
                    name: 'coinpair',
                    fieldLabel: me.trans.common.coin_pair + me.required_indication,
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: false,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 250,
                    store: {
                        type: 'cryptos_coinpair'
                    },
                    listeners: {
                        render: function(field, eOpts)
                        {
                            var proxy = field.store.getProxy();
                            proxy.url = restpath + proxy.endpoint;
                            field.store.load({
                                params: {
                                    available: true
                                }
                            });
                        },
                        change: function(field, newValue, oldValue, eOpts)
                        {

                        }
                    }
                }
            ]
        };

        return ret;
    },
    
    getTradingFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Trading',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'combobox',
                    name: 'operation',
                    fieldLabel: 'Operation' + me.required_indication,
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: false,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 250,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['code', 'name'],
                        data : 
                        [
                            {"code": "buy", "name": 'buy'},
                            {"code": "sell", "name": "sell"}
                        ]
                    })
                },        
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '0 0 10 0',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'numberfield',
                            name: 'amount',
                            allowBlank: false,
                            fieldLabel: me.trans.common.amount + me.required_indication,
                            labelAlign: 'right',
                            width: 250,
                            minValue: 0.00000000001,
                            //maxValue: 100,
                            decimalPrecision: 10,
                            enableKeyEvents : true,
                            decimalSeparator: '.',
                            // Remove spinner buttons, and arrow key and mouse wheel listeners
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false  
                        },                      
                        {
                            xtype: 'combobox',
                            name: 'amount_unit',
                            margin: '0 0 0 5',
                            fieldLabel: '',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'name'],
                                data : 
                                [
                                    {"code": "usdt", "name": "USDT"},
                                    {"code": "coin", "name": 'Coin'},
                                    {"code": "market-coin", "name": 'Market coin'}
                                ]
                            }),
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: false,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 100
                        }                
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '0 0 10 0',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'numberfield',
                            name: 'commission',
                            allowBlank: false,
                            fieldLabel: 'Commission' + me.required_indication,
                            labelAlign: 'right',
                            width: 200,
                            //minValue: 0.00000000001,
                            //maxValue: 100,
                            decimalPrecision: 10,
                            enableKeyEvents : true,
                            decimalSeparator: '.',
                            // Remove spinner buttons, and arrow key and mouse wheel listeners
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false    
                        }, 
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 2'
                        },               
                        {
                            xtype: 'combobox',
                            name: 'commission_coin',
                            fieldLabel: '',
                            margin: '0 0 0 5',
                            labelSeparator : '',
                            labelAlign: 'right',
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: false,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 130,
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
                            xtype: 'button',
                            margin: '0 0 0 2',
                            iconCls: "x-fa fa-info",
                            handler: function() {
                                me.getRobotController().showCommissionInfo(me.config);
                            }
                        }
                    ]
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
    
    getRobotController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.manualTransaction');
        return controller;
    }
        
});
