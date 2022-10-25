Ext.define('App.modules.cryptos.UI.view.manualTransaction.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-manualTransaction-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.manualTransaction',
        'App.view.maintenance.toolbar'
    ],
    
    show_delete_button: false,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add({
            text: 'View order',
            iconCls: 'x-fa fa-ticket',
            handler: function()
            {
                me.getMaintenanceController().showOrder(me.config);
            }
        });
        
        this.callParent(arguments);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.manualTransaction');
        return controller;
    }

});
