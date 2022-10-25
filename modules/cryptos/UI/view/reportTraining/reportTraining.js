Ext.define('App.modules.cryptos.UI.view.reportTraining.reportTraining', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportTraining',
    
    requires: [
        'App.modules.cryptos.UI.view.reportTraining.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportTraining.filterForm',
        'App.modules.cryptos.UI.view.reportTraining.grid',
        'App.modules.cryptos.UI.view.reportTraining.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportTraining';
        
        me.config.wild = false;

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.reportTraining.reportTraining);
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
                    Ext.widget('cryptos-reportTraining-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-reportTraining-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTraining');
        return controller;
    }

});
