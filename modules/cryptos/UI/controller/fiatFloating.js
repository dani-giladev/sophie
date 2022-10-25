Ext.define('App.modules.cryptos.UI.controller.fiatFloating', {
    extend: 'App.modules.cryptos.UI.controller.reportTransaction',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTransaction'
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.fiatFloating');
    },
    
    convert2Fiat: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        var title = "Convert to FIAT";
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            me.msgBox(title, "Please, at least you should select one selling transaccion");
            return;
        }
        
        Ext.MessageBox.show({
            title: title,
            msg: "Are you sure to convert to FIAT Now, all the selected selling transactions?",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn, text)
            {
                if (btn !== 'yes')
                {
                    return;
                }
                
                var params = {};
                var data = [];
                Ext.each(selected, function(record) {
                    data.push({
                        transaction_id: record.get('_id'),
                        is_training: record.get('is_training')
                    });
                });
                data = Ext.encode(data);
                params['data'] = data;
                
                Ext.getBody().mask(config.trans.common.wait_please);
            
                Ext.Ajax.request({
                    type: 'ajax',
                    method: 'POST',
                    url: restpath + 'cryptos/fiatFloating/convert2Fiat',
                    params: params,
                    success: function(result, request)
                    {
                        Ext.getBody().unmask();
                        var obj = Ext.JSON.decode(result.responseText);
                        
                        me.refreshGrid(config);
                        
                        if (!obj.success)
                        {
                            me.msgBox(title, obj.msg);
                            return;
                        }
                        
                        me.msgBox(title, "These orders have been converted to FIAT successfully", Ext.Msg.INFO);
                    }
                });
            }
        });
    }

});
