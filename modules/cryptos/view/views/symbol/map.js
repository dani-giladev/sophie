function(doc) {
    if (doc.type == 'cryptos_symbol') {
        emit(doc.code, doc);
    }
}