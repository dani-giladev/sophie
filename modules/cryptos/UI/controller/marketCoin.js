Ext.define('App.modules.cryptos.UI.controller.marketCoin', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.marketCoin.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_marketCoin-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.marketCoin');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 700,
            width: 600,
            title: ((is_edition)? (config.trans.marketCoin.edition + ': ' + record.get('code')) : config.trans.marketCoin.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    },
    
    onAddForm: function(config, window, form)
    {
        
    }

});
