Ext.define('App.modules.cryptos.UI.view.fiatFloating.fiatFloating', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-fiatFloating',
    
    requires: [
        'App.modules.cryptos.UI.view.fiatFloating.dynamicFilterForm',
        'App.modules.cryptos.UI.view.fiatFloating.filterForm',
        'App.modules.cryptos.UI.view.fiatFloating.grid',
        'App.modules.cryptos.UI.view.fiatFloating.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'fiatFloating';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.fiatFloating.fiatFloating_plural);
    },

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
                    Ext.widget('cryptos-fiatFloating-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-fiatFloating-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.fiatFloating');
        return controller;
    }

});
