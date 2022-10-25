Ext.define('App.modules.cryptos.UI.model.pump', {
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
        {name: 'amount',
            label: 'Amount',
            gridcolumn: { 
                align: 'center',
                width: 180
            }
        },
        {name: 'commission',
            label: 'Commission %',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + "% of " + record.get('commission_coin');
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'commission_coin'},
        
        /*
         * 
         * Buying
         * 
         */
        {name: 'buying_price',
            label: 'Buying price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'buying_order',
            label: 'Buying Order id',
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
        {name: 'buying_commission_value'},
        {name: 'buying_commission_market'},
        
        /*
         * 
         * Selling
         * 
         */
        {name: 'selling_price',
            label: 'Selling price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (!value || Ext.isEmpty(value))
                    {
                        return '';
                    }
                    return value + " " + record.get('market_coin');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'selling_commission_value'},
        {name: 'selling_commission_market'},
        {name: 'selling_number_of_stoploss_orders',
            label: 'Num of stop-loss orders',
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        {name: 'selling_orders'},
        {name: 'selling_last_order'},
        {name: 'selling_pending_amount'},
        
        /*
         * 
         * Additional
         * 
         */
        {name: 'log',
            label: 'Log',
            gridcolumn: {
                renderer: function(log, meta, record)
                {
                    var html = '';
                    if (!log || Ext.isEmpty(log))
                    {
                        return html;
                    }
                    
                    Ext.each(log, function(msg)
                    {
                        if (!Ext.isEmpty(html))
                        {
                            html += '</br>';
                        }
                        html += msg;
                    });
                    
                    return html;
                },
                align: 'left',
                width: 1000
            }
        },
        
        /*
         * 
         * Finally...
         * 
         */
        {name: 'completed',
            label: 'Completed',
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
                _default_value: 'no',
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
        {name: '_id',
            label: 'Transaction id',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<div style="font-size:10px;">' + value + "</div>";
                },
                align: 'center',
                width: 350
            }
        }
        
    ]
});