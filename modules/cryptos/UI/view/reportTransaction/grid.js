Ext.define('App.modules.cryptos.UI.view.reportTransaction.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-reportTransaction-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTransaction',
        'App.modules.cryptos.UI.store.reportTransaction',
        'App.modules.cryptos.UI.model.reportTransaction'
    ],
    
    getGridStore: function()
    {
        return this.getMaintenanceController().getStore();
    },
    
    getGridFeatures: function()
    {
        var ret = 
        [ 
            {
                ftype: "summary"
            },
            {
                ftype: 'groupingsummary',
                //startCollapsed: true,
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }    
            /*Ext.create('Ext.grid.feature.GroupingSummary',
            {
                groupHeaderTpl: [
                    '<div class="custom-grid-feature-grouping">{[this.getUserName(values)]}</div>',
                    {
                        getUserName: function(values) 
                        {
                            var store = App.app.adminUserStore;
                            var record = store.findRecord('code', values.groupValue);
                            var name = record.get('name');
                            return name;
                        }
                    }
                ]
            })*/                        
        ];
        
        return ret;
    },
        
    onContextMenu: function(view, record, item, index, e, eOpts)
    {
        var me = this;
        
        var menu = Ext.create('Ext.menu.Menu', 
        {
            items: me.getContextMenuItems(record)
        });

        e.stopEvent();
        menu.showAt(e.getXY());
        e.preventDefault();
    },
        
    getContextMenuItems: function(record)
    {
        var me = this;
        
        return [
            {                       
                text: 'View order',
                iconCls: 'x-fa fa-ticket',
                handler: function(e, t)
                {
                    me.getMaintenanceController().showOrder(me.config);
                }
            }                  
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTransaction');
        return controller;
    }
});
