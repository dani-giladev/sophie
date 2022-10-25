<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * Config controller
 *
 * @author Default user
 * 
 */
class config extends controller 
{
    
    public function getParams($params)
    {
        $module = isset($params['module']) ? $params['module'] : null;
        
        $view = $this->model->getView("config");
        $raw_data = $view->exec()['data'];

        $data = array();
        if (!empty($raw_data))     
        {
            foreach($raw_data as $item)
            {
                if ($item['module'] !== $module)
                {
                    continue;
                }

                foreach ($item['values'] as $code => $values)
                {
                    $id = $item['module'].'|'.$code;
                    
                    $default_value = $values['default_value'];
                    if (is_array($default_value))
                    {
                        $default_value = var_export($default_value, true);
                    }
                    
                    $value = $values['value'];
                    if (is_array($value))
                    {
                        $value = var_export($value, true);
                    }
                            
                    $data[] = array(
                        '_id' => $id,
                        
                        'module' => $item['module'],
                        
                        'code' => $code,
                        'name' => $values['desc'],
                        'default_value' => $default_value,
                        'value' => $value
                    );
                }
            }
        }
            
        return helpers::resStruct(true, "", $data);
    }
    
    public function save($params)
    {
        $id = (isset($params['id']))? $params['id'] : "";
        $pieces = explode('|', $id);
        $module = $pieces[0];
        $code = $pieces[1];
        $name = (isset($params['name']))? $params['name'] : null;
//        $default_value = (isset($params['default_value']))? $params['default_value'] : "";
        $value = (isset($params['value']))? $params['value'] : "";
        
        $config = $this->config->getConfig($module);
        if (!isset($config))
        {
            return helpers::resStruct(false, "El fichero de configuración no existe");
        }

        // Update parameter
        if (strtolower($value) == 'true' || strtolower($value) == 'false')
        {
            $value = (strtolower($value) == 'true');
        }
        elseif (strpos(strtolower($value), 'array') !== false)
        {
            eval('$value='.$value.';');
        }
        
        $config['values'][$code]['value'] = $value;
        if (!is_null($name))
        {
            $config['values'][$code]['desc'] = $name;
        }
        
        // Update params
        $this->config->saveConfig($module, $config['values'], $name);
        
        return helpers::resStruct(true, "");
    }
    
    public function delete($id)
    {
        $pieces = explode('|', $id);
        $module = $pieces[0];
        $code = $pieces[1];
        
        $config = $this->config->getConfig($module);
        if (!isset($config))
        {
            return helpers::resStruct(false, "El fichero de configuración no existe");
        }

        // Delete parameter
        unset($config['values'][$code]);
        
        // Update params
        $this->config->saveConfig($module, $config['values']);
        
        return helpers::resStruct(true, "");
    }
}
