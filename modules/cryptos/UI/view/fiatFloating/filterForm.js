Ext.define('App.modules.cryptos.UI.view.fiatFloating.filterForm', {
    extend: 'App.view.maintenance.filterForm',
    alias: 'widget.cryptos-fiatFloating-filterform',
    
    requires: [
        
    ],
    
    getItems: function()
    {
        var me = this;
        var trans = me.getMaintenanceController().getTrans('cryptos');
        var today = new Date();
        
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
                    maxValue: today,
                    startDay: 1
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
                    maxValue: today,
                    startDay: 1
                }
            ]
        };
        
        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.fiatFloating');
        return controller;
    }

});