Ext.define('App.modules.[MODULE_NAME].UI.model.userGroup', {
    extend: 'Ext.data.Model',

    fields: [
        
        {name: '_id'},
        {name: 'modified_by_user_name'},
        {name: 'last_modification_date'},
        
        {name: 'code', 
            label: '[MODULE_NAME].common.code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
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
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'left',
                flex: 1
            }
        },
        
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
        }
        
        // Special grants
        /*{name: 'past_management_events'},
        {name: 'management_signings_made_from_tablet'}*/
    ]
});