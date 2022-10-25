Ext.define('App.modules.cryptos.UI.view.robot.tabs.indicators', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-indicators',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Indicators';
        
        me.items =
        [
            me.getMovingAveragesFieldset(),
            me.getMACDFieldset(),
            me.getRSIFieldset(),
            me.getOBVFieldset(),
            me.getVolumeFieldset()
        ];
        
        this.callParent(arguments);
    },

    getMovingAveragesFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Moving averages',
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
                            name: 'ma_enabled_to_buy',
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
                            _name: 'ma_enabled_to_buy'
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
                            xtype: 'combobox',
                            name: 'ma_fast_filter_type',
                            fieldLabel: 'Fast filter',
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
                            name: 'ma_fast_filter_factor',
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
                            _name: 'ma_fast_filter_type',
                            _name2: 'ma_fast_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_ma_fast_filter_factor',
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
                            _name: 'wt_ma_fast_filter_factor',
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
                            name: 'ma_slow_filter_type',
                            fieldLabel: 'Slow filter',
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
                            name: 'ma_slow_filter_factor',
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
                            _name: 'ma_slow_filter_type',
                            _name2: 'ma_slow_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_ma_slow_filter_factor',
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
                            _name: 'wt_ma_slow_filter_factor',
                            margin: '1 0 0 5'
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },

    getMACDFieldset: function()
    {
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'MACD',
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
                            name: 'macd_enabled_to_buy',
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
                            _name: 'macd_enabled_to_buy'
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
                            name: 'macd_enabled_to_sell',
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
                            _name: 'macd_enabled_to_sell'
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
                            xtype: 'combobox',
                            name: 'macd_macd1_filter_type',
                            fieldLabel: 'MACD 1',
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
                            name: 'macd_macd1_filter_factor',
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
                            _name: 'macd_macd1_filter_type',
                            _name2: 'macd_macd1_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_macd_macd1_filter_factor',
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
                            _name: 'wt_macd_macd1_filter_factor',
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
                            name: 'macd_macd2_filter_type',
                            fieldLabel: 'MACD 2',
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
                            name: 'macd_macd2_filter_factor',
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
                            _name: 'macd_macd2_filter_type',
                            _name2: 'macd_macd2_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_macd_macd2_filter_factor',
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
                            _name: 'wt_macd_macd2_filter_factor',
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
                            name: 'macd_signal_filter_type',
                            fieldLabel: 'Signal',
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
                            name: 'macd_signal_filter_factor',
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
                            _name: 'macd_signal_filter_type',
                            _name2: 'macd_signal_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_macd_signal_filter_factor',
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
                            _name: 'wt_macd_signal_filter_factor',
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
                            name: 'macd_min_lowest_value',
                            fieldLabel: 'Min. lowest value',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: -100,
                            maxValue: 0,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'macd_min_lowest_value',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_macd_min_lowest_value',
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
                            _name: 'wt_macd_min_lowest_value',
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
                            name: 'macd_max_lowest_value',
                            fieldLabel: 'Max. lowest value',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: -100,
                            maxValue: 0,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'macd_max_lowest_value',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_macd_max_lowest_value',
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
                            _name: 'wt_macd_max_lowest_value',
                            margin: '1 0 0 5'
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },

    getRSIFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'RSI',
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
                            name: 'rsi_enabled_to_buy',
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
                            _name: 'rsi_enabled_to_buy'
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
                            name: 'rsi_periods',
                            fieldLabel: 'Periods',
                            labelAlign: 'right',
                            allowBlank: true,
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
                            _name: 'rsi_periods',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_rsi_periods',
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
                            _name: 'wt_rsi_periods',
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
                            name: 'rsi_oversold',
                            fieldLabel: 'Oversold (0-100)',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 1,
                            maxValue: 100,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'rsi_oversold',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_rsi_oversold',
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
                            _name: 'wt_rsi_oversold',
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
                            name: 'rsi_overbought',
                            fieldLabel: 'Overbought (0-100)',
                            labelAlign: 'right',
                            allowBlank: true,
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 1,
                            maxValue: 100,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'rsi_overbought',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_rsi_overbought',
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
                            _name: 'wt_rsi_overbought',
                            margin: '1 0 0 5'
                        }
                    ]
                },
                {
                    xtype: 'checkboxfield',
                    name: 'rsi_smoothed',
                    fieldLabel: 'Smoothed',
                    labelAlign: 'right',
                    boxLabel: '',
                    labelWidth: 150
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
                            name: 'rsi_signal_filter_type',
                            fieldLabel: 'Signal',
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
                            name: 'rsi_signal_filter_factor',
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
                            _name: 'rsi_signal_filter_type',
                            _name2: 'rsi_signal_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_rsi_signal_filter_factor',
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
                            _name: 'wt_rsi_signal_filter_factor',
                            margin: '1 0 0 5'
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },

    getOBVFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'OBV (On-Balance Volume)',
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
                            name: 'obv_enabled_to_buy',
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
                            _name: 'obv_enabled_to_buy'
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
                            xtype: 'combobox',
                            name: 'obv_fast_filter_type',
                            fieldLabel: 'Fast filter',
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
                            name: 'obv_fast_filter_factor',
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
                            _name: 'obv_fast_filter_type',
                            _name2: 'obv_fast_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_obv_fast_filter_factor',
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
                            _name: 'wt_obv_fast_filter_factor',
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
                            name: 'obv_slow_filter_type',
                            fieldLabel: 'Slow filter',
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
                            name: 'obv_slow_filter_factor',
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
                            _name: 'obv_slow_filter_type',
                            _name2: 'obv_slow_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_obv_slow_filter_factor',
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
                            _name: 'wt_obv_slow_filter_factor',
                            margin: '1 0 0 5'
                        }
                    ]
                }
            ]
        };
        
        return ret;
    },

    getVolumeFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'Volume',
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
                            name: 'volume_enabled_to_buy',
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
                            _name: 'volume_enabled_to_buy'
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
                            xtype: 'combobox',
                            name: 'volume_fast_filter_type',
                            fieldLabel: 'Fast filter',
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
                            name: 'volume_fast_filter_factor',
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
                            _name: 'volume_fast_filter_type',
                            _name2: 'volume_fast_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_volume_fast_filter_factor',
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
                            _name: 'wt_volume_fast_filter_factor',
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
                            name: 'volume_slow_filter_type',
                            fieldLabel: 'Slow filter',
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
                            name: 'volume_slow_filter_factor',
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
                            _name: 'volume_slow_filter_type',
                            _name2: 'volume_slow_filter_factor',
                            margin: '1 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_volume_slow_filter_factor',
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
                            _name: 'wt_volume_slow_filter_factor',
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
                            name: 'perc_volume_vs_average',
                            allowBlank: true,
                            fieldLabel: 'Volume vs. MA',
                            labelAlign: 'right',
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
                            margin: '8 0 0 2'
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'perc_volume_vs_average',
                            margin: '1 0 0 5'
                        }, 
                        {
                            xtype: 'label',
                            text: '( F O M O )',
                            margin: '8 0 0 5'
                        },
                        {xtype: 'tbspacer', flex: 1},
                        {
                            xtype: 'textfield',
                            name: 'wt_perc_volume_vs_average',
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
                            _name: 'wt_perc_volume_vs_average',
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
