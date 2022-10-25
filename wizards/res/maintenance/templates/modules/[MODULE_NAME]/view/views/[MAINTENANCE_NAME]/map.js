function(doc) {
    if (doc.type == '[MODULE_NAME]_[MAINTENANCE_NAME_lowercase]') {
        emit(doc.code, doc);
    }
}