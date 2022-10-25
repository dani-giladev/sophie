Ext.define('App.modules.cryptos.UI.view.reportProfit.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-reportProfit-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportProfit',
        'App.view.maintenance.toolbar'
    ],
    
    show_add_button: false,
    show_edit_button: false,
    show_delete_button: false,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add({
            text: 'Total Profit by day',
            iconCls: 'x-fa fa-area-chart',
            handler: function()
            {
                me.getMaintenanceController().showChart(me.config, 'Total Profit by day', 'total_profit_usdt');
            }
        },{
            text: 'Profit Average % by day',
            iconCls: 'x-fa fa-area-chart',
            handler: function()
            {
                me.getMaintenanceController().showChart(me.config, 'Profit Average % by day', 'total_profit_perc');
            }
        });
        
        this.callParent(arguments);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportProfit');
        return controller;
    }

});
