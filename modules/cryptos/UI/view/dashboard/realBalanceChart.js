Ext.define('App.modules.cryptos.UI.view.dashboard.realBalanceChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cryptos-dashboard-realBalanceChart',
    
    requires: [

    ],
    
    border: false,
    frame: false,
    layout: 'vbox',
    layoutConfig: {
        pack: 'center',
        align: 'center'
    },
           
    config: {},
    chart_store: null,
                    
    initComponent: function()
    {
        var me = this;
        
        me.title = '';

        me.items = 
        [ 
            {
                xtype: 'polar',
                reference: 'chart',
                margin: '20 0 0 0',
                width: '100%',
                height: 400,
                innerPadding: 20,
                store: me.chart_store,
                legend: {
                    docked: 'bottom'
                },
                interactions: ['rotate', 'itemhighlight'],
                series: [{
                    type: 'pie',
                    angleField: 'perc',
                    donut: 25,
                    label: {
                        field: 'coin',
                        display: 'rotate',
//                        //display: 'rotate',// 'outside',
//                        display: 'inside',
//                        calloutLine: {
//                            length: 10,
//                            width: 1
//                        },  
                        fontSize: '8px'
                    },
                    highlight: true,
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) 
                        {
                            var perc = Ext.util.Format.number(record.get('perc'), '0.00').replace(',', '.');
                            var btcs = Ext.util.Format.number(record.get('btcs'), '0.00000000').replace(',', '.');
                            var usdt = Ext.util.Format.number(record.get('usdt'), '0.00').replace(',', '.');
                            tooltip.setHtml(record.get('coin') + ': ' + perc + '% ( ' + btcs + ' BTC = ' + usdt + ' USDT )');
                        }                        
                    }
                }]        
            }
        ];
        
        me.callParent(arguments); 
    },

    getDashboardController: function()
    {
        var controller = App.app.getController('App.modules.cryptos.UI.controller.dashboard');
        return controller;
    }

});
