Ext.define('App.model.userGroupGrantsByMenu', {
    extend: 'Ext.data.Model',

    fields: [
        'id', 
        'menu_text', 
        'visualize', 
        'insert', 
        'update', 
        'remove'
    ]
});