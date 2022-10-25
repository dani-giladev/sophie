function(doc) {
    if (doc.type == 'cryptos_wild_training') {
        emit([doc.user_code, doc.robot_code, doc.finalized], doc);
    }
}