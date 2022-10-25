Ext.define('App.view.fileManager.gridToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.filemanager_grid_toolbar',
    
    explotation: 'File manager grid toolbar view',
    
    config: {},
    
    region: 'north',
    border: true,
    frame: false,
    
//    ui: 'footer',
    
    initComponent: function()
    {
        var me = this;
        
        this.title = '';
        
        this.items = 
        [
            {
                xtype: 'form',
                title: '',// 'Upload a File',
                width: 150,
                frame: false,
                border: false,
                margin: 0,
                padding: 0,
                items: [{
                    xtype: 'multiUpload',
                    name: 'files[]',
                    multiple: true,
                    buttonOnly : true,
                    buttonConfig : {
                        margin: 0,
                        text : 'Add file',
                        iconCls: "x-fa fa-plus"
                    },
                    margin: 0,
                    listeners: {
                        change: function(fld, value) {
                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                            fld.setRawValue(newValue);

                            var form = this.up('form').getForm();
                            if(form.isValid())
                            {
                                me.getViewController().uploadFiles(me.config, form);
                            }                                
                        }
                    }
                }]
            },               
            {
                text: 'Delete file',
                //disabled: !me.config.permissions.delete,
                handler: this.deleteFile
            },
            //' | ',
            {
                xtype: 'tbfill'
            },
            {
                xtype: 'button',
                text: 'Visualize',
                iconCls: "x-fa fa-eye",
                handler: function()
                {
                    me.getViewController().visualize(me.config);                         
                }
            },
            {
                xtype: 'button',
                text: 'Descargar',
                iconCls: "x-fa fa-download",
                handler: function()
                {
                    me.getViewController().download(me.config);  
                }
            }            
        ];
            
        this.callParent(arguments);
    },
    
    deleteFile: function(button, eventObject)
    {
        var me = button.up('toolbar');
        me.getViewController().deleteFile(me.config);
    },
        
    getViewController: function()
    {
        var controller = App.app.getController('App.controller.fileManager.fileManager');       
        return controller;
    }
});