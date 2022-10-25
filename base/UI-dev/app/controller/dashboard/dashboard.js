Ext.define('App.controller.dashboard.dashboard', {
    extend: 'App.controller.maintenance.maintenance',
    
    requires: [

    ],

    getAliasPrefix: function(config)
    {
        var prefix = config.moduleId + '-' + config.modelId;
        return prefix;
    },
    
    refresh: function()
    {
        alert('Sorry.. Not imlemented yet!');
    }
    
});