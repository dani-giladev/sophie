Ext.define('App.view.fileManager.toolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.filemanager_toolbar',
    
    explotation: 'File manager toolbar view',
    
    config: {},
    
    region: 'north',
    border: true,
    frame: false,
    
//    ui: 'footer',
    
    initComponent: function()
    {
        this.title = '';
        
        this.items = 
        [
            {
                text: 'Refresh',
                handler: this.refresh
            }
        ];
            
        this.callParent(arguments);
    },
    
    refresh: function(button, eventObject)
    {
        var me = button.up('toolbar');
        me.getViewController().refresh(me.config);
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});