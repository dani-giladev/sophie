Ext.define('App.modules.cryptos.UI.model.reportTraining', {
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
                renderer: function(value, meta, record) {
                    return value + '<br>' + 
                        '<i>' + record.get('robot_code') + '</i>' + '<br>' + 
                        record.get('candlestick_interval') + "m";
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
            },
            gridcolumn: {
                align: 'center',
                width: 100
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
        
        {name: 'total_profit_usdt',
            label: 'Total profit',
            gridcolumn: {
                renderer: function(value) {
                    return '<b>' + Ext.util.Format.round(value, 2).toFixed(2) + "</b> USDT";
                },
                align: 'center',
                width: 150
            }
        },
        {name: 'transactions',
            label: 'Transactions',
            gridcolumn: {
                align: 'center',
                width: 120
            }
        },
        {name: 'trades'},
        {name: 'hits',
            label: 'Hits',
            gridcolumn: {
                renderer: function(value, meta, record)
                {
                    return '<b>' + value + "/" + record.get('trades') + "</b>" + 
                            " (" + Ext.util.Format.round(record.get('hits_perc'), 2).toFixed(2) + ' %)';
                },
                align: 'center',
                width: 150
            }
        },
        {name: 'hits_perc'},
        {name: 'total_profit_perc',
            label: '% Profit',
            gridcolumn: {
                renderer: function(value) {
                    if (!value)
                    {
                        return "";
                    }
                    return Ext.util.Format.round(value, 2).toFixed(2) + ' %';
                },
                align: 'center',
                width: 120
            }
        },
        {name: 'total_time',
            label: 'Total time',
            gridcolumn: {
                renderer: function(value) {
                    return Ext.util.Format.round(value, 2).toFixed(2) + ' seconds';
                },
                align: 'center',
                width: 200
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