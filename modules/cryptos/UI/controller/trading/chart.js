Ext.define('App.modules.cryptos.UI.controller.trading.chart', {
    extend: 'App.modules.cryptos.UI.controller.common',
    
    requires: [
        'App.modules.cryptos.UI.store.trading.mainchart',
        'App.modules.cryptos.UI.store.trading.secondchart',
        
        'App.modules.cryptos.UI.model.trading.mainchart',
        'App.modules.cryptos.UI.model.trading.secondchart',
        
        'App.modules.cryptos.UI.view.trading.mainchart',
        'App.modules.cryptos.UI.view.trading.secondchart'        
    ],
    
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
    },
    
    initSecondchartSeries: function(robot)
    {
        var chart = Ext.ComponentQuery.query('#cryptos-trading-cartesian-secondchart')[0];
        var strategy = robot.get('strategy');
        
        // Hide series
        var seriesList = chart.getSeries();
        for (var i = 0; i < seriesList.length; i++) {
            var serie = seriesList[i];
            var visible = false;
            
            if (strategy === 'rsi')
            {
                visible = (
                    //serie._yField === 'rsi' || 
                    serie._yField === 'rsi_signal' || 
                    serie._yField === 'rsi_oversold' || 
                    serie._yField === 'rsi_overbought'
                );
            }
            else
            {
                visible = (
                    serie._yField === 'macd' || 
                    serie._yField === 'macd_signal' || 
                    serie._yField === 'macdh'
                );
            }
            
            serie.setHidden(!visible);
        }
    }
    
});
