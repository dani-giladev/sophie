Ext.define('App.modules.[MODULE_NAME].UI.view.config.config', {
    extend: 'App.view.config.config',
    xtype: '[MODULE_NAME]-config',
    
    requires: [
        
    ],

    initComponent: function()
    {
        var me = this;
        
        me.config.module = '[MODULE_NAME]';
        
        this.callParent(arguments);
        
        me.setTitle(me.config.trans.config.config);
    }

});