Ext.define('App.modules.cryptos.UI.view.robot.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-robot-form',
    
    requires: [
        'App.modules.cryptos.UI.model.coin',
        'App.modules.cryptos.UI.model.coinpair',
        'App.modules.cryptos.UI.store.marketCoin',
        'App.modules.cryptos.UI.store.coinpair',
        'App.modules.cryptos.UI.view.robot.tabs.main',
        'App.modules.cryptos.UI.view.robot.tabs.scalping',
        'App.modules.cryptos.UI.view.robot.tabs.indicators',
        'App.modules.cryptos.UI.view.robot.tabs.wildTraining',
        'App.modules.cryptos.UI.view.robot.tabs.redAndWhite',
        'App.modules.cryptos.UI.view.robot.tabs.strategies',
        'App.modules.cryptos.UI.view.robot.tabs.asynchronous'
    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('cryptos');

        var ret = 
        {
            xtype: 'tabpanel',
            activeTab: 0,
            items:
            [
                Ext.widget('cryptos-robot-tab-main', {
                    trans: me.trans,
                    config: me.config
                }),        
                Ext.widget('cryptos-robot-tab-scalping', {
                    trans: me.trans,
                    config: me.config
                }),       
                Ext.widget('cryptos-robot-tab-indicators', {
                    trans: me.trans,
                    config: me.config
                }),       
                Ext.widget('cryptos-robot-tab-wildTraining', {
                    trans: me.trans,
                    config: me.config
                }),       
                Ext.widget('cryptos-robot-tab-redAndWhite', {
                    trans: me.trans,
                    config: me.config
                }),       
                Ext.widget('cryptos-robot-tab-strategies', {
                    trans: me.trans,
                    config: me.config
                }),       
                Ext.widget('cryptos-robot-tab-asynchronous', {
                    trans: me.trans,
                    config: me.config
                })
            ]
        };
        
        return ret;
    },
    
    getLeftToolbarButtons: function()
    {
        var me = this;
                        
        var ret = {
            xtype: 'button',
            text: 'Actions',
            menu: 
            [
                {
                    text: 'Copy properties',
                    itemId: me.config.itemId + '_form_copy_properties',
                    handler: function()
                    {
                        me.getMaintenanceController().copyProperties(me.config);
                    }
                },
                {
                    text: 'Show history of selected property',
                    handler: function()
                    {
                        me.getMaintenanceController().showHistoryOfSelectedProperty(me.config);
                    }
                }
            ]
        };
        
        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }
        
});
