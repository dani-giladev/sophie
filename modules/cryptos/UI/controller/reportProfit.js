Ext.define('App.modules.cryptos.UI.controller.reportProfit', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.store.reportProfitChart',
        'App.modules.cryptos.UI.model.reportProfitChart',
        'App.modules.cryptos.UI.view.reportProfit.chart'
    ],
    
    getStore: function()
    {
        return Ext.create('App.modules.cryptos.UI.store.reportProfit');
    },
    
    showChart: function(config, title, property)
    {
        var me = this;
        var grid = me.getComponentQuery('grid', config);
        
        var selected = grid.getSelectionModel().getSelection();
        if (Ext.isEmpty(selected))
        {
            return;
        }
        
        var series = [];
        var counter = 0;
        var colors = ['blue', 'green', 'violet', 'yellow', 'brown', 'orange', 'pink'];
        var robots = [];
        Ext.each(selected, function(record)
        {
            //console.log(record);
            var user_code = record.get('user_code');
            var robot_code = record.get('robot_code');
            var robot_name = record.get('robot_name');
            var yfield = user_code + '-' + robot_code + '-' + property;
            var color;
            if (!colors[counter])
            {
                color = 'silver';
            }
            else
            {
                color = colors[counter];
            }
            robots.push({
                user_code: user_code,
                robot_code: robot_code
            });
            
            series.push({
                type: 'line',
                title: robot_name,
                xField: 'date',
                yField: yfield,
                style: {
                    lineWidth: 2,
                    strokeStyle: color
                },
                marker: {
                    type: 'circle',
                    radius: 2,
                    fx: {
                        duration: 200,
                        easing: 'backOut'
                    },
                    fillStyle: color
                },
                highlightCfg: {
                    scaling: 2
                },
                tooltip: {
                    trackMouse: true,
                    renderer: function (tooltip, record, item) {
                        if (!record) return;
                        tooltip.setHtml(record.get('date') + '<br>' + record.get(yfield));
                    }
                }                     
            });
            
            counter++;
        });
        
        var filterForm = me.getComponentQuery('filterForm', config);
        var filterFormValues = filterForm.getValues();
        
        var window = Ext.widget('common-window');
        var panel = Ext.widget('cryptos-reportProfit-chart', {
            chart_height: 500,
            robots: robots,
            is_training: filterFormValues.is_training,
            start_date: filterFormValues.start_date,
            end_date: filterFormValues.end_date,
            series: series,
            property: property
        });
        window.setTitle(title);
        window.setWidth(1000);
        window.setHeight(600);
        window.add(panel);

        window.show();  
    },
    
    toggleMarkers: function(chart)
    {
        var seriesList = chart.getSeries(),
            ln = seriesList.length,
            i = 0,
            series;

        for (; i < ln; i++) {
            series = seriesList[i];
            series.setShowMarkers(!series.getShowMarkers());
        }

        chart.redraw();
    }

});
