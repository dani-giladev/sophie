Ext.define('App.view.window', {
    extend: 'Ext.window.Window',
    xtype: 'common-window',
    alias: 'widget.common-window',
    controller: 'viewController',
    
    requires: [
        'App.view.viewController'
    ],
    
    title: '',
    width: 950,
    autoHeight: true,
    layout: 'fit',
    resizable: true,
    modal: true,
    
    maxSizeEnabled: true,

    initComponent: function()
    {
        var me = this;
        
        if (me.maxSizeEnabled)
        {
            var size = me.getController().getSize();
            this.maxHeight  = size.height - 20;
            this.maxWidth  = size.width - 20;            
        }
        
        me.items = [];        
            
        me.callParent(arguments);
    }

});