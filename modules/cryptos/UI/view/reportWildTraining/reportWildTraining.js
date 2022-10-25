Ext.define('App.modules.cryptos.UI.view.reportWildTraining.reportWildTraining', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportWildTraining',
    
    requires: [
        'App.modules.cryptos.UI.view.reportWildTraining.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportWildTraining.filterForm',
        'App.modules.cryptos.UI.view.reportWildTraining.grid',
        'App.modules.cryptos.UI.view.reportWildTraining.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportWildTraining';
        
        me.config.wild = true;

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.reportWildTraining.reportWildTraining);
    },

    getWestPanel: function()
    {
        var me = this;
        var basetrans = me.getMaintenanceController().getTrans('base').maintenance;

        return {
            xtype: 'panel',
            region: 'west',
            layout: 'border',
            width: 300,
            height: '100%',
            split: true,
            collapsible: true,
            title: basetrans.filters,
            items:
                [
                    Ext.widget('cryptos-reportWildTraining-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-reportWildTraining-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportWildTraining');
        return controller;
    }

});
