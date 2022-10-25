function(doc) {
    if (doc.type == 'cryptos_sample') {
        emit([doc.user_code, doc.robot_code, doc.candlestick_interval, doc.sample_date], doc);
    }
}