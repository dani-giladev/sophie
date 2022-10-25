Ext.define('App.modules.cryptos.UI.controller.historyRobotChanges', {
    extend: 'App.modules.cryptos.UI.controller.robot',
    
    requires: [
        'App.modules.cryptos.UI.controller.robot',
        'App.modules.cryptos.UI.view.historyRobotChanges.form'
    ],
    
    getId: function(code)
    {
      var ret = 'cryptos_historyrobotchanges-' + code;
      return ret.toLowerCase();
    },
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.historyRobotChanges');
    },
    
    _onEditForm: function(config, record, window, form)
    {
        var me = this;
        me.getComponentQuery('form_save_button', config).setDisabled(true);
        me.getComponentQuery('form_copy_properties', config).setDisabled(true);
    }

});
