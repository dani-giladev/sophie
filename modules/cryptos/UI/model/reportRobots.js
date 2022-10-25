Ext.define('App.modules.cryptos.UI.model.reportRobots', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [
        {name: '_id'},
        
        // Chart
        {name: 'chart', 
            label: 'Chart',
            gridcolumn: {
                xtype: 'widgetcolumn',
                dataIndex: 'chart',
                align: 'center',
                width: 150,
                widget: {
                    xtype: 'sparklineline',
                    fillColor: '#ddf',
                    height: 80
                }
            }
        },
        {name: 'chart_info',
            label: 'Chart info',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = '';
                    var chart_info = record.get('chart_info');
                    html += 'vs.Min: <font color="green">' + chart_info.chart_diff_min_value + '%</font>';
                    html += '</br>';
                    html += 'vs.Max: <font color="red">' + chart_info.chart_diff_max_value + '%</font>';
                    html += '</br>';
                    
                    html += 'Price ' + chart_info.chart_last_value;
                    html += '</br>';
                    
                    html += '</br>';
                    html += '<span style="font-size:10px;"><i>Period: ' + chart_info.period + ' days / ' +  chart_info.interval + 'h.</i></span>';
                    return html;
                },
                align: 'left',
                width: 150
            }
        },
                
        /*
         * 
         * Main
         * 
         */
        {name: 'created_by_user'},
        {name: 'created_by_user_name', 
            label: 'User',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                hidden: true,
                renderer: function(value, meta, record) {
                    return value + '<br>' + 
                        '<i>' + record.get('created_by_user') + '</i>';
                },
                align: 'left',
                width: 120
            }
        },
        {name: 'code',
            label: 'cryptos.common.code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                maskRe: /[a-zA-Z0-9\-\_]/
            }
        },
        {name: 'name', 
            label: 'cryptos.common.name',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                listeners: {
                    render: function(field, eOpts)
                    {
                        field.focus();
                    }
                }
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  "<b>" + value + "</b></br><i>" + record.get('code') + "</i>";
                },
                align: 'left',
                width: 120
            }
        },
        {name: 'candlestick_interval',
            label: 'Candlestick',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  value + "m";
                },
                align: 'center',
                width: 100
            }
        },
        {name: 'coinpair'},
        {name: 'coinpair_name',
            label: 'cryptos.common.coin_pair',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  "<b>" + value + "</b>";
                },
                align: 'center',
                width: 100
            }
        },
        {name: 'coin'},
        {name: 'market_coin'},
        
        /*
         * 
         * Trading
         * 
         */
        {name: 'in_production',
            label: 'In production',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'is_running',
            label: 'Running',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'last_operation',
            label: 'Last operation',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "buy", "name": 'buy'},
                        {"code": "sell", "name": "sell"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                align: 'center',
                width: 90            
            }
        },
        {name: 'amount',
            label: 'cryptos.common.amount',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = value + " ";
                    if (record.get('amount_unit') === 'usdt')
                    {
                        html += 'USDT';
                    }
                    else if (record.get('amount_unit') === 'market-coin')
                    {
                        html += record.get('market_coin');
                    }
                    else
                    {
                        html += record.get('coin');
                    }
                    return html;
                },
                align: 'center',
                width: 100
            }
        },
        {name: 'amount_unit'},
        {name: 'takeprofit',
            label: 'Take-profit & Stop-loss',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = 'TP: ' + value + "%+" + record.get('takeprofit_trailing') + '% / ';
                    html += record.get('takeprofit2') + "%+" + record.get('takeprofit2_trailing') + '%';
                    html += '</br>';
                    html += 'SL: ' + record.get('stoploss') + '%';
                    return html;
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'stoploss'},
        {name: 'commission'/*,
            label: 'Commission',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return record.get('commission') + "% of " + record.get('commission_coin');
                },
                align: 'center',
                width: 120
            }
        */},
        {name: 'commission_coin'},
        
        /*
         * 
         * Properties
         * 
         */
        {name: 'available',
            label: 'cryptos.common.available',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                _default_value: 'yes',
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'enabled_to_buy',
            label: 'Enabled to buy',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'buying_deactivation_date',
            label: 'Buying deactivation',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var date_text = '?';
                    var price_text = '?';
                    if (value && !Ext.isEmpty(value))
                    {
                        date_text = value;
                    }
                    if (record.get('buying_deactivation_price'))
                    {
                        price_text = record.get('buying_deactivation_price') + ' ' + record.get('coin');
                    }
                    return date_text + '<br>' + 
                           price_text;
                },
                align: 'center',
                width: 150
            }
        },
        {name: 'buying_deactivation_price'},
        {name: 'disable_buying_when_sell'},
        {name: 'disable_buying_when_buy'},
        {name: 'enabled_to_sell',
            label: 'Enabled to sell',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'favourite',
            label: 'Favourite',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'is_training',
            label: 'For training',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'group',
            label: 'Group',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: 'cryptos_robotGroup'
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code',
                listConfig:{
                    minWidth: 300 // width of the list
                    //maxHeight: 400 // height of a list with scrollbar
                },
                listeners: {
                    render: function(field, eOpts)
                    {
                        var proxy = field.store.getProxy();
                        proxy.url = restpath + proxy.endpoint;  
                        field.store.on('load', function(this_store, records, successful, eOpts)
                        {
                            this_store.add({
                                code: 'all',
                                name: 'All'
                            });                         
                        }, this, {single: true});  
                        field.store.load();
                    }
                }
            },
            gridcolumn: {
                align: 'center',
                width: 90            
            }
        },
        {name: 'wt_enabled',
            label: 'Wild training',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'wt_group',
            label: 'WT group',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: 'cryptos_wildTrainingGroup'
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code',
                listConfig:{
                    minWidth: 300 // width of the list
                    //maxHeight: 400 // height of a list with scrollbar
                },
                listeners: {
                    render: function(field, eOpts)
                    {
                        var proxy = field.store.getProxy();
                        proxy.url = restpath + proxy.endpoint;  
                        field.store.on('load', function(this_store, records, successful, eOpts)
                        {
                            this_store.add({
                                code: 'all',
                                name: 'All'
                            });                         
                        }, this, {single: true});  
                        field.store.load();
                    }
                }
            },
            gridcolumn: {
                align: 'center',
                width: 90            
            }
        },
        {name: 'order',
            label: 'Order',
            gridcolumn: {
                align: 'center',
                width: 80
            }
        }, 
        {name: 'notes'}, 
        
        /*
         * 
         * Red & White
         * 
         */        
        {name: 'rw_enabled',
            label: 'R&W',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        }, 
        {name: 'rw_max_consecutive_failures',
            label: 'R&W max failures',
            gridcolumn: {
                align: 'center',
                width: 80
            }
        },
        
        /*
         * 
         * Strategies
         * 
         */  
        {name: 'strategy',
            label: 'Strategy',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 80
            }
        },
        
        /*
         * 
         * Asynchronous
         * 
         */        
        {name: 'asynchronous_enabled',
            label: 'Asynchronous',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        
        /*
         * 
         * Last training data
         * 
         */
        {name: 'last_modification_comesfrom_training',
            label: 'Last modif comes from training',
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'last_training_code',
            label: 'Last training',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (!value)
                    {
                        return "";
                    }
                    
                    var winner = (record.get('last_training_winner') === 'robot')? 'br' : record.get('last_training_winner');
                    
                    return value + "</br>" + 
                           "<b>" + (record.get('last_training_was_wild')? 'Wild' : 'Not wild') + "</b>" + 
                           " / Winner: " + winner;
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'last_training_was_wild'},
        {name: 'last_training_winner'},
        
        /*
         * 
         * Others
         * 
         */
        
        /*
         * 
         * User
         * 
         */   
        {name: 'creation_date',
            label: 'cryptos.common.creation_date',
            filtertype: 'date',
            panelfilter: {
                xtype: 'datefield'
            },
            gridcolumn: {
                align: 'center',
                width: 130
            }
        },        
        {name: 'last_modification_date',
            label: 'cryptos.common.last_modification_date',
            filtertype: 'date',
            panelfilter: {
                xtype: 'datefield'
            },
            gridcolumn: {
                align: 'center',
                width: 130
            }
        },        
        {name: 'modified_by_user_name'}
    ]
});