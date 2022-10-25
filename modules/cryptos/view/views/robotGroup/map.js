function(doc) {
    if (doc.type == 'cryptos_robotgroup') {
        emit(doc.code, doc);
    }
}