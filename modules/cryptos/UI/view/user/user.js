Ext.define('App.modules.cryptos.UI.view.user.user', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-user',
    
    requires: [
        'App.modules.cryptos.UI.view.user.dynamicFilterForm',
        'App.modules.cryptos.UI.view.user.grid',
        'App.modules.cryptos.UI.view.user.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'user';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.user.users);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.user');
        return controller;
    }

});