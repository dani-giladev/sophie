Ext.define('App.model.config', {
    extend: 'Ext.data.Model',

    fields: [
        
        {name: '_id'},
        {name: 'modified_by_user_name'},
        {name: 'last_modification_date'},
        {name: 'module'},
        
        {name: 'code', 
            label: 'base.config.code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 250
            }
        },
        
        {name: 'name', 
            label: 'base.config.name',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'left',
                flex: 1
            }
        },
        
        {name: 'default_value'},
        
        {name: 'value', 
            label: 'base.config.value',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                flex: 1
            }
        }
    ]
});