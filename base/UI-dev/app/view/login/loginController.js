Ext.define('App.view.login.loginController', {
    extend: 'App.view.viewController',
    alias: 'controller.login',

    requires: [
        'App.controller.controller',
        'App.controller.main.Main'
    ],

    onAfterRenderForm: function(thisForm, eOpts) {
        var loginfield = thisForm.down('[name=login]');
        
        // Test
//        var passfield = thisForm.down('[name=pass]');
//        loginfield.setValue('usertest');
//        passfield.setValue('usertest');
        
        // Set focus in login field
        var task = new Ext.util.DelayedTask(function(){
            //console.log('focus');
           loginfield.focus();
        });        
        task.delay(100);
    },

    onSpecialKey: function(field, e) 
    {
        var me = this;
        
        if ((e.getKey() === e.ENTER || e.getKey() === e.TAB) && field.isValid()) 
        {
            e.stopEvent();

            if (e.getKey() === e.TAB)
            {
                var nextField = me.getNextField(field);
                nextField && nextField.focus();                 
            }
            else
            {
                this.jumpToBlankField();
            }
        }        
    },
    
    getNextField: function(field)
    {
        var me = this,
            view = me.getView(),
            form = view.down('form');
    
        var fields = form.query('textfield, numberfield, combo');
        if (!fields)
        {
            return false;
        }   
        
        var currentFieldIdx = fields.indexOf(field);    
        if(currentFieldIdx <= -1) 
        {
            return false;
        }
        
        // Get the next form field
        var nextField, i=1;
        while (true) {
            //console.log(i);
            nextField = fields[currentFieldIdx + i];
            if (!nextField)
            {
                //console.log(nextField);
                return false;
            }
            if (!nextField.isHidden() && !nextField.isDisabled())
            {
                //console.log(nextField);
                return nextField;
            }
            i += 1;
        };

        return false;
    },
    
    jumpToBlankField: function()
    {
        var me = this,
            view = me.getView(),
            form = view.down('form');     
        
        // Set focus in the blank field
        var login = form.down('[name=login]');
        if (login.getValue() === '')
        {
            login.focus();
            return;
        }
        var password = form.down('[name=pass]');
        if (password.getValue() === '')
        {
            password.focus();
            return;
        }     
//        var lang = form.down('[name=lang]');
//        if (lang.getValue() === '')
//        {
//            lang.focus();
//            return;
//        } 
        
        this.onFormSubmit();        
    },
    
    onChangeLanguage: function( field , newValue , oldValue , eOpts)
    {
        var common_controller = App.app.getController('App.controller.controller');
        common_controller.setLang(newValue);
        //common_controller.logout();
    },

    onFormSubmit: function()
    {
        var me = this,
            view = me.getView(),
            form = view.down('form');
        var common_controller = App.app.getController('App.controller.controller');
        var common_uidata_controller = App.app.getController('App.controller.uidata');
        var main_controller = App.app.getController('App.controller.main.Main');
        
        if (!form.isValid()) 
        {
             return;
        }
        
        var values = form.getForm().getValues();
        var login = values['login'];
        var pass = values['pass'];
        var lang = values['lang'];
        
        // Validate user
        common_uidata_controller.on('receivedValidateUser', function(success, result)
        {
            if (!success)
            {
                var msg = (!Ext.isEmpty(result.msg)? result.msg : 'Invalid user or password')
                Ext.MessageBox.show({
                   title: 'Error',
                   msg: msg,
                   buttons: Ext.MessageBox.OK,
                   icon: Ext.MessageBox.ERROR
                });
                return;
            }

            // Set token
            var token = result.data.token;
            common_controller.setToken(token);
            common_controller.setTokenToDefaultHeaders(token);
                
            // Get ui data
            common_uidata_controller.on('receivedUIData', function(success, result)
            {
                if (!success)
                {
                    Ext.MessageBox.show({
                       title: 'Error',
                       msg: result.msg,
                       buttons: Ext.MessageBox.OK,
                       icon: Ext.MessageBox.ERROR
                    });
                    return;
                }

                // Set ui data
                common_uidata_controller.setUIData(result.data);

                // Close Login Window
                view.up('window').close();

                // Init viewport
                main_controller.initViewport();  

            }, this, {single: true});
            common_uidata_controller.getRemoteUIData(token);

        }, this, {single: true});
        common_uidata_controller.validateUser(login, pass, lang);

    }
});
