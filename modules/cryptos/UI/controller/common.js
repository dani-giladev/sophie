Ext.define('App.modules.cryptos.UI.controller.common', {
    extend: 'App.controller.maintenance.maintenance',
    
    requires: [

    ],
    
    isTimeToExecuteTask: function(task)
    {
        var difference, lapsed, interval;
        var now =  new Date();
        
        if (task.enabled)
        {
            difference = now.getTime() - task.date.getTime(); // This will give difference in milliseconds
            lapsed = Math.round(difference / 1000);
            interval = task.interval;
            //console.log('Checking ' + task.name, lapsed, interval);
            if (lapsed >= interval)
            {
                task.date = new Date(); // restart timer
                return true;
            }            
        }
        
        return false;
    }
    
});
