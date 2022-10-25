Ext.define('App.modules.cryptos.UI.view.historyRobotChanges.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-historyRobotChanges-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.historyRobotChanges',
        'App.view.maintenance.toolbar'
    ],
    
    show_add_button: false,
    show_edit_button: false,
    show_delete_button: true,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add({
            text: 'Download conf.',
            iconCls: 'x-fa fa-download',
            handler: function()
            {
                me.getMaintenanceController().donwloadConfs(me.config);
            }
        });    
        
        this.callParent(arguments);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.historyRobotChanges');
        return controller;
    }

});
