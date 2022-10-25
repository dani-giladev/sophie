Ext.define('App.modules.cryptos.UI.controller.user', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.user.form'
    ],
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 800,
            width: 600,
            title: ((is_edition)? (config.trans.user.edition + ': ' + record.get('name')) : config.trans.user.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    },
    
    addParams: function(params, config, form)
    {
        params['module_id'] = config.moduleId;
        params['cryptos_rendered_form'] = true;
        return params;
    }

});
