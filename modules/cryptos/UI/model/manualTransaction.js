Ext.define('App.modules.cryptos.UI.model.manualTransaction', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

        {name: 'creation_date',
            label: 'Date',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 150
            }
        },
        
        /*
         * 
         * Coins
         * 
         */        
        {name: 'coinpair'},
        {name: 'coinpair_name',
            label: 'cryptos.common.coin_pair',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
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
        {name: 'commission'/*,
            label: 'Commission %',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + "% of " + record.get('commission_coin');
                },
                align: 'center',
                width: 120
            }
        */},
        
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
        {name: 'commission_usdt',
            type: 'float',
            label: 'Commission',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = 
                            record.get('commission_value') + " " + record.get('commission_coin') + '<br>' +
                            value + " USDT";
                    return html;
                },
                align: 'center',
                width: 200,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return '<b>' + ret + ' USDT</b>';
                }
            }
        },        
        {name: 'commission_coin'},
        {name: 'commission_value'},
        {name: 'commission_market'},
        
        /*
         * 
         * Finally...
         * 
         */
        {name: '_id',
            label: 'Transaction id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<div style="font-size:10px;">' + value + "</div>";
                },
                align: 'center',
                width: 280
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
                width: 350
            }
        }
        
    ]
});