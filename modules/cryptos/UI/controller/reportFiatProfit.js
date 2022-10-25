Ext.define('App.modules.cryptos.UI.controller.reportFiatProfit', {
    extend: 'App.modules.cryptos.UI.controller.reportTransaction',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTransaction'
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.reportFiatProfit');
    }

});
