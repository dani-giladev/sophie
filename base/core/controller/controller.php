<?php

namespace base\core\controller;

// base
use base\core\controller\helpers;
use base\core\controller\config;
use base\core\controller\cache;
use base\core\controller\lang;
use base\core\controller\trans;
use base\core\controller\token;

/**
 * Generic controller class
 *
 * @author Default user
 */
class controller
{
    public $module;
    public $config;
    public $lang;
    public $trans;
    public $cache;
    public $model;
    public $token;
    
    public function __construct()
    {
        require_once 'HTTP/Request2.php';
        
        $caller_class_struct = helpers::getClassStruct(\get_called_class());
        
        // Getting child module from caller
        $this->module = $caller_class_struct->module;
        
        // Initilize configuration system
        $this->config = new config($this->module);

        // Initialize translations system
        $this->token = new token();
        $lang = $this->token->getLang();
        $this->lang = new lang($this->module, $lang);
        $this->trans = new trans($this->module, $this->lang->getLang());
        
        // Initialize cache system
        $this->cache = new cache();

        // Initialize main model
        $model_class = "modules\\".$this->module."\\model\\".$caller_class_struct->classname;

        // (Xavi 2018-04-10) Crappy fix for:
        // Dani 2018-04-06. Disabled because of: modules\pos\posapp\controller\user
        if (\strpos($caller_class_struct->classpath, "posapp") !== false)
        {
            $model_class = \str_replace(array("controller"), array("model"), $caller_class_struct->class);
        }

        if (\class_exists($model_class))
        {
            $this->model = new $model_class();
            $this->model->name = $caller_class_struct->classname;
            $this->model->classpath = $caller_class_struct->classpath;
            $this->model->module = $this->module;
            $this->model->config = $this->config;
            $this->model->setDesignDocName($this->config->base->NAME."-".$this->module);
            
            // TODO Generate doctrine document manager
            // we have to install doctrine/orm
           /* $doctrine_documents_path = "modules\\".$this->module."\\documents\\".$caller_class_struct->classname;
            $proxies_dir = realpath(__DIR__ . "/../../../res/proxies");
            $config = new \Doctrine\ODM\CouchDB\Configuration();
            $metadataDriver = $config->newDefaultAnnotationDriver(array($doctrine_documents_path));
            $config->setProxyDir($proxies_dir);
            $config->setMetadataDriverImpl($metadataDriver);
            //$config->setLuceneHandlerName('_fti');
            $dm = new \Doctrine\ODM\CouchDB\DocumentManager($this->model, $config); 
            $this->model->dm = $dm; */
        }
    }
    
    public function get($id, $normalize = true)
    {
        if($normalize)
        {
            $id = $this->normalizeId($id);
        }

        return $this->model->get($id);
    }
    
    public function delete($id)
    {
        $id = $this->normalizeId($id);
        return $this->model->delete($id);
    }
    
    public function normalizeCode($code)
    {
        if (empty(trim($code))) return "";
        $search = array("%", " ", "__", "Ñ", "ñ", ' ', ',');
        $replace = array("_", "_", "_", "N", "n", '', '');    
        return str_replace($search, $replace, $code);
    }
    
    public function normalizeId($id)
    {
        if (empty(trim($id))) return "";
        $search = array("%", " ", "__", "Ñ", "ñ");
        $replace = array("_", "_", "_", "N", "n");
        $ret = str_replace($search, $replace, $id);
        $ret = helpers::normalizeSpecialChars($ret);
        return strtolower($ret);
    }
    
    public function getValues($values, $model = null)
    {
        if (is_null($model))
        {
            return $values;
        }
        
        $ret = array();
        foreach ($values as $key => $value)
        {
            if (in_array($key, $model))
            {
                $ret[$key] = $value;
            }
        }
        
        return $ret;
    }
    
    public function getRecords($params)
    {
        if (!isset($params['ids']))
        {
            return helpers::resStruct(true);
        }
        
        $ids = json_decode($params['ids']);
        
        $data = array();
        foreach ($ids as $id) {
            $id = $this->normalizeId($id);
            $doc = $this->get($id)['data'];
            if (empty($doc))
            {
                continue;
            }
            
            $this->_manipulateProperties($doc);
            
            $data[] = $doc;
            
        }
        
        return helpers::resStruct(true, "", $data);
    }
    
    protected function _manipulateProperties(&$doc) {
        
    }

    public function getJustAvailable($data, $jAvail = true, $justCodeAndName = false)
    {
        $res = array();
        $n_item = array();

        foreach($data['data'] as $key => $item)
        {
            $available = ($item['available'] == "1" || $item['available']) ? true : false;

            if( ($jAvail && $available) || !$jAvail)
            {
                if($justCodeAndName && isset($item['code']))
                {
                    $n_item['code'] = $item['code'];
                    $first_name = (isset($item['first_name'])) ? $item['first_name'] : "";
                    $last_name =  (isset($item['last_name'])) ? $item['last_name'] : "";
                    $n_item['name'] = \trim($first_name." ".$last_name);
                }
                else
                {
                    $n_item = $item;
                    $n_item['available'] = $available;
                }

                $res[] = $n_item;
            }
        }

        if(isset($res['name']))
        {
            $res = helpers::sortArrayByField($res, "name");
        }

        return $res;
    }
    
    public function isDebug()
    {
        $debug = false;
        if (isset($_SERVER['QUERY_STRING']))
        {
            $debug = (strpos($_SERVER['QUERY_STRING'], "XDEBUG_SESSION_START=netbeans-xdebug") !== false);    
        }
        return $debug;        
    }
}