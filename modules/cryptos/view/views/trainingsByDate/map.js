function(doc) {
    if (doc.type == 'cryptos_training') {
        emit([doc.creation_date], doc);
    }
}