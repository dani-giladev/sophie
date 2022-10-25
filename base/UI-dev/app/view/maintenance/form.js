Ext.define('App.view.maintenance.form', {
    extend: 'Ext.form.Panel',
    alias: 'widget.maintenance-form',
    
    requires: [
        
    ],
    
    border: false,
    frame: false,
    autoHeight: true,
    scrollable: true,
    bodyPadding: 10,

    isRecordSaved: false,
    refreshAfterSave: false,
    refreshCombo: null,

    object_id: '',
    current_record: null,
    config: {},
    is_box_ready: false,
    required_indication: '<font size="4" color="red">*</font>',    
    
    initComponent: function() {
        var me = this;
        
        var trans = me.getMaintenanceController().getTrans('base').maintenance;
        var grants = me.getMaintenanceController().getGrants(me.config);
        var is_new_record = (me.object_id == '')? true : false;
        
        me.itemId = me.config.itemId + '_form';

        me.formExtraParams = {};
        
        me.items = me.getItems();
        
        me.dockedItems = 
        [
            {
                xtype: 'toolbar',
//                height: 35,
                anchor: '100%',
                dock: 'bottom',
//                style: {
//                    background: '#5ea1db'
//                },
                items: 
                [
                    me.getLeftToolbarButtons(),
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'button',
                        itemId: me.config.itemId + '_form_save_button',
                        text: trans.save,
                        iconCls: 'x-fa fa-save',
                        //formBind: true,
                        //disabled: true,
                        handler: me.saveRecord,
                        disabled: ( (is_new_record && !grants.insert) || (!is_new_record && !grants.update))
                    },
                    {
                        xtype: 'button',
                        text: trans.close,
                        iconCls: 'x-fa fa-sign-out',
                        handler: me.cancelForm
                    }
                ]
            }
        ];

        me.callParent(arguments);
        me.on('beforerender', me.onBeforerender, me);
        me.on('boxready', me.onBoxready, me);
        
        me.addLastModificationText();
    
        // Update properties and listeners
        me.getMaintenanceController().addFormListeners(me.config, me);    
    },

    setRefreshExternalCombo: function(refresh, combo)
    {
        var me = this;

        me.refreshAfterSave = refresh;
        me.refreshCombo = combo;
    },

    getRefreshStatus: function()
    {
        var me = this;

        return me.refreshAfterSave;
    },

    getRefreshCombo: function()
    {
        var me = this;

        return me.refreshCombo;
    },


    getLeftToolbarButtons: function()
    {
        var ret = null;
        
        return ret;
    },
    
    getItems: function()
    {
        var ret = [];
        
        return ret;
    },
    
    addLastModificationText: function()
    {
        var me = this;
        me.add(me.getLastModificationText());
    },
    
    getLastModificationText: function()
    {
        var me = this;

        var ret = 
        {
            xtype: 'panel',
            border:false,
            margin: '10 0 0 0',
            items: [
                {
                    xtype: 'label',
                    itemId: me.config.itemId + '_form_last_modification_field'                    
                }
            ]
        };

        return ret;
    },
    
    onBeforerender: function(thisForm, eOpts)
    {
   
    },
    
    onBoxready: function(thisForm, width, height, eOpts)
    {
        var me = this;
        //console.log('onBoxready');
        var is_new_record = (me.object_id == '')? true : false;
        if (is_new_record)
        {
            var task = new Ext.util.DelayedTask(function(){
                //console.log('focus');
                var focus_field = me.getMaintenanceController().getComponentQuery('form_code_field', me.config);
                if (focus_field)
                {
                    focus_field.focus();
                }
            });        
            task.delay(500); 
        }
        
        me.is_box_ready = true;
    },
    
    saveRecord: function(button, eventObject)
    {
        var me = button.up('form');
        me.getMaintenanceController().saveRecord(me.config, true);

        me.isRecordSaved = true;
    },

    cancelForm: function(button, eventObject)
    {
        var me = button.up('form');
        me.getMaintenanceController().cancelForm(me.config);
    },
        
    getMaintenanceController: function()
    {
        var controller = App.app.getController('App.controller.maintenance.maintenance');
        return controller;
    }
});