Ext.define('App.modules.cryptos.UI.view.floating.filterForm', {
    extend: 'App.view.maintenance.filterForm',
    alias: 'widget.cryptos-floating-filterform',
    
    requires: [
        
    ],
    
    getItems: function()
    {
        var me = this;
        var trans = me.getMaintenanceController().getTrans('cryptos');
        var today = new Date();
        //var start_date = new Date('2020-02-25');
        
        var ret = 
        {
            xtype: 'container',
            autoHeight: true,
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
                    editable: true,
                    width: 220,
                    fieldStyle: {
                        'text-align': 'center'
                    },
                    //value: start_date,
                    maxValue: today,
                    startDay: 1,
                    listeners: 
                    {
                        change: function(thisDateField, newValue, oldValue, options)
                        {
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
                    editable: true,
                    width: 220,
                    fieldStyle: {
                        'text-align': 'center'
                    },
                    //value: today,
                    maxValue: today,
                    startDay: 1,
                    listeners: 
                    {
                        change: function(thisDateField, newValue, oldValue, options)
                        {
                            var start_date = me.getForm().findField('start_date');
                            if( (start_date.getEl()) && start_date.getValue() > newValue)
                            {
                                start_date.setValue(newValue);
                            }
                        }
                    }
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
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.floating');
        return controller;
    }

});