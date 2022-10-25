Ext.define('App.controller.config.config', {
    extend: 'App.controller.maintenance.maintenance',
    
    requires: [
        'App.view.config.form'
    ],
    
    getAliasPrefix: function(config)
    {
        var prefix = 'config';
        return prefix;
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        var me = this;
        var trans = me.getTrans('base').config;
        
        return {
            height: 600,
            width: 600,
            title: ((is_edition)? (trans.edition + ': ' + record.get('code')) : trans.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        form.getForm().findField("code").setDisabled(true);
        //form.getForm().findField("name").setReadOnly(true);
        form.getForm().findField("default_value").setReadOnly(true);
    },
    
    addParams: function(params, config, form)
    {
        var current_record = form.current_record;
        
        if (!current_record)
        {
            return params;
        }
        
        params['id'] = current_record.get('_id');
        
        return params;
    }
    
});