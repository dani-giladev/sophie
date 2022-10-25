Ext.define('App.modules.cryptos.UI.view.reportTraining.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.cryptos-reportTraining-grid',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTraining',
        'App.modules.cryptos.UI.store.reportTraining',
        'App.modules.cryptos.UI.model.reportTraining'
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
                ftype: 'grouping',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }
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
                text: 'Switch progress state',
                iconCls: "x-fa fa-exchange",
                handler: function(e, t)
                {
                    me.getMaintenanceController().toggleProgressStatuses(me.config);
                }
            },
            {
                text: 'View robot',
                iconCls: "x-fa fa-github-alt",
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().getTrainingRobot(me.config, training_code, 'robot');
                }
            },
            {
                text: 'Download robot conf.',
                iconCls: 'x-fa fa-download',
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().donwloadTrainingRobotConf(me.config, training_code, 'robot');
                }
            }                     
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTraining');
        return controller;
    }
});
