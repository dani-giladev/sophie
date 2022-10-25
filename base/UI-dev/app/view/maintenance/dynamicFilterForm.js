Ext.define('App.view.maintenance.dynamicFilterForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.maintenance-dynamicfilterform',
    
    requires: [
        'App.controller.maintenance.dynamicFilterForm'
    ],
    
    border: false,
    frame: false,
    width: 300,
    region: 'west',
    split: true,
    collapsible: true,
    //collapsed: true,
    bodyPadding: 10,
    scrollable: true,
    
    config: {},
    
    initComponent: function()
    {
        var me = this;
        
        var trans = me.getDynamicFilterController().getTrans('base').maintenance;
        me.title = (Ext.isEmpty(me.config.filterform) || !me.config.filterform.hidden)? trans.dynamic_filters : '';
        
        me.itemId = me.config.itemId + '_dynamicFilterForm';
        
        if (me.config.color)
        {
            me.header = {
                cls: 'maintenance-color-' + me.config.color
            };
        }
        
        this.items = [
            me.getItems()
        ];
        
        me.dockedItems = 
        [
            {
                xtype: 'toolbar',
                height: 35,
                anchor: '100%',
                dock: 'bottom',
                items: [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: trans.refresh,
                        handler: me.refreshFilterForm
                    },
                    {
                        xtype: 'button',
                        text: trans.reset,
                        handler: me.resetFilterForm
                    }
                ]
            }
        ];
            
        this.callParent(arguments);
    },
    
    getItems: function()
    {
        var me = this;
        
        var ret = 
        {
            xtype: 'container',
            itemId: me.config.itemId + '_dynamicFilterForm_container',
            defaults: {
                width: '100%',
                labelAlign: 'right',
                labelWidth: 60
            },    
            items:
            [

            ]
        };
        
        return ret;
    },
    
    onRender: function(thisForm, eOpts)
    {
        this.callParent(arguments);
    },
    
    refreshFilterForm: function(button, eventObject)
    {
        var me = button.up('form');
        me.getDynamicFilterController().refreshFilterForm(me.config);
    },
    
    resetFilterForm: function(button, eventObject)
    {
        var me = button.up('form');
        me.getDynamicFilterController().resetFilterForm(me.config);
    },
        
    getDynamicFilterController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.dynamicFilterForm');
        return controller;
    }
});