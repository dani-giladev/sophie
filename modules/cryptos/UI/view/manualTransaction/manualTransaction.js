Ext.define('App.modules.cryptos.UI.view.manualTransaction.manualTransaction', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-manualTransaction',
    
    requires: [
        'App.modules.cryptos.UI.view.manualTransaction.dynamicFilterForm',
        'App.modules.cryptos.UI.view.manualTransaction.grid',
        'App.modules.cryptos.UI.view.manualTransaction.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'manualTransaction';

        this.callParent(arguments);
        
        me.setTitle(me.config.trans.manualTransaction.manualTransaction_plural);
    },

    /*
    getWestPanel: function()
    {
        var me = this;
        var basetrans = me.getMaintenanceController().getTrans('base').maintenance;

        return {
            xtype: 'panel',
            region: 'west',
            layout: 'border',
            width: 300,
            height: '100%',
            split: true,
            collapsible: true,
            title: basetrans.filters,
            items:
                [
                    Ext.widget('cryptos-manualTransaction-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-manualTransaction-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
    */
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.manualTransaction');
        return controller;
    }

});
