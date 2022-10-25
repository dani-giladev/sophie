Ext.define('App.view.fileManager.fileManager', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fileManager',
    
    requires: [
        'App.controller.fileManager.fileManager',
        'App.model.fileManager',
        'App.store.fileManager',
        'App.view.fileManager.toolbar',
        'App.view.fileManager.grid',
        'App.view.fileManager.gridToolbar',
        'App.view.fileManager.tree',
        'App.view.fileManager.treeToolbar',
        'App.view.fileManager.multiImagesGrid',
        'App.view.fileManager.multiImagesGridToolbar',
        'App.view.fileManager.dynamicFilterForm'
    ],
    
    explotation: 'File manager main panel',
    
    layout: 'border',
    width: '100%',
    height: '100%',
    border: false,
    frame: false,
    
    config: {},
            
    initComponent: function()
    {
        var me = this;
        
        me.config.itemId += '_fileManager';
        me.itemId = me.config.itemId;
        
        var trans = App.app.getController('App.controller.controller').getTrans('base').fileManager;
        
        if (!me.config.hideTitle)
        {
            this.title = trans.fileManager;
            this.closable = true;
        }
        
        var items = 
        [
            Ext.widget('filemanager_toolbar', {
                config: me.config
            }),
            {
                xtype: 'panel',
                title: 'Folders',
                split: true,
                region: 'west',
                width: 300,    
                layout: 'border',
                items:
                [
                    Ext.widget('filemanager_tree_toolbar', {
                        config: me.config
                    }),
                    Ext.widget('filemanager_tree', {
                        config: me.config
                    })
                ]
            },
            {
                xtype: 'panel',
                title: 'Images',
                region: 'center',
                layout: 'border',
                items:
                [
                    Ext.widget('filemanager_grid_toolbar', {
                        config: me.config
                    }),
                    Ext.widget('filemanager_dynamicfilterform', {
                        config: me.config
                    }),                    
                    Ext.widget('filemanager_grid', {
                        config: me.config
                    })
                ]
            }
        ];
        
        if (me.config.enableSelectMultiImagesGrid)
        {
            me.config.enableSelectedEvent = false;
            items.push({
                xtype: 'panel',
                title: 'Assigned images',
                split: true,
                region: 'east',
                width: 450,    
                layout: 'border',
                items:
                [
                    Ext.widget('filemanager_multi_images_grid_toolbar', {
                        config: me.config
                    }),
                    Ext.widget('filemanager_multi_images_grid', {
                        config: me.config
                    })
                ]
            });
        }
        
        this.items = items;        
            
        this.callParent(arguments);
    },
    
    onRender: function(thispanel, eOpts)
    {
        var me = this;
        
        /*var tree = me.down('#filemanager_tree');
        var tree_store = tree.getStore();   
        tree_store.load();  */

        this.callParent(arguments);        
    },
    
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});