Ext.define('App.modules.cryptos.UI.view.floating.toolbar', {
    extend: 'App.modules.cryptos.UI.view.reportTransaction.toolbar',
    alias: 'widget.cryptos-floating-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.floating',
        'App.modules.cryptos.UI.view.reportTransaction.toolbar'
    ],
    
    show_selectall_button: true,
    
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
                text: 'Panic button',
                style: 'background-color: red;',
                iconCls: 'x-fa fa-frown-o',
                handler: function()
                {
                    me.getMaintenanceController().sellPendingTransactions(me.config);
                }
            }            
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.floating');
        return controller;
    }

});
