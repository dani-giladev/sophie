function(doc) {
    if (doc.type == 'cryptos_marketcoin') {
        emit(doc.code, doc);
    }
}