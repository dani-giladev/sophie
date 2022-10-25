function(doc) {
    if (doc.type == 'cryptos_transaction') {
        emit([doc.asynchronous, doc.completed], doc);
    }
}