Ext.define('App.modules.cryptos.UI.model.wildTrainingGroup', {
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
         * Properties
         * 
         */
        {name: 'order',
            label: 'Order',
            gridcolumn: {
                align: 'center',
                width: 80
            }
        }, 
        {name: 'notes'}
    ]
});