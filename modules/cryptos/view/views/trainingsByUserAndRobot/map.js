function(doc) {
    if (doc.type == 'cryptos_training') {
        emit([doc.user_code, doc.robot_code], doc);
    }
}