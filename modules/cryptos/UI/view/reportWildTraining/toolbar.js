Ext.define('App.modules.cryptos.UI.view.reportWildTraining.toolbar', {
    extend: 'App.modules.cryptos.UI.view.reportTraining.toolbar',
    alias: 'widget.cryptos-reportWildTraining-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportWildTraining',
        'App.modules.cryptos.UI.view.reportTraining.toolbar'
    ],
    
    show_selectall_button: true,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add({
            text: 'Automatic winner selection',
            iconCls: 'x-fa fa-magic',
            handler: function()
            {
                me.getMaintenanceController().automaticWinnerUpdates(me.config);
            }
        });    
        
        this.callParent(arguments);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportWildTraining');
        return controller;
    }

});
