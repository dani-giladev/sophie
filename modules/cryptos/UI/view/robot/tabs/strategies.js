Ext.define('App.modules.cryptos.UI.view.robot.tabs.strategies', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-strategies',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Strategies';
        
        me.items =
        [
            me.getMainFieldset()
        ];
        
        this.callParent(arguments);
    },

    getMainFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            title: me.trans.common.main,
            anchor: '100%',
            padding: '0 0 0 50',
            items: 
            [
                {
                    xtype: 'radiofield',
                    itemId: me.config.itemId + '_form_strategy_basicmode_radiofield',
                    name : 'strategy',
                    fieldLabel : '',
                    boxLabel  : 'Basic mode strategy',
                    inputValue: 'basic-mode'
                },
                {
                    xtype: 'radiofield',
                    name : 'strategy',
                    fieldLabel : '',
                    boxLabel  : 'MACD strategy',
                    inputValue: 'macd'
                },
                {
                    xtype: 'radiofield',
                    name : 'strategy',
                    fieldLabel : '',
                    boxLabel  : 'RSI strategy',
                    inputValue: 'rsi'
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        { xtype: 'label', text: '( Check to copy', margin: '6 4 0 0' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'strategy',
                            _is_radiofield_selection: true
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                }  
            ]
        };

        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.robot');
        return controller;
    }
        
});
