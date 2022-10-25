Ext.define('App.view.userGroup.grantsByMenuGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.userGroup-grantsByMenuGrid',
    
    requires: [
        'App.store.userGroupGrantsByMenu'
    ],
        
    border: false,
    frame: false,
    scrollable: true,
    margin: '0 0 12 0',
    maxHeight: 300,
    
    config: {},
    user_group_id: '',
        
    initComponent: function()
    {
        var me = this;
        
        var trans = me.getMaintenanceController().getTrans('base').userGroup;
        
        me.title = '';        
        me.cls = 'feed-grid';
        me.store = {
            type: 'userGroupGrantsByMenu'
        };
        me.columns =
        [
            {
                text: trans.menu,
                dataIndex: 'menu_text',
                width: 200
            },
            {
                text: trans.visualize,
                dataIndex: 'visualize',
                align:'center',
                renderer: me.formatBoolean,
                editor: {
                    xtype: 'checkbox',
                    selectOnFocus: false
                },
                flex: 1
            },
            {
                text: trans.insert,
                dataIndex: 'insert',
                align:'center',
                renderer: me.formatBoolean,
                editor: {
                    xtype: 'checkbox',
                    selectOnFocus: false
                },
                flex: 1
            },
            {
                text: trans.update,
                dataIndex: 'update',
                align:'center',
                renderer: me.formatBoolean,
                editor: {
                    xtype: 'checkbox',
                    selectOnFocus: false
                },
                flex: 1
            },
            {
                text: trans.delete,
                dataIndex: 'remove',
                align:'center',
                renderer: me.formatBoolean,
                editor: {
                    xtype: 'checkbox',
                    selectOnFocus: false
                },
                flex: 1
            }
        ];
        
        me.plugins = 
        [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ];
            
        me.callParent(arguments);
        
        me.store.getProxy().url = restpath + me.config.moduleId + '/userGroup/getGrantsByMenu';
        me.store.load({
            params:{
                module_id: me.config.moduleId,
                user_group_id: me.user_group_id
            }
        });
    },
    
    formatBoolean: function(value, p, record)
    {
        return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.userGroup.userGroup');
        return controller;
    }
         

});