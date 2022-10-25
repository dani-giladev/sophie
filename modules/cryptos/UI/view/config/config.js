Ext.define('App.modules.cryptos.UI.view.config.config', {
    extend: 'App.view.config.config',
    xtype: 'cryptos-config',
    
    requires: [
        
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.module = 'cryptos';
        
        this.callParent(arguments);
        
        me.setTitle(me.config.trans.config.config);
    }

});