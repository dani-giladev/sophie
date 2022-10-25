Ext.define('App.modules.cryptos.UI.controller.dashboard', {
    extend: 'App.controller.dashboard.dashboard',

    requires: [
        'App.controller.dashboard.dashboard'
    ],
    
    refresh: function(config)
    {
        var me = this;
        //var container = Ext.getBody();
        var container = Ext.ComponentQuery.query('[xtype=cryptos-dashboard]')[0];
                
        container.mask(config.trans.dashboard.loading_dashboard);
        
        var floating_showfree_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-floatingChart-floating_showfree')[0];
        var floating_showfree = floating_showfree_checkbox? floating_showfree_checkbox.getValue() : '';        
        
        var change_time_chart_btc_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-changeTimeChart-btc')[0];
        var change_time_chart_btc = change_time_chart_btc_checkbox? change_time_chart_btc_checkbox.getValue() : '';
        var change_time_chart_alts_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-changeTimeChart-alts')[0];
        var change_time_chart_alts = change_time_chart_alts_checkbox? change_time_chart_alts_checkbox.getValue() : '';
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/dashboard/getDashboard',
            params:
            {
                floating_showfree: floating_showfree,
                change_time_chart_btc: change_time_chart_btc,
                change_time_chart_alts: change_time_chart_alts
            },
            success: function(result, request)
            {
                container.unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    // Warning!!
                    me.msgBox('Oupps!', obj.msg);
                    return;
                }
                
                //console.log(obj.data);
                
                me.updateLastRefreshPanel();
                
                /*
                 * TODAY'S PROFITS
                 */ 
                me.updateTodaysProfitsPanel(config, obj.data); 
                
                /*
                 * REAL BALANCE
                 */
                me.updateRealBalancePanel(config, obj.data);   
                
                /*
                 * FLOATING
                 */
                me.updateFloatingPanel(config, obj.data);
                
                /*
                 * CHANGE TIME VALUES
                 */
                me.updateChangeTimePanel(config, obj.data);
            }
        });  
    },
    
    updateLastRefreshPanel: function()
    {
        var panel = Ext.ComponentQuery.query('#cryptos-dashboard-last_refresh')[0];
        panel.update('Last refresh at <b>' + Ext.Date.format(new Date(), "d/m/Y H:i:s") + '</b>');       
    },
    
    updateTodaysProfitsPanel: function(config, data)
    {
        var panel, field;
        var sum_total_profit_usdt = Ext.util.Format.number((data.sum_total_profit_usdt).toString(), '0.00').replace(',', '.') + ' USDT';

        panel = Ext.ComponentQuery.query('#cryptos-dashboard-today_profits')[0];
        panel.setTitle("Today's profits: " + sum_total_profit_usdt);   

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_profit_usdt')[0];
        field.update(Ext.util.Format.number((data.sum_profit_usdt).toString(), '0.00').replace(',', '.') + ' USDT');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_commission_usdt')[0];
        field.update(Ext.util.Format.number((data.sum_total_commission_usdt).toString(), '0.00').replace(',', '.') + ' USDT');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_profit_usdt')[0];
        field.update(sum_total_profit_usdt);

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_profit_perc')[0];
        field.update(Ext.util.Format.number((data.sum_total_profit_perc).toString(), '0.00').replace(',', '.') + ' %');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_profit_usdt_now')[0];
        field.update(Ext.util.Format.number((data.sum_total_profit_usdt_now).toString(), '0.00').replace(',', '.') + ' USDT');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_market_profit_btc')[0];
        field.update(Ext.util.Format.number((data.sum_total_market_profit_btc).toString(), '0.00000000').replace(',', '.') + ' BTC');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_market_profit_eth')[0];
        field.update(Ext.util.Format.number((data.sum_total_market_profit_eth).toString(), '0.00000000').replace(',', '.') + ' ETH');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_market_profit_bnb')[0];
        field.update(Ext.util.Format.number((data.sum_total_market_profit_bnb).toString(), '0.00000000').replace(',', '.') + ' BNB');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_market_profit_xrp')[0];
        field.update(Ext.util.Format.number((data.sum_total_market_profit_xrp).toString(), '0.00000000').replace(',', '.') + ' XRP');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_total_market_profit_usdt')[0];
        field.update(Ext.util.Format.number((data.sum_total_market_profit_usdt).toString(), '0.00000000').replace(',', '.') + ' USDT');

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_buyings')[0];
        field.update((data.sum_buyings).toString());

        field = Ext.ComponentQuery.query('#cryptos-dashboard-sum_trades')[0];
        field.update((data.sum_trades).toString());        
    },
    
    updateRealBalancePanel: function(config, data)
    {
        var panel = Ext.ComponentQuery.query('#cryptos-dashboard-realBalance')[0];
        panel.removeAll();
        panel.setTitle('Real balance: ' + data.real_balance_total_btc + ' BTC / ' + data.real_balance_total_usdt + ' USDT');  
        panel.add({
            html: '<div style="padding-top:5px; padding-left:5px;"><b>' + data.real_balance_numer_of_coins + '</b> coins</div>'
        });
        panel.add(Ext.widget('cryptos-dashboard-realBalanceChart', {
            config: config,
            margin: 0,
            chart_store: Ext.create('Ext.data.Store', {
                fields: ['coin', 'perc', 'btcs', 'usdt'],
                data: data.real_balance_chart,
                sorters: [{
                    property: 'btcs',
                    direction: 'DESC'
                }]
            })
        }));        
    },
    
    updateFloatingPanel: function(config, data)
    {              
        var panel = Ext.ComponentQuery.query('#cryptos-dashboard-floating')[0];
        panel.removeAll();
        panel.setTitle('Floating: ' + data.floating_total_btc + ' BTC / ' + data.floating_total_usdt + ' USDT');  
        panel.add(Ext.widget('cryptos-dashboard-floatingChart', {
            config: config,
            margin: 0,
            chart_store: Ext.create('Ext.data.Store', {
                fields: ['coin', 'market_coin', 'btcs', 'market_coin_order'],
                data: data.floating_chart
            }),
            floating_showfree: data.floating_showfree
        }));
    },
    
    updateChangeTimePanel: function(config, data)
    {               
        var panel = Ext.ComponentQuery.query('#cryptos-dashboard-changeTime')[0];
        panel.removeAll();
        panel.setTitle('Change time 24h. Now: ' + data.change_time_now + ' %');
        
        panel.add({
            xtype: 'tabpanel',
            activeTab: 0,
            items:
            [
                Ext.widget('cryptos-dashboard-changeTimeChart', {
                    config: config,
                    margin: 0,
                    chart_store: Ext.create('Ext.data.Store', {
                        fields: [
                            'date', 
                            'diff_to_previous_value', 'diff_to_previous_value_zero', 
                            'accumulated_value', 'accumulated_value_zero'
                        ],
                        data: data.change_time_chart
                    }),
                    change_time_chart_btc: data.change_time_chart_btc,
                    change_time_chart_alts: data.change_time_chart_alts
                }),
                Ext.widget('cryptos-dashboard-changeTimeByMarketcoinChart', {
                    config: config,
                    margin: 0,
                    chart_store: Ext.create('Ext.data.Store', {
                        fields: [
                            'date', 
                            'accumulated_value_btc', 
                            'accumulated_value_eth', 
                            'accumulated_value_bnb', 
                            'accumulated_value_xrp', 
                            'accumulated_value_usdt', 
                            'accumulated_value_zero'
                        ],
                        data: data.change_time_by_marketcoin_chart
                    })
                })
            ]            
        });
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
    },
    
    refreshFloatingPanel: function(config)
    {
        var me = this;
        //var container = Ext.getBody();
        var container = Ext.ComponentQuery.query('[xtype=cryptos-dashboard]')[0];
        
        container.mask(config.trans.dashboard.loading_dashboard);
        
        var floating_showfree_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-floatingChart-floating_showfree')[0];
        var floating_showfree = floating_showfree_checkbox? floating_showfree_checkbox.getValue() : '';
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/dashboard/getFloatingData',
            params:
            {
                floating_showfree: floating_showfree
            },
            success: function(result, request)
            {
                container.unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    // Warning!!
                    me.msgBox('Oupps!', obj.msg);
                    return;
                }
                
                //console.log(obj.data);
                
                me.updateFloatingPanel(config, obj.data);
            }
        });
    },
    
    refreshChangeTimePanel: function(config)
    {
        var me = this;
        //var container = Ext.getBody();
        var container = Ext.ComponentQuery.query('[xtype=cryptos-dashboard]')[0];
        
        container.mask(config.trans.dashboard.loading_dashboard);
        
        var change_time_chart_btc_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-changeTimeChart-btc')[0];
        var change_time_chart_btc = change_time_chart_btc_checkbox? change_time_chart_btc_checkbox.getValue() : '';
        var change_time_chart_alts_checkbox = Ext.ComponentQuery.query('#cryptos-dashboard-changeTimeChart-alts')[0];
        var change_time_chart_alts = change_time_chart_alts_checkbox? change_time_chart_alts_checkbox.getValue() : '';
        
        Ext.Ajax.request({
            type: 'ajax',
            method: 'POST',
            url: restpath + 'cryptos/dashboard/getChangeTimeData',
            params:
            {
                change_time_chart_btc: change_time_chart_btc,
                change_time_chart_alts: change_time_chart_alts
            },
            success: function(result, request)
            {
                container.unmask();
                var obj = Ext.JSON.decode(result.responseText);
                if (!obj.success)
                {
                    // Warning!!
                    me.msgBox('Oupps!', obj.msg);
                    return;
                }
                
                //console.log(obj.data);
                
                me.updateChangeTimePanel(config, obj.data);
            }
        });
    }
    
});
