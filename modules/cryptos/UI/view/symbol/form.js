Ext.define('App.modules.cryptos.UI.view.symbol.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-symbol-form',
    
    requires: [

    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('cryptos');
        
        var ret = me.getMainTab();
        
        return ret;
    },
    
    getMainTab: function()
    {
        var me = this;
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset(),
            me.getNotesFieldset()
        ];
        
        return ret;
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
                    xtype: 'textfield',
                    itemId: me.config.itemId + '_form_code_field',
                    name: 'code',
                    maskRe: /[a-zA-Z0-9\-\_]/,
                    allowBlank: false,
                    fieldLabel: me.trans.common.code + me.required_indication,
                    labelAlign: 'right',
                    width: 250
                },
                {
                    xtype: 'textfield',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: me.trans.common.name + me.required_indication,
                    labelAlign: 'right',
                    anchor: '100%'
                }

            ]
        };

        return ret;
    },
    
    getPropertiesFieldset: function()
    {
        var me = this;
        
        var ret =
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.common.properties,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'checkboxfield',
                    name: 'available',
                    fieldLabel: me.trans.common.available,
                    labelAlign: 'right',
                    boxLabel: '',
                    anchor: '100%'
                },
                {
                    xtype: 'numberfield',
                    name: 'decimals',
                    allowBlank: true,
                    fieldLabel: 'Decimals (amount)',
                    labelAlign: 'right',
                    width: 200,
                    minValue: 0,
                    maxValue: 10,
                    decimalPrecision: 0
                },
                {
                    xtype: 'numberfield',
                    name: 'price_decimals',
                    allowBlank: true,
                    fieldLabel: 'Decimals (price)',
                    labelAlign: 'right',
                    width: 200,
                    minValue: 0,
                    maxValue: 10,
                    decimalPrecision: 0
                },
                {
                    xtype: 'numberfield',
                    name: 'min_notional',
                    allowBlank: true,
                    fieldLabel: 'Min notional',
                    labelAlign: 'right',
                    width: 400,
                    minValue: 0,
                    decimalPrecision: 10,
                    enableKeyEvents : true,
                    decimalSeparator: '.',
                    // Remove spinner buttons, and arrow key and mouse wheel listeners
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false                      
                }
            ]
        };
        
        return ret;
    },
    
    getNotesFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.common.notes,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'textareafield',
                    name: 'notes',
                    anchor: '100%',
                    height: 60
                }
            ]
        };

        return ret;
    },
    
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.symbol');
        return controller;
    }
        
});
