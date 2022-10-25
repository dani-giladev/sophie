<?php

namespace modules\[MODULE_NAME]\model;

use modules\admin\model\userGroup as adminUserGroup;

/**
 *
 * @author [AUTHOR]
 * 
 */
class userGroup extends adminUserGroup
{
    
    public $special_grants = array(

    );
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = '[MODULE_NAME]_user_group';
        
        parent::__construct();
    }
}