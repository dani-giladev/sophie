Ext.define('App.modules.cryptos.UI.controller.userGroup', {
    extend: 'App.controller.userGroup.userGroup',
    
    requires: [
        'App.modules.cryptos.UI.view.userGroup.form'
    ],
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 700,
            width: 700,
            title: ((is_edition)? (config.trans.userGroup.edition + ': ' + record.get('name')) : config.trans.userGroup.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    },
    
    onAddForm: function(config, window, form)
    {
        form.getForm().findField('grants_summary').setValue('custom');
    }

});
