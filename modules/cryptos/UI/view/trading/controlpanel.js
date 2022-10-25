Ext.define('App.modules.cryptos.UI.view.trading.controlpanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-trading-controlpanel',
    itemId: 'cryptos-trading-controlpanel',
    
    requires: [

    ],
                        
    bodyPadding: 10,
    
    initComponent: function()
    {
        var me = this;
        var button_style = 
//                'font-size: 1vw;' +
                'white-space: pre-line;' +
                'overflow-wrap: break-word;' +
                'word-break: break-word;' +
                '-ms-hyphens: auto;' +
                '-moz-hyphens: auto;' +
                '-webkit-hyphens: auto;' +
                'hyphens: auto;';
                                        
        me.title = '';
        
        me.items = 
        [ 
            {
                xtype: 'panel',
                layout: 'hbox',
                border: false,
                frame: false,
                margin: '0 0 5 0',
                items:
                [
                    {
                        xtype: 'textfield',
                        itemId: 'cryptos-trading-controlpanel-status',
                        readOnly: true,
                        fieldLabel: 'Status',
                        labelAlign: 'right',
                        width: 250
                    },
                    {

                        xtype:'button',
                        itemId: 'cryptos-trading-controlpanel-start-stop-robot-togglebutton',
                        text: 'Start Robot',
                        iconCls: 'x-fa fa-play',
                        enableToggle: true,
                        pressed: false,
                        margin: '0 0 0 10',
                        toggleHandler: function(button, state)
                        {
                            me.setStartStopRobotButton(button, state);
                            me.getMaintenanceController().startStopRobot(state);
                        }
                    }                         
                ]
            },
            {
                xtype: 'textfield',
                itemId: 'cryptos-trading-controlpanel-lastoperation',
                readOnly: true,
                fieldLabel: 'Last operation',
                labelAlign: 'right',
                width: 250
            },
            {
                xtype: 'textfield',
                itemId: 'cryptos-trading-controlpanel-amount',
                readOnly: true,
                //fieldLabel: 'Amount to operate for each transaction',
                fieldLabel: 'Amount',
                labelAlign: 'right',
                width: 250
            },        
            {
                xtype: 'fieldset',
                autoHeight: true,
                padding: 5,
                title: 'Manual operations',
                width: 430,
                items: 
                [
                    {
                        xtype: 'panel',
                        border: false,
                        frame: false,
                        margin: '0 0 5 0',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                            pack: 'center'
                        },   
                        bodyStyle: {
                            'background-color': '#f6f6f6'
                        },            
                        defaults: {
                            width: 80,
                            height: 60
                        },
                        items:
                        [
                            {
                                xtype: 'button',
                                itemId: 'cryptos-trading-controlpanel-buy-button',
                                text: 'Buy Now',
                                margin: '0 0 0 8',
                                listeners: {
                                    render: function(button)
                                    {
                                        var text = '<span style="' + button_style + ';">' + 
                                                        button.getText() +
                                                   '</span>';
                                        button.setText(text);
                                    }
                                },
                                handler: function()
                                {
                                    me.getMaintenanceController().trade('buy');
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'cryptos-trading-controlpanel-sell-button',
                                text: 'Sell Now',
                                margin: '0 0 0 10',
                                listeners: {
                                    render: function(button)
                                    {
                                        var text = '<span style="' + button_style + ';">' + 
                                                        button.getText() +
                                                   '</span>';
                                        button.setText(text);
                                    }
                                },
                                handler: function()
                                {
                                    me.getMaintenanceController().trade('sell');
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'cryptos-trading-controlpanel-sellandstop-button',
                                text: 'Sell Now & Stop',
                                margin: '0 0 0 10',
                                listeners: {
                                    render: function(button)
                                    {
                                        var text = '<span style="' + button_style + ';">' + 
                                                        button.getText() +
                                                   '</span>';
                                        button.setText(text);
                                    }
                                },
                                handler: function()
                                {
                                    me.getMaintenanceController().trade('sellAndStop');
                                }
                            },
                            {
                                xtype: 'button',
                                itemId: 'cryptos-trading-controlpanel-sellcalmlyandstop-button',
                                text: 'Sell Calmly & Stop',
                                margin: '0 0 0 10',
                                listeners: {
                                    render: function(button)
                                    {
                                        var text = '<span style="' + button_style + ';">' + 
                                                        button.getText() +
                                                   '</span>';
                                        button.setText(text);
                                    }
                                },
                                handler: function()
                                {
                                    me.getMaintenanceController().trade('sellCalmlyAndStop');
                                }
                            }
                        ]
                    }
                ]
            },         
            {
                xtype: 'fieldset',
                autoHeight: true,
                padding: 5,
                title: 'History',
                width: '100%',
                items: 
                [
                    {
                        xtype: 'textfield',
                        itemId: 'cryptos-trading-controlpanel-history-transactions',
                        readOnly: true,
                        fieldLabel: 'Nº  transactions',
                        labelAlign: 'right',
                        width: 200
                    },
                    {
                        xtype: 'panel',
                        layout: 'hbox',
                        margin: '0 0 10 0',  
                        bodyStyle: {
                            'background-color': '#f6f6f6'
                        },
                        items:
                        [
                            {
                                xtype: 'textfield',
                                itemId: 'cryptos-trading-controlpanel-history-profit',
                                readOnly: true,
                                fieldLabel: 'Total Net Profit',
                                labelAlign: 'right',
                                width: 250
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'cryptos-trading-controlpanel-history-profit_usdt',
                                readOnly: true,
                                fieldLabel: '',
                                margin: '0 0 0 5',
                                labelSeparator : '',
                                labelAlign: 'right',
                                width: 150
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'cryptos-trading-controlpanel-history-workingtime',
                        readOnly: true,
                        fieldLabel: 'Working-time',
                        labelAlign: 'right',
                        width: 210
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'cryptos-trading-controlpanel-history-restingtime',
                        readOnly: true,
                        fieldLabel: 'Resting-time',
                        labelAlign: 'right',
                        width: 210
                    }
                ]
            }
        ];
        
        me.callParent(arguments); 
    },
        
    setStartStopRobotButton: function(button, state)
    {
        if (state)
        {
            button.setText('Stop Robot');
            button.setIconCls('x-fa fa-stop');
        }
        else
        {
            button.setText('Start Robot');
            button.setIconCls('x-fa fa-play');
        }        
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.trading.trading');
        return controller;
    }

});
