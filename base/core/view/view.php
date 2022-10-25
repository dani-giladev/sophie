<?php

namespace base\core\view;

use base\core\model\model;

// Doctrine
use \Doctrine\CouchDB\View\Query;
use \Doctrine\CouchDB\HTTP\HTTPException;
use \Doctrine\CouchDB\HTTP\Response;
use Doctrine\CouchDB\View\FolderDesignDocument;

/**
 * Extends doctrine view query class
 *
 * @author Default user
 */
class view extends Query 
{
    private $_views_initialized = false;
    
    private $_model = null;
    
    public function __construct(model $model)
    {
        $this->_model = $model;
        
        parent::__construct(
            $model->doctrine_http_client,
            $model->dbname,
            $model->design_doc_name,
            $model->view_name
       );
    }
    
    public function exec()
    {
        $final_res = array();
        
        try
        {
            $res = parent::execute(); //->toArray();
        }
        catch (HTTPException $ex)
        {
            if(!$this->_views_initialized)
            {
                $this->initViews();
                return $this->exec();
            }
            else
            {
                $response = new Response($ex->getCode(), array(), $ex->getMessage());
                throw HTTPException::fromResponse(__CLASS__, $response);
            }
        }
        
        foreach($res->toArray() as $key => $data)
        {
            unset($data['value']['revisions']);
            unset($data['value']['_attachments']);
            unset($data['value']['_rev']);      
            unset($data['value']['_deleted_conflicts']);    
            $final_res[] = $data['value'];
        }
        
        $res_struct = array(
            "success"   => true,
            "msg"       => "",
            "data"      => $final_res
        );
        
        return $res_struct;
    }
    
    public function initViews()
    {
        $views_dir = realpath(__DIR__."/../../../modules/".$this->_model->module);
        
        // Dani 2018-04-23.
        if (\strpos($this->_model->classpath, "posapp") !== false)
        {
            $views_dir .= "/posapp";
        }     
        
        $views_dir .= '/view';
        
        $dir_empty = (count(glob("$views_dir/views/*")) === 0) ? true : false;
        if(!$dir_empty && !is_null($this->_model))
        {
            $views = new FolderDesignDocument($views_dir);
            $views->getData();
            $design_doc_name = $this->_model->config->base->NAME."-".$this->_model->module;
            $this->_model->setDesignDocName($this->_model->design_doc_name);
            $this->_model->createDesignDocument($design_doc_name, $views);
        }
        
        $this->_views_initialized = true;
    }
}
