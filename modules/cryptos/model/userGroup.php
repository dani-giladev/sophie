<?php

namespace modules\cryptos\model;

use modules\admin\model\userGroup as adminUserGroup;

/**
 *
 * @author Dani Gilabert
 * 
 */
class userGroup extends adminUserGroup
{
    
    public $special_grants = array(

    );
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = 'cryptos_user_group';
        
        parent::__construct();
    }
}