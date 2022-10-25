function(doc) {
    if (doc.type == 'cryptos_pump') {
        emit([doc.created_by_user, doc.completed], doc);
    }
}