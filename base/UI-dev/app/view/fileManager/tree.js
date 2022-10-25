Ext.define('App.view.fileManager.tree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.filemanager_tree',
    
    explotation: 'File manager tree view',
    
    region: 'center',
    border: false,
    frame: false,
    scrollable: true,
            
    hideHeaders: true,
    rootVisible: false,
    useArrows: true,  
    //constraintInsets: '0 0 0 10', 
    
    config: {},
    
    initComponent: function()
    {
        var me = this;
        
        me.itemId = me.config.itemId + '_filemanager_tree';
        
        me.title = '';

        me.store = Ext.create('Ext.data.TreeStore',
        {
            autoLoad: true,
            root:
            {
                //text: '/',
                expanded: true,
                loaded: true,
                draggable: false
            },
            proxy:
            {
                type: 'ajax',
                url: restpath + 'admin/fileManager/getDir',
                actionMethods:{
                    read: 'POST'
                },
                extraParams: {
                    resources_path: me.config.resourcesPath
                }
            }
        });     
        
        me.columns =
        [
            {
                xtype: 'treecolumn',
                renderer: me.formatName,
                align:'left',
                flex: 1
            }
        ];
        
        me.listeners = {
            itemclick: {
                fn: function(view, record, item, index, event)
                {
                    me.getViewController().loadGridStore(me.config, record.data.id);
                }
            }
        };
        
        me.callParent(arguments);
        
        me.store.on('load', this.onLoad, this, {single: true});
    },
    
    onLoad: function(this_store, node, records, successful, eOpts)
    {
        var me = this;
        var rootnode = this.getRootNode();
        //console.log(rootnode);
        
        //rootnode.expandChildren(true);
        
        var node;
        if (Ext.isEmpty(rootnode.childNodes))
        {
            node = rootnode;
        }
        else
        {
            node = rootnode.childNodes[0];
        }
        
        this.getSelectionModel().select(node);
        this.getViewController().loadGridStore(me.config, node.id);
    },

    formatName: function(value, metadata, record, rowIndex, colIndex, store)
    {
        return record.data.text;
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});