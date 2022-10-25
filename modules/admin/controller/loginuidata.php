<?php

namespace modules\admin\controller;

// Base controllers
use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * Returns main info for Login UI (languages, translations, ...)
 *
 * @author Default user
 */
class loginuidata extends controller
{
    
    public function __construct()
    {
        parent::__construct();
    }
    
    public function getLoginUIData()
    {
        $data =  array(
            'app_name' => $this->config->base->NAME,
            'app_version' => $this->config->base->VERSION,
            'app_languages' => $this->lang->getAppLanguages(),
            'translations' => array('login' => $this->trans->base->UI['login'])
        );
        
        return helpers::resStruct(true, "", $data);
    }
}