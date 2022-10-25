/* 
 * Couchdb view
 */

function(doc) {
    if (doc.type == 'config') {
        emit(doc.module, doc);
    }
}