Ext.define('App.modules.cryptos.UI.view.reportProfit.reportProfit', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-reportProfit',
    
    requires: [
        'App.modules.cryptos.UI.view.reportProfit.dynamicFilterForm',
        'App.modules.cryptos.UI.view.reportProfit.filterForm',
        'App.modules.cryptos.UI.view.reportProfit.grid',
        'App.modules.cryptos.UI.view.reportProfit.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'reportProfit';
        
        me.config.extraParams = {
            all_users: false
        };

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.reportProfit.reportProfit);
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
                    Ext.widget('cryptos-reportProfit-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-reportProfit-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportProfit');
        return controller;
    }

});
