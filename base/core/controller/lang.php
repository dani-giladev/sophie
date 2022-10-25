<?php

namespace base\core\controller;

use base\core\controller\config;
use base\core\controller\cache;

/**
 * This class manages the starting language for whole app
 *
 * @author Default user
 */
class lang
{
    private $_config;
    private $_cache;
    private $_lang_code;
    
    public function __construct($module, $lang_code = null)
    {
        $this->_config = new config($module);
        $this->_cache = new cache();
        $this->_lang_code = $lang_code;
    }
    
    public function getLangCode()
    {
        return $this->_lang_code;
    }
    
    // Return Array
    private function _setLang($language_code = "es")
    {
        if(!is_null($language_code) && $this->isLanguageSupported($language_code))
        {
            $lang = $this->getLanguageStruct($language_code);
            return $lang;
        }
        
        return false;
    }
    
    // Return Array
    public function getLang($forced_lang = null)
    {
        if (!is_null($forced_lang) && $this->isLanguageSupported($forced_lang))
        {
            return $this->_setLang($forced_lang);
        }
        elseif(!is_null($this->_lang_code) && $this->isLanguageSupported($this->_lang_code))
        {
            return $this->_setLang($this->_lang_code);
        }
        elseif($this->isLanguageSupported($this->getBrowserLanguage()))
        {
            return $this->_setLang($this->getBrowserLanguage());
        }
        else
        {
            return $this->_setLang($this->getDefaultSupportedLanguage()['code']);
        }
    }
    
    // Return Array
    public function getBrowserLanguage()
    {
        if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
        {
            $browser_langs = explode(',', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
            $main_browser_lang = explode('-', $browser_langs[0]);
            $browser_lang = strtolower($main_browser_lang[0]);
        }
        else
        {
            $browser_lang = array();
        }
        
        return $browser_lang;
    }
    
    // Return Array
    public function getAppLanguages()
    {
        $langs = $this->_config->base->LANGUAGES;
        
        return $langs;
    }
    
    // Return boolean
    public function isLanguageSupported($lang)
    {
        $app_langs = $this->getAppLanguages();
        
        foreach($app_langs as $key => $s_langs)
        {
            if($s_langs['code'] == $lang)
            {
                return true;
            }
        }
        
        return false;
    }
    
    // Return Array
    public function getDefaultSupportedLanguage()
    {
        $app_langs = $this->getAppLanguages();
        
        foreach($app_langs as $key => $s_langs)
        {
            if(isset($s_langs['default']) && $s_langs['default'])
            {
                return $s_langs;
            }
        }
    }
    
    // Return Array
    public function getLanguageStruct($lang)
    {
        $app_langs = $this->getAppLanguages();
        
        foreach($app_langs as $key => $s_langs)
        {
            if($s_langs['code'] == $lang)
            {
                return $s_langs;
            }
        }
    }
    
}
