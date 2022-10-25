Ext.define('App.modules.cryptos.UI.view.floating.floating', {
    extend: 'App.view.maintenance.maintenance',
    xtype: 'cryptos-floating',
    
    requires: [
        'App.modules.cryptos.UI.view.floating.dynamicFilterForm',
        'App.modules.cryptos.UI.view.floating.filterForm',
        'App.modules.cryptos.UI.view.floating.grid',
        'App.modules.cryptos.UI.view.floating.toolbar'
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.moduleId = 'cryptos';
        me.config.modelId = 'floating';

        this.callParent(arguments);
        
        me.config.anyForm = false;
        me.setTitle(me.config.trans.floating.floating);
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
                    Ext.widget('cryptos-floating-filterform', {
                        config: me.config
                    }),

                    Ext.widget('cryptos-floating-dynamicfilterform', {
                        config: me.config
                    })
                ]
        };
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.floating');
        return controller;
    }

});
