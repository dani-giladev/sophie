Ext.define('App.controller.controller', {
    extend: 'Ext.app.Controller',
    
    getLang: function()
    {
        var lang = localStorage.getItem("lang");
        if (!lang)
        {
            return 'ca';
        }
        
        return lang;
    },
    
    setLang: function(value)
    {
        localStorage.setItem("lang", value);
    },
    
    getToken: function()
    {
        return localStorage.getItem("token");
    },
    
    setToken: function(token)
    {
        localStorage.setItem("token", token);
    },
    
    removeToken: function()
    {
        localStorage.removeItem("token");
    },
    
    setTokenToDefaultHeaders: function(token)
    {
        Ext.Ajax.cors = true;
        Ext.Ajax.setDefaultHeaders({
            'Authorization': 'Bearer ' + token,
            'Access-Control-Allow-Origin': '*'
        });           
    },
    
    getLoginUIData: function()
    {
        return this.getUIDataController().getLoginUIData();
    },
    
    getUIData: function()
    {
        return this.getUIDataController().getUIData();
    },
    
    getLanguages: function()
    {
        return this.getLoginUIData().app_languages;
    },
    
    getLoginTrans: function()
    {
        return this.getLoginUIData().translations['login'];
    },
    
    getTrans: function(key)
    {
        var trans = this.getUIData().translations;
        if (!trans[key])
        {
            return null;
        }
        
        return trans[key];
    },
    
    logout: function()
    {
        var me = this;
        Ext.Ajax.request({
            type: 'ajax',
            method: 'GET',
            url: restpath + 'admin/user/logout',
            success: function(response)
            {
                me.removeToken();
                window.location.reload();
            }
        });
    },
    
    getUIDataController: function()
    {
        return App.app.getController('App.controller.uidata');
    },
    
    msgBox: function(title, msg, icon)
    {
        icon = (!icon)? Ext.Msg.ERROR : icon;
        
        setTimeout(function() {
            // Delay because of fix bug (ths box hides under active window)
            Ext.Msg.show(
            {
                title: title,
                msg: msg,
                modal: true,
                icon: icon,
                buttons: Ext.Msg.OK
            });
        }, 10);         

    },
    
    customMsgBox: function(title, msg, show_time, type_box)
    {
        var me = this;
        
        var enabled_cancel_button,
            text_accept_button,
            text_cancel_button;
        
        var trans = me.getTrans('base').maintenance;
        
        if (!type_box)
        {
            enabled_cancel_button = false;
            text_accept_button = trans.accept;
            text_cancel_button = trans.cancel;
        }   
        else
        {
            if (type_box == 'accept-cancel')
            {
                enabled_cancel_button = true;
                text_accept_button = trans.accept;
                text_cancel_button = trans.cancel;
            }
            else if (type_box == 'yes-no')
            {
                enabled_cancel_button = true;
                text_accept_button = trans.yes;
                text_cancel_button = trans.no;
            }
            else
            {
                enabled_cancel_button = false;
                text_accept_button = trans.accept;
                text_cancel_button = trans.cancel;
            }
        }
        
        var msgBox = Ext.widget('msgBox', {
            title: title,
            msg: msg,
            enabledCancelButton: enabled_cancel_button,
            textAcceptButton: text_accept_button,
            textCancelButton: text_cancel_button
        });

        if (show_time)
        {
            if (show_time === 'default')
            {
                show_time = 5000;
            }
            Ext.defer(function() {
                msgBox.close();
            }, show_time);  
        }
        
        return msgBox;
      
    },
    
    getGrants: function(config)
    {
        var me = this;
        
        if (me.getUIData().is_super_user)
        {
            return {
                visualize: true,
                insert: true,
                update: true,
                remove: true
            };
        }
        
        var plugin = config.moduleId;
        var model = config.modelId;
        var grants = me.getUIData().grants[config.launchedFromModule];

        if (!grants)
        {
            return {
                visualize: false,
                insert: false,
                update: false,
                remove: false
            };
        }

        var menu_id = plugin + '-' + model;
        
        if (!grants.grants_summary || grants.grants_summary === 'none')
        {
            return {
                visualize: false,
                insert: false,
                update: false,
                remove: false
            };
        }
        
        if (grants.grants_summary === 'all')
        {
            return {
                visualize: true,
                insert: true,
                update: true,
                remove: true
            };
        }
        
        // Custom grants
        if (!grants.grants_by_menu[menu_id])
        {
            return {
                visualize: false,
                insert: false,
                update: false,
                remove: false
            };
        }
        
        return {
            visualize: grants.grants_by_menu[menu_id].visualize,
            insert: grants.grants_by_menu[menu_id].insert,
            update: grants.grants_by_menu[menu_id].update,
            remove: grants.grants_by_menu[menu_id].remove
        };        
    },
    
    isSpecialGranted: function(key, config)
    {
        var me = this;
        
        if (me.getUIData().is_super_user)
        {
            return true;
        }
        
        var grants = me.getUIData().grants[config.launchedFromModule];
        
        if (!grants.special_grants || !grants.special_grants[key])
        {
            return false;
        }
        
        return grants.special_grants[key];
    },
    
    getUrlVars: function() 
    {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
        function(m,key,value) {
          vars[key] = value;
        });
        return vars;
    },
    
    getSize: function()
    { 
        var ret = {};
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('rows')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        ret.width = x;
        ret.height = y;
        return ret;
    },
    
    getRandom: function(min, max)
    {
        return Math.floor(Math.random() * max) + min;        
    },

    setDefaultMenuOption: function(module_code, menu_option)
    {
        var varName = module_code + "_default_menu_option";
         // console.log("Saving " + menu_option + " in "  + varName);
        localStorage.setItem(varName, menu_option);
    },

    getDefaultMenuOption: function (module_code)
    {
        var varName = module_code + "_default_menu_option";
         // console.log("Getting value from " + varName);
        return localStorage.getItem(varName);
    },

    resetDefaultMenuOption: function (module_code, menu_option)
    {
        var varName = module_code + "_default_menu_option";
        if(this.getDefaultMenuOption(module_code) == menu_option)
        {
            // console.log("Resetting: " + varName);
            localStorage.removeItem(varName);
        }

    },
    
    showCalc: function(field)
    {
        var window = Ext.widget('common-window');
        window.setHeight(100);
        window.setWidth(400);
        window.setTitle('Calc');
        window.add({
            xtype: 'textfield',
            maskRe: /[0-9\,\.\+\-\*\/]/,
            enableKeyEvents : true,
            listeners: {
                render: function(this_field) {
                    var task = new Ext.util.DelayedTask(function() {
                        var value = field.getValue();
                        if (!Ext.isEmpty(value))
                        {
                            value = String(value).replace(/\,/g, ".");
                            this_field.setValue(value);                            
                        }
                        this_field.focus();
                    });        
                    task.delay(100); 
                },
                keypress : function(view, e) {
                    
                    var key = e.getKey();
                    var value = view.getRawValue();
                    
                    if (key === e.ENTER) 
                    {
                        var new_value = value.replace(/\,/g, ".");
                        new_value =  eval(new_value);
                        new_value = parseFloat(new_value.toFixed(4));
                        if (new_value < 0) new_value = 0;
                        new_value = String(new_value).replace(/\./g, ",");
                        field.setValue(new_value);
                        field.focus();
                        window.close();
                    }
                }
            }  
        });         
        window.show();
    }
});