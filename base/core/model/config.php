<?php

namespace base\core\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 * 
 */
class config extends model
{
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = 'config';
                
        $this->properties = array(
            '_id',
            
            // Main
            'module',
            'values',
            
            // User
            'modified_by_user',
            'modified_by_user_name',
            'last_modification_date'
        );
        
        parent::__construct();
    }
}