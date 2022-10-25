Ext.define('App.modules.cryptos.UI.view.trading.toolbar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-trading-toolbar',
    
    requires: [
        'App.modules.cryptos.UI.store.robot.robot'
    ],
    
    height: 46,
    region: 'north',
    border: false,
    frame: false, 
                        
    user_code: null,
    
    initComponent: function()
    {
        var me = this;
        
        me.title = '';
        
        me.items = 
        [        
            {
                xtype: 'fieldcontainer',
                layout: 'hbox',
                items: 
                [
                    {
                        xtype:'buttongroup',
                        border: false,
                        frame: false,                        
                        items: 
                        [
                            {   
                                //text: 'Re-build',
                                handler: me.rebuildTradingView,
                                iconCls: 'x-fa fa-refresh'
                            }
                        ]
                    },
                    {
                        xtype: 'combobox',
                        itemId: 'cryptos-trading-toolbar-robot-combo',
                        margin: '6 0 0 3',
                        fieldLabel: '',// 'Robot',
                        labelSeparator: '',
                        /*labelAlign: 'right',
                        labelWidth: 50,*/
                        store: {
                            type: 'cryptos_robot'
                        },
                        queryMode: 'local',
                        valueField: 'code',
                        displayField: 'name',
                        //typeAhead: true,
                        //forceSelection: true,
                        editable: true,
                        width: 300,
                        listConfig: {
                            minWidth: 300, // width of the drop-list
                            //maxHeight: 600 // height of a drop-list with scrollbar
                            itemTpl: '{name} ({coinpair_name})'
                        },
                        listeners: {
                            render: function(field, eOpts)
                            {
                                field.store.on('load', function(this_store, records, successful, eOpts)
                                {                                  
                                    field.forceSelection = true;
                                    field.typeAhead = true;
                                    
                                    if (records.length > 0)
                                    {
                                        var robot_code = records[0].get('code');
                                        field.setValue(robot_code);
                                    }
                                    
                                }, this, {single: true});
                                var proxy = field.store.getProxy();
                                proxy.url = restpath + proxy.endpoint;
                                field.store.load({
                                    params: {
                                        user_code: me.user_code,
                                        available: true
                                    }
                                });                                        
                            },
                            change: function(field, newValue, oldValue, eOpts)
                            {
                                var robot = field.getStore().findRecord('code', newValue, 0, false, false, true);
                                me.getMaintenanceController().setRobot(robot);
                            },
                            beforequery: function (record) {
                                try {
                                    record.query = new RegExp(record.query, 'i');
                                    record.forceAll = true;
                                } catch (exception) {} 
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        margin: '6 0 0 2',
                        iconCls: "x-fa fa-edit",
                        handler: function() {
                            var robot = me.getMaintenanceController().getRobot();
                            if (!robot)
                            {
                                return;
                            }
                            me.getRobotController().editRecord(robot.get('_id'), null);
                        }
                    },                    
                    {
                        xtype: 'textfield',
                        itemId: 'cryptos-trading-toolbar-training-info',
                        margin: '6 0 0 20',
                        readOnly: true,
                        hidden: true,
                        fieldLabel: '',
                        labelSeparator: '',
                        value: 'TRAINING ENABLED',
                        fieldStyle: {
                             //'fontSize': '14px',
                             'background' : 'green',
                             'color' : 'white',
                             'text-align' : 'center',
                             'padding-bottom' : '7px'
                        }, 
                        width: 150
                    }
                ]
            }
        ];
        
        me.callParent(arguments); 
    },

    rebuildTradingView: function(button, eventObject)
    {
        var me = button.up('[xtype=cryptos-trading-toolbar]');
        me.getMaintenanceController().renderView();
    },

    showSummary: function(button, eventObject)
    {
        var me = button.up('[xtype=cryptos-trading-toolbar]');
        //me.getMaintenanceController().showSummary();
    },
        
    getRobotController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }

});
