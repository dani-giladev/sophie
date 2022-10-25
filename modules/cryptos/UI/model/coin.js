Ext.define('App.modules.cryptos.UI.model.coin', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

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
                width: 120
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
        }
    ]
});