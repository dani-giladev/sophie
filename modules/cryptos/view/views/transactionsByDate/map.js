function(doc) {
    if (doc.type == 'cryptos_transaction') {
        emit([doc.date_time], doc);
    }
}