Ext.define('App.modules.cryptos.UI.view.fiatFloating.toolbar', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.toolbar',
    alias: 'widget.cryptos-fiatFloating-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.fiatFloating',
        'App.modules.cryptos.UI.view.reportTransaction.toolbar'
    ],
    
    show_selectall_button: true,
    show_delete_button: true,
    
    getExtraButton: function()
    {
        var me = this;
        
        return [
            {
                text: 'View order',
                iconCls: 'x-fa fa-ticket',
                handler: function()
                {
                    me.getMaintenanceController().showOrder(me.config);
                }
            },
            {
                text: 'Convert to FIAT',
                style: 'background-color: lime;',
                iconCls: 'x-fa fa-usd',
                handler: function()
                {
                    me.getMaintenanceController().convert2Fiat(me.config);
                }
            }
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.fiatFloating');
        return controller;
    }

});
