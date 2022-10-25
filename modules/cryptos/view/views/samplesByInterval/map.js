function(doc) {
    if (doc.type == 'cryptos_sample') {
        emit([doc.candlestick_interval], doc);
    }
}