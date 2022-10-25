Ext.define('App.modules.admin.UI.view.config.config', {
    extend: 'App.view.config.config',
    xtype: 'admin-config',
    
    requires: [
        
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.module = 'admin';
        
        this.callParent(arguments);
        
        me.setTitle(me.config.trans.config.config);
    }

});