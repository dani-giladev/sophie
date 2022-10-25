Ext.define('App.modules.cryptos.UI.view.userGroup.userGroup', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-userGroup',
    
    requires: [
        'App.modules.cryptos.UI.view.userGroup.dynamicFilterForm',
        'App.modules.cryptos.UI.view.userGroup.grid',
        'App.modules.cryptos.UI.view.userGroup.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'userGroup';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.userGroup.user_groups);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.userGroup');
        return controller;
    }

});