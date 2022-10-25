function(doc) {
    if (doc.type == 'cryptos_pump') {
        emit(doc.code, doc);
    }
}