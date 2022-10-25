Ext.define('App.view.fileManager.treeToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    
    alias: 'widget.filemanager_tree_toolbar',
    
    explotation: 'File manager tree toolbar view',
    
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
                text: 'New folder',
//                disabled: true, //!me.config.permissions.update,
                handler: this.newFolder
            },
            {
                text: 'Delete folder',
                disabled: true, //!me.config.permissions.delete,
                handler: this.deleteFolder
            }
        ];
            
        this.callParent(arguments);
    },
    
    newFolder: function(button, eventObject)
    {
        var me = button.up('toolbar');
        me.getViewController().newFolder(me.config);
    },
    
    deleteFolder: function(button, eventObject)
    {
        var me = button.up('toolbar');
        me.getViewController().deleteFolder(me.config);
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});