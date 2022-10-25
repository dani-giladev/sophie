Ext.define('App.modules.cryptos.UI.controller.robotGroup', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.view.robotGroup.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_robotgroup-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.robotGroup');
    },
    
    getFormConfig: function(config, is_edition, record)
    {
        return {
            height: 600,
            width: 600,
            title: ((is_edition)? (config.trans.robotGroup.edition + ': ' + record.get('code')) : config.trans.robotGroup.add)
        };
    },
    
    onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_code_field', config).setDisabled(true);
    }

});
