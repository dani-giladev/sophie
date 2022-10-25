Ext.define('App.modules.cryptos.UI.model.marketCoin', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [
        {name: '_id'},
        {name: 'modified_by_user_name'},
        {name: 'last_modification_date'},
        
        /*
         * 
         * Main
         * 
         */
        {name: 'code',
            label: 'cryptos.common.code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                maskRe: /[a-zA-Z0-9\-\_]/
            },
            gridcolumn: {
                align: 'center',
                width: 150
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
                align: 'left',
                width: 250
            }
        },
        
        /*
         * 
         * Initial buying
         * 
         */
        {name: 'buying_amount', 
            label: 'Buying amount',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (!value || Ext.isEmpty(value))
                    {
                        return '';
                    }
                    return  value + " " + record.get('code');
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'buying_fiat_coin'},
        {name: 'buying_price', 
            label: 'Buying price',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  value + " " + record.get('buying_fiat_coin');
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'buying_date', 
            label: 'Buying date',
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        
        /*
         * 
         * Properties
         * 
         */
        {name: 'reserve', 
            label: 'Reserve',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  value + " " + record.get('code');
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'free_balance', 
            label: 'Free balance',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return  value + " " + record.get('code');
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'free_balance_usdt', 
            label: 'Free balance USDT',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return '<b>' + Ext.util.Format.number(value, '0.00').replace(',', '.') + ' USDT</b>';
                },
                align: 'center',
                width: 180,
                summaryType: 'sum',
                summaryRenderer: function(value, summaryData, dataIndex)
                {
                    var ret = Ext.util.Format.number(value, '0.00').replace(',', '.');
                    return '<b>' + ret + ' USDT</b>';
                }
            }
        },
        {name: 'notes'}
    ]
});