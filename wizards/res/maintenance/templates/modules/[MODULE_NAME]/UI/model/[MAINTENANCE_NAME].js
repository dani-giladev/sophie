Ext.define('App.modules.[MODULE_NAME].UI.model.[MAINTENANCE_NAME]', {
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
            label: '[MODULE_NAME].common.code',
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
            label: '[MODULE_NAME].common.name',
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
        {name: 'available',
            label: '[MODULE_NAME].common.available',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": '[MODULE_NAME].common.yes'},
                        {"code": "no", "name": "[MODULE_NAME].common.no"},
                        {"code": "all", "name": '[MODULE_NAME].common.all_male'}
                    ]
                }),
                _has_local_data: true,
                _default_value: 'all',
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
        {name: 'notes'}
    ]
});