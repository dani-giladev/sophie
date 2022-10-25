/* 
 * Couchdb view
 */

function(doc) {
    if (doc.type == 'admin_user_group') {
        emit(doc.code, doc);
    }
}