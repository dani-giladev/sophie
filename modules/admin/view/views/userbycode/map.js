/* 
 * Couchdb view. Return user filtered by login
 */

function(doc) {
    if (doc.type == 'app_user') {
        emit(doc.code, doc);
    }
}