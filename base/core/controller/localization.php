<?php

namespace base\core\controller;

// Controllers
//use base\core\controller\helpers;

/**
 * Localization
 *
 * @author Dani Gilabert
 * 
 */
class localization
{
    public static function getCountryName($code, $lang = 'es')
    {
        if (!isset($code) || empty($code)) return '';
        
        $countries = self::getWorldCountries($lang);
        
        return (isset($countries[$code]))? $countries[$code] : '';
    }
    
    public static function getWorldCountries($lang = 'es')
    {
        $countries_list_path = __DIR__."/../../res/localization/countries/".$lang.'.php';
        require($countries_list_path);
        
        switch($lang)
        {
            case 'ca':
            case 'es':
                // Change Netherlands (Países bajos) by Holland
                $countries_list['NL'] = 'Holanda';
                break;
            case 'de':
                // Change Netherlands (Niederlande) by Holland
                $countries_list['NL'] = 'Holland';
                break;
            case 'fr':
                // Change Netherlands (Pays-Bas) by Holland
                $countries_list['NL'] = 'Hollande';
                break;
            case 'ru':
                // Change Netherlands (Нидерланды) by Holland
                $countries_list['NL'] = 'Голландия';
                break;                
            default:
                // Change Netherlands by Holland
                $countries_list['NL'] = 'Holland';
                break;                
        }             

        asort($countries_list);
        return $countries_list;
    }
    
    public static function getProvinces($country)
    {
        if (!isset($country) || 
            empty($country) || 
            $country != 'ES') return array();
        
        $provinces_list_path = __DIR__."/../../res/localization/provinces/".$country.'.php';        
        require($provinces_list_path);
        
        asort($provinces_list);
        return $provinces_list;
    }  
    
    public static function getProvinceName($code, $country = 'ES')
    {
        if (!isset($code) || empty($code)) return '';
        
        $provinces = self::getProvinces($country);
        
        return (isset($provinces[$code]))? $provinces[$code] : '';
    }
    
}
