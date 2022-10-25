Ext.define('App.view.attachments', {
    extend: 'Ext.grid.Panel',
    xtype: 'attachments',
    alias: 'widget.attachments',
    
    requires: [
        'App.model.attachments',
        'App.store.attachments'
    ],

    region: 'center',
    layout: 'fit',
    height: '100%',
    width: '100%',
    scroll: true,
    
    trans: null,
    
    module: null,
    model: null,
    doc_id: null,
    
    initComponent: function()
    {
        var me = this;     
    
        me.trans = App.app.getController('App.controller.controller').getTrans('base').attachments;
    
        Ext.apply(this, 
        {
            title: '',
            cls: 'feed-grid',
            store: {
                type: 'attachments'
            },
            viewConfig: 
            {
                deferEmptyText: false              
            },
            columns:
            [
                {
                    text: me.trans.filename,
                    dataIndex: 'filename',
                    align: 'left',
                    flex: 1
                },
                {
                    text: me.trans.size,
                    dataIndex: 'size',
                    align: 'center',
                    width: 180
                }                
            ]
            
        });
        
        me.dockedItems =
        [
            Ext.create('Ext.toolbar.Toolbar', 
            {
                dock: 'bottom', //'top',
                items: 
                [
                    {
                        xtype: 'form',
                        title: '',// 'Upload a File',
                        width: 150,
                        frame: false,
                        border: false,
                        margin: 0,
                        padding: '10 5 0 0',
                        items: [{
                            xtype: 'filefield',
                            name: 'file',
                            buttonOnly : true,
                            buttonConfig : {
                                width : '100%',
                                text : me.trans.add_file,
                                iconCls: "x-fa fa-plus"
                                //ui: 'default-toolbar'
                            },
                            //msgTarget: 'side',
                            anchor: '100%',
                            listeners: {
                                change: function(fld, value) {
                                    var newValue = value.replace(/C:\\fakepath\\/g, '');
                                    fld.setRawValue(newValue);

                                    var form = this.up('form').getForm();
                                    if(form.isValid()){
                                        form.submit({
                                            url: restpath + 'admin/attachments/uploadFile',
                                            waitMsg: me.trans.uploading_file + '...',
                                            params: {
                                                module: me.module,
                                                model: me.model,
                                                doc_id: me.doc_id                                                
                                            },
                                            success: function(fp, o) {
                                                //console.log(o);
                                                me.getStore().reload();
                                            },
                                            failure: function(fp, o) {
                                                //console.log(o);
                                                App.app.getController('App.controller.controller').msgBox('Error uploading file', o.result.msg);
                                            }
                                        });
                                    }                                


                                }
                            }
                        }]
                    },
                    {
                        xtype: 'button',
                        text: me.trans.remove_file,
                        iconCls: "x-fa fa-remove",
                        handler: function()
                        {
                            var selected = me.getSelectionModel().getSelection();
                            if (!selected[0])
                            {
                                return;
                            }
                            var record = selected[0];
                            var filename = record.get('filename');
                            
                            Ext.MessageBox.show({
                                title: me.trans.remove_file_title,
                                msg: me.trans.sure_delete,
                                buttons: Ext.MessageBox.YESNO,
                                icon: Ext.MessageBox.WARNING,
                                fn: function(btn, text)
                                {
                                    if(btn == 'yes')
                                    {

                                        Ext.Ajax.request({
                                            type: 'ajax',
                                            method: 'POST',
                                            url: restpath + 'admin/attachments/removeFile',
                                            params: {
                                                module: me.module,
                                                model: me.model,
                                                doc_id: me.doc_id,
                                                filename: filename  
                                            },
                                            success: function(response)
                                            {
                                                var result = Ext.JSON.decode(response.responseText);
                                                if (!result.success)
                                                {
                                                    App.app.getController('App.controller.controller').msgBox('Error removing file', result.msg);
                                                    return;
                                                }
                                                
                                                me.getStore().reload();
                                            }
                                        });    

                                    }
                                }
                            });
                             
                        }
                    },       
                    //' | ',
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: me.trans.visualize,
                        iconCls: "x-fa fa-eye",
                        handler: function()
                        {
                            var selected = me.getSelectionModel().getSelection();
                            if (!selected[0])
                            {
                                return;
                            }
                            var record = selected[0];                            
                            me.visualize(record);
                        }
                    },
                    {
                        xtype: 'button',
                        text: me.trans.download,
                        iconCls: "x-fa fa-download",
                        handler: function()
                        {
                            me.download();
                        }
                    }
                ]
            })
        ];        
        
        me.callParent(arguments);
        
        me.store.on('load', this.onLoad, this);
        this.on('itemdblclick', this.onRowDblClick, this);   
        
        var proxy = me.store.getProxy();
        proxy.url = restpath + proxy.endpoint;
        me.store.load({
            params: {
                module: me.module,
                model: me.model,
                doc_id: me.doc_id
            }
        });
        
    },

    onRender: function(grid, options)
    {   
        
        this.callParent(arguments);           
    },
   
    onLoad: function(store, records, success, operation, options)
    {
        /*if(store.getCount() > 0)
        {
            this.getSelectionModel().select(0);
        }*/
    },
    
    onRowDblClick: function(view, record, product, index, e)
    {
        var me = this;
        me.visualize(record); 
    },
    
    visualize: function(record)
    {
        var me = this;
        var path = record.get('path');
        var relative_path = record.get('relative_path');
        var filename = record.get('filename');
        var extension = record.get('extension');
        var can_be_viewed = record.get('can_be_viewed');
        
        if (!can_be_viewed)
        {
            App.app.getController('App.controller.controller').msgBox(me.trans.visualize, me.trans.this_type_of_file_cannot_be_viewed);
            return;
        }
        
        if (extension.toUpperCase() === 'PDF')
        {
            me.showPDF(path, filename);
        }
        else
        {
            me.showImage(relative_path, filename);
        }
    },
    
    showPDF: function(path, filename)
    {
        var fullpath = path + '/' + filename;
        
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", restpath + "admin/attachments/showPDF");
        form.setAttribute("target", "view");

        var fullpath_field = document.createElement("input"); 
        fullpath_field.setAttribute("type", "hidden");
        fullpath_field.setAttribute("name", "fullpath");
        fullpath_field.setAttribute("value", fullpath);
        form.appendChild(fullpath_field);

        document.body.appendChild(form);
        window.open('', 'view');
        form.submit();               
    },
    
    showImage: function(relative_path, filename)
    {
        var src = relative_path + '/' + filename;
        
        var window = Ext.widget('common-window');
        window.setHeight(500);
        window.setWidth(500);
        window.setTitle(filename);
        window.add({
            xtype: 'image',
            src: src//,
//            height: '100%',
//            width: '100%'       
        });
            
        window.show();
    },
    
    download: function()
    {
        var me = this;
        var selected = me.getSelectionModel().getSelection();
        if (!selected[0])
        {
            return;
        }
        var record = selected[0];
        var path = record.get('path');
        var filename = record.get('filename');
        var fullpath = path + '/' + filename;
        
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", restpath + "admin/attachments/downloadFile");
        form.setAttribute("target", "view");

        var fullpath_field = document.createElement("input"); 
        fullpath_field.setAttribute("type", "hidden");
        fullpath_field.setAttribute("name", "fullpath");
        fullpath_field.setAttribute("value", fullpath);
        form.appendChild(fullpath_field);

        document.body.appendChild(form);
        //window.open('', 'view');
        form.submit();
    }
    
});