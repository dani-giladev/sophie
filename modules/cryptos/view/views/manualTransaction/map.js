function(doc) {
    if (doc.type == 'cryptos_manualtransaction') {
        emit(doc.code, doc);
    }
}