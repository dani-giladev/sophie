<?php

namespace modules\cryptos\model;

use base\core\model\model;

/**
 *
 * @author Dani Gilabert
 *
 */
class wildTrainingGroup extends model
{

    public function __construct()
    {
        $this->db = 'cryptos';
        $this->type = 'cryptos_wildtraininggroup';

        $this->properties = array(
            '_id',
            
            // Main
            'code',
            'name',
            
            // Properties
            'order',
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