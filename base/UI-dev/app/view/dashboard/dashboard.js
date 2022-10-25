Ext.define('App.view.dashboard.dashboard', {
    extend: 'Ext.panel.Panel',
    //alias: 'widget.dashboard', // It's not posible 'cos comes into conflict with Ext.Dashboard.Dashboard (dani)
    alias: 'widget.base-dashboard',
    
    requires: [
        'App.controller.dashboard.dashboard',
        'App.view.dashboard.centerpanel',
        'App.view.dashboard.toolbar'
    ],

    //ui: 'light',
    layout: 'border',
    width: '100%',
    height: '100%',
    border: false,
    frame: false,
    closable: true,

    config: {},

    initComponent: function()
    {
        var me = this;

        me.setConfig();

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

        if (!me.config.enableSelectionMode)
        {
            me.title = title; //Ext.isEmpty(me.config.breadscrumb)? title : me.config.breadscrumb;
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
        return me.getDashboardController().getTrans(me.config.moduleId);
    },

    getItems: function()
    {
        var me = this;

        return [
            me.getWestPanel(),
            me.getCenterPanel(),
            me.getEastPanel()
        ];
    },

    getWestPanel: function()
    {
        return null;
        /*var me = this;
        var prefix = me.getDashboardController().getAliasPrefix(me.config);

        return Ext.widget(prefix + '-options', {
            config: me.config
        });*/
    },

    getCenterPanel: function()
    {
        var me = this;
        var prefix = me.getDashboardController().getAliasPrefix(me.config);

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
                    Ext.widget(prefix + '-centerpanel', {
                        config: me.config
                    })
                ]
        };
    },

    getEastPanel: function()
    {
        return null;
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.controller.dashboard.dashboard');
        return controller;
    }

});