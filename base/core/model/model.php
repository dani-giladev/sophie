<?php

namespace base\core\model;

use base\core\model\doctrineCouchDB;

/**
 * Main model class. ORM
 *
 * @author Default user
 * @author Dani Gilabert
 * 
 */

class model extends doctrineCouchDB
{
    public $type;
    public $properties = array();
    
   /*
    * 
    * ORM
    * 
    */   
    
    public function get($id)
    {
        return $this->findDocument($id);
    }
    
    public function delete($id)
    {
        return $this->deleteDocument($id, null);
    }
    
    public function exist($id)
    {
        $res = $this->findDocument($id);
        return ($res['success']);
    }
    
    public function save($id, &$doc)
    {
        $res = $this->putDocument($doc, $id, $rev = null);
        if ($res['success'])
        {
            $doc['_id'] = $id;
        }
        return $res;
    }

    public function setDB($db)
    {
        $this->db = $db;
        $this->dbname = null;
        $this->__construct();
    }

   /*
    * 
    * Other methods
    * 
    */    
    
    public function getCleanData($data)
    {
        $ret = array();
        
        if (!empty($data))
        {
            foreach($data as $item)
            {
                $this->clean($item);
                
                // Add item
                $ret[] = $item; 
            }     
        }
        
        return $ret;
    } 
    
    public function clean(&$doc)
    {
        unset($doc['revisions']);
        unset($doc['_attachments']);
        unset($doc['_rev']);      
        unset($doc['_conflicts']);    
        unset($doc['_deleted_conflicts']);
    }

    public function createDatabase($name)
    {
        return parent::createDatabase($name);
    }

    public function deleteDatabase($name)
    {
        return parent::deleteDatabase($name);
    }

    public function getAllViews($database)
    {
        $query = $database.'/_all_docs?startkey="_design%2F"&endkey="_design0"&include_docs=true';

        $response = $this->doctrine_http_client->request('GET', '/' .$query);

        if ($response->status != 200)
        {
            return false;
        }

        return $response->body;
    }

    public function sync($rsource_conn_params, $rtarget_conn_params, $continous = false, $invert_source = false, $doc_ids = array(), $selector = null)
    {
        // Source
        $loginSource = $rsource_conn_params['user'].":".$rsource_conn_params['password']."@";
        $source = "http://".$loginSource.$rsource_conn_params['host'].":".$rsource_conn_params['port']."/".$rsource_conn_params['dbname'];
        // Target
        $loginTarget = $rtarget_conn_params['user'].":".$rtarget_conn_params['password']."@";
        $target = "http://".$loginTarget.$rtarget_conn_params['host'].":".$rtarget_conn_params['port']."/".$rtarget_conn_params['dbname'];

        if($invert_source)
        {
            $url = "http://".$rsource_conn_params['host'].":".$rsource_conn_params['port']."/_replicate";
        }
        else
        {
            $url = "http://".$rtarget_conn_params['host'].":".$rtarget_conn_params['port']."/_replicate";
        }

        $post_fields = array(
            "source"        => $source,
            "target"        => $target,
            "create_target" => true,
            "continuous"    => $continous         
        );
        if (!empty($doc_ids))
        {
            $post_fields['doc_ids'] = $doc_ids;
        }
        if (!is_null($selector))
        {
            $post_fields['selector'] = $selector;
        }
        $json_post_fields = json_encode($post_fields);
        
        // abrimos la sesión cURL
        $ch = curl_init();

        // definimos la URL a la que hacemos la petición
        curl_setopt($ch, CURLOPT_URL, $url);
        // indicamos el tipo de petición: POST
        curl_setopt($ch, CURLOPT_POST, TRUE);
        // definimos cada uno de los parámetros
        curl_setopt($ch, CURLOPT_POSTFIELDS, $json_post_fields);

        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
        curl_setopt($ch, CURLOPT_TIMEOUT_MS, 1000000);
        
        // recibimos la respuesta y la guardamos en una variable
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $remote_server_output = curl_exec ($ch);

        // cerramos la sesión cURL
        curl_close ($ch);

        if (strpos($remote_server_output, '"ok":true') !== false)
        {
            return true;
        }
        else
        {
            return $remote_server_output;
        }
    }
}
