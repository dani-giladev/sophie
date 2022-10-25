Ext.define('App.modules.[MODULE_NAME].UI.controller.[MAINTENANCE_NAME]', {
    extend: 'App.modules.[MODULE_NAME].UI.controller.common',
    
    requires: [
        'App.modules.[MODULE_NAME].UI.view.[MAINTENANCE_NAME].form'
    ],
    
    getId: function(code)
    {
      var ret = '[MODULE_NAME]_[MAINTENANCE_NAME]-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.[MODULE_NAME].UI.store.[MAINTENANCE_NAME]');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 550,
            width: 600,
            title: ((is_edition)? (config.trans.[MAINTENANCE_NAME].edition + ': ' + record.get('code')) : config.trans.[MAINTENANCE_NAME].add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    },
    
    onAddForm: function(config, window, form)
    {
        form.getForm().findField('available').setValue(true);
    }

});
