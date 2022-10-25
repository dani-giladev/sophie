Ext.define('App.modules.cryptos.UI.view.robot.tabs.redAndWhite', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-redAndWhite',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Red & White';
        
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
                            name: 'rw_enabled',
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
                            _name: 'rw_enabled'
                        },
                        { xtype: 'label', text: ')', margin: '6 0 0 2' }
                    ]
                },
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    border: false,
                    frame: false,
                    margin: '0 0 10 0',
                    bodyStyle: {
                        'background-color': '#f6f6f6'
                    },
                    items:
                    [
                        {
                            xtype: 'numberfield',
                            name: 'rw_max_consecutive_failures',
                            fieldLabel: 'Max number of consecutive failures',
                            labelAlign: 'right',
                            width: 200 + 50,
                            labelWidth: 150,
                            minValue: 1,
                            //maxValue: 100,
                            decimalPrecision: 0,
                            enableKeyEvents : true
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'rw_max_consecutive_failures',
                            margin: '1 0 0 5'
                        }
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
