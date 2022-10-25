Ext.define('App.view.fileManager.multiImagesGridToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.filemanager_multi_images_grid_toolbar',
    
    explotation: 'File manager - Multi images grid toolbar view',
    
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
                text: 'Deallocate image',
                //disabled: !me.config.permissions.delete,
                handler: this.deleteAssignedImageFromMultiImageGrid
            }
        ];
            
        this.callParent(arguments);
    },
    
    deleteAssignedImageFromMultiImageGrid: function(button, eventObject)
    {
        var me = button.up('toolbar');
        me.getViewController().deleteAssignedImageFromMultiImageGrid(me.config);
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});