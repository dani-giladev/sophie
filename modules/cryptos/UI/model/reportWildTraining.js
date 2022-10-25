Ext.define('App.modules.cryptos.UI.model.reportWildTraining', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

        {name: 'creation_date',
            label: 'Date',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var datetime_pieces = value.split(" ");
                    var raw_date = datetime_pieces[0];
                    var time = datetime_pieces[1];
                    var date_pieces = raw_date.split("-");
                    var date = new Date(date_pieces[0]+"/"+date_pieces[1]+"/"+date_pieces[2]);
                    return Ext.Date.format(date, 'Y-m-d') + '</br>' +
                           '<i>' + time + '</i>';
                },
                align: 'center',
                width: 100
            }
        },
        
        {name: 'user_code'},
        {name: 'user_name', 
            label: 'User',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                hidden: true,
                renderer: function(value, meta, record) {
                    return value + '<br>' + 
                        '<i>' + record.get('user_code') + '</i>';
                },
                align: 'left',
                width: 120
            }
        },
        {name: 'robot_code'},
        {name: 'robot_name', 
            label: 'Robot',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                listeners: {
                    render: function(field, eOpts)
                    {
                        field.focus();
                    }
                }
            },
            gridcolumn: {
                renderer: function(value, meta, record)
                {
                    var html = '';
                    
                    html += '<b>' + value + '</b>';
                    html += '<br>';
                    html += '<i>' + record.get('robot_code') + '</i>';
                    html += '<br>';
                    html += record.get('coinpair_name');
                    html += '<br>';
                    html += record.get('candlestick_interval') + "m";
                    
                    var original_robot= record.get('original_robot');
                    if (!Ext.isEmpty(original_robot))
                    {
                        html += '<br>';
                        html += original_robot.wt_group;
                    }
                    
                    return html;
                },
                align: 'left',
                width: 120
            }
        },
        {name: 'candlestick_interval',
            label: 'Candlestick',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }
        },
        {name: 'coinpair'},
        {name: 'coinpair_name',
            label: 'cryptos.common.coin_pair',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            }
        },

        {name: 'finalized',
            label: 'Finalized',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 100            
            }
        },

        {name: 'validated',
            label: 'Validated',
            filtertype: 'boolean',
            panelfilter: {
                xtype: 'combo',
                store: Ext.create('Ext.data.Store', {
                    fields: ['code', 'name'],
                    data : 
                    [
                        {"code": "yes", "name": 'cryptos.common.yes'},
                        {"code": "no", "name": "cryptos.common.no"},
                        {"code": "all", "name": 'cryptos.common.all_male'}
                    ]
                }),
                _has_local_data: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'code'
            },
            gridcolumn: {
                renderer: function(value) {
                    return Ext.String.format("<img src='resources/ico/" + (value? "yes" : "no") + ".png' />");
                },
                align: 'center',
                width: 100            
            }
        },
        {name: 'period',
            label: 'Period',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var days = (value/24);
                    return value + ' hours' + '<br>' + 
                        //Ext.util.Format.round(days, 2).toFixed(2) + ' days' + '<br>' +
                        '<b>' + days + ' days</b>' + '<br>' + 
                        record.get('start_date') + '<br>' + 
                        record.get('end_date') + 
                        '';
                },
                align: 'center',
                width: 180
            }
        },
        {name: 'start_date'/*,
            label: 'Start/End date',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield'
            },
            gridcolumn: {
                renderer: function(value, meta, record) {
                    return value + '<br>' + 
                        record.get('end_date');
                },
                align: 'center',
                width: 180
            }
        */},
        {name: 'end_date'},
        
        /*
         * 
         * Original robot
         * 
         */
        {name: 'original_robot_total_profit_usdt',
            label: 'Original robot',
            gridcolumn: {
                renderer: function(value, meta, record)
                {
                    var html = '';
                    
                    html += 'Training number: 0';
                    html += '<br>'; 
                    html += 'Transactions: ' + record.get('original_robot_transactions');
                    html += '<br>';
                    html += 'Hits: ' + record.get('original_robot_hits') + '/' + record.get('original_robot_trades') + ' (<b>' + Ext.util.Format.round(record.get('original_robot_hits_perc'), 2).toFixed(2) + ' %</b>)';
                    html += '<br>';
                    html += '% Profit: ' + Ext.util.Format.round(record.get('original_robot_total_profit_perc'), 2).toFixed(2) + ' %';
                    html += '<br>';
                    html += 'Total time: ' + Ext.util.Format.round(record.get('original_robot_total_time'), 2).toFixed(2) + ' seconds';
                    html += '<br>';
                    html += 'Total profit: ' + '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "</b> USDT";
                    
                    return html;
                },
                align: 'left',
                width: 200
            }
        },
        {name: 'original_robot_transactions'},
        {name: 'original_robot_trades'},
        {name: 'original_robot_hits'},
        {name: 'original_robot_hits_perc'},
        {name: 'original_robot_total_profit_perc'},
        {name: 'original_robot_total_time'},
        
        /*
         * 
         * The best robot
         * 
         */
        {name: 'total_profit_usdt',
            label: 'The best robot',
            gridcolumn: {
                renderer: function(value, meta, record)
                {
                    var html = '';
                    
                    html += 'Training number: ' + record.get('training_number');
                    html += '<br>';                 
                    html += 'Transactions: ' + record.get('transactions');
                    html += '<br>';
                    html += 'Hits: ' + record.get('hits') + '/' + record.get('trades') + ' (<b>' + Ext.util.Format.round(record.get('hits_perc'), 2).toFixed(2) + ' %</b>)';
                    html += '<br>';
                    html += '% Profit: ' + Ext.util.Format.round(record.get('total_profit_perc'), 2).toFixed(2) + ' %';
                    html += '<br>';
                    html += 'Total time: ' + Ext.util.Format.round(record.get('total_time'), 2).toFixed(2) + ' seconds';
                    html += '<br>';
                    html += 'Total profit: ' + '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "</b> USDT";
                    
                    return html;
                },
                align: 'left',
                width: 200
            }
        },
        {name: 'transactions'},
        {name: 'trades'},
        {name: 'hits'},
        {name: 'hits_perc'},
        {name: 'total_profit_perc'},
        {name: 'total_time'},
        {name: 'training_number'},
        
        /*
         * 
         * The best custom robot
         * 
         */
        {name: 'bcr_total_profit_usdt',
            label: 'The best custom robot',
            gridcolumn: {
                renderer: function(value, meta, record)
                {
                    var html = '';
                    
                    if (Ext.isEmpty(record.get('bcr_training_number')))
                    {
                        return html;
                    }
                    
                    html += 'Training number: ' + record.get('bcr_training_number');
                    html += '<br>'; 
                    html += 'Transactions: ' + record.get('bcr_transactions');
                    html += '<br>';
                    html += 'Hits: ' + record.get('bcr_hits') + '/' + record.get('bcr_trades') + ' (<b>' + Ext.util.Format.round(record.get('bcr_hits_perc'), 2).toFixed(2) + ' %</b>)';
                    html += '<br>';
                    html += '% Profit: ' + Ext.util.Format.round(record.get('bcr_total_profit_perc'), 2).toFixed(2) + ' %';
                    html += '<br>';
                    html += 'Total time: ' + Ext.util.Format.round(record.get('bcr_total_time'), 2).toFixed(2) + ' seconds';
                    html += '<br>';
                    html += 'Total profit: ' + '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "</b> USDT";
                    
                    return html;
                },
                align: 'left',
                width: 200
            }
        },
        {name: 'bcr_transactions'},
        {name: 'bcr_trades'},
        {name: 'bcr_hits'},
        {name: 'bcr_hits_perc'},
        {name: 'bcr_total_profit_perc'},
        {name: 'bcr_total_time'},
        
        // The winner
        {name: 'winner',
            label: 'The winner',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    if (!value)
                    {
                        return "";
                    }
                    
                    var html = "<b>";
                    if (value === 'robot')
                    {
                         html += "Best robot";
                    }
                    else if (value === 'original')
                    {
                         html += "Original robot";
                    }
                    else
                    {
                         html += "Best custom robot";
                    }
                    html += "</b>";
                    
                    return html;
                },
                align: 'center',
                width: 90
            }
        },
        
        {name: 'number_of_trainings',
            label: 'Nº of trainings',
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        {name: 'final_total_time',
            label: 'Total time',
            gridcolumn: {
                renderer: function(value, meta, record) {
                    var html = '';
                    if (!value || value == 0)
                    {
                        return html;
                    }
                    html += '<br>' + Ext.util.Format.round(value, 2).toFixed(2) + ' seconds';
                    return html;
                },
                align: 'center',
                width: 120
            }
        },
        
        {name: 'error_msg',
            label: 'Error',
            gridcolumn: {
                align: 'left',
                width: 200
            }
        },
        /*{name: 'code',
            label: 'Training Code',
            filtertype: 'string',
            panelfilter: {
                xtype: 'textfield',
                maskRe: /[a-zA-Z0-9\-\_]/
            },
            gridcolumn: {
                align: 'left',
                width: 300
            }
        },*/        
        {name: '_id',
            label: 'Training Id',
            gridcolumn: {
                align: 'left',
                width: 300
            }
        }
        
    ]
});