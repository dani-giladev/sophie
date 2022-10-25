Ext.define('App.modules.cryptos.UI.model.symbol', {
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
                width: 200
            }
        },
        
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
                width: 100            
            }
        },
        {name: 'decimals',
            label: 'Decimals (amount)',
            gridcolumn: {
                align: 'center',
                width: 150
            }
        },
        {name: 'price_decimals',
            label: 'Decimals (price)',
            gridcolumn: {
                align: 'center',
                width: 150
            }
        },
        {name: 'min_notional',
            label: 'Min notional',
            gridcolumn: {
                align: 'center',
                width: 150
            }
        },
        {name: 'notes'}
    ]
});