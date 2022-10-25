Ext.define('App.modules.cryptos.UI.model.floating', {
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
        {name: 'robot_name'/*, 
            label: 'Robot',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<b>' + value + '</b><br>' + 
                        '<i>' + record.get('robot_code') + '</i>';
                },
                align: 'left',
                width: 150
            }*/
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
        /*{name: 'operation',
            label: 'Operation',
            gridcolumn: {
                align: 'center',
                width: 120            
            }
        },*/
        {name: 'robot_track_value'},
        
        /*
         * 
         * Prices
         * 
         */
        {name: 'price',
            label: 'Buying/Current price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + " " + record.get('market_coin') + "</br>" +
                           record.get('current_price') + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'current_price'},
        {name: 'total_profit_perc',
            type: 'float',
            label: '% Profit',
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
        {name: 'fiat_net_profit',
            type: 'float',
            label: 'FIAT Profit Now!',
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
            label: '% FIAT Profit Now!',
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
        {name: 'is_pending_asynchronous',
            label: 'Is pending asynchronous',
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
        
        /*
         * 
         * Test...
         * 
         */
        {name: '_id',
            label: 'Buying transaction id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<div style="font-size:10px;">' + value + "</div>";
                },
                align: 'center',
                width: 350
            }
        },
        {name: 'order',
            label: 'Buying order id',
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
        {name: 'is_training'},
        
        {name: 'amount_usdt',
            label: 'Amount (A)',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return record.get('amount') + " " + record.get('coin') + '</br>' + 
                        Ext.util.Format.round(value, 2).toFixed(2) + " USDT";
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return ret;
                }
            }
        },
        {name: 'amount'},
        {name: 'current_amount_usdt',
            type: 'float',
            label: 'Amount now! (B)',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return record.get('amount') + " " + record.get('coin') + '</br>' + 
                        Ext.util.Format.round(value, 2).toFixed(2) + " USDT";
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
        {name: 'total_profit_usdt_vs_amount_usdt',
            type: 'float',
            label: 'B - A',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return Ext.util.Format.round(value, 4).toFixed(4) + " USDT";
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
        }
        
    ]
});