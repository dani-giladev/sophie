Ext.define('App.view.dashboard.centerpanel', {
    extend: 'Ext.panel.Panel',

    region: 'center',
    border: false,
    frame: false,

    config: {},

    initComponent: function()
    {
        var me = this;

        me.items = me.getItems();

        this.callParent(arguments);
    },

    getItems: function()
    {
        return [];
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.controller.dashboard.dashboard');
        return controller;
    }

});