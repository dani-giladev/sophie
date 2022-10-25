Ext.define('App.modules.cryptos.UI.controller.reportWildTraining', {
    extend: 'App.modules.cryptos.UI.controller.reportTraining',
    
    requires: [
        'App.modules.cryptos.UI.controller.reportTraining'
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.reportWildTraining');
    },
    
    toggleValidations: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        Ext.each(selected, function(record)
        {
            var training_code = record.get('code');
            me.toggleValidation(config, training_code);
        });
    },
    
    toggleValidation: function(config, training_code)
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/reportWildTraining/toggleValidation',
            params :{
                training_code: training_code
            },
            success: function(result, request)
            {
                me.refreshGrid(config);
            }
        });           
    },
    
    updateTheWinners: function(config, winner)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        Ext.each(selected, function(record)
        {
            var training_code = record.get('code');
            me.updateTheWinner(config, training_code, winner);
        });
    },
    
    updateTheWinner: function(config, training_code, winner)
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/reportWildTraining/updateTheWinner',
            params :{
                training_code: training_code,
                winner: winner
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                
                if (!obj.success)
                {
                    me.msgBox('Error updating the winner', obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
            }
        });           
    },
    
    automaticWinnerUpdates: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        Ext.each(selected, function(record)
        {
            var training_code = record.get('code');
            me.automaticWinnerUpdate(config, training_code);
        });
    },
    
    automaticWinnerUpdate: function(config, training_code)
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/reportWildTraining/automaticWinnerUpdate',
            params :{
                training_code: training_code
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                
                if (!obj.success)
                {
                    me.msgBox('Error updating the winner', obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
            }
        });           
    }

});
