<?php

namespace modules\admin\model;

use base\core\model\model;

/**
 *
 * @author Default user
 * 
 */
class userGroup extends model
{
    public $db = 'common';
    public $type = 'admin_user_group';
    public $properties = array(
        '_id',

        // Main
        'code',
        'name',

        // Properties
        'available',

        // Grants
        'grants_by_menu',
        'grants_summary',

        // Creation
        'created_by_user',
        'created_by_user_name',
        'creation_date', 

        // Last modification
        'modified_by_user',
        'modified_by_user_name',
        'last_modification_date'        
    );
    
    public $special_grants = array();
    
    public function __construct()
    {
        // Add special grants
        $this->properties = array_merge($this->properties, $this->special_grants);
        
        parent::__construct();
    }
}