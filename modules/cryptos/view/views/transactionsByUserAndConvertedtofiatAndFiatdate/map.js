function(doc) {
    if (doc.type == 'cryptos_transaction' && doc.operation === 'sell') {
        emit([doc.user_code, doc.converted_to_fiat, doc.fiat_date_time], doc);
    }
}