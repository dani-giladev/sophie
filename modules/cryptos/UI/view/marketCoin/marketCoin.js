Ext.define('App.modules.cryptos.UI.view.marketCoin.marketCoin', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-marketCoin',
    
    requires: [
        'App.modules.cryptos.UI.view.marketCoin.dynamicFilterForm',
        'App.modules.cryptos.UI.view.marketCoin.grid',
        'App.modules.cryptos.UI.view.marketCoin.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'marketCoin';
        
        me.config.extraParams = {
            get_free_balance_usdt: true
        };

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.marketCoin.marketCoin_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.marketCoin');
        return controller;
    }

});
