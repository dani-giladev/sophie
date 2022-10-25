Ext.define('App.modules.cryptos.UI.view.robot.tabs.wildTraining', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-robot-tab-wildTraining',
    
    requires: [
    
    ],
          
    trans: null,
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.title = 'Wild training';
        
        me.items =
        [
            me.getMainFieldset(),
            me.getTheBestCustomRobotFieldset()
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
                            name: 'wt_enabled',
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
                            _name: 'wt_enabled'
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
                            xtype: 'combobox',
                            name: 'wt_group',
                            fieldLabel: 'Group',
                            labelAlign: 'right',
                            queryMode: 'local',
                            valueField: 'code',
                            displayField: 'name',
                            allowBlank: true,
                            typeAhead: true,
                            forceSelection: true,
                            editable: true,
                            width: 350 + 50,
                            labelWidth: 150,
                            store: {
                                type: 'cryptos_wildTrainingGroup'
                            },
                            listeners: {
                                render: function(field, eOpts)
                                {
                                    var proxy = field.store.getProxy();
                                    proxy.url = restpath + proxy.endpoint;
                                    field.store.load();
                                }
                            }
                        },
                        {
                            xtype: 'checkboxfield',
                            _xtype: 'checkbox_selection',
                            fieldLabel: '',
                            boxLabel: '',
                            _name: 'wt_group',
                            margin: '1 0 0 5'
                        }
                    ]
                }          
            ]
        };

        return ret;
    },

    getTheBestCustomRobotFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: 'The best custom robot',
            anchor: '100%',
            items: 
            [
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
                            name: 'wt_bcr_min_trades',
                            allowBlank: true,
                            fieldLabel: 'Min/Max trades',
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
                            _name: 'wt_bcr_min_trades',
                            margin: '1 0 0 5'
                        },
                        {
                            xtype: 'numberfield',
                            name: 'wt_bcr_max_trades',
                            margin: '0 0 0 5',
                            allowBlank: true,
                            fieldLabel: '',
                            labelAlign: 'right',
                            width: 100,
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
                            _name: 'wt_bcr_max_trades',
                            margin: '1 0 0 5'
                        }
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
                            name: 'wt_bcr_min_hits_perc',
                            fieldLabel: 'Min hits %',
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
                            _name: 'wt_bcr_min_hits_perc',
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
