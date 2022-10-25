function(doc) {
    if (doc.type == 'cryptos_wild_training') {
        emit([doc.creation_date], doc);
    }
}