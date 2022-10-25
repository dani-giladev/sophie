Ext.define('App.modules.cryptos.UI.view.reportTransaction.filterForm', {
    extend: 'App.view.maintenance.filterForm',
    alias: 'widget.cryptos-reportTransaction-filterform',
    
    requires: [
        
    ],
    
    _steping: false,
    
    getItems: function()
    {
        var me = this;
        var trans = me.getMaintenanceController().getTrans('cryptos');
        var today = new Date();
        var start_date = today;
//        var start_date = Ext.Date.add(today, Ext.Date.DAY, -7);
        
        var ret = 
        {
            xtype: 'container',
            autoHeight: true,
//            style: 'margin-bottom: -10px;',
            defaults: {
                labelAlign: 'right',
                labelWidth: 85
            },
            layout: 'anchor',
            items: 
            [           
                {
                    xtype: 'datefield',
                    name: 'start_date',
                    format: 'd/m/Y',
                    submitFormat: 'Y-m-d',
                    fieldLabel: trans.common.start_date,
                    allowBlank: true,
                    editable: false,
                    width: 220,
                    fieldStyle: {
                        'text-align': 'center'
                    },
                    value: start_date,
                    maxValue: new Date(),
                    startDay: 1,
                    listeners: 
                    {
                        change: function(thisDateField, newValue, oldValue, options)
                        {
                            if (me._steping)
                            {
                                return;
                            }
                            
                            var end_date = me.getForm().findField('end_date');
                            if( (end_date.getEl()) && end_date.getValue() < newValue)
                            {
                                end_date.setValue(newValue);
                            }
                        }
                    }
                },
                {
                    xtype: 'datefield',
                    name: 'end_date',
                    format: 'd/m/Y',
                    submitFormat: 'Y-m-d',
                    fieldLabel: trans.common.end_date,
                    allowBlank: true,
                    editable: false,
                    width: 220,
                    fieldStyle: {
                        'text-align': 'center'
                    },
                    value: today,
                    maxValue: today,
                    startDay: 1,
                    listeners: 
                    {
                        change: function(thisDateField, newValue, oldValue, options)
                        {
                            if (me._steping)
                            {
                                return;
                            }
                            
                            var start_date = me.getForm().findField('start_date');
                            if( (start_date.getEl()) && start_date.getValue() > newValue)
                            {
                                start_date.setValue(newValue);
                            }
                        }
                    }
                },
                {          
                    xtype: 'container',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '0 0 0 112',
                    items:
                    [   
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-step-backward',
                            margin: '0 0 0 5',
                            ui: 'default-toolbar',
                            handler: function () {
                                me.steping('step-backward');
                            }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'x-fa fa-step-forward',
                            margin: '0 0 0 5',
                            ui: 'default-toolbar',
                            handler: function () {
                                me.steping('step-forward');
                            }
                        }
                    ]
                },
                {
                    xtype: 'checkboxfield',
                    name: 'is_training',
                    fieldLabel: 'Training',
                    labelAlign: 'right',
                    //checked: true,
                    boxLabel: ''
                }
            ]
        };
        
        return ret;
    },
    
    steping: function(type)
    {
        var me = this;
        
        me._steping = true;
        
        var start_date = me.getForm().findField('start_date');
        var end_date = me.getForm().findField('end_date');
        var add_day = (type === 'step-backward')? -1 : 1;

        var new_start_date = Ext.Date.add(start_date.getValue(), Ext.Date.DAY, add_day);
        var new_end_date = Ext.Date.add(end_date.getValue(), Ext.Date.DAY, add_day);
        
        start_date.setValue(new_start_date);
        end_date.setValue(new_end_date);

        me._steping = false;
        
        me.getMaintenanceController().refresh(me.config);
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.reportTransaction');
        return controller;
    }

});