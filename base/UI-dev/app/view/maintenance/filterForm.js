Ext.define('App.view.maintenance.filterForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.maintenance-filterform',
    
    requires: [
        
    ],
    
    border: false,
    frame: false,
    autoWidth: true,
    bodyPadding: 10,
    region: 'north',
    anchor: '100%',
    
    initialized: false,
    is_box_ready: false,
    
    config: {},
    
    initComponent: function()
    {
        var me = this;
        
        var trans = me.getMaintenanceController().getTrans('base').maintenance;
        me.itemId = me.config.itemId + '_filterForm';
        
        this.items = [
            me.getItems()/*,
            {
                xtype: 'button',
                text: trans.refresh,
                scale: 'large',
                anchor: '100%',
                handler: me.refresh
            }*/
        ];
        
        me.dockedItems = 
        [
            {
                xtype: 'toolbar',
                height: 35,
                padding: '0 0 10 0',
                anchor: '100%',
                dock: 'bottom',
                items: [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        text: trans.refresh,
                        handler: me.refresh
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
        this.on('boxready', this.onBoxready, this);
        
        // Update properties and listeners
        me.getMaintenanceController().addFilterFormListeners(me.config, me);    
        me.getMaintenanceController().updateFilterFormProperties(me.config, me);      
        
    },
    
    onBoxready: function(thisForm, width, height, eOpts)
    {
        var me = this;
        var task = new Ext.util.DelayedTask(function(){
            me.is_box_ready = true;
        });        
        task.delay(100);
    },
    
    getItems: function()
    {
        var ret = {};
        
        return ret;
    },
    
    onRender: function(thisForm, eOpts)
    {
        var me = this;
        //console.log('OnRender filterForm');

//        var task = new Ext.util.DelayedTask(function(){
//            //console.log('focus');
//            me.getMaintenanceController().getComponentQuery('filterForm_code_field', me.config).focus();
//        });        
//        task.delay(500); 
       
        this.callParent(arguments);
    },
    
    resetFilterForm: function(button, eventObject)
    {
        var me = button.up('form');
        me.getMaintenanceController().resetFilterForm(me.config);
    },
    
    refresh: function(button, eventObject)
    {
        var me = button.up('form');
        me.getMaintenanceController().refresh(me.config);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.maintenance');
        return controller;
    }
       
});