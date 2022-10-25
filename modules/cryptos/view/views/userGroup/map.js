/*
 * Couchdb view
 */

function(doc) {
    if (doc.type == 'cryptos_user_group') {
        emit(doc.code, doc);
    }
}