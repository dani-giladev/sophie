Ext.define('App.modules.cryptos.UI.view.pump.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-pump-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.pump',
        'App.view.maintenance.toolbar'
    ],
    
    show_add_button: false,
    show_edit_button: false,
    show_delete_button: true,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add(
            {
                text: 'View buying order',
                iconCls: 'x-fa fa-ticket',
                handler: function()
                {
                    me.getMaintenanceController().showOrder(me.config, 'buying_order');
                }
            },
            {
                text: 'View selling orders',
                iconCls: 'x-fa fa-ticket',
                handler: function()
                {
                    me.getMaintenanceController().showOrder(me.config, 'selling_orders');
                }
            },
            {
                text: 'Complete order',
                iconCls: 'x-fa fa-flag',
                handler: function()
                {
                    me.getMaintenanceController().completeOrder(me.config);
                }
            }
        );
        
        this.callParent(arguments);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.pump');
        return controller;
    }

});
