Ext.define('App.model.fileManager', {
    extend: 'Ext.data.Model',
    
    fields: [
        {name: 'relativePath'},
        
        {name: 'filename', 
            label: 'base.fileManager.name',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                listeners: {
                    render: function(field, eOpts)
                    {
                        field.focus();
                    }
                }
            }
        },
        
        {name: 'filesize'},
        {name: 'filedate'},
        {name: 'fileextension'},
        {name: 'is_image'},
        {name: 'can_be_viewed'}
    ]
});