function(doc) {
    if (doc.type == 'cryptos_transaction') {
        emit([doc.user_code, doc.asynchronous, doc.completed], doc);
    }
}