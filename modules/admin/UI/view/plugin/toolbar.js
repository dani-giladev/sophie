Ext.define('App.modules.admin.UI.view.plugin.toolbar', {
    extend: 'App.view.maintenance.toolbar',
    alias: 'widget.admin-plugin-toolbar',
    
    requires: [
        'App.modules.admin.UI.controller.plugin',
        'App.view.maintenance.toolbar'
    ],
    
    onRender: function()
    {
        var me = this;
        var trans = me.getMaintenanceController().getTrans('admin');
        var buttongroup = me.getMaintenanceController().getComponentQuery('toolbar_buttongroup', me.config);
        
        buttongroup.add({
            text: trans.plugin.metacode,
            iconCls: 'x-fa fa-code',
            menu: {
                items:
                [
                    {
                        text: trans.plugin.new_module,
                        handler: me.createMetacodeOfModule
                    },
                    {
                        text: trans.plugin.new_maintenance,
                        handler: me.createMetacodeOfMaintenance
                    },
                    {
                        text: trans.plugin.new_field,
                        handler: me.createMetacodeOfField
                    }
                ]
            }
        }); 
        
        this.callParent(arguments);
    },

    createMetacodeOfModule: function(button, eventObject)
    {
        var me = button.up('[alias=widget.admin-plugin-toolbar]');
        me.getMaintenanceController().createMetacodeOfModule(me.config);
    },

    createMetacodeOfMaintenance: function(button, eventObject)
    {
        var me = button.up('[alias=widget.admin-plugin-toolbar]');
        me.getMaintenanceController().createMetacodeOfMaintenance(me.config);
    },

    createMetacodeOfField: function(button, eventObject)
    {
        var me = button.up('[alias=widget.admin-plugin-toolbar]');
        me.getMaintenanceController().createMetacodeOfField(me.config);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.modules.admin.UI.controller.plugin');
        return controller;
    }

});