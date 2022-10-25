Ext.define('App.modules.cryptos.UI.view.robotGroup.robotGroup', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-robotGroup',
    
    requires: [
        'App.modules.cryptos.UI.view.robotGroup.dynamicFilterForm',
        'App.modules.cryptos.UI.view.robotGroup.grid',
        'App.modules.cryptos.UI.view.robotGroup.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'robotGroup';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.robotGroup.robotGroup_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robotGroup');
        return controller;
    }

});
