function(doc) {
    if (doc.type == 'cryptos_transaction') {
        emit([doc.user_code, doc.robot_code, doc.operation, doc.asynchronous], doc);
    }
}