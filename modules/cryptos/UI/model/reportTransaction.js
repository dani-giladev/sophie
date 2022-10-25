Ext.define('App.modules.cryptos.UI.model.reportTransaction', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

        {name: 'date_time',
            label: 'Date-Time',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }
        },
        {name: 'date',
            label: 'Date-Time',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + '</br>' +
                           record.get('time');
                },
                align: 'center',
                width: 100
            }
        },        
        {name: 'time'},
        
        /*
         * 
         * User
         * 
         */
        {name: 'user_code'/*, 
            label: 'User',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }
        */},
        {name: 'user_name'/*, 
            label: 'User',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + '<br>' + 
                        '<i>' + record.get('user_code') + '</i>';
                },
                align: 'left',
                width: 150
            }
        */},
        
        /*
         * 
         * Robot
         * 
         */
        {name: 'robot_code', 
            label: 'Robot code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }
        },
        {name: 'robot_name', 
            label: 'Robot name',
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
                    return value + '<br>' + 
                        '<i>' + record.get('robot_code') + '</i>';
                },
                align: 'left',
                width: 150
            }
        },
        {name: 'candlestick_interval',
            label: 'Candlestick',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }/*,
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  value + "m";
                },
                align: 'center',
                width: 100
            }*/
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
                    return value + '<br>' + 
                        '<i>' + record.get('candlestick_interval') + "m" + '</i>';
                },
                align: 'center',
                width: 100
            }
        },
        {name: 'coin'},
        {name: 'market_coin',
            label: 'Market coin',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: 'cryptos_marketCoin'
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
            }
        },
        
        /*
         * 
         * Trading
         * 
         */
        {name: 'operation',
            label: 'Operation',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "buy", "name": 'buy'},
                        {"code": "sell", "name": "sell"},
                        {"code": "all", "name": 'cryptos.common.all_female'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                align: 'center',
                width: 120            
            }
        },
        {name: 'is_manual_operation',
            label: 'Manual',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_female'}
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
        {name: 'amount',
            label: 'Amount',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var amount_usdt = value * record.get('price_usdt');
                    return value + " " + record.get('coin') + '</br>' + 
                        Ext.util.Format.round(amount_usdt, 2).toFixed(2) + ' USDT';
                    
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'robot_track_value'},
        
        /*
         * 
         * Prices
         * 
         */
        {name: 'price',
            label: 'Price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'price_usdt'},
        {name: 'profit',
            type: 'float',
            label: 'Gross Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    return value + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'commission_coin'},
        {name: 'commission_usdt'},
        {name: 'commission_market'},
        {name: 'total_commission'},
        {name: 'total_commission_usdt',
            type: 'float',
            label: 'Commission USDT',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = 
                            record.get('total_commission') + " " + record.get('commission_coin') + '<br>' +
                            value + " USDT";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return ret + ' USDT';
                }
            }
        },
        {name: 'total_commission_market'},
        {name: 'total_profit',
            type: 'float',
            label: 'Net Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    return value + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'total_profit_perc',
            type: 'float',
            label: '% Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {                    
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    return '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "%" + '</b>';
                },
                align: 'center',
                width: 120,
                summaryType: 'average',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return '<b>' + ret + '%</b>';
                }
            }
        },
        
        {name: 'total_market_profit_btc',
            type: 'float',
            label: 'Net Profit BTC',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = value + " BTC";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00000000').replace(',', '.');
                    return ret + ' BTC';
                }
            }
        },
        {name: 'total_market_profit_eth',
            type: 'float',
            label: 'Net Profit ETH',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = value + " ETH";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00000000').replace(',', '.');
                    return ret + ' ETH';
                }
            }
        },
        {name: 'total_market_profit_bnb',
            type: 'float',
            label: 'Net Profit BNB',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = value + " BNB";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00000000').replace(',', '.');
                    return ret + ' BNB';
                }
            }
        },
        {name: 'total_market_profit_xrp',
            type: 'float',
            label: 'Net Profit XRP',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = value + " XRP";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00000000').replace(',', '.');
                    return ret + ' XRP';
                }
            }
        },
        {name: 'total_market_profit_usdt',
            type: 'float',
            label: 'Net Profit USDT',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    var html = value + " USDT";
                    return html;
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00000000').replace(',', '.');
                    return ret + ' USDT';
                }
            }
        },
        
        /*
         * 
         * Asynchronous
         * 
         */
        {name: 'asynchronous',
            label: 'Asynchronous',
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'completed',
            label: 'Async completed',
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
         * Finally...
         * 
         */
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
                width: 120            
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
        {name: '_id',
            label: 'Transaction id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<div style="font-size:10px;">' + value + "</div>";
                },
                align: 'center',
                width: 350
            }
        },
        {name: 'last_transaction_id',
            label: 'Buying transaction id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (record.get('operation') === 'buy')
                    {
                        return '';
                    }
                    return '<div style="font-size:10px;">' + value + "</div>";
                },
                align: 'center',
                width: 350
            }
        },
        {name: 'order',
            label: 'Order id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (!value || !value.orderId)
                    {
                        return '';
                    }
                    return '<b>' + value.orderId + '</b>';
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'selling_order_activated',
            label: 'Selling order activated',
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 90            
            }
        },
        {name: 'negative',
            label: 'Negative profit',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_female'}
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
                width: 120            
            }
        },
        {name: 'notes',
            label: 'cryptos.common.notes',
            gridcolumn: {
                align: 'left',
                width: 120
            }
        }
        
    ]
});