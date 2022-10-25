Ext.define('App.modules.cryptos.UI.view.robot.settingPricesCharts', {
    extend: 'Ext.form.Panel',
    alias: 'widget.cryptos-robot-settingPricesCharts',
    
    requires: [
      
    ],
    
    border: false,
    frame: false,
    autoHeight: true,
    autoScroll: true,
    bodyPadding: 20,
    required_indication: '<font size="4" color="red">*</font>',
          
    config: {},
    trans: null,
    user_code: null,
    period: null,
    interval: null,

    initComponent: function() {
        var me = this;

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
                        {"code": "1",    "name": '1 day'},
                        {"code": "2",    "name": "2 days"},
                        {"code": "3",    "name": "3 days"},
                        {"code": "7",  "name": '7 days'},
                        {"code": "15",  "name": '15 days'},
                        {"code": "30",  "name": '30 days'},
                        {"code": "60",  "name": '60 days'},
                        {"code": "90",  "name": '90 days'},
                        {"code": "120",  "name": '120 days'}
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
                xtype: 'combobox',
                name: 'interval',
                fieldLabel: 'Interval' + me.required_indication,
                labelAlign: 'right',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "1",    "name": '1 hour'},
                        {"code": "2",    "name": "2 hours"},
                        {"code": "3",    "name": "3 hours"},
                        {"code": "6",    "name": '6 hours'},
                        {"code": "12",   "name": '12 hours'},
                        {"code": "24",   "name": '24 hours'}
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
                value: me.interval,
                width: 220
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
        
        var values = me.getForm().getValues();
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/robot/setSettingPricesCharts',
            params:
            {
                user_code: me.user_code,
                period: values['period'],        
                interval: values['interval']         
            },
            success: function(result, request)
            {
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    Ext.MessageBox.show({
                        title: "Error",
                        msg: obj.msg,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                    return;
                }
                
                me.getMaintenanceController().refreshGrid(me.config);
                
                button.up('window').close();
            }
        });
    },
   
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }
        
});
