Ext.define('App.modules.cryptos.UI.view.robot.tabs.main', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-main',
    
    requires: [
        'App.modules.cryptos.UI.store.robot.inherit'
    ],
          
    trans: null,
    config: {},
    required_indication: '<font size="4" color="red">*</font>',  

    initComponent: function()
    {
        var me = this;
        
        me.title = me.trans.common.main;
        
        me.items =
        [
            me.getMainFieldset(),
            me.getTradingFieldset(),
            me.getProperties(),
            me.getNotesFieldset()
        ];
        
        this.callParent(arguments);
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
                    width: 250 + 50,
                    labelWidth: 150
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: me.trans.common.name + me.required_indication,
                    labelAlign: 'right',
                    labelWidth: 150,
                    anchor: '100%'
                },
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
                    width: 250 + 50,
                    labelWidth: 150,
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
                        }
                    }
                },
                {
                    xtype: 'combobox',
                    name: 'candlestick_interval',
                    fieldLabel: 'Candlestick interval' + me.required_indication,
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: 'code',
                    displayField: 'name',
                    allowBlank: false,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 200 + 50,
                    labelWidth: 150,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['code', 'name'],
                        data : 
                        [
                            {"code": "1", "name": '1m'},
                            {"code": "5", "name": "5m"},
                            {"code": "15", "name": "15m"},
                            {"code": "30", "name": "30m"}
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
                            xtype: 'combobox',
                            name: 'group',
                            fieldLabel: 'Group' + me.required_indication,
                            labelAlign: 'right',
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: false,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 400 + 50,
                            labelWidth: 150,
                            store: {
                                type: 'cryptos_robotGroup'
                            },
                            listeners: {
                                render: function(field, eOpts)
                                {
                                    var proxy = field.store.getProxy();
                                    proxy.url = restpath + proxy.endpoint;
                                    field.store.load();
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'group',
                            margin: '1 0 0 5'
                        }
                    ]
                },
                {
                    xtype: 'combobox',
                    name: 'inherit_id',
                    fieldLabel: 'Inherit from',
                    labelAlign: 'right',
                    queryMode: 'local',
                    valueField: '_id',
                    displayField: 'name',
                    displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">' +
                            '{name} {coinpair_name} ({created_by_user_name})' +
                        '</tpl>'
                    ),
                    allowBlank: true,
                    typeAhead: true,
                    forceSelection: true,
                    editable: true,
                    width: 400 + 50,
                    labelWidth: 150,
                    disabled: true,
                    store: {
                        type: 'cryptos_inherit'
                    },
                    listConfig: {
                        minWidth: 300, // width of the drop-list
                        //maxHeight: 600 // height of a drop-list with scrollbar
                        itemTpl: '{name} {coinpair_name} ({created_by_user_name})'
                    },
                    listeners: {
                        render: function(field, eOpts)
                        {
                            var form = me.up('form');
                            var is_new_record = (form.object_id == '')? true : false;
                            if (is_new_record) return;
                            
                            var robot = form.current_record.data;
                            
                            var proxy = field.store.getProxy();
                            proxy.url = restpath + proxy.endpoint;
                            field.store.load({
                                params: {
                                    user_code: robot.created_by_user,
                                    robot_code: robot.code,
                                    coinpair: robot.coinpair,
                                    candlestick_interval: robot.candlestick_interval
                                }
                            });
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
                            width: 250 + 50,
                            labelWidth: 150,
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
                            width: 100 + 50,
                            labelWidth: 150
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'amount',
                            _name2: 'amount_unit',
                            margin: '1 0 0 5'
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
                            fieldLabel: 'Commission',
                            labelAlign: 'right',
                            width: 200 + 50,
                            labelWidth: 150,
                            //minValue: 0.00000000001,
                            //maxValue: 100,
                            decimalPrecision: 10,
                            enableKeyEvents : true,
                            decimalSeparator: '.',
                            // Remove spinner buttons, and arrow key and mouse wheel listeners
                            hideTrigger: true,
                            keyNavEnabled: false,
                            mouseWheelEnabled: false,
                            disabled: true
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
                            width: 100 + 50,
                            labelWidth: 150,
                            disabled: true,
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
                                me.getMaintenanceController().showCommissionInfo(me.config);
                            }
                        }/*,
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'commission',
                            _name2: 'commission_coin',
                            margin: '1 0 0 5'
                        }*/
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getProperties: function()
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
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'available',
                            fieldLabel: me.trans.common.available,
                            labelAlign: 'right',
                            labelWidth: 150,
                            boxLabel: '',
                            anchor: '100%'
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'available'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'is_training',
                            fieldLabel: 'For training',
                            labelAlign: 'right',
                            labelWidth: 150,
                            boxLabel: '',
                            anchor: '100%'
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'is_training'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'favourite',
                            fieldLabel: 'Favourite',
                            labelAlign: 'right',
                            labelWidth: 150,
                            boxLabel: '',
                            anchor: '100%'
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'favourite'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '10 0 10 0',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'numberfield',
                            name: 'order',
                            fieldLabel: 'Order',
                            labelAlign: 'right',
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 1,
                            //maxValue: 100,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'order',
                            margin: '1 0 0 5'
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
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }
        
});
