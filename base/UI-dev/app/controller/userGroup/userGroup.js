Ext.define('App.controller.userGroup.userGroup', {
    extend: 'App.controller.maintenance.maintenance',
    
    requires: [
        
    ],
    
    addParams: function(params, config, form)
    {
        var grid = form.down('[alias=widget.userGroup-grantsByMenuGrid]');
        
        var data_grid = grid.getStore().getRange();
        
        var records = [];
        if (!Ext.isEmpty(data_grid))
        {
            Ext.each(data_grid, function(rc)
            { 
                records.push(Ext.apply(rc.data));
            });    
        }  
        
        params['grants_by_menu'] = Ext.encode(records);
            
        return params;
    }
    
});