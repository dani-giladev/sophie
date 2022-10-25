Ext.define('App.controller.fileManager.fileManager', {
    extend: 'App.controller.controller',
    
    requires: [

    ],
    
    getComponentQuery: function(id, config)
    {
        var itemId = Ext.isEmpty(id)? config.itemId : (config.itemId + '_' + id);
//        console.log(itemId);
        return Ext.ComponentQuery.query('#' + itemId)[0];
    },
    
    newFolder: function(config)
    {
        var me = this;
        
        Ext.MessageBox.prompt('New folder', 'New folder name:', createDir);
        
        function createDir(button, text)
        {
            if (button === 'cancel')
            {
                return;
            }
            
            var theTree =  me.getComponentQuery('filemanager_tree', config);
            var selected = theTree.getSelectionModel().getSelection();
            var base_dir = '';
            if(selected[0])
            {
                base_dir = selected[0].get('id');
            }
            
            var url = restpath + 'admin/fileManager/newFolder';
                    
            Ext.Ajax.request({
                type: 'ajax',
                method: 'POST',
                url: url,
                params:
                {
                    base_dir: base_dir,
                    dir_name: text,
                    resources_path: config.resourcesPath
                },
                success: function(result, request)
                {
                    var obj = Ext.JSON.decode(result.responseText);
                    if(obj.success)
                    {
                        me.refresh(config);
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            title: 'New folder',
                            msg: 'Unable to create the requested folder. Contact support crew if you think you should be able to perform this action.' + obj.msg,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                },
                failure: function(response)
                {
                    Ext.MessageBox.show({
                        title: 'New folder',
                        msg: 'Unable to create the requested folder. Contact support crew if you think you should be able to perform this action.',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },
    
    deleteFolder: function(config)
    {
        var me = this;
        var theTree =  me.getComponentQuery('filemanager_tree', config);
        var selected = theTree.getSelectionModel().getSelection();
        
        if(selected[0])
        {
            var dir_id = selected[0].get('id');
            Ext.MessageBox.show({
                title: 'Delete folder',
                msg: 'Are you sure to delete this folder?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.WARNING,
                fn: function(btn, text)
                {
                    if(btn == 'yes')
                    {
                        var url = restpath + 'admin/fileManager/deleteFolder';
            
                        Ext.Ajax.request({
                            type: 'ajax',
                            method: 'POST',
                            url: url,
                            params:
                            {
                                dir: dir_id,
                                resources_path: config.resourcesPath
                            },
                            success: function(result, request)
                            {
                                var obj = Ext.JSON.decode(result.responseText);
                                if(obj.success)
                                {
                                    me.refresh(config, true);
                                }
                                else
                                {
                                    Ext.MessageBox.show({
                                        title: 'Delete folder',
                                        msg: 'Unable to remove the requested folder. Contact support crew if you think you should be able to perform this action.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            },
                            failure: function(response)
                            {
                                Ext.MessageBox.show({
                                    title: 'Delete folder',
                                    msg: 'Unable to remove the requested folder. Contact support crew if you think you should be able to perform this action.',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    
    deleteFile: function(config)
    {
        var me = this;
        var theGrid = me.getComponentQuery('grid', config);
        var selected = theGrid.getSelectionModel().getSelection();
        
        if(selected[0])
        {
            var filename_id = selected[0].get('filename');
            var theTree =  me.getComponentQuery('filemanager_tree', config);
            var selectedDir = theTree.getSelectionModel().getSelection();
            
            Ext.MessageBox.show({
                title: 'Delete file',
                msg: 'Are you sure to delete this file?',
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.WARNING,
                fn: function(btn, text)
                {
                    if(btn == 'yes')
                    {
                        var url = restpath + 'admin/fileManager/deleteFile';
                        
                        Ext.Ajax.request({
                            type: 'ajax',
                            method: 'POST',
                            url: url,
                            params:
                            {
                                file: selectedDir[0].get('id') + '/' + filename_id,
                                resources_path: config.resourcesPath
                            },
                            success: function(result, request)
                            {
                                var obj = Ext.JSON.decode(result.responseText);
                                if(obj.success)
                                {
                                    me.loadGridStore(config, selectedDir[0].get('id'));
                                }
                                else
                                {
                                    Ext.MessageBox.show({
                                        title: 'Delete file',
                                        msg: 'Unable to remove the requested file. Contact support crew if you think you should be able to perform this action.',
                                        buttons: Ext.MessageBox.OK,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                }
                            },
                            failure: function(response)
                            {
                                Ext.MessageBox.show({
                                    title: 'Delete file',
                                    msg: 'Unable to remove the requested file. Contact support crew if you think you should be able to perform this action.',
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        });
                    }
                }
            });
        }
    },
    
    uploadFiles: function(config, form)
    {
        var me = this;
        var theTree =  me.getComponentQuery('filemanager_tree', config);
        var selected = theTree.getSelectionModel().getSelection();
        
        if(!selected[0])
        {
            return;
        }

        var url = restpath + 'admin/fileManager/uploadFile';
        var dir_id = selected[0].get('id');
        
        form.submit({
            url: url,
            waitMsg: 'Uploading file' + '...',
            params: {
                dir_id: dir_id
            },
            success: function(fp, result) {
                me.loadGridStore(config, dir_id);
            },
            failure: function(fp, result) {
                var obj = Ext.JSON.decode(result.response.responseText);
                Ext.MessageBox.show({
                    title: 'Error uploading file',
                    msg: 'Unable to upload the requested file. Contact support crew if you think you should be able to perform this action.</br></br>Error: ' + obj.msg,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });

    },
    
    visualize: function(config)
    {
        var me = this;
        var theTree =  me.getComponentQuery('filemanager_tree', config);
        var selected_dir = theTree.getSelectionModel().getSelection();
        if(!selected_dir[0])
        {
            return;
        }
        var dir_record = selected_dir[0];
        var dir_id = dir_record.get('id');

        var theGrid = me.getComponentQuery('grid', config);
        var selected_file = theGrid.getSelectionModel().getSelection();
        if (!selected_file[0])
        {
            return;
        }
        var image_record = selected_file[0];
        
        var extension = image_record.get('fileextension');
        var can_be_viewed = image_record.get('can_be_viewed');
        
        if (!can_be_viewed)
        {
            App.app.getController('App.controller.controller').msgBox("Error", "This file is not allowed to show");
            return;
        }
        
        if (extension.toUpperCase() === 'PDF')
        {
            me.showPDF(dir_id, image_record);
        }
        else
        {
            me.showImage(config, image_record);
        }
    },
    
    showPDF: function(dir_id, image_record)
    {
        var filename = image_record.get('filename');
        var fullpath = dir_id + '/' + filename;
        
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", restpath + "admin/fileManager/showPDF");
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
    
    showImage: function(config, image_record)
    {
        var relative_path = image_record.get('relativePath');
        var filename = image_record.get('filename');
        var src = '/' + config.resourcesPath + '/' + relative_path + '/' + filename;
        
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
    
    download: function(config)
    {
        var me = this;
        
        var theTree =  me.getComponentQuery('filemanager_tree', config);
        var selected_dir = theTree.getSelectionModel().getSelection();
        if(!selected_dir[0])
        {
            return;
        }
        var dir_record = selected_dir[0];
        var dir_id = dir_record.get('id');

        var theGrid = me.getComponentQuery('grid', config);
        var selected_file = theGrid.getSelectionModel().getSelection();
        if (!selected_file[0])
        {
            return;
        }
        var image_record = selected_file[0];
        
        var filename = image_record.get('filename');
        var fullpath = dir_id + '/' + filename;
        
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", restpath + "admin/fileManager/downloadFile");
        form.setAttribute("target", "view");

        var fullpath_field = document.createElement("input"); 
        fullpath_field.setAttribute("type", "hidden");
        fullpath_field.setAttribute("name", "fullpath");
        fullpath_field.setAttribute("value", fullpath);
        form.appendChild(fullpath_field);

        document.body.appendChild(form);
        //window.open('', 'view');
        form.submit();
    },

    refresh: function(config, delete_folder)
    {
        var me = this;
        var theTree =  me.getComponentQuery('filemanager_tree', config);
        var selectedDir = theTree.getSelectionModel().getSelection();
        var selectedDirId = null;
       
        if(selectedDir[0])
        {
            selectedDirId = selectedDir[0].get('id');
            if (delete_folder)
            {
                var parentNode = selectedDir[0].parentNode;
                selectedDirId = parentNode.data.id;
            }
        }
        
        if (!Ext.isEmpty(selectedDirId))
        {
            var tree_store = theTree.getStore();
            tree_store.on('load', function(this_store, records, successful, eOpts)
            {
                var node = this_store.getNodeById(selectedDirId);
                theTree.expandNode(node);
                theTree.getSelectionModel().select(node);
                me.loadGridStore(config, selectedDirId);
            }, this, {single: true}); 
        }
        else
        {
            var node = theTree.getRootNode();
            node.expandChildren(true);
            theTree.getSelectionModel().select(node);
        }

        theTree.getStore().reload();       
    },
    
    loadGridStore: function(config, dir_id)
    {
        var me = this;
        var theGrid = me.getComponentQuery('grid', config);
        
        var proxy = theGrid.store.getProxy();
        proxy.url = restpath + proxy.endpoint;
        theGrid.store.load({
            params: {
                dir: dir_id,
                resources_path: config.resourcesPath
            }
        });
    },
    
    selectAndClose: function(config)
    {
        var me = this;
        var file_manager = me.getComponentQuery('', config);
        var thisGrid = me.getComponentQuery('grid', config);
        var selected_image = thisGrid.getSelectionModel().getSelection()[0];
        
        var task = new Ext.util.DelayedTask(function(){
            // Fire selected file event
            file_manager.fireEvent('selectedFile', 
                                    selected_image.get('filename'), 
                                    selected_image.get('filesize'), 
                                    selected_image.get('filedate'), 
                                    selected_image.get('relativePath'));  

            thisGrid.up('window').close();   
        });        
        task.delay(100);
     
    },
    
    deleteAssignedImageFromMultiImageGrid: function(config)
    {
        var me = this;
        var thisGrid = me.getComponentQuery('filemanager_multi_images_grid', config);
        var selected_image = thisGrid.getSelectionModel().getSelection()[0];
        if (!Ext.isEmpty(selected_image))
        {
            thisGrid.getStore().remove(selected_image); 
        }        
    },
    
    applyAssignedImagesFromMultiImageGridAndClose: function(config)
    {
        var me = this;
        var file_manager = me.getComponentQuery('', config);
        var thisGrid = me.getComponentQuery('filemanager_multi_images_grid', config);
        var imagesStore = thisGrid.getStore();
        
        // Fire event
        file_manager.fireEvent('applyAssignedImagesFromMultiImage', 
                                imagesStore);
                                
        thisGrid.up('window').close();   
    }
});