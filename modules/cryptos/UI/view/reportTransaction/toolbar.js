Ext.define('App.modules.cryptos.UI.view.reportTransaction.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-reportTransaction-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTransaction',
        'App.view.maintenance.toolbar'
    ],
    
    show_add_button: false,
    show_edit_button: false,
    show_delete_button: true,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add(me.getExtraButton());
        
        this.callParent(arguments);
    },
    
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
            }            
        ];
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTransaction');
        return controller;
    }

});
