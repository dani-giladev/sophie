function(doc) {
    if (doc.type == 'cryptos_historyrobotchanges') {
        emit([doc.date], doc);
    }
}