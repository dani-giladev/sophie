Ext.define('App.controller.globals', {
    extend: 'Ext.app.Controller',
    
    requires: [
        'App.modules.admin.UI.store.user'
    ],
    
    setGlobals: function()
    {
        var common_controller = App.app.getController('App.controller.controller');
        
        // Disable Aria accessibility warnings. Ex: [W] WAI-ARIA compatibility warnings can be suppressed by adding the following to application startup code:
        Ext.enableAria = false;
        //Ext.enableAriaButtons = false;        
        //Ext.enableAriaPanels = false;
        
        // Set global vars
        var urlvars = common_controller.getUrlVars();
        restpath = !urlvars.restpath? '/REST/public/' : urlvars.restpath;
        autologindata = {};
        if (urlvars.autologin === "true")
        {
            autologindata.login = urlvars.login;
            autologindata.encodedpass = urlvars.encodedpass;
            autologindata.lang = urlvars.lang;
            autologindata.forcemodule = urlvars.forcemodule;
        }
    },
    
    setGlobalStores: function()
    {
        App.app.adminUserStore = Ext.create('App.modules.admin.UI.store.user');
//        App.app.adminUserStore.on('load', function(store, records, success, operation)
//        {
//            console.log(records);
//        }, this, {single: true});
        var proxy = App.app.adminUserStore.getProxy();
        proxy.url = restpath + proxy.endpoint;
        App.app.adminUserStore.load();
    }
});