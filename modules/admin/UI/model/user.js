Ext.define('App.modules.admin.UI.model.user', {
    extend: 'Ext.data.Model',
    
    requires: [
        'App.modules.admin.UI.store.userGroup'
    ],

    fields: [
        
        {name: '_id'},
        {name: 'modified_by_user_name'},
        {name: 'last_modification_date'},
        
        {name: 'code', 
            label: 'admin.common.code',
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
            label: 'admin.common.name',
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
            label: 'admin.user.login',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        
        {name: 'active',
            label: 'admin.common.available',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'admin.common.yes'},
                        {"code": "no", "name": "admin.common.no"},
                        {"code": "all", "name": 'admin.common.all_male'}
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
        },
        
        {name: 'admin_grants_group', 
            label: 'admin.user.group',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: 'adminUserGroup'
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