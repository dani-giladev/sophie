Ext.define('App.view.fileManager.grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.filemanager_grid',
    
    explotation: 'File manager grid view',
    
    config: {},
    
    region: 'center',
    border: false,
    frame: false,
    
    initComponent: function()
    {
        var me = this;
        
        me.itemId = me.config.itemId + '_grid';
        
        Ext.apply(this, {
            title: '',
            store: {
                type: 'fileManager'
            },
            viewConfig: {
                itemId: 'itemsView',
                emptyText: 'There isn\'t any image to display',
                deferEmptyText: false,
                //stripeRows: true,
                enableDrag: true,
                enableDrop: false,
                allowCopy: true,
                copy: true,
                plugins: 
                [
                    {
                        ptype: 'gridviewdragdrop',
                        dragGroup: 'filemanager_DDGroup_1',
                        dropGroup: 'filemanager_DDGroup_2'
                    }
                ],
                listeners: {
                    scope: this,
                    itemdblclick: this.onRowDblClick
                }
            },
            columns: [
                { 
                    header: 'Preview', 
                    width: 100, 
                    align: 'center',
                    renderer: this.formatPreview
                },
                { 
                    header: 'Name', 
                    width: 170, 
                    dataIndex: 'filename',
                    align: 'left',
                    flex: 1, 
                    renderer: this.formatTitle
                },
                { header: 'Size', width: 100, dataIndex: 'filesize', hidden: true },
                { header: 'Last modified', width: 200, dataIndex: 'filedate', hidden: true }
            ],
            
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                hidden: !me.config.enableSelectedEvent,
                items: [
                    {
                        xtype: 'tbfill'
                    },{
                        xtype: 'button',
                        text: 'Select and close',
                        handler: function()
                        {
                            me.getViewController().selectAndClose(me.config);
                        }
                    }
                ]
            }]
        });
        
        this.callParent(arguments);
        
        me.store.on('load', this.onLoad, this);
        
//        var proxy = me.store.getProxy();
//        proxy.url = restpath + proxy.endpoint;
//        me.store.load({
//            params: {
//                resources_path: me.config.resourcesPath
//            }
//        });
        
    },
    
    onRender: function(grid, options, norefresh)
    {
        var me = this; 
        
        me.getDynamicFilterController().renderPanelFilter(me.config); 
        
        this.callParent(arguments);
    },
    
    onLoad: function(this_store, records, successful, eOpts)
    {
        if(this_store.getCount() > 0)
        {
            this.getSelectionModel().select(0);
        }
    },
    
    onRowDblClick: function(view, record, product, index, e)
    {
        var me = this;
        
        if (me.config.enableSelectedEvent)
        {
            me.getViewController().selectAndClose(me.config); 
        }
        else
        {
            me.getViewController().visualize(me.config); 
        }
        
    },

    formatTitle: function(value, p, record)
    {
        //var html = '<div><b>{0}</b></br>{1}</br>{2}</div>';
        var html = '<div><b>{0}</b></br>{1}</div>';
        return Ext.String.format(html, 
            value, 
            record.get('filesize')//,
            //record.get('relativePath')
        );
    },
    
    formatPreview: function(value, p, record)
    {
        var relative_path = record.get('relativePath');
        var filename = record.get('filename');
        var is_image = record.get('is_image');

        var src = '/' + this.config.resourcesPath + '/' + relative_path + '/' + filename;
        var alternate_src = ' onerror="this.src=\'' + '/' + this.config.resourcesPath + '/' + filename + '\'"';
        
        if (!is_image)
        {
            src = '';
        }

        var html = '<img src="' + src + '"' + alternate_src + ' width="60" height="60" border="0" />';

        return html;
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    },
        
    getDynamicFilterController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.dynamicFilterForm');
        return controller;
    }
});