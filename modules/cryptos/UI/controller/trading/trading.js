Ext.define('App.modules.cryptos.UI.controller.trading.trading', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.controller.trading.chart',
        'App.modules.cryptos.UI.view.trading.toolbar',
        'App.modules.cryptos.UI.view.trading.controlpanel',
        'App.modules.cryptos.UI.view.trading.history',
        'App.modules.cryptos.UI.view.trading.trainingForm'
    ],
    
    trans: null,
    scanTask: null,
    state: 'minimized',
    header_initialized: false,
    user_code: null,
    user_name: null,
    robot: null,
    robot_is_running: false,
    robot_is_training: false,
    
    init: function()
    {
        var me = this;
        
        me.trans = me.getTrans('cryptos');
        
        me.scanTask = {
            enabled: false,
            counter: 0,
            run: function() {
                this.counter++;
                me.scan();
            },
            interval: 30000 // 30 seconds
        };
    },
    
    refreshChartsTask: {
        enabled: false,
        name: 'Refresh chart task',
        date: new Date(),
        interval: -1, // seconds (<= 0 is always interval disabled)
        start: function()
        {
            this.date = new Date();
            this.enabled = true;
        },
        stop: function()
        {
            this.enabled = false;
        }
    },
    
    refreshHistoryTask: {
        enabled: false,
        name: 'Refresh history task',
        date: new Date(),
        interval: 60, // seconds
        start: function()
        {
            this.date = new Date();
            this.enabled = true;
        },
        stop: function()
        {
            this.enabled = false;          
        }
    },
    
    getSelectedUserCode: function()
    {
        return this.getUIData().user_code;
    },
    
    getSelectedUserName: function()
    {
        return this.getUIData().user_name;
    },
    
    getRobot: function()
    {
        return this.robot;
    },
    
    renderView: function()
    {
        var me = this;
        
        me.user_code  = me.getSelectedUserCode();
        me.user_name  = me.getSelectedUserName();
        console.log(me.user_code, me.user_name);
        
        // Stop scan timer
        if (me.scanTask.enabled)
        {
            Ext.TaskManager.stop(me.scanTask);
            me.scanTask.enabled = false;
        }
    
        var dynamic_panel = Ext.ComponentQuery.query('#cryptos-trading-dynamicpanel')[0];
        //var config = dynamic_panel._config;
        
        // Firstly, remove panel
        dynamic_panel.removeAll();
      
        // Set title
        dynamic_panel.setTitle(me.user_name);
        
        // Building view
        var view =
        [
            {
                xtype: 'panel',
                layout: 'border',
                width: '100%',
                height: 1020,
                border: false,
                frame: false, 
                items:
                [
                    {
                        xtype: 'panel',
                        region: 'center',
                        layout: 'border',
                        flex: 1,
                        height: '100%',
                        items:
                        [
                            Ext.widget('cryptos-trading-toolbar', {
                                user_code: me.user_code
                            }),
                            {
                                xtype: 'panel',
                                itemId: 'cryptos-trading-mainchart-wrapper',
                                region: 'center',
                                layout: 'vbox',
                                items: 
                                [
                                    {
                                        xtype: 'panel',
                                        layout: 'hbox',
                                        margin: '0 0 0 20',
                                        height: 38,
                                        items:
                                        [
                                            {
                                                itemId: 'cryptos-trading-coinpair',
                                                html: ''
                                            },
                                            {
                                                xtype: 'container',
                                                itemId: 'cryptos-trading-realtime-topinfo',
                                                layout: 'hbox',
                                                items:
                                                [
                                                    {
                                                        itemId: 'cryptos-trading-lastprice',
                                                        html: '',
                                                        margin: '0 0 0 40'
                                                    },
                                                    {
                                                        itemId: 'cryptos-trading-change-by-period',
                                                        html: '',
                                                        margin: '0 0 0 40'
                                                    },
                                                    {
                                                        itemId: 'cryptos-trading-change-by-robot',
                                                        html: '',
                                                        margin: '0 0 0 40'
                                                    }                                            
                                                ]
                                            }             
                                        ]
                                    },                                    
                                    Ext.widget('cryptos-trading-mainchart', {
                                        chart_height: 400
                                    }),
                                    Ext.widget('cryptos-trading-secondchart', {
                                        chart_height: 400
                                    })
                                ]
                            }
                        ]
                    },
                    {
                        xtype: 'panel',
                        region: 'east',
                        layout: 'vbox',
                        width: 450,
                        height: '100%',
                        split: true,
                        collapsible: true,
                        collapsed: true,
                        title: 'Control panel',
                        items:
                        [
                            Ext.widget('cryptos-trading-controlpanel', {
                                
                            })
                        ]
                    }                    
                ]
            },
            /*{
                xtype: 'fieldset',
                autoHeight: true,
                padding: 5,
                title: 'History',
                width: '100%',
                margin: '0 0 0 10',
                items: 
                [ 
                    Ext.widget('cryptos-trading-history', {
                        title: 'History'
                    })
                ]
            },*/
            {
                xtype: 'container',
                padding: 5,
                width: '100%',
                margin: '10 0 0 0',
                items: 
                [ 
                    Ext.widget('cryptos-trading-history', {
                        
                    })
                ]
            }
        ];
        
        // Add view
        dynamic_panel.add(view);
        
        // Init header
        if (!me.header_initialized)
        {
            me.initHeader(dynamic_panel.header);
            me.header_initialized = true;
        }
    },
    
    initHeader: function(header)
    {
        // Add max/min button in header
        var me = this;
        
        header.add({
            xtype : 'button',
            iconCls: 'x-fa fa-window-maximize',
            handler: function(button)
            {
                if (me.state === 'minimized')
                {
                    // Maximize
                    me.maximizeWindow(button);
                }
                else
                {
                    // Minimize
                    me.minimizeWindow(button);
                }     
            },
            listeners: {
                render: function(button)
                {
                    // Maximize
                    //me.maximizeWindow(button);
                }
            }
        });        
    },
    
    maximizeWindow: function(button)
    {
        // Maximize
        var me = this;
        var dynamic_panel = Ext.ComponentQuery.query('#cryptos-trading-dynamicpanel')[0];
        var window = Ext.widget('common-window', {
            itemId: 'cryptos-trading-window',
            width: '100%',
            header: false,
            border: false,
            closable: false,
            maxSizeEnabled: false
        });
        window.setWidth('100%');
        window.setHeight('100%');
        window.add(dynamic_panel);
        window.show();                    
        button.setIconCls('x-fa fa-window-minimize');
        me.state = 'maximized';        
    },
    
    minimizeWindow: function(button)
    {
        // Minimize
        var me = this;
        var dynamic_panel = Ext.ComponentQuery.query('#cryptos-trading-dynamicpanel')[0];        
        var window = Ext.ComponentQuery.query('#cryptos-trading-window')[0];
        var trading_panel = Ext.ComponentQuery.query('[xtype=cryptos-trading]')[0];
        trading_panel.add(dynamic_panel);
        window.close();                    
        button.setIconCls('x-fa fa-window-maximize');
        me.state = 'minimized';        
    },
    
    setRobot: function(robot)
    {
        var me = this;
        
        me.robot  = robot;
        console.log(me.robot);
        me.robot_is_training = me.robot.get('is_training');
        me.robot_is_running = me.robot.get('is_running');
        
        // Update coinpair
        var coinpair = Ext.ComponentQuery.query('#cryptos-trading-coinpair')[0];
        var html = '<span style="font-weight: bold; font-size: 20px;">' + me.robot.get('coinpair_name') + '</span>';
        coinpair.update(html);
        
        // Start/Stop Robot button
        var start_stop_robot_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-start-stop-robot-togglebutton')[0];
        start_stop_robot_button.setVisible(false);
        
        // Manual operations buttons
        var buy_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-buy-button')[0];
        buy_button.setDisabled(true);
        var sell_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sell-button')[0];
        sell_button.setDisabled(true);
        var sellandstop_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sellandstop-button')[0];
        sellandstop_button.setDisabled(true);
        var sellcalmlyandstop_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sellcalmlyandstop-button')[0];
        sellcalmlyandstop_button.setDisabled(true);
        
        // Init timers
        me.setRealtimeButton("real-time", false);
        
        // Init charts
        me.getChartController().initSecondchartSeries(me.robot);
        
        // Refresh data
        if (me.scanTask.enabled)
        {
            me.refreshCharts();
            me.refreshRealTimeData();              
        }
        me.refreshHistory();

        // Start scan
        if (!me.scanTask.enabled)
        {
            me.scanTask.enabled = true;
            Ext.TaskManager.start(me.scanTask);
        }
    },
    
    scan: function()
    {
        var me = this;
        //console.log(me.scanTask.counter);
        
        // Refresh chart
        if (me.isTimeToExecuteTask(me.refreshChartsTask))
        {
            me.refreshCharts();
        }
        
        // Refresh real-time data
        me.refreshRealTimeData();
        
        // Refresh history
        if (me.isTimeToExecuteTask(me.refreshHistoryTask))
        {
            me.refreshHistory();
        }
    },
    
    refreshChartsAndHistory: function()
    {
        var me = this;
        me.refreshCharts();
        me.refreshHistory();
    },
    
    refreshCharts: function()
    {
        var me = this;
        var mainchart = Ext.ComponentQuery.query('#cryptos-trading-cartesian-mainchart')[0];
        var secondchart = Ext.ComponentQuery.query('#cryptos-trading-cartesian-secondchart')[0];
        var period_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-period-combo')[0];
        var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
        var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];
        var show_training_samples = Ext.ComponentQuery.query('#cryptos-trading-toolbar-show-training-samples')[0];
        var custom_filter_type_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-custom_filter-type')[0];
        var custom_filter_factor_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-custom_filter-factor')[0];
        
        var sd = Ext.Date.format(start_date_field.getValue(), 'Y-m-d');
        var st = Ext.Date.format(start_time_field.getValue(), 'H:i');
        var start_date = sd + " " + st + ":00";
        
        var proxy = mainchart.store.getProxy();
        proxy.url = restpath + proxy.endpoint;
        mainchart.store.load({
            params: {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                is_realtime: me.refreshChartsTask.enabled,
                period: period_field.getValue(),
                start_date: start_date,
                show_training_samples: show_training_samples.getValue(),
                custom_filter_type: custom_filter_type_field.getValue(),
                custom_filter_factor: custom_filter_factor_field.getValue()
            }
        });
        
        var proxy = secondchart.store.getProxy();
        proxy.url = restpath + proxy.endpoint;
        secondchart.store.load({
            params: {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                is_realtime: me.refreshChartsTask.enabled,
                period: period_field.getValue(),
                start_date: start_date
            }
        });
    },
    
    refreshRealTimeData: function()
    {
        var me = this;
        var html;
        var period_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-period-combo')[0];
        var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
        var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];
        var show_training_samples = Ext.ComponentQuery.query('#cryptos-trading-toolbar-show-training-samples')[0];
        
        var sd = Ext.Date.format(start_date_field.getValue(), 'Y-m-d');
        var st = Ext.Date.format(start_time_field.getValue(), 'H:i');
        var start_date = sd + " " + st + ":00";
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/getRealTimeData',
            params:
            {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                is_realtime: me.refreshChartsTask.enabled,
                period: period_field.getValue(),
                start_date: start_date,
                show_training_samples: show_training_samples.getValue()
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    // Warning!!
                    // TODO
                    return;
                }
                
                // Update last price
                var lastprice_field = Ext.ComponentQuery.query('#cryptos-trading-lastprice')[0];
                html = 'Last price: </br>';
                html += '<b>' + obj.data.last_price + ' ' + obj.data.market_coin + '</b>';
                if (!Ext.isEmpty(obj.data.date_of_last_price))
                {
                    html += ' (' + obj.data.date_of_last_price + ')';
                }
                lastprice_field.update(html);
                
                // Change according to period
                var change_by_period_field = Ext.ComponentQuery.query('#cryptos-trading-change-by-period')[0];
                html = 'Change ' + obj.data.change_by_period + ': </br>';
                html += obj.data.change_by_period_value;
                change_by_period_field.update(html);
                
                // Change according to robot
                var change_by_robot_field = Ext.ComponentQuery.query('#cryptos-trading-change-by-robot')[0];
                html = '';
                if (!Ext.isEmpty(obj.data.change_by_robot))
                {
                    html += 'Change ' + obj.data.change_by_robot + ': </br>';
                    html += obj.data.change_by_robot_value;                    
                }
                change_by_robot_field.update(html);
                
                // Update status
                var status_field = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-status')[0];
                status_field.setValue(obj.data.status);
                
                // Update last operation
                var last_operation_field = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-lastoperation')[0];
                last_operation_field.setValue(obj.data.last_operation);
                
                // Update amount
                var amount_field = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-amount')[0];
                amount_field.setValue(obj.data.amount);
                
                // Start/Stop Robot button
                var start_stop_robot_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-start-stop-robot-togglebutton')[0];
                start_stop_robot_button.setVisible(true);
                me.robot_is_running = obj.data.is_running;
                start_stop_robot_button.toggle(me.robot_is_running, true);
                var controlpanel = Ext.ComponentQuery.query('#cryptos-trading-controlpanel')[0];
                controlpanel.setStartStopRobotButton(start_stop_robot_button, me.robot_is_running);
                
                // Update summary (history)
                var history_transactions = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-history-transactions')[0];
                history_transactions.setValue(obj.data.history_transactions);
                var history_profit = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-history-profit')[0];
                history_profit.setValue(obj.data.history_profit);
                var history_profit_usdt = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-history-profit_usdt')[0];
                history_profit_usdt.setValue(obj.data.history_profit_usdt);                
                var history_workingtime = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-history-workingtime')[0];
                history_workingtime.setValue(obj.data.history_working_time);
                var history_restingtime = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-history-restingtime')[0];
                history_restingtime.setValue(obj.data.history_resting_time);
        
                // Manual operations buttons
                var buy_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-buy-button')[0];
                var sell_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sell-button')[0];
                var sellandstop_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sellandstop-button')[0];
                var sellcalmlyandstop_button = Ext.ComponentQuery.query('#cryptos-trading-controlpanel-sellcalmlyandstop-button')[0];
                if (!me.robot_is_running)
                {
                    buy_button.setDisabled(true);
                    sell_button.setDisabled(true);  
                    sellandstop_button.setDisabled(true);
                    sellcalmlyandstop_button.setDisabled(true);  
                }
                else
                {
                    if (Ext.isEmpty(obj.data.last_operation) || obj.data.last_operation === 'sell')
                    {
                        buy_button.setDisabled(false);
                        sell_button.setDisabled(true); 
                        sellandstop_button.setDisabled(true); 
                        sellcalmlyandstop_button.setDisabled(true); 
                    }
                    else
                    {
                        buy_button.setDisabled(true);
                        sell_button.setDisabled(false);
                        sellandstop_button.setDisabled(false);
                        sellcalmlyandstop_button.setDisabled(false);
                    }
                }
                
                // Training
                me.robot_is_training = obj.data.is_training;
                var training_info_textfield = Ext.ComponentQuery.query('#cryptos-trading-toolbar-training-info')[0];
                training_info_textfield.setVisible(obj.data.is_training);
