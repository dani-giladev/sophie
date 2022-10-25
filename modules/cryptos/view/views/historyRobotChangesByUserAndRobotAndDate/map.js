function(doc) {
    if (doc.type == 'cryptos_historyrobotchanges') {
        emit([doc.created_by_user, doc.code, doc.date], doc);
    }
}