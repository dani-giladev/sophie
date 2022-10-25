Ext.define('App.view.userGroup.form', {
    extend: 'App.view.maintenance.form',
    alias: 'widget.userGroup-form',
    
    requires: [
        'App.view.userGroup.grantsByMenuGrid'
    ],
          
    trans: null,
    
    getItems: function()
    {
        var me = this;
        
        me.trans = me.getMaintenanceController().getTrans('base').userGroup;
        //console.log(me.trans);
        
        var ret =
        [ 
            me.getMainFieldset(),
            me.getPropertiesFieldset(),
            me.getGrantsFieldset(),
            me.getSpecialGrantsFieldset()
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
                    width: 350
                },
                {
                    xtype: 'textfield',
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
                    xtype: 'checkboxfield',
                    name: 'available',
                    fieldLabel: me.trans.available,
                    labelAlign: 'right',
                    boxLabel: '',
                    checked: true,
                    anchor: '100%'
                }
            ]
        };

        return ret;
    },
    
    getGrantsFieldset: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.grants,
            anchor: '100%',
            items: 
            [
                    {
                        xtype: 'fieldcontainer',
                        fieldLabel : '',
                        margin: '0 0 7 0',
                        anchor: '100%',
                        defaultType: 'radiofield',
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: 
                        [ 
                            {
                                boxLabel: me.trans.custom,
                                name: 'grants_summary',
                                inputValue: 'custom',
                                listeners: {
                                    change: function(thisField, newValue, oldValue, eOpts )
                                    {
                                        if (newValue === true)
                                        {
                                            var grid = me.down('grid');
                                            grid.setDisabled(false);
                                        }

                                    }
                                }
                            }, 
                            {
                                boxLabel: me.trans.all_male,
                                name: 'grants_summary',
                                inputValue: 'all',
                                listeners: {
                                    change: function(thisField, newValue, oldValue, eOpts)
                                    {
                                        if (newValue === true)
                                        {
                                            var grid = me.down('grid');
                                            grid.setDisabled(true);
                                        }
                                    }
                                }
                            }, 
                            {
                                boxLabel: me.trans.none,
                                name: 'grants_summary',
                                inputValue: 'none',
                                listeners: {
                                    change: function(thisField, newValue, oldValue, eOpts )
                                    {
                                        if (newValue === true)
                                        {
                                            var grid = me.down('grid');
                                            grid.setDisabled(true);
                                        }
                                    }
                                }
                            }                                                       
                        ]
                    },                   
                    Ext.widget('userGroup-grantsByMenuGrid', {
                        config: me.config,
                        user_group_id: me.object_id
                    })
            ]
        };

        return ret;
    },
    
    getSpecialGrantsFieldset: function()
    {
        var me = this;
        var special_grants = me.getSpecialGrants();
        if (Ext.isEmpty(special_grants))
        {
            return null;
        }
        
        var ret = 
        {
            xtype: 'fieldset',
            autoHeight: true,
            padding: 5,
            title: me.trans.special_grants,
            anchor: '100%',
            items: special_grants
        };

        return ret;
    },
    
    getSpecialGrants: function()
    {
        return [];
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.userGroup.userGroup');
        return controller;
    }
});