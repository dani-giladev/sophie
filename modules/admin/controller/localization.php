<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;
use base\core\controller\localization as loc;

/**
 * Localization controller
 *
 * @author Default user
 * 
 */
class localization extends controller 
{
    
    public function getCountries()
    {
        $lang = $this->lang->getLangCode();
        $raw_data = loc::getWorldCountries($lang);
        
        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $key => $value)
            {
                // Add item
                $data[] = array(
                    'code' => $key,
                    'name' => $value
                ); 
            }     
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getProvinces($params)
    {
        $country = isset($params['country']) ? $params['country'] : null;
        
        $raw_data = loc::getProvinces($country);
        
        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $key => $value)
            {
                // Add item
                $data[] = array(
                    'code' => $key,
                    'name' => $value
                ); 
            }     
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getLocations($params)
    {
        $country = isset($params['country']) ? $params['country'] : null;
        $province = isset($params['province']) ? $params['province'] : null;
        $postal_code = (isset($params['postalcode']) && !empty($params['postalcode'])) ? $params['postalcode'] : null;
        
        $raw_data = loc::getLocations($country, $province);
        
        $data = array();
        if (!empty($raw_data))
        {
            foreach($raw_data as $key => $value)
            {
                // Add item
                
                // Old version
                /*$data[] = array(
                    'code' => $key,
                    'name' => $value
                );*/ 
                
                $cp = $value['postal_code'];
                if (!is_null($postal_code) && $postal_code !== $cp)
                {
                    continue;
                }
                $data[] = array(
                    'code' => $cp,
                    'name' => $value['location_name'],
                ); 
            }     
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    public function getLocalizationByPostalcode($params)
    {
        $postal_code = isset($params['postal_code']) ? $params['postal_code'] : null;
        
        $data = array();
        $raw_data = loc::getLocalizationByPostalcode($postal_code);
        if (!empty($raw_data))
        {
            $data['country'] = 'ES';
            $data['province'] = $raw_data['province_code'];
            $data['location'] = $raw_data['postal_code'];  
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
}
