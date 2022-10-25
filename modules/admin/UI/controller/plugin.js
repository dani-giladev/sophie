Ext.define('App.modules.admin.UI.controller.plugin', {
    extend: 'App.modules.admin.UI.controller.common',
    
    requires: [
        'App.modules.admin.UI.view.plugin.form',
        'App.modules.admin.UI.view.plugin.metacodePluginForm',
        'App.modules.admin.UI.view.plugin.metacodeMaintenanceForm',
        'App.modules.admin.UI.view.plugin.metacodeWidgetForm',
        'App.modules.admin.UI.view.plugin.metacodeFieldForm',
        'App.modules.admin.UI.view.plugin.metacodeTabForm'
    ],
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 400,
            width: 520,
            title: ((is_edition)? (config.trans.plugin.edition + ': ' + record.get('description')) : config.trans.plugin.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    },
    
    createMetacodeOfModule: function(config)
    {
        var me = this;
        var title, msg;
        
        title = config.trans.plugin.new_module;
        
        var record = me.getSelectedRecord(config);
        if (Ext.isEmpty(record))
        {
            msg = config.trans.plugin.firstly_you_must_select_one_plugin;
            me.msgBox(title, msg);
            return; 
        } 
        
        var window = Ext.widget('common-window');
        var form = Ext.widget('admin-plugin-metacodePluginForm', {
            current_record: record,
            trans: config.trans
        });
        window.setTitle(title);
        window.setWidth(300);
        window.setHeight(260);
        window.add(form);
        
        //form.getForm().loadRecord(record);
        
        window.on('close', function(){
            if (form.accept)
            {
                me.refreshGrid(config);
            }
        }); 

        window.show(); 
    },
    
    createMetacodeOfMaintenance: function(config)
    {
        var me = this;
        var title, msg;
        
        title = config.trans.plugin.new_maintenance;
        
        var record = me.getSelectedRecord(config);
        if (Ext.isEmpty(record))
        {
            msg = config.trans.plugin.firstly_you_must_select_one_plugin;
            me.msgBox(title, msg);
            return; 
        } 
        
        var window = Ext.widget('common-window');
        var form = Ext.widget('admin-plugin-metacodeMaintenanceForm', {
            current_record: record,
            trans: config.trans
        });
        window.setTitle(title);
        window.setWidth(850);
        window.setHeight(370);
        window.add(form);
        
        //form.getForm().loadRecord(record);
        form.getForm().findField('plugin_name').setValue(record.get('description'));
        
        window.on('close', function(){
            if (form.accept)
            {
                me.refreshGrid(config);
            }
        }); 

        window.show();       
    },

    createMetacodeOfField: function(config)
    {
        var me = this;
        var title, msg;

        title = config.trans.plugin.new_field;

        var record = me.getSelectedRecord(config);
        if (Ext.isEmpty(record))
        {
            msg = config.trans.plugin.firstly_you_must_select_one_plugin;
            me.msgBox(title, msg);
            return;
        }

        var window = Ext.widget('common-window');
        var form = Ext.widget('admin-plugin-metacodeWidgetForm', {
            current_record: record,
            trans: config.trans
        });
        window.setTitle(title);
        window.setWidth(850);
        window.setHeight(600);
        window.add(form);

        //form.getForm().loadRecord(record);
        form.getForm().findField('plugin_name').setValue(record.get('description'));

        window.on('close', function(){
            if (form.accept)
            {
                me.refreshGrid(config);
            }
        });

        window.show();
    }

});
