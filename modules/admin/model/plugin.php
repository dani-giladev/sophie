<?php

namespace modules\admin\model;

use base\core\model\model;

/**
 *
 * @author Default user
 * 
 */
class plugin extends model
{
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = 'app_plugin';
        
        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'description',
            
            // Properties
            'available',
            
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