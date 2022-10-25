Ext.define('App.view.maintenance.maintenance', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.maintenance',
    
    //ui: 'light',
    layout: 'border',
    width: '100%',
    height: '100%',
    border: false,
    frame: false,
    closable: true,
    hideHeader: false,
    
    config: {},

    initComponent: function()
    {
        var me = this;
        
        me.setConfig();
        
        if (me.config.color)
        {
            me.tabConfig = {
                //cls: 'maintenance-color-' + me.config.color,
                style: {
                    'background-color': me.config.color
                }
            };
        }
    
        me.items = me.getItems();

        this.callParent(arguments);
    },

    setConfig: function()
    {
        var me = this;
        
        me.config.itemId = me.itemId;
        me.config.launchedFromModule = Ext.isEmpty(me.config.launchedFromModule)? me.config.moduleId : me.config.launchedFromModule;
        me.config.trans = me.getTrans();
        me.config.anyForm = true;
    },

    setTitle: function(title)
    {
        var me = this;
        
        if (!me.config.enableSelectionMode && !me.hideHeader)
        {
            var text = title; //Ext.isEmpty(me.config.breadscrumb)? title : me.config.breadscrumb;
            if (me.config.color)
            {
                me.title = '<font color="white">' + text + '</font>';
            }
            else
            {
                me.title = text;
            }
        }
        else
        {
            me.title = '';
            me.header = false;
        }
        
        me.config.title = title;
    },

    getTrans: function()
    {
        var me = this;
        return me.getMaintenanceController().getTrans(me.config.moduleId);
    },
    
    getItems: function()
    {
        var me = this;
        
        var westpanel = me.getWestPanel();
        var centerpanel = me.getCenterPanel();
        
        if (me.config.color)
        {
            westpanel.header = {
                cls: 'maintenance-color-' + me.config.color
            };
            centerpanel.header = {
                cls: 'maintenance-color-' + me.config.color
            };
        }        
        
        return [
            westpanel,
            centerpanel,
            me.getEastPanel()
        ];
    },
    
    getWestPanel: function()
    {
        var me = this;
        var prefix = me.getMaintenanceController().getAliasPrefix(me.config);
        
        return Ext.widget(prefix + '-dynamicfilterform', {
            config: me.config
        });
    },
    
    getCenterPanel: function()
    {
        var me = this;
        var prefix = me.getMaintenanceController().getAliasPrefix(me.config);
        
        return {
            xtype: 'panel',
            title: me.config.breadscrumb,
            region: 'center',
            layout: 'border',
            width: '100%',
            height: '100%',
            items:
            [
                Ext.widget(prefix + '-toolbar', {
                    config: me.config
                }),
                Ext.widget(prefix + '-grid', {
                    config: me.config
                })                
            ]            
        };
    },
    
    getEastPanel: function()
    {
        return null;
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.maintenance');
        return controller;
    }
    
});