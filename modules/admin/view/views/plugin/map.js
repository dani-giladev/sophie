/* 
 * Couchdb view
 */

function(doc) {
    if (doc.type == 'app_plugin') {
        emit(doc.code, doc);
    }
}