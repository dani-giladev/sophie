Ext.define('App.modules.[MODULE_NAME].UI.model.user', {
    extend: 'Ext.data.Model',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.store.userGroup'
    ],

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
        
        {name: 'login', 
            label: '[MODULE_NAME].user.login',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        
        {name: '[MODULE_NAME]_grants_group',
            label: '[MODULE_NAME].user.group',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: '[MODULE_NAME]UserGroup'
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
                        field.store.load();
                    }
                }
            },
            gridcolumn: {
                align: 'center',
                width: 150
            }
        }
    ]
});