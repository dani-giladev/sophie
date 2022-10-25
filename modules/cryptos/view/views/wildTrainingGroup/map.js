function(doc) {
    if (doc.type == 'cryptos_wildtraininggroup') {
        emit(doc.code, doc);
    }
}