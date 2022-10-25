Ext.define('App.view.config.grid', {
    extend: 'App.view.maintenance.grid',
    alias: 'widget.config-grid',
    
    requires: [
        'App.store.config',
        'App.model.config'
    ],
    
    getGridStore: function()
    {
        return Ext.create('App.store.config');
    },
    
    getGridFeatures: function()
    {
        var ret = 
        [       
            {
                ftype: 'grouping',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }                       
        ];
        
        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.config.config');
        return controller;
    }
});