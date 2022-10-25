Ext.define('App.modules.cryptos.UI.model.user', {
    extend: 'Ext.data.Model',
    
    requires: [
        'App.modules.cryptos.UI.store.userGroup'
    ],

    fields: [
        
        {name: '_id'},
        {name: 'modified_by_user_name'},
        {name: 'last_modification_date'},
        
        {name: 'code', 
            label: 'cryptos.common.code',
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
            label: 'cryptos.common.name',
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
            label: 'cryptos.user.login',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        
        {name: 'cryptos_grants_group',
            label: 'cryptos.user.group',
            filtertype: 'string',
            panelfilter: {
                xtype: 'combo',
                store: {
                    type: 'cryptosUserGroup'
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