//                var realtime_button = Ext.ComponentQuery.query('#cryptos-trading-toolbar-realtime-button')[0];
//                realtime_button.setVisible(obj.data.is_training);
                var from_train_wrapper = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-train-wrapper')[0];
                from_train_wrapper.setVisible(obj.data.is_training);
                
            },
            failure: function(result, request)
            {
                // Warning!!
                // TODO
            }
        });        

        
    },
    
    refreshHistory: function()
    {
        var me = this;
        var period_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-period-combo')[0];
        var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
        var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];
        var show_training_samples = Ext.ComponentQuery.query('#cryptos-trading-toolbar-show-training-samples')[0];
        
        var sd = Ext.Date.format(start_date_field.getValue(), 'Y-m-d');
        var st = Ext.Date.format(start_time_field.getValue(), 'H:i');
        var start_date = sd + " " + st + ":00";
        
        var history = Ext.ComponentQuery.query('#cryptos-trading-history')[0];
        var proxy = history.store.getProxy();
        proxy.url = restpath + proxy.endpoint; 
        history.store.load({
            params: {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                is_realtime: me.refreshChartsTask.enabled,
                period: period_field.getValue(),
                start_date: start_date,
                show_training_samples: show_training_samples.getValue()
            }
        });
    },
    
    setMask: function(enable)
    {
        var me = this;
        
        if (enable)
        {
            if (me.state === 'minimized')
            {
                Ext.getBody().mask(me.trans.common.wait_please);
            }
            else
            {
                var window = Ext.ComponentQuery.query('#cryptos-trading-window')[0];
                window.getEl().mask(me.trans.common.wait_please);
            }            
        }
        else
        {
            if (me.state === 'minimized')
            {
                Ext.getBody().unmask();
            }
            else
            {
                var window = Ext.ComponentQuery.query('#cryptos-trading-window')[0];
                window.getEl().unmask();
            }
        }
    },
    
    startStopRobot: function(start)
    {
        var me = this;
        
        me.setMask(true);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/startStopRobot',
            params:
            {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                start: start
            },
            success: function(result, request)
            {
                me.setMask(false);
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
        
                // Refresh real-time data
                me.refreshRealTimeData();
            }
        });        
    },
    
    trade: function(action)
    {
        var me = this;
        
        me.setMask(true);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/' + action,
            params:
            {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training
            },
            success: function(result, request)
            {
                me.setMask(false);
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
        
                me.msgBox(obj.data.title, obj.data.msg, Ext.Msg.INFO);
            }
        });        
    },
    
    showTrainingForm: function()
    {
        var me = this;
        
        if (!me.getUIData().is_devel)
        {
            me.msgBox("Quieto parao!!", "No es poden fer entrenaments en producció, ja que s'alteraria l'entrenamet del robot en mode 'realtime'");
            return;
        }        
        
        if (me.robot_is_running)
        {
            me.msgBox("Oupss!", "Per fer un entrenament en el passat, primer hauria de parar el robot.");
            return;
        }
        
        var period_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-period-combo')[0];
        var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
        var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];
        
        var window = Ext.widget('common-window');
        var form = Ext.widget('cryptos-trading-trainingForm', {
            trans: me.trans,
            user_code: me.user_code,
            robot: me.robot,
            period: period_field.getValue(),
            start_date: start_date_field.getValue(),
            start_time: start_time_field.getValue()
        });
        window.setTitle('Training form');
        window.setWidth(460);
        window.setHeight(250);
        window.add(form);
        
        //form.getForm().loadRecord(record);
        
        /*window.on('close', function(){
            if (form.accept)
            {
                
            }
        });*/ 

        window.show();        
    },
    
    setRealtimeButton: function(mode, refresh)
    {
        var me = this;
        var realtime_button = Ext.ComponentQuery.query('#cryptos-trading-toolbar-realtime-button')[0];
        var from_wrapper = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-wrapper')[0];
        var realtime_topinfo = Ext.ComponentQuery.query('#cryptos-trading-realtime-topinfo')[0];
            
        if (mode === "real-time")
        {
            realtime_button.setIconCls('x-fa fa-stop');
            me.refreshChartsTask.start();
            me.refreshHistoryTask.start();
        }
        else
        {
            realtime_button.setIconCls('x-fa fa-play');
            me.refreshChartsTask.stop();  
            me.refreshHistoryTask.stop();
        }
            
        from_wrapper.setVisible(mode === "history");
        realtime_topinfo.setVisible(mode === "real-time");
        
        if (refresh)
        {
            me.refreshChartsAndHistory();
        }
        
    },
    
    setDateOfSample: function(type)
    {
        var me = this;
        
        var period_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-period-combo')[0];
        var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
        var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];
        var show_training_samples = Ext.ComponentQuery.query('#cryptos-trading-toolbar-show-training-samples')[0];
        
        var sd = Ext.Date.format(start_date_field.getValue(), 'Y-m-d');
        var st = Ext.Date.format(start_time_field.getValue(), 'H:i');
        var start_date = sd + " " + st + ":00";
        
        me.setMask(true);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/getDateOfSample',
            params:
            {
                user_code: me.user_code,
                robot_code: me.robot.get('code'),
                is_training: me.robot_is_training,
                is_realtime: me.refreshChartsTask.enabled,
                period: period_field.getValue(),
                start_date: start_date,
                show_training_samples: show_training_samples.getValue(),
                type: type
            },
            success: function(result, request)
            {
                me.setMask(false);
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
        
                var data = obj.data;
                console.log(data);

                //birthday = new Date("December 19, 1989 03:24:00");
                //birthday = new Date(1989,11,19);
                //birthday = new Date(1989,11,17,3,24,0);
                
                var start_date_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-startdate')[0];
                var start_time_field = Ext.ComponentQuery.query('#cryptos-trading-toolbar-from-starttime')[0];

                var sd = new Date(data.y, data.m -1, data.d);
                var st = new Date(data.y, data.m -1, data.d, data.H, data.i, data.s);
                
                start_date_field.setValue(sd);
                start_time_field.setValue(st);
                
                me.refreshChartsAndHistory();
            }
        });            
    },
    
    getChartController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.chart');
        return controller;
    }

});
