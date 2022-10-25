<?php

namespace modules\admin\model;

use base\core\model\model;

/**
 *
 * @author Default user
 * 
 */
class uidata extends model
{
    
    public function __construct()
    {
        $this->db = 'common';
        $this->type = 'admin_uidata';
                
        $this->properties = array(
            '_id',
            'code',          
            'description'  
        );
        
        parent::__construct();
    }
}