Ext.define('App.modules.cryptos.UI.view.reportFiatProfit.toolbar', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.toolbar',
    alias: 'widget.cryptos-reportFiatProfit-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportFiatProfit',
        'App.modules.cryptos.UI.view.reportTransaction.toolbar'
    ],
    
    show_selectall_button: true,
    show_delete_button: false,
    
    getExtraButton: function()
    {
        var me = this;
        
        return [
            {
                text: 'View FIAT order',
                iconCls: 'x-fa fa-ticket',
                handler: function()
                {
                    me.getMaintenanceController().showOrder(me.config);
                }
            }
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportFiatProfit');
        return controller;
    }

});
