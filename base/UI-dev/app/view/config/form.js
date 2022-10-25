Ext.define('App.view.config.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.config-form',
    
    requires: [

    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('base').config;
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset()
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
            title: me.trans.main,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'textfield',
                    itemId: me.config.itemId + '_form_code_field',
                    name: 'code',
                    maskRe: /[a-zA-Z0-9\-\_]/,
                    allowBlank: false,
                    fieldLabel: me.trans.code + me.required_indication,
                    labelAlign: 'right',
                    anchor: '100%'
                },
                {
                    xtype: 'textareafield',
                    name: 'name',
                    allowBlank: false,
                    fieldLabel: me.trans.name + me.required_indication,
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
            title: me.trans.properties,
            anchor: '100%',
            items: 
            [
                {
                    xtype: 'textareafield',
                    name: 'default_value',
                    allowBlank: false,
                    fieldLabel: me.trans.default_value + me.required_indication,
                    labelAlign: 'right',
                    anchor: '100%'
                },
                {
                    xtype: 'textareafield',
                    name: 'value',
                    allowBlank: false,
                    fieldLabel: me.trans.value + me.required_indication,
                    labelAlign: 'right',
                    anchor: '100%',
                    height: 200
                }
            ]
        };

        return ret;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.config.config');
        return controller;
    }
});