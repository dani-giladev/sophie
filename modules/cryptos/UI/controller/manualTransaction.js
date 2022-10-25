Ext.define('App.modules.cryptos.UI.controller.manualTransaction', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.manualTransaction.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_manualtransaction-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.manualTransaction');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 550,
            width: 500,
            title: ((is_edition)? (config.trans.manualTransaction.edition + ': ' + record.get('code')) : config.trans.manualTransaction.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_save_button', config).setDisabled(true);
    },
    
    showOrder: function(config)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var record = selected[0];
        
        Ext.Msg.alert('JSON', '<pre>' + JSON.stringify(record.data.order, undefined, 2) + '</pre>');
    }

});
