Ext.define('App.view.dashboard.toolbar', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.dashboard-toolbar',
    _alias: 'dashboard-toolbar',

    requires: [
        
    ],

    height: 46,
    region: 'north',

    config: {},
    trans: null,
    show_refresh_button: true,

    initComponent: function()
    {
        var me = this;
        me.itemId = me.config.itemId + '_toolbar';
        me.title = '';

        me.trans = me.config.trans.dashboard;
        
        // Set visibility in order to hidden buttons
        me.setButtonsVisibility();

        me.layout = {
            type: 'hbox',
            align: 'stretch'
        },

        me.items =
        [
            {
                xtype: 'buttongroup',
                itemId: me.config.itemId + '_toolbar_buttongroup',
                frame: false,
                border: false,
                items: [
                    {
                        itemId: me.config.itemId + '_refresh_button',
                        text: me.trans.refresh,
                        iconCls: 'x-fa fa-refresh',
                        handler: me.refresh,
                        hidden: !me.show_refresh_button
                    }
                ]
            }
        ];

        this.callParent(arguments);
    },

    setButtonsVisibility: function()
    {
        var me = this;

        if (typeof me.config.buttonBar != 'undefined' && typeof me.config.buttonBar.visibility != 'undefined')
        {
            if (typeof me.config.buttonBar.visibility.refreshButton != 'undefined')
            {
                me.show_refresh_button = me.config.buttonBar.visibility.refreshButton;
            }

        }
    },

    refresh: function(button, eventObject)
    {
        var me = button.up('[_alias=dashboard-toolbar]');
        me.getDashboardController().refresh(me.config);
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.controller.dashboard.dashboard');
        return controller;
    }

});