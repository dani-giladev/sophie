function(doc) {
    if (doc.type == 'cryptos_sample00h') {
        emit([doc.candlestick_interval, doc.sample_date], doc);
    }
}