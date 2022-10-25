/*
 * Couchdb view
 */

function(doc) {
    if (doc.type == '[MODULE_NAME]_user_group') {
        emit(doc.code, doc);
    }
}