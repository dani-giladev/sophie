Ext.define('App.modules.cryptos.UI.view.reportWildTraining.grid', {
    extend: 'App.modules.cryptos.UI.view.reportTraining.grid',
    alias: 'widget.cryptos-reportWildTraining-grid',
    
    requires: [
        'App.modules.cryptos.UI.view.reportTraining.grid',
        'App.modules.cryptos.UI.controller.reportWildTraining',
        'App.modules.cryptos.UI.store.reportWildTraining',
        'App.modules.cryptos.UI.model.reportTraining'
    ],
    
    getGridFeatures: function()
    {
        var ret = 
        [ 
            {
                ftype: 'grouping',
                groupHeaderTpl: '<div class="custom-grid-feature-grouping">{groupValue}</div>'
            }
        ];
        
        return ret;
    },
        
    getContextMenuItems: function(record)
    {
        var me = this;
        
        return [
            {                       
                text: 'The winner is: The original robot',
                iconCls: "x-fa fa-trophy",
                handler: function(e, t)
                {
                    me.getMaintenanceController().updateTheWinners(me.config, 'original');
                }
            },
            {                       
                text: 'The winner is: The best robot',
                iconCls: "x-fa fa-trophy",
                handler: function(e, t)
                {
                    me.getMaintenanceController().updateTheWinners(me.config, 'robot');
                }
            },
            {                       
                text: 'The winner is: The best custom robot',
                iconCls: "x-fa fa-trophy",
                handler: function(e, t)
                {
                    me.getMaintenanceController().updateTheWinners(me.config, 'bcr');
                }
            },
            '-',
            {                       
                text: 'Switch progress state',
                iconCls: "x-fa fa-exchange",
                handler: function(e, t)
                {
                    me.getMaintenanceController().toggleProgressStatuses(me.config);
                }
            },
            {                       
                text: 'Switch validation',
                iconCls: "x-fa fa-exchange",
                handler: function(e, t)
                {
                    me.getMaintenanceController().toggleValidations(me.config);
                }
            },
            '-',
            {
                text: 'View the original robot',
                iconCls: "x-fa fa-github-alt",
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().getTrainingRobot(me.config, training_code, 'original');
                }
            },
            {
                text: 'Download the original robot conf.',
                iconCls: 'x-fa fa-download',
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().donwloadTrainingRobotConf(me.config, training_code, 'original');
                }
            },
            '-',
            {
                text: 'View the best robot',
                iconCls: "x-fa fa-github-alt",
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().getTrainingRobot(me.config, training_code, 'robot');
                }
            },
            {
                text: 'Download the best robot conf.',
                iconCls: 'x-fa fa-download',
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().donwloadTrainingRobotConf(me.config, training_code, 'robot');
                }
            },
            '-',
            {
                text: 'View the best custom robot',
                iconCls: "x-fa fa-github-alt",
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().getTrainingRobot(me.config, training_code, 'bcr');
                }
            },
            {
                text: 'Download the best custom robot conf.',
                iconCls: 'x-fa fa-download',
                handler: function(e, t)
                {
                    var training_code = record.get('code');
                    me.getMaintenanceController().donwloadTrainingRobotConf(me.config, training_code, 'bcr');
                }
            }                    
        ];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportWildTraining');
        return controller;
    }
});
