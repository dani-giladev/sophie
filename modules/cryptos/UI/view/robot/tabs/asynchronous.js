Ext.define('App.modules.cryptos.UI.view.robot.tabs.asynchronous', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-asynchronous',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Asynchronous';
        
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
            padding: 5,
            title: me.trans.common.main,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '-8 0 5 154',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'checkboxfield',
                            name: 'asynchronous_enabled',
                            fieldLabel: '',
                            labelAlign: 'right',
                            boxLabel: 'Enabled',
                            labelWidth: 150
                        },
                        { xtype: 'label', text: '(', margin: '6 4 0 20' },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'asynchronous_enabled'
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
