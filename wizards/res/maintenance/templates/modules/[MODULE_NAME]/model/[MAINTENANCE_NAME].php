<?php

namespace modules\[MODULE_NAME]\model;

use base\core\model\model;

/**
 *
 * @author [AUTHOR]
 *
 */
class [MAINTENANCE_NAME] extends model
{

    public function __construct()
    {
        $this->db = '[MODULE_NAME]';
        $this->type = '[MODULE_NAME]_[MAINTENANCE_NAME_lowercase]';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'name',
            
            // Properties
            'available',
            'notes',
            
            // Creation
            'created_by_user',
            'created_by_user_name',
            'creation_date', 

            // Last modification
            'modified_by_user',
            'modified_by_user_name',
            'last_modification_date'
        );

        parent::__construct();
    }
}