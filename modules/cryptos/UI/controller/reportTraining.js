Ext.define('App.modules.cryptos.UI.controller.reportTraining', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.reportTraining');
    },
    
    toggleProgressStatuses: function(config)
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
            me.toggleProgressStatus(config, training_code);
        });
        
    },
    
    toggleProgressStatus: function(config, training_code)
    {
        var me = this;
        
        var report = (config.wild)? 'reportWildTraining' : 'reportTraining';
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/' + report + '/toggleProgressStatus',
            params :{
                training_code: training_code
            },
            success: function(result, request)
            {
                me.refreshGrid(config);
            }
        });           
    },
    
    getTrainingRobot: function(config, training_code, winner)
    {
        var me = this;
        
        var report = (config.wild)? 'reportWildTraining' : 'reportTraining';
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/' + report + '/getTrainingRobot',
            params :{
                training_code: training_code,
                winner: winner
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                
                if (!obj.success)
                {
                    me.msgBox('Error getting robot', obj.msg);
                    return;
                }
                
                var record = Ext.data.Record.create(obj.data);
                var last_training_config = {
                    last_training_code: training_code,
                    last_training_was_wild: config.wild,
                    last_training_winner: winner
                };
                me.getRobotController().showRobot(record, last_training_config);
            }
        });           
    },
    
    donwloadTrainingRobotConf: function(config, training_code, winner)
    {
        var me = this;
        
        var report = (config.wild)? 'reportWildTraining' : 'reportTraining';
                    
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/' + report + '/getTrainingRobot',
            params :{
                training_code: training_code,
                winner: winner
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                
                if (!obj.success)
                {
                    me.msgBox('Error getting robot', obj.msg);
                    return;
                }
                
                var record = Ext.data.Record.create(obj.data);
                me.getRobotController().donwloadConf(record);
            }
        });           
    },
    
    getRobotController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }

});
