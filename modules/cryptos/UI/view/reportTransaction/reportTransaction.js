Ext.define('App.modules.cryptos.UI.view.reportTransaction.reportTransaction', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportTransaction',
    
    requires: [
        'App.modules.cryptos.UI.view.reportTransaction.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportTransaction.filterForm',
        'App.modules.cryptos.UI.view.reportTransaction.grid',
        'App.modules.cryptos.UI.view.reportTransaction.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportTransaction';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.reportTransaction.reportTransaction);
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
                    Ext.widget('cryptos-reportTransaction-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-reportTransaction-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTransaction');
        return controller;
    }

});
