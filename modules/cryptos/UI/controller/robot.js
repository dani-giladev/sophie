Ext.define('App.modules.cryptos.UI.controller.robot', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.robot.form',
        'App.modules.cryptos.UI.store.robot.chart',
        'App.modules.cryptos.UI.model.robot.chart',
        'App.modules.cryptos.UI.view.robot.chart'        
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_robot-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.robot.robot');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 800,
            width: 700,
            title: ((is_edition)? (config.trans.robot.edition + ': ' + record.get('name')) : config.trans.robot.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
        form.getForm().findField('coinpair').setDisabled(true);
        form.getForm().findField('candlestick_interval').setDisabled(true);
        form.getForm().findField('inherit_id').setDisabled(false);
        
        var commission = me.getUIData().cryptos_commission;
        var commission_coin = me.getUIData().cryptos_commission_coin;
        form.getForm().findField('commission').setValue(commission);
        form.getForm().findField('commission_coin').setValue(commission_coin);
        
        me._onEditForm(config, record, window, form);
    },
    
    _onEditForm: function(config, record, window, form)
    {

    },
    
    onAddForm: function(config, window, form)
    {
        var me = this;
        form.getForm().findField('available').setValue(true);
        me.getComponentQuery('form_strategy_basicmode_radiofield', config).setValue('basicmode');
        
        var commission = me.getUIData().cryptos_commission;
        var commission_coin = me.getUIData().cryptos_commission_coin;
        form.getForm().findField('commission').setValue(commission);
        form.getForm().findField('commission_coin').setValue(commission_coin);
        
        me._onAddForm(config, window, form);
    },
    
    _onAddForm: function(config, window, form)
    {
        
    },
    
    addParams: function(params, config, form)
    {
        var is_edition = form.is_edition;
        if (is_edition && !Ext.isEmpty(config.last_training_code))
        {
            params['last_modification_comesfrom_training'] = true;
            params['last_training_code'] = config.last_training_code;
            params['last_training_was_wild'] = config.last_training_was_wild;
            params['last_training_winner'] = config.last_training_winner;
        }
        else
        {
            params['last_modification_comesfrom_training'] = false;
        }
        
        return params;
    },
    
    showImage: function(title, filename)
    {
        var src = '/modules/cryptos/res/img/scalping/' + filename;
        
        var window = Ext.widget('common-window');
        window.setHeight(600);
        window.setWidth(800);
        window.setTitle(title);
        window.add({
            xtype: 'image',
            src: src//,
//            height: '100%',
//            width: '100%'       
        });
            
        window.show();
    },
    
    showRobot: function(record, last_training_config)
    {
        var me = this;
        
        var widget = Ext.create({
            xtype: 'cryptos-robot',
            itemId: 'cryptos_editing_robot' + '_' + me.getRandom(1, 100)
        });
        var widget_config = widget.config;
        widget.close();
                    
        var i;
        for (i in last_training_config) {
          var value = last_training_config[i];
          widget_config[i] = value;
        }
        
        me.showForm(widget_config, true, record);
    },
    
    editRecord: function(id, field)
    {
        var me = this;
        
        var widget = Ext.create({
            xtype: 'cryptos-robot',
            itemId: 'cryptos_editing_robot' + '_' + me.getRandom(1, 100)
        });
        var widget_config = widget.config;
        widget.close();
                    
        me.on('receivedRecord', function(success, record)
        {
            if (!success) return;
            
            if (field)
            {
                me.on('editedRecord', function(suc, rec) {
                    field.focus();
                }, this, {single: true});                
            }
           
            me.showForm(widget_config, true, record);  

        }, this, {single: true});
        me.getRecord(id, widget.config); 
    },
    
    showCommissionInfo: function(config)
    {
        var me = this;
        var form = me.getComponentQuery('form', config);
        var window = form.up('window');
        
        var coinpair = form.getForm().findField('coinpair').getValue();
        var amount = form.getForm().findField('amount').getValue();
        var amount_unit = form.getForm().findField('amount_unit').getValue();
        var commission = form.getForm().findField('commission').getValue();
        var commission_coin = form.getForm().findField('commission_coin').getValue();
        
        window.getEl().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/robot/getCommissionInfo',
            params:
            {
                coinpair: coinpair,
                amount: amount,
                amount_unit: amount_unit,
                commission: commission,                        
                commission_coin: commission_coin
            },
            success: function(result, request)
            {
                window.getEl().unmask();

                var obj = Ext.JSON.decode(result.responseText);
                if (obj.success)
                {
                    Ext.MessageBox.show({
                        title: "Commission info",
                        msg: obj.msg,
                        buttons: Ext.MessageBox.OK
                    });
                }
                else
                {
                    Ext.MessageBox.show({
                        title: "Error",
                        msg: obj.msg,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            }
        });            
    },
    
    donwloadConfs: function(config)
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
            me.donwloadConf(record);
        });
        
    },
    
    donwloadConf: function(record)
    {
        var data = record.data;
        
        delete(data.id);
        delete(data._id);
        delete(data._conflicts);
        delete(data.date);

        var filename =  
                data.created_by_user + '-' +
                data.code + '-' +
                Ext.Date.format(new Date(), 'YmdHis') +
                '.json';

        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4);
        }

        var blob = new Blob([data], {type: 'text/json'}),
            e    = document.createEvent('MouseEvents'),
            a    = document.createElement('a');

        a.download = filename;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':');
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
    },
    
    uploadConf: function(config, uploadform)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection()[0];
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var robot = selected.data;
        var robot_id = robot._id;
        
        if (!uploadform.isValid())
        {
            return;
        }
        
        Ext.MessageBox.show({
            title: "Uploading conf.",
            msg: "Està segur de voler transferir la configuració seleccionada al robot <b>" + robot.name + "</b>?",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn, text)
            {
                if (btn !== 'yes')
                {
                    return;
                }
                
                 uploadform.submit({
                    url: restpath + 'cryptos/robot/uploadConf',
                    waitMsg: "Uploading_file" + '...',
                    params: {
                        robot_id: robot_id                                              
                    },
                    success: function(fp, o) {
                        //console.log(o);
                        me.refreshGrid(config);
                        me.msgBox('Upload robot config', 'The robot <b>' + robot.name + '</b> has been updated successfully', Ext.MessageBox.INFO);
                    },
                    failure: function(fp, o) {
                        //console.log(o);
                        me.msgBox('Error uploading file', o.result.msg);
                    }
                });     
                
            }
        });
        
    },
    
    tradeRobots: function(config, action)
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
            me.trade(config, action, record);
        });      
    },
    
    trade: function(config, action, record)
    {
        var me = this;
        var data = record.data;
        
        Ext.getBody().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/' + action,
            params:
            {
                user_code: data.created_by_user,
                robot_code: data.code,
                is_training: data.is_training
            },
            success: function(result, request)
            {
                Ext.getBody().unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
        
                me.msgBox(obj.data.title, obj.data.msg, Ext.Msg.INFO);
            }
        });        
    },
    
    startStopRobots: function(config, start)
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
            me.startStopRobot(config, start, record);
        });      
    },
    
    startStopRobot: function(config, start, record)
    {
        var me = this;
        var data = record.data;
        
        Ext.getBody().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/startStopRobot',
            params:
            {
                user_code: data.created_by_user,
                robot_code: data.code,
                is_training: data.is_training,
                start: start
            },
            success: function(result, request)
            {
                Ext.getBody().unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
            }
        });        
    },
    
    switchLastOperation: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var robots = [];
        Ext.each(selected, function(record)
        {
            var data = record.data;
            robots.push({
                user_code: data.created_by_user,
                robot_code: data.code
            });
        });
        
        Ext.getBody().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/robot/switchLastOperation',
            params:
            {
                data: Ext.encode(robots)
            },
            success: function(result, request)
            {
                Ext.getBody().unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
            }
        });           
        
    },
    
    settingPricesCharts: function(config)
    {
        var me = this;
        
        var user_code = me.getUIData().user_code;
        
        Ext.getBody().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/robot/getSettingPricesCharts',
            params:
            {
               user_code: user_code
            },
            success: function(result, request)
            {
                Ext.getBody().unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
                
                var period = obj.data.period;
                var interval = obj.data.interval;
                
                var window = Ext.widget('common-window');
                var form = Ext.widget('cryptos-robot-settingPricesCharts', {
                    config: config,
                    trans: config.trans,
                    user_code: user_code,
                    period: period,
                    interval: interval
                });
                window.setTitle('Setting Prices Charts form');
                window.setWidth(300);
                window.setHeight(220);
                window.add(form);
                window.show();  
            }
        });   
    },
    
    copyProperties: function(config)
    {
        var me = this;
        var title = "Copying properties to other robots";
        var form = me.getComponentQuery('form', config);
        var value;
        
        var checkbox_selection_fields = form.query('checkboxfield[_xtype=checkbox_selection][checked=true]');
        if (Ext.isEmpty(checkbox_selection_fields))
        {
            me.msgBox(title, "Firstly, you should select properties to copy through checkboxes");
            return;
        }
        
        var properties = [];
        Ext.each(checkbox_selection_fields, function(checkbox_selection_field)
        {
            var name = checkbox_selection_field._name;
            var field = form.getForm().findField(name);
            
            if (checkbox_selection_field._is_radiofield_selection)
            {
                value = field.getGroupValue();
            }
            else
            {
                value = field.getValue();
            }
            
            properties.push({
                code: name,
                value: value
            });  
            if (checkbox_selection_field._name2)
            {
                name = checkbox_selection_field._name2;
                field = form.getForm().findField(name);
            
                if (checkbox_selection_field._is_radiofield_selection2)
                {
                    value = field.getGroupValue();
                }
                else
                {
                    value = field.getValue();
                }
            
                properties.push({
                    code: name,
                    value: value
                }); 
            }
        });      
        
        var itemId = 'cryptos_selecting_robot_record' + '_' + me.getRandom(1, 100);
        
        var widget = Ext.create({
            xtype: 'cryptos-robot',
            itemId: itemId,
            enableSelectionMode: true,
            filters: {}
        });
        
        var window = Ext.widget('common-window');
        window.setTitle(widget.config.trans.robot.selection);
        var size = me.getSize();
        window.setHeight(size.height - 50);
        window.setWidth(size.width - 50);
        
        widget.on('selectedRecords', function(recs) {
            
            window.close();
            
            if (Ext.isEmpty(recs))
            {
                return;
            }
            
            Ext.MessageBox.show({
                title: title,
                msg: "Are you sure to want to copy the selected properties to these " + recs.length + " robots?",
                buttons: Ext.MessageBox.YESNO,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn, text)
                {
                    if (btn !== 'yes')
                    {
                        return;
                    }
                    
                    var robots = [];
                    Ext.each(recs, function(rec)
                    {
                        robots.push(rec.data._id);
                    });                    
        
                    window = form.up('window');
                    window.getEl().mask(config.trans.common.wait_please);

                    Ext.Ajax.request({
                        type: 'ajax',
                        method: 'POST',
                        url: restpath + 'cryptos/robot/copyProperties',
                        params:
                        {
                            robots: Ext.encode(robots),
                            properties: Ext.encode(properties)
                        },
                        success: function(result, request)
                        {
                            window.getEl().unmask();
                            var obj = Ext.JSON.decode(result.responseText);
                            if (!obj.success)
                            {
                                me.msgBox("Error", obj.msg);
                                return;
                            }
                            
                            me.msgBox(title, recs.length + ' robots have been updated successfully', Ext.MessageBox.INFO);

                            me.refreshGrid(config);
                        }
                    }); 

                }
            });            
            
        }, this, {single: true});
        
        window.add(widget);
        window.show();         
    },
    
    showHistoryOfSelectedProperty: function(config)
    {
        var me = this;
        var title = "Show history of selected property";
        var form = me.getComponentQuery('form', config);
        
        if (!form.current_record)
        {
            me.msgBox(title, "Firstly, you must save this robot");
            return;
        }
        
        var chkselflds = form.query('checkboxfield[_xtype=checkbox_selection][checked=true]');
        if (chkselflds.length != 1)
        {
            me.msgBox(title, "You should select only one property through checkboxes");
            return;
        }
        
        var chkselfld = chkselflds[0];
        var name = chkselfld._name;
        if (chkselfld._name2 && 
            chkselfld._name2 !== 'amount_unit' && 
            chkselfld._name2 !== 'commission_coin')
        {
            name = chkselfld._name2;
        }
        
        var robot = form.current_record.data;
        
        var window = Ext.widget('common-window');
        var panel = Ext.widget('cryptos-robot-chart', {
            chart_height: 500,
            robot: robot,
            property: name
        });
        window.setTitle(name);
        window.setWidth(1000);
        window.setHeight(600);
        window.add(panel);

        window.show();  
    },
    
    toggleMarkers: function(chart)
    {
        var seriesList = chart.getSeries(),
            ln = seriesList.length,
            i = 0,
            series;

        for (; i < ln; i++) {
            series = seriesList[i];
            series.setShowMarkers(!series.getShowMarkers());
        }

        chart.redraw();
    },
    
    updateCandlestick: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var user_code = me.getUIData().user_code;
        
        var data = [];
        Ext.each(selected, function(record)
        {
            data.push({
                coinpair: record.get('coinpair'),
                candlestick_interval: record.get('candlestick_interval')
            });
        });
        
        Ext.getBody().mask(config.trans.common.wait_please);
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/robot/updateCandlestick',
            params:
            {
                user_code: user_code,
                data: Ext.encode(data)
            },
            success: function(result, request)
            {
                Ext.getBody().unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    me.msgBox("Error", obj.msg);
                    return;
                }
                
                me.refreshGrid(config);
            }
        });           
        
    }

});
