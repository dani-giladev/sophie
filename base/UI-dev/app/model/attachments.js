Ext.define('App.model.attachments', {
    extend: 'Ext.data.Model',

    fields: [
        {name: 'path'},
        {name: 'relative_path'},
        {name: 'filename'},
        {name: 'size'},
        {name: 'extension'},
        {name: 'can_be_viewed'}
    ]
});