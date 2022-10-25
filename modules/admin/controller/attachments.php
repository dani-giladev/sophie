<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * Attachments controller
 *
 * @author Default user
 * 
 */
class attachments extends controller 
{
    private $_real_base_path;
    private $_resources_path;
    private $_real_resources_path;
    
    public function __construct() {
        parent::__construct();
        $this->_real_base_path = realpath(__DIR__."/../../../");
        $this->_resources_path = "res/attachments/public";
        $this->_real_resources_path = $this->_real_base_path."/".$this->_resources_path;
    }

    public function getAttachments($params)
    {
        $module = isset($params['module']) ? $params['module'] : null;
        $model = isset($params['model']) ? $params['model'] : null;
        $doc_id = (isset($params['doc_id']) && !empty($params['doc_id'])) ? $params['doc_id'] : null;
        
        // Get path
        $module_path = $this->_real_resources_path.'/'.$module;
        $model_path = $module_path.'/'.$model;
        $attachments_folder = $model_path.'/';
        if (isset($doc_id))
        {
            $attachments_folder .= $doc_id;
        }
        else
        {
            $attachments_folder .= 'tmp-'.$this->token->getUserLogin();
        }
        
        $files = glob($attachments_folder.'/*');
        if (empty($files))
        {
            return helpers::resStruct(true);
        }  
        
        $data = array();
        foreach ($files as $filename)
        {
            $pathinfo = pathinfo($filename);
            $path = $pathinfo['dirname'];
            $relative_path = str_replace($this->_real_base_path, "", $path);
            $size = round(filesize($filename) / 1024, 2);
            $extension = $pathinfo['extension'];
            $is_image = exif_imagetype($filename);
            $can_be_viewed = (strtoupper($extension)==='PDF' || $is_image !== false);
            
            $data[] = array(
                'path' => $path,
                'relative_path' => $relative_path,
                'filename' => $pathinfo['basename'],
                'size' => $size.' KB',
                'extension' => $extension,
                'can_be_viewed' => $can_be_viewed
            );            
        }
            
        return helpers::resStruct(true, "", $data);
    }
    
    public function uploadFile($params)
    {
        $module = isset($params['module']) ? $params['module'] : null;
        $model_name = isset($params['model']) ? $params['model'] : null;
        $doc_id = (isset($params['doc_id']) && !empty($params['doc_id'])) ? $params['doc_id'] : null;

        // Check public path
        if (!file_exists($this->_real_resources_path))
        {
            return helpers::resStruct(false, "Path doesn't exist: ".$this->_real_resources_path);
        }
        
        if (!isset($_FILES) || empty($_FILES))
        {
            return helpers::resStruct(false, "No files to upload!");
        }
        
        $temp_filename = $_FILES['file']['tmp_name'];
        $original_filename = $_FILES['file']['name'];

        // Set path to upload
        $module_path = $this->_real_resources_path.'/'.$module;
        if (!file_exists($module_path))
        {
            mkdir($module_path);
        }
        $model_path = $module_path.'/'.$model_name;
        if (!file_exists($model_path))
        {
            mkdir($model_path);
        }
        $attachments_folder = $model_path.'/';
        if (isset($doc_id))
        {
            $attachments_folder .= $doc_id;
        }
        else
        {
            $attachments_folder .= 'tmp-'.$this->token->getUserLogin();
        }
        if (!file_exists($attachments_folder))
        {
            mkdir($attachments_folder);
        }
        
        // Set the path to upload
        $filename = $attachments_folder.'/'.$original_filename;

        if (move_uploaded_file ($temp_filename, $filename))
        {
            return helpers::resStruct(true);
        } 
        else 
        {
            return helpers::resStruct(false, "Ha ocurrido un error al subir el archivo");
        }
    }
    
    public function removeFile($params)
    {
        $module = isset($params['module']) ? $params['module'] : null;
        $model_name = isset($params['model']) ? $params['model'] : null;
        $doc_id = isset($params['doc_id']) ? $params['doc_id'] : null;
        $filename = isset($params['filename']) ? $params['filename'] : null;

        // Check public path
        if (!file_exists($this->_real_resources_path))
        {
            return helpers::resStruct(false, "Path doesn't exist: ".$this->_real_resources_path);
        }

        // Set full filename path to remove
        $module_path = $this->_real_resources_path.'/'.$module;
        $model_path = $module_path.'/'.$model_name;
        $attachments_folder = $model_path.'/'.$doc_id;
        $full_filename_path = $attachments_folder.'/'.$filename;
        
        if (!file_exists($full_filename_path))
        {
            return helpers::resStruct(false, "Filename doesn't exist: ".$full_filename_path);
        }
        
        // Remove file
        $output = unlink($full_filename_path);
        
        return helpers::resStruct(true);
    }
    
    public function renameTmpResourcesFolder($module, $model_name, $id)
    {
        $real_resources_path = __DIR__."/../../../res/attachments/public";
        $real_real_resources_path = realpath($real_resources_path);
        
        // Get path
        $module_path = $real_real_resources_path.'/'.$module;
        $model_path = $module_path.'/'.$model_name;
        $tmp_path = $model_path.'/tmp-'.$this->token->getUserLogin();;
        if (!file_exists($tmp_path))
        {
            return;
        }
        $new_path = $model_path.'/'.$id;
        
        $output = rename($tmp_path, $new_path);
    }
    
    public function deleteAttachmentsFolder($module, $model_name, $id)
    {
        $real_resources_path = __DIR__."/../../../res/attachments/public";
        $real_real_resources_path = realpath($real_resources_path);
        
        // Get path
        $module_path = $real_real_resources_path.'/'.$module;
        $model_path = $module_path.'/'.$model_name;
        $attachments_folder = $model_path.'/'.$id;
        if (!file_exists($attachments_folder))
        {
            return;
        }
        
        $output = system('rm -rf ' . $attachments_folder, $retval);
    }
    
    public function showPDF($params)
    {
        $fullpath = isset($params['fullpath']) ? $params['fullpath'] : '';
        $content = file_get_contents($fullpath);
        return $content;
    }
    
    public function downloadFile($params)
    {
        $fullpath = isset($params['fullpath']) ? $params['fullpath'] : '';
        
        header('Content-Description: File Transfer');
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="'.basename($fullpath).'"');
        header('Expires: 0');
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Length: ' . filesize($fullpath));
        @readfile($fullpath);
    }
    
}
