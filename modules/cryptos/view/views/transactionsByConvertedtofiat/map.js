function(doc) {
    if (doc.type == 'cryptos_transaction' && doc.operation === 'sell') {
        emit([doc.converted_to_fiat], doc);
    }
}