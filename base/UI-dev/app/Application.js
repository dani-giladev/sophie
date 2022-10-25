/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.Loader.setPath(
{
    'Ext.ux.grid.Printer': 'app/plugins/ux/grid/Printer',
    'App.modules': 'app/plugins/modules'
}).setConfig({
//    enabled: true//,
//    disableCaching: false
});

Ext.define('App.Application', {
    extend: 'Ext.app.Application',
    
    name: 'App',

    requires: [
        'App.controller.controller',
        'App.controller.globals',
        'App.controller.uidata',
        'App.controller.overrides',
        'App.controller.main.Main',
        'App.view.main.Main',
        'App.view.login.login',
        'App.view.window',
        'App.view.msgBox'
    ],

    stores: [
        // TODO: add global / shared stores here
    ],

    common_controller: null,
    common_globals_controller: null,
    common_uidata_controller: null,
    common_overrides_controller: null,
    main_controller: null,
    
    launch: function () {
        var me = this;

        // Set common controllers
        me.common_controller = App.app.getController('App.controller.controller');
        me.common_globals_controller = App.app.getController('App.controller.globals');
        me.common_uidata_controller = App.app.getController('App.controller.uidata');
        me.common_overrides_controller = App.app.getController('App.controller.overrides');
        me.main_controller = App.app.getController('App.controller.main.Main');
        
        // set global methods and overrides
        me.common_globals_controller.setGlobals();
        me.common_overrides_controller.setOverrides();
        
        // Get ui base data
        me.common_uidata_controller.on('receivedLoginUIData', function(success, result)
        {
            if (!success)
            {
                alert("It's been impossible to launch this app!!");
                return;
            }

            // Set ui data
            me.common_uidata_controller.setLoginUIData(result.data);
            
            // Autologin?
            if (Ext.Object.isEmpty(autologindata))
            {
                // Init app
                me.initApp();                
            }
            else
            {
                // Validate user
                me.common_uidata_controller.on('receivedValidateUser', function(success, result)
                {
                    if (!success)
                    {
                        // Remove token
                        me.common_controller.setToken('');
                    }
                    else
                    {
                        // Set token
                        var token = result.data.token;
                        me.common_controller.setToken(token);                        
                    }
                    
                    // Init app
                    me.initApp();  

                }, this, {single: true});
                me.common_uidata_controller.validateUser(autologindata.login, autologindata.encodedpass, autologindata.lang, true);            
            }            

        }, this, {single: true});
        me.common_uidata_controller.getRemoteLoginUIData();  
    },
    
    initApp: function()
    {
        var me = this;
        
        // Create viewport
        Ext.create({
            xtype: 'main'
        }); 

        // Is logged user?
        var token = me.common_controller.getToken();
        //console.log(token);
        if (!token)
        {
            App.app.showLoginWindow();
        }
        else
        {
            // Set token to default headers
            me.common_controller.setTokenToDefaultHeaders(token);
            
            // Get ui data
            me.common_uidata_controller.on('receivedUIData', function(success, result)
            {
                if (!success)
                {
                    App.app.showLoginWindow();
                    return;
                }

                // Set ui data
                me.common_uidata_controller.setUIData(result.data);
                
                // Init viewport
                me.main_controller.initViewport();  

            }, this, {single: true});
            me.common_uidata_controller.getRemoteUIData(token);            
        }        
    },
    
    showLoginWindow: function()
    {
        var window = Ext.widget('common-window');
        window.setHeight('100%');
        window.setWidth('100%');
        window.closable = false;
        window.resizable = false;   
        window.header = false;
        window.frame = false;
        window.border = false;
    
        var login_form = Ext.create({
            xtype: 'login'
        }); 
        
        window.add(login_form);   
        window.show();
    },

    onAppUpdate: function () {
        
        /*Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );*/
        
        Ext.Msg.alert(
            'Nueva actualización', 
            'Hay una nueva actualización de Sophie. Acepte el mensaje para refrescar la nueva versión. Gracias', 
            function()
            {
                window.location.reload();
            }
        );

    }
});
