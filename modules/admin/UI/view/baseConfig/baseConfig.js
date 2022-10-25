Ext.define('App.modules.admin.UI.view.baseConfig.baseConfig', {
    extend: 'App.view.config.config',
    xtype: 'admin-baseConfig',
    
    requires: [
        
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.module = 'base';
        
        this.callParent(arguments);
        
        me.setTitle(me.config.trans.config.base_config);
    }

});