Ext.define('App.modules.cryptos.UI.view.trading.trainingForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.cryptos-trading-trainingForm',
    
    requires: [
      
    ],
    
    border: false,
    frame: false,
    autoHeight: true,
    autoScroll: true,
    bodyPadding: 20,
    required_indication: '<font size="4" color="red">*</font>',
          
    accepted: false,
    trans: null,
    user_code: null,
    robot: null,
    period: null,
    start_date: null,
    start_time: null,

    initComponent: function() {
        var me = this;

        //var today = new Date();
        //var tomorrow_date = Ext.Date.add(today, Ext.Date.DAY, +1);
        
        me.items = 
        [
            {
                xtype: 'combobox',
                name: 'period',
                fieldLabel: 'Period' + me.required_indication,
                labelAlign: 'right',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "1",    "name": '1 hour'},
                        {"code": "2",    "name": "2 hours"},
                        {"code": "6",    "name": '6 hours'},
                        {"code": "12",   "name": '12 hours'},
                        {"code": "24",   "name": '24 hours'},
                        {"code": "48",   "name": '2 days'},
                        {"code": "168",  "name": '7 days'},
                        {"code": "360",  "name": '15 days'},
                        {"code": "720",  "name": '30 days'}
                    ]
                }),
                queryMode: 'local',
                valueField: 'code',
                displayField: 'name',
                //typeAhead: true,
                //forceSelection: true,
                editable: false,
                allowBlank: false,
                //value: "24",
                value: me.period,
                width: 220
            },    
            {          
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                frame: false,
                margin: '0 0 10 0',
                items:
                [
                    {
                        xtype: 'datefield',
                        name: 'start_date',
                        format: 'd/m/Y',
                        submitFormat: 'Y-m-d',
                        fieldLabel: 'From date' + me.required_indication,
                        labelAlign: 'right',
                        allowBlank: false,
                        editable: false,
                        width: 240,
                        fieldStyle: {
                            'text-align': 'center'
                        },
                        //value: today,
                        value: me.start_date,
                        maxValue: new Date(),
                        startDay: 1
                    },
                    {
                        xtype: 'timefield',
                        name: 'start_time',
                        submitFormat: 'H:i',
                        //value: '12:00 AM',
                        value: me.start_time,
                        allowBlank: false,
                        margin: '0 0 0 5',
                        /*minValue: '6:00 AM',
                        maxValue: '8:00 PM',
                        increment: 30,*/
                        width: 120
                    }
                ]
            },
            {
                xtype: 'checkboxfield',
                name: 'record_samples',
                fieldLabel: '',
                labelAlign: 'right',
                boxLabel: 'Record samples and robot track' + ' (slower)',
                margin: '0 0 0 102',
                anchor: '100%'
            }    
        ];
        
        me.dockedItems = [
            {
                xtype: 'toolbar',
                anchor: '100%',
                dock: 'bottom',
                items: 
                [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.accept,
                        formBind: true,
                        disabled: true,
                        handler: me.accept
                    },
                    {
                        xtype: 'button',
                        text: me.trans.common.cancel,
                        handler: me.cancel
                    }
                ]
            }
        ];

        me.callParent(arguments);
    },

    cancel: function(button, eventObject)
    {
        button.up('window').close();
    },

    doLastValidation: function()
    {
        return true;      
    },
    
    accept: function(button, eventObject)
    {
        var me = button.up('form');
        
        if (!me.getForm().isValid())
        {
            return;
        }
        
        // The last Validation
        if (!me.doLastValidation())
        {
            return;
        }
        
        Ext.MessageBox.show({
            title: "Starting training",
            msg: "Està segur de voler començar l'entrenament? Aquesta acció eliminarà totes les dades d'entrenament del robot seleccionat.",
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.WARNING,
            fn: function(btn, text)
            {
                if (btn !== 'yes')
                {
                    return;
                }
                
                Ext.TaskManager.stop(me.getMaintenanceController().scanTask);
                me.getMaintenanceController().scanTask.enabled = false;                
                
                var values = me.getForm().getValues();
                var start_date = values['start_date'] + " " + values['start_time'] + ":00";
                
                //me.setMask(true);

                Ext.Ajax.request({
                    type: 'ajax',
                    method: 'POST',
                    url: restpath + 'cryptos/trading/train',
                    params:
                    {
                        user_code: me.user_code,
                        robot_code: me.robot.get('code'),
                        period: values['period'],                        
                        start_date: start_date,
                        record_samples: values['record_samples']
                    },
                    success: function(result, request)
                    {
                        //me.setMask(false);

                        me.getMaintenanceController().scanTask.enabled = true;
                        Ext.TaskManager.start(me.getMaintenanceController().scanTask); 

                        var obj = Ext.JSON.decode(result.responseText);
                        if (obj.success)
                        {
                            var training_code = obj.data.training_code;
                            
                            // Show progress window
                            var window = Ext.widget('common-window', {
                                itemId: 'cryptos-trading-trainingProgressWindow',
                                closable: false
                            });
                            window.setTitle('Training progress');
                            window.setWidth(400);
                            window.setHeight(80);
                            window.add({
                                xtype: 'progressbar',
                                itemId: 'cryptos-trading-trainingProgressWindow-progressbar',
                                anchor: '100%'
                            });
                            window.on('render', function(){

                                me.getTrainingProgress(training_code);

                            }, this, {single: true});
                            window.show();
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
                
            }
        });
    },
    
    getTrainingProgress: function(training_code)
    {
        var me = this;
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/trading/getTrainingProgress',
            params :{
                training_code: training_code
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);

                var perc = obj.data.perc;
                var any_error = obj.data.any_error;
                var finalized = obj.data.finalized;
                var msg = obj.msg;
                
                if (finalized)
                {
                    var progress_window = Ext.ComponentQuery.query('#cryptos-trading-trainingProgressWindow')[0];
                    progress_window.close();
                    
                    if (!any_error)
                    {
                        Ext.MessageBox.show({
                            title: "Training completed",
                            msg: msg,
                            buttons: Ext.MessageBox.OK
                        });
                        
                        me.accepted = true;
                        me.getMaintenanceController().refreshChartsAndHistory();
                        me.up('window').close();
                    }
                    else
                    {
                        Ext.MessageBox.show({
                            title: "Error",
                            msg: msg,
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });                        
                    }
                    
                    return;
                }
                            
                // In progress
                var progressbar = Ext.ComponentQuery.query('#cryptos-trading-trainingProgressWindow-progressbar')[0];
                progressbar.updateProgress(perc, obj.msg);
                
                var task = new Ext.util.DelayedTask(function(){
                    me.getTrainingProgress(training_code);
                });        
                task.delay(2000);
            }
        });     
    },
    
    setMask: function(enable)
    {
        var me = this;

        var window = me.up('window');
        if (enable)
        {
            window.getEl().mask(me.trans.common.wait_please);
        }
        else
        {
            window.getEl().unmask();
        }
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }
        
});
