Ext.define('App.modules.cryptos.UI.model.reportFiatProfit', {
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
            label: 'Robot',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                listeners: {
                    render: function(field, eOpts)
                    {
                        field.focus();
                    }
                }
            }
        },
        {name: 'robot_name', 
            label: 'Robot',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<b>' + value + '</b><br>' + 
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
         * Prices
         * 
         */
        {name: 'amount'/*,
            label: 'Amount',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + " " + record.get('coin');
                },
                align: 'center',
                width: 180
            }
        */},
        {name: 'buying_price'/*,
            label: 'Buying/Selling price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + " " + record.get('market_coin') + "</br>" +
                           record.get('price') + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        */},
        {name: 'price'},
        {name: 'total_profit',
            type: 'float',
            label: 'Net Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {
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
                    var html = '';
                    //html += '<b>' + Ext.util.Format.round(value, 4).toFixed(4) + "%" + '</b>';
                    html += Ext.util.Format.round(value, 2).toFixed(2) + "%";
                    return html;
                },
                align: 'center',
                width: 100,
                summaryType: 'average',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    //return '<b>' + ret + '%</b>';
                    return ret + '%';
                }
            }
        },
        {name: 'fiat_net_profit',
            type: 'float',
            label: 'FIAT Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + " " + record.get('fiat_coin') + '</b>';
                },
                align: 'center',
                width: 160,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    return '<b>' + Ext.util.Format.number(value, '0.00').replace(',', '.') + '</b>';
                }
            }
        },
        {name: 'fiat_coin'},
        {name: 'fiat_net_profit_perc',
            type: 'float',
            label: '% FIAT Profit',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = '';
                    html += '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "%" + '</b>';
                    return html;
                },
                align: 'center',
                width: 100,
                summaryType: 'average',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return '<b>' + ret + '%</b>';
                }
            }
        },
        
        {name: 'fiat_buying_price',
            type: 'float',
            label: 'Mkc Buying/Current price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = '';
                    html += Ext.util.Format.round(value, 2).toFixed(2) + " " + record.get('market_coin') + "</br>";
                    html += Ext.util.Format.round(record.get('fiat_current_price'), 2).toFixed(2) + " " + record.get('market_coin');
                    return html;
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'fiat_current_price'},
        
        {name: 'total_market_profit_btc',
            type: 'float',
            label: 'Net Profit BTC',
            gridcolumn: {
                renderer: function(value, meta, record) {
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
        
        /*
         * 
         * Others
         * 
         */
        {name: 'last_transaction_id',
            label: 'Buying/Selling transaction ids',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<div style="font-size:10px;">' + value + "</div>" + '</b>' +
                           '<div style="font-size:10px;">' + record.get('_id') + "</div>";
                },
                align: 'center',
                width: 350
            }
        },
        {name: '_id'},
        {name: 'fiat_order',
            label: 'FIAT Order id',
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
        {name: 'fiat_commission',
            type: 'float',
            label: 'FIAT Commission',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return Ext.util.Format.round(value, 8).toFixed(8) + " " + record.get('fiat_commission_coin');
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
        {name: 'fiat_commission_coin'}
    ]
});