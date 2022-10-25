Ext.define('App.modules.cryptos.UI.view.robot.tabs.scalping', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-scalping',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Scalping';
        
        me.items =
        [
            me.getGeneralFieldset(),
            me.getBuyingFieldset(),
            me.getSellingFieldset()
        ];
        
        this.callParent(arguments);
    },
    

    getGeneralFieldset: function()
    {
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'General',
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
                            xtype: 'combobox',
                            name: 'filter_type',
                            fieldLabel: 'Default filter',
                            labelAlign: 'right',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'name'],
                                data : 
                                [
                                    {"code": "sma", "name": 'SMA'},
                                    {"code": "ema", "name": "EMA"}
                                ]
                            }),
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 200 + 50,
                            labelWidth: 150
                        },
                        {
                            xtype: 'numberfield',
                            name: 'filter_factor',
                            margin: '0 0 0 5',
                            allowBlank: true,
                            fieldLabel: '',
                            labelAlign: 'right',
                            width: 100,
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
                            _name: 'filter_type',
                            _name2: 'filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_filter_factor',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_filter_factor',
                            margin: '1 0 0 5'
                        }                      
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getBuyingFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Buying parameters',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '-8 0 5 154',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'enabled_to_buy',
                            fieldLabel: '',
                            labelAlign: 'right',
                            boxLabel: 'Enabled to buy',
                            width: 110
                            
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'enabled_to_buy'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
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
                            xtype: 'combobox',
                            name: 'buying_candlestick_interval',
                            fieldLabel: 'Candlestick interval',
                            labelAlign: 'right',
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'name'],
                                data : 
                                [
                                    {"code": "15", "name": "15m"}
                                ]
                            })
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'buying_candlestick_interval',
                            margin: '1 0 0 5'
                        }
                    ]
                },*/
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
                            name: 'takeoff',
                            fieldLabel: 'Take-off',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 5',
                            iconCls: "x-fa fa-picture-o",
                            handler: function() {
                                me.getMaintenanceController().showImage('Take-off', 'buy-takeoff.jpg');
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'takeoff',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeoff',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeoff',
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
                            xtype: 'combobox',
                            name: 'takeoff_filter_type',
                            fieldLabel: 'Take-off filter',
                            labelAlign: 'right',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'name'],
                                data : 
                                [
                                    {"code": "sma", "name": 'SMA'},
                                    {"code": "ema", "name": "EMA"}
                                ]
                            }),
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 200 + 50,
                            labelWidth: 150
                        },
                        {
                            xtype: 'numberfield',
                            name: 'takeoff_filter_factor',
                            margin: '0 0 0 5',
                            allowBlank: true,
                            fieldLabel: '',
                            labelAlign: 'right',
                            width: 100,
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
                            _name: 'takeoff_filter_type',
                            _name2: 'takeoff_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeoff_filter_factor',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeoff_filter_factor',
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
                            name: 'min_green_candle_size',
                            fieldLabel: 'Min. green candle size',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'min_green_candle_size',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_min_green_candle_size',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_min_green_candle_size',
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
                            name: 'number_of_samples_with_price_always_going_up',
                            fieldLabel: 'Nº of samples with price always going up',
                            allowBlank: true,
                            labelAlign: 'right',
                            width: 250,
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
                            _name: 'number_of_samples_with_price_always_going_up',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_number_of_samples_with_price_always_going_up',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20,
                            margin: '5 0 0 0'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_number_of_samples_with_price_always_going_up',
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
                            name: 'change_min',
                            fieldLabel: 'Min. change',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'change_min',
                            margin: '1 0 0 5'
                        }, 
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_change_min',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_change_min',
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
                            name: 'change_max',
                            fieldLabel: 'Max. change',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'change_max',
                            margin: '1 0 0 5'
                        }, 
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_change_max',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_change_max',
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
                            name: 'change_max_disable_buy',
                            fieldLabel: 'Max. change disable buy',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'change_max_disable_buy',
                            margin: '1 0 0 5'
                        }, 
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_change_max_disable_buy',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_change_max_disable_buy',
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
                            name: 'change_time',
                            fieldLabel: 'Change time',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 0,
                            maxValue: 24,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: 'hours',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'change_time',
                            margin: '1 0 0 5'
                        }, 
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_change_time',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_change_time',
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
                            name: 'perc_price_vs_robot_track',
                            fieldLabel: 'Skip if Price is greater than Robot-track',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 0,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'perc_price_vs_robot_track',
                            margin: '1 0 0 5'
                        }, 
                        {
                            xtype: 'label',
                            text: '( A N T I - F O M O )',
                            margin: '8 0 0 5'
                        }, 
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_perc_price_vs_robot_track',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_perc_price_vs_robot_track',
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
                            name: 'perc_skip_buying_if_price_is_close_to_last_selling',
                            fieldLabel: 'Skip if Price is close to the last selling',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 0,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'perc_skip_buying_if_price_is_close_to_last_selling',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_perc_skip_buying_if_price_is_close_to_last_selling',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_perc_skip_buying_if_price_is_close_to_last_selling',
                            margin: '1 0 0 5'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '-8 0 5 154',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'disable_buying_when_sell',
                            fieldLabel: '',
                            labelAlign: 'right',
                            boxLabel: 'Disable buying at the next selling',
                            width: 110
                            
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'disable_buying_when_sell'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '-8 0 5 154',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'disable_buying_when_buy',
                            fieldLabel: '',
                            labelAlign: 'right',
                            boxLabel: 'Disable buying at the next buying',
                            width: 110
                            
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'disable_buying_when_buy'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                }
            ]
        };
        
        return ret;
    },
    
    getSellingFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Selling parameters',
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '-8 0 5 154',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'enabled_to_sell',
                            fieldLabel: '',
                            labelAlign: 'right',
                            boxLabel: 'Enabled to sell',
                            width: 110
                            
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'enabled_to_sell'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
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
                            name: 'takeprofit',
                            fieldLabel: 'Take-profit',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 5',
                            iconCls: "x-fa fa-picture-o",
                            handler: function() {
                                me.getMaintenanceController().showImage('Take-profit', 'sell-takeprofit.jpg');
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'takeprofit',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeprofit',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeprofit',
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
                            name: 'takeprofit_trailing',
                            fieldLabel: 'Trailing take-profit',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 5',
                            iconCls: "x-fa fa-picture-o",
                            handler: function() {
                                me.getMaintenanceController().showImage('Take-profit', 'sell-takeprofit.jpg');
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'takeprofit_trailing',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeprofit_trailing',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeprofit_trailing',
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
                            name: 'takeprofit2',
                            fieldLabel: 'Take-profit 2',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'takeprofit2',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeprofit2',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeprofit2',
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
                            name: 'takeprofit2_trailing',
                            fieldLabel: 'Trailing take-profit 2',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'takeprofit2_trailing',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_takeprofit2_trailing',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_takeprofit2_trailing',
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
                            name: 'stoploss',
                            fieldLabel: 'Stop-loss',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            decimalPrecision: 2,
                            decimalSeparator: '.',
                            enableKeyEvents : true                            
                        },
                        {
                            xtype: 'label',
                            text: '%',
                            margin: '8 0 0 5'
                        },                     
                        {
                            xtype: 'button',
                            margin: '0 0 0 5',
                            iconCls: "x-fa fa-picture-o",
                            handler: function() {
                                me.getMaintenanceController().showImage('Stop-loss', 'sell-stoploss.jpg');
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'stoploss',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_stoploss',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_stoploss',
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
                            xtype: 'combobox',
                            name: 'stoploss_filter_type',
                            fieldLabel: 'Stop-loss filter',
                            labelAlign: 'right',
                            store: Ext.create('Ext.data.Store', {
                                fields: ['code', 'name'],
                                data : 
                                [
                                    {"code": "sma", "name": 'SMA'},
                                    {"code": "ema", "name": "EMA"}
                                ]
                            }),
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 200 + 50,
                            labelWidth: 150
                        },
                        {
                            xtype: 'numberfield',
                            name: 'stoploss_filter_factor',
                            margin: '0 0 0 5',
                            allowBlank: true,
                            fieldLabel: '',
                            labelAlign: 'right',
                            width: 100,
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
                            _name: 'stoploss_filter_type',
                            _name2: 'stoploss_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_stoploss_filter_factor',
                            allowBlank: true,
                            fieldLabel: 'wt',
                            labelAlign: 'right',
                            fieldStyle: 'text-align: right',
                            width: 120,
                            labelWidth: 20
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_stoploss_filter_factor',
                            margin: '1 0 0 5'
                        }
                    ]
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
