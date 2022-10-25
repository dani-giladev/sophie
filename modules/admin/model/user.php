<?php

namespace modules\admin\model;

use base\core\model\model;

/**
 *
 * @author Default user
 * @author Default user
 * 
 */
class user extends model
{
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = 'app_user';
                
        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'login',
            'pass',
            'name',
            
            // Properties
            'active',
            'email',
            'phone',
            'telegram_user',

            // Grants
            'granted_plugins',
            'admin_grants',
            'cryptos_grants', // Array
// [WIZARD_MODULE_TAG]
            
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