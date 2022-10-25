Ext.define('App.modules.cryptos.UI.view.user.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-user-form',
    
    requires: [

    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('cryptos');
        //console.log(me.trans);
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getTradingFieldset(),
            me.getWithdrawalFieldset(),
            me.getTelegramFieldset(),
            me.getPumpsFieldset()
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
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    items: 
                    [
                        {
                            xtype: 'combobox',
                            name: 'cryptos_grants_group',
                            fieldLabel: me.trans.user.group,
                            labelAlign: 'right',
                            store: {
                                type: 'cryptosUserGroup'
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
                                var field = me.getForm().findField('cryptos_grants_group');
                                field.setValue('');
                            }
                        }
                    ]
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
                            name: 'cryptos_commission',
                            allowBlank: false,
                            fieldLabel: 'Commission' + me.required_indication,
                            labelAlign: 'right',
                            width: 200 ,
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
                            name: 'cryptos_commission_coin',
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
                            width: 140,
                            store: {
                                type: 'cryptos_marketCoin'
                            },
                            listeners: {
                                render: function(field, eOpts)
                                {
                                    var proxy = field.store.getProxy();
                                    proxy.url = restpath + proxy.endpoint;
                                    field.store.load();
                                }
                            }
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getWithdrawalFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Withdrawal',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'checkboxfield',
                    name: 'cryptos_withdrawal_enabled',
                    fieldLabel: 'Enabled',
                    labelAlign: 'right',
                    boxLabel: ''
                },
                {
                    xtype: 'textfield',
                    name: 'cryptos_withdrawal_address',
                    fieldLabel: 'Address',
                    labelAlign: 'right',
                    allowBlank: true,
                    anchor: '100%'
                },               
                {
                    xtype: 'combobox',
                    name: 'cryptos_withdrawal_coin',
                    fieldLabel: 'Coin',
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: true,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 240,
                    store: {
                        type: 'cryptos_marketCoin'
                    },
                    listeners: {
                        render: function(field, eOpts)
                        {
                            var proxy = field.store.getProxy();
                            proxy.url = restpath + proxy.endpoint;
                            field.store.load();
                        }
                    }
                }
            ]
        };
        
        return ret;
    },
    
    getTelegramFieldset: function()
    {
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Telegram',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'textfield',
                    name: 'cryptos_telegram_api_id',
                    allowBlank: true,
                    fieldLabel: 'Api Id',
                    labelAlign: 'right',
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    name: 'cryptos_telegram_api_hash',
                    allowBlank: true,
                    fieldLabel: 'Api Hash',
                    labelAlign: 'right',
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    name: 'cryptos_telegram_chat_id',
                    allowBlank: true,
                    fieldLabel: 'Chat Id',
                    labelAlign: 'right',
                    anchor: '100%'
                },
                {
                    xtype: 'textfield',
                    name: 'cryptos_telegram_bot_token',
                    allowBlank: true,
                    fieldLabel: 'Bot token',
                    labelAlign: 'right',
                    anchor: '100%'
                }
            ]
        };
        
        return ret;
    },
    
    getPumpsFieldset: function()
    {
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Pumps',
            anchor: '100%',
            items: 
            [
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
                            name: 'cryptos_pumps_amount',
                            allowBlank: true,
                            fieldLabel: 'Amount',
                            labelAlign: 'right',
                            width: 250,
                            //minValue: 0.00000000001,
                            minValue: 0,
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
                            name: 'cryptos_pumps_amount_unit',
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
                            allowBlank: true,
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
                            name: 'cryptos_pumps_buying_perc',
                            allowBlank: true,
                            fieldLabel: 'Buying perc.',
                            labelAlign: 'right',
                            width: 200 ,
                            minValue: 0.1,
                            //maxValue: 100,
                            decimalPrecision: 2,
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
                            name: 'cryptos_pumps_stoploss_perc',
                            allowBlank: true,
                            fieldLabel: 'Stop-loss perc.',
                            labelAlign: 'right',
                            width: 200 ,
                            minValue: 0.1,
                            //maxValue: 100,
                            decimalPrecision: 2,
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
                        }
                    ]
                },
                /*{
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
                            xtype: 'datefield',
                            name: 'cryptos_pumps_megasignal_start_date',
                            format: 'd/m/Y',
                            submitFormat: 'Y-m-d',
                            fieldLabel: 'Start Mega-sig.',
                            labelAlign: 'right',
                            allowBlank: true,
                            editable: false,
                            width: 240,
                            fieldStyle: {
                                'text-align': 'center'
                            },
                            //value: today,
                            //value: me.start_date,
                            //maxValue: new Date(),
                            startDay: 1
                        },
                        {
                            xtype: 'timefield',
                            name: 'cryptos_pumps_megasignal_start_time',
                            submitFormat: 'H:i',
                            //value: '12:00 AM',
                            //value: me.start_time,
                            allowBlank: true,
                            margin: '0 0 0 5',
                            //minValue: '6:00 AM',
                            //maxValue: '8:00 PM',
                            //increment: 30,
                            width: 120
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
                            xtype: 'datefield',
                            name: 'cryptos_pumps_megasignal_end_date',
                            format: 'd/m/Y',
                            submitFormat: 'Y-m-d',
                            fieldLabel: 'End Mega-sig.',
                            labelAlign: 'right',
                            allowBlank: true,
                            editable: false,
                            width: 240,
                            fieldStyle: {
                                'text-align': 'center'
                            },
                            //value: today,
                            //value: me.start_date,
                            //maxValue: new Date(),
                            startDay: 1
                        },
                        {
                            xtype: 'timefield',
                            name: 'cryptos_pumps_megasignal_end_time',
                            submitFormat: 'H:i',
                            //value: '12:00 AM',
                            //value: me.start_time,
                            allowBlank: true,
                            margin: '0 0 0 5',
                            //minValue: '6:00 AM',
                            //maxValue: '8:00 PM',
                            //increment: 30,
                            width: 120
                        }                
                    ]
                }*/
                {
                    xtype: 'checkboxfield',
                    name: 'cryptos_pumps_megasignal_enabled',
                    fieldLabel: 'Mega-signal',
                    labelAlign: 'right',
                    boxLabel: ''
                },
                {
                    xtype: 'checkboxfield',
                    name: 'cryptos_pumps_binancedex_enabled',
                    fieldLabel: 'Binance DEX',
                    labelAlign: 'right',
                    boxLabel: ''
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
                            name: 'cryptos_pumps_min_takeprofit_perc',
                            allowBlank: true,
                            fieldLabel: 'Min. Take-profit perc.',
                            labelAlign: 'right',
                            width: 200 ,
                            minValue: 0.1,
                            //maxValue: 100,
                            decimalPrecision: 2,
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
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.user');
        return controller;
    }
        
});