Ext.define('App.modules.cryptos.UI.controller.pump', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_pump-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.pump');
    },
    
    showOrder: function(config, property)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var record = selected[0];
        
        if (!record.data[property])
        {
            me.msgBox('Oupps!', "This order does not exist yet!");
            return;
        }
        
        Ext.Msg.alert('JSON', '<pre>' + JSON.stringify(record.data[property], undefined, 2) + '</pre>');
    },
    
    completeOrder: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var record = selected[0];
        
        if (record.get('completed'))
        {
            me.msgBox('Eppps!', "This order is already completed!");
            return;
        }
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/pump/setComplete',
            params :{
                order_code: record.get('code')
            },
            success: function(result, request)
            {
                me.refreshGrid(config);
            }
        });  
    }

});
