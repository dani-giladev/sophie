<?php

namespace base\core\model;

use \Doctrine\CouchDB\CouchDBClient;
use base\core\controller\init;
use base\core\controller\helpers;
use base\core\view\view;

/**
 * Doctrine couchdb class. Overrides some methods of doctrine
 *
 * @author Default user
 * @author Dani Gilabert
 * 
 */

class doctrineCouchDB extends CouchDBClient
{
    public $db;
    public $dbname;
    public $database;
    public $config;
    public $module;
    public $doctrine_http_client;
    public $design_doc_name;
    public $view_name;
    
    /**
     * Create connection with database
     *
     * @return void
     */
    public function __construct()
    {
        if(is_null($this->db))
        {
            return false;
        }

        $init_controller = new init();
        $this->database = $init_controller->getDatabase($this->db);
        
        $host = $this->database['host'];
        $port = $this->database['port'];
        $user = $this->database['user'];
        $password = $this->database['password'];
        $this->dbname = (isset($this->dbname))? $this->dbname : $this->database['dbname'];
        $ssl = $this->database['ssl'];
                
        $this->doctrine_http_client = new \Doctrine\CouchDB\HTTP\SocketClient(
            $host,
            $port,
            $user,
            $password,
            $host, // IP
            $ssl,
            null, // Path
            10 // Timeout
        );
        
        parent::__construct($this->doctrine_http_client, $this->dbname);
    }
    
    /**
     * Find a document by ID and return the HTTP response.
     *
     * @param string $id
     * @return HTTP\Response
     */
    public function findDocument($id)
    {
        $res = parent::findDocument($id);
        
        $success = ($res->status != 404);
        if ($success)
        {
            unset($res->body['revisions']);
            $doc = $res->body;
        }
        else
        {
            $doc = array(); // return empty array (important)
        }
                
        return helpers::resStruct($success, "", $doc);
    } 
    
    /**
     * Execute a PUT request against CouchDB inserting or updating a document.
     *
     * @param array $data
     * @param string $id
     * @param string|null $rev
     * @return array<id, rev>
     * @throws HTTPException
     */
    public function putDocument($data, $id, $rev = null)
    {
        $data['type'] = $this->type;
        $result = parent::putDocument($data, $id, $rev);
        return helpers::resStruct(true, "", $result);
    }
    
    /**
     * Delete a document.
     *
     * @param  string $id
     * @param  string $rev
     * @return void
     * @throws HTTPException
     */
    public function deleteDocument($id, $rev)
    {
        $raw_doc = $this->findDocument($id);
        if($raw_doc['success'] == false)
        {
            return $raw_doc;
        }
        $doc = $raw_doc['data'];
        
        $path = '/' . $this->databaseName . '/' . urlencode($id). '?rev=' . $doc['_rev'];
        $response = $this->doctrine_http_client->request('DELETE', $path);

        if ($response->status != 200)
        {
            throw HTTPException::fromResponse($path, $response);
        }
        
        $result = array($response->status);
        
        return helpers::resStruct(($response->status != 404), "", $result);
    }
    
    public function setDesignDocName($design_doc_name)
    {
        $this->design_doc_name = $design_doc_name;
    }
    
    public function getDesignDocName()
    {
        return $this->design_doc_name;
    }
    
    public function getView($view_name, $raw_design_doc_name = null)
    {
        $this->view_name = $view_name;
        $this->design_doc_name = (!is_null($raw_design_doc_name)) ? $raw_design_doc_name : $this->getDesignDocName();
        
        $view = new view($this);

        return $view;
    }
    
    public function getAllDocs()
    {
        $res = $this->allDocs();
        
        return helpers::resStruct(($res->status != 404), "", $res->body['rows']);
    }

    public function existDatabase($name)
    {
        $response = $this->doctrine_http_client->request('GET', '/' . urlencode($name));
        return ($response->status == 200);
    }

    public function createDatabase($name)
    {
        $response = $this->doctrine_http_client->request('PUT', '/' . urlencode($name));
        return (isset($response->body['ok']) && $response->body['ok']);
    }

    public function deleteDatabase($name)
    {
        $response = $this->doctrine_http_client->request('DELETE', '/' . urlencode($name));
        return (isset($response->body['ok']) && $response->body['ok']);
    }
}
