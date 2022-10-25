Ext.define('App.modules.cryptos.UI.view.wildTrainingGroup.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.cryptos-wildTrainingGroup-form',
    
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
                    xtype: 'numberfield',
                    name: 'order',
                    fieldLabel: 'Order',
                    labelAlign: 'right',
                    width: 200,
                    minValue: 1,
                    //maxValue: 100,
                    decimalPrecision: 0,
                    enableKeyEvents : true
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
        var controller = App.app.getController('App.modules.cryptos.UI.controller.wildTrainingGroup');
        return controller;
    }
        
});
