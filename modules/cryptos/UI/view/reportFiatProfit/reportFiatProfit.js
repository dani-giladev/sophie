Ext.define('App.modules.cryptos.UI.view.reportFiatProfit.reportFiatProfit', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportFiatProfit',
    
    requires: [
        'App.modules.cryptos.UI.view.reportFiatProfit.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportFiatProfit.filterForm',
        'App.modules.cryptos.UI.view.reportFiatProfit.grid',
        'App.modules.cryptos.UI.view.reportFiatProfit.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportFiatProfit';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.reportFiatProfit.reportFiatProfit);
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
                    Ext.widget('cryptos-reportFiatProfit-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-reportFiatProfit-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportFiatProfit');
        return controller;
    }

});
