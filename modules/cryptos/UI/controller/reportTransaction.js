Ext.define('App.modules.cryptos.UI.controller.reportTransaction', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.reportTransaction');
    },
    
    showOrder: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var record = selected[0];
        
        Ext.Msg.alert('JSON', '<pre>' + JSON.stringify(record.data.order, undefined, 2) + '</pre>');
    }

});
