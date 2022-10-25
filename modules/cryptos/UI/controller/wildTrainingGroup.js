Ext.define('App.modules.cryptos.UI.controller.wildTrainingGroup', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.wildTrainingGroup.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_wildtraininggroup-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.wildTrainingGroup');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 550,
            width: 600,
            title: ((is_edition)? (config.trans.wildTrainingGroup.edition + ': ' + record.get('code')) : config.trans.wildTrainingGroup.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    }

});
