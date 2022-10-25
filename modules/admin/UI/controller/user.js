Ext.define('App.modules.admin.UI.controller.user', {
    extend: 'App.modules.admin.UI.controller.common',
    
    requires: [
        'App.modules.admin.UI.view.user.form'
    ],
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 800,
            width: 800,
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
        var admin_fieldset = form.down('[alias=widget.admin-user-modules-admin]');
        if (admin_fieldset)
        {
            params['admin_rendered_form'] = (admin_fieldset.rendered_form);
        }

        var cryptos_fieldset = form.down('[alias=widget.admin-user-modules-cryptos]');
        if (cryptos_fieldset)
        {
            params['cryptos_rendered_form'] = (cryptos_fieldset.rendered_form);
        }

// [WIZARD_MODULE_TAG]

        return params;
    }
});
