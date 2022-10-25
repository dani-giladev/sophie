function(doc) {
    if (doc.type == 'cryptos_robot') {
        emit(doc.code, doc);
    }
}