Ext.define('App.modules.cryptos.UI.view.robot.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.cryptos-robot-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.controller.robot',
        'App.view.maintenance.toolbar'
    ],
    
    show_selectall_button: true,

    onRender: function()
    {
        var me = this;

        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);

        buttongroup.add({
            text: 'Download conf.',
            iconCls: 'x-fa fa-download',
            handler: function()
            {
                me.getMaintenanceController().donwloadConfs(me.config);
            }
        });
        
        var margin_form;
        var width_button;
        if (Ext.isChrome)
        {
            margin_form = '-6 0 0 -6';
            width_button = '100%';
        }
        else
        {
            margin_form = '-6 0 0 -6';
            width_button = 130;
        }
        
        buttongroup.add({
            
//            text: 'Upload Conf.',
//            iconCls: 'x-fa fa-upload',
//            handler: function()
//            {
//                me.getMaintenanceController().uploadConf(me.config);
//            }

            xtype: 'form',
            title: '',// 'Upload a File',
            width: 130,
            frame: false,
            border: false,
            margin: margin_form,
            padding: 0,
            items: [{
                xtype: 'filefield',
                name: 'file',
                buttonOnly : true,
                buttonConfig : {
                    width : width_button,
                    text: 'Upload conf.',
                    iconCls: 'x-fa fa-upload',
                    ui: 'default-toolbar'
                },
                anchor: '100%',
                listeners: {
                    change: function(fld, value)
                    {
                        var filename = value.replace(/C:\\fakepath\\/g, '');
                        fld.setRawValue(filename);
                        var uploadform = this.up('form').getForm();
                        
                        me.getMaintenanceController().uploadConf(me.config, uploadform);
                    }
                }
            }]
        
        });
        
        buttongroup.add({
            text: 'More Actions',
            iconCls: 'x-fa fa-bolt',
            menu:
            [
                {
                    text: 'Start',
                    iconCls: 'x-fa fa-play',
                    handler: function()
                    {
                        me.getMaintenanceController().startStopRobots(me.config, true);
                    }
                },
                {
                    text: 'Stop',
                    iconCls: 'x-fa fa-stop',
                    handler: function()
                    {
                        me.getMaintenanceController().startStopRobots(me.config, false);
                    }
                },
                '-',
                {
                    text: 'Sell Now',
                    iconCls: 'x-fa fa-flag-checkered',
                    handler: function()
                    {
                        me.getMaintenanceController().tradeRobots(me.config, 'sell');
                    }
                },
                {
                    text: 'Sell Now & Stop',
                    iconCls: 'x-fa fa-stop',
                    handler: function()
                    {
                        me.getMaintenanceController().tradeRobots(me.config, 'sellAndStop');
                    }
                },
                {
                    text: 'Sell Calmly & Stop',
                    iconCls: 'x-fa fa-stop',
                    handler: function()
                    {
                        me.getMaintenanceController().tradeRobots(me.config, 'sellCalmlyAndStop');
                    }
                },
                '-',
                {
                    text: 'Setting Charts',
                    iconCls: 'x-fa fa-cog',
                    handler: function()
                    {
                        me.getMaintenanceController().settingPricesCharts(me.config);
                    }
                },
                '-',
                {
                    text: 'Get/Update Samples (Update Candlestick)',
                    iconCls: 'x-fa fa-stack-overflow',
                    handler: function()
                    {
                        me.getMaintenanceController().updateCandlestick(me.config);
                    }
                },
                '-',
                {
                    text: 'Switch last operation Buy<->Sell',
                    iconCls: 'x-fa fa-exchange',
                    handler: function()
                    {
                        me.getMaintenanceController().switchLastOperation(me.config);
                    }
                }
            ]
        });        
    
        this.callParent(arguments);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }

});
