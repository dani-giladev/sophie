Ext.define('App.modules.cryptos.UI.model.trading.secondchart', {
    extend: 'Ext.data.Model',

    requires: [

    ],

    fields: [

        {name: 'date_time'},
        
        // MACD
        {name: 'macd'},
        {name: 'macd_signal'},
        {name: 'macdh'},
        
        // RSI
        {name: 'rsi'},
        {name: 'rsi_oversold'},
        {name: 'rsi_overbought'},
        {name: 'rsi_signal'}
                    
    ]
});