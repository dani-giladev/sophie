Ext.define('App.controller.uidata', {
    extend: 'Ext.app.Controller',
    
    loginuidata: null,
    uidata: null,
    
    getLoginUIData: function()
    {
        return this.loginuidata;
    },
    
    setLoginUIData: function(object)
    {
        this.loginuidata = object;
    },
    
    getUIData: function()
    {
        return this.uidata;
    },
    
    setUIData: function(object)
    {
        this.uidata = object;
    },
    
    getRemoteLoginUIData: function()
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'GET',
            url: restpath + 'admin/uidata/getLoginUIData',
            success: function(response)
            {
                var result = Ext.JSON.decode(response.responseText);
                
                if (!result.success)
                {
                    me.fireEvent('receivedLoginUIData', false, result);
                    return;
                }
                
                me.fireEvent('receivedLoginUIData', true, result);
            },
            failure: function(response)
            {
                me.fireEvent('receivedLoginUIData', false, null);   
            }
        });        
    },
    
    validateUser: function(login, pass, lang, is_encodedpass)
    {
        var me = this;
        
        var params = {
            login: login,
            lang: lang               
        };
        
        if (is_encodedpass)
        {
            params['encodedpass'] = pass;
        }
        else
        {
            params['pass'] = pass;
        }
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'admin/user/validate',
            params: params,
            success: function(response)
            {
                var result = Ext.JSON.decode(response.responseText);
                
                if (!result.success)
                {
                    me.fireEvent('receivedValidateUser', false, result);
                    return;
                }

                me.fireEvent('receivedValidateUser', true, result);
            },
            failure: function(response)
            {
                me.fireEvent('receivedValidateUser', false, null);   
            }
        });        
    },
    
    getRemoteUIData: function(token)
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'admin/uidata/getUIData',
            params: {
                token: token
            },
            success: function(response)
            {
                var result = Ext.JSON.decode(response.responseText);
                
                if (!result.success)
                {
                    me.fireEvent('receivedUIData', false, result);
                    return;
                }
                
                console.log(result.data);
                
                me.fireEvent('receivedUIData', true, result);
            },
            failure: function(response)
            {
                me.fireEvent('receivedUIData', false, null);   
            }
        });        
    }
});