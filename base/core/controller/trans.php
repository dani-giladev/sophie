<?php

namespace base\core\controller;

// use base\core\controller\lang;
use base\core\controller\config;

/**
 * Manage app translations
 *
 * @author Default user
 */
class trans
{
    private $_lang;
    private $_config;
    
    public $base;
    public $mod;
    public $UI;
    
    public function __construct($module, $lang)
    {
        $this->_config = new config($module);
        $this->_lang = $lang;
        $this->_loadBaseTexts();
        $this->_loadModuleServerTexts($module);
        $this->_loadModuleUITexts($module);
    }
    
    private function _loadBaseTexts()
    {
        try
        {
            require(__DIR__."/../../res/lang/server/".$this->_lang['code'].".php");
            $base_labels['server'] = $labels;
            require(__DIR__."/../../res/lang/UI/".$this->_lang['code'].".php");
            $base_labels['UI'] = $labels;
            
            $this->base = (object) $base_labels;
        }
        catch(\Exception $ex)
        {
            echo 'Caught exception loading base texts: ',  $e->getMessage(), "\n";
        }
    }
    
    private function _loadModuleServerTexts($module)
    {
        try
        {
            require(__DIR__."/../../../modules/".$module."/res/lang/server/".$this->_lang['code'].".php");
            
            $this->mod = (object) $labels;
        }
        catch(\Exception $ex)
        {
            echo 'Caught exception loading sophie '.$module.' server texts": ',  $e->getMessage(), "\n";
        }
    }
    
    private function _loadModuleUITexts($module)
    {
        try
        {
            $UI_trans_path = realpath(__DIR__."/../../../modules/".$module."/res/lang/UI/".$this->_lang['code'].".php");
            //var_dump($UI_trans_path);

            require($UI_trans_path);
            
            $this->UI = (object) $labels;
        }
        catch(\Exception $ex)
        {
            echo 'Caught exception loading sophie '.$module.' UI texts": ',  $e->getMessage(), "\n";
        }
    }
}