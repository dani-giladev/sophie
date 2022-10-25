Ext.define('App.modules.cryptos.UI.view.wildTrainingGroup.wildTrainingGroup', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-wildTrainingGroup',
    
    requires: [
        'App.modules.cryptos.UI.view.wildTrainingGroup.dynamicFilterForm',
        'App.modules.cryptos.UI.view.wildTrainingGroup.grid',
        'App.modules.cryptos.UI.view.wildTrainingGroup.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'wildTrainingGroup';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.wildTrainingGroup.wildTrainingGroup_plural);
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.wildTrainingGroup');
        return controller;
    }

});
