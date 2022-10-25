Ext.define('App.modules.cryptos.UI.controller.symbol', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.symbol.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_symbol-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.symbol');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 550,
            width: 700,
            title: ((is_edition)? (config.trans.symbol.edition + ': ' + record.get('name')) : config.trans.symbol.add)
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
