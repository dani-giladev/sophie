<?php

namespace modules\admin\controller;

// Controllers
use base\core\controller\controller;
use base\core\controller\helpers;

/**
 * File manager controller
 *
 * @author Default user
 * 
 */
class fileManager extends controller 
{
    private $json = '';
    private $_real_base_path;
    
    public function __construct() {
        parent::__construct();
        $this->json .= '[';
        $this->_real_base_path = realpath(__DIR__."/../../../");
    }
    
    public function getDir($params)
    {
        $resources_path = $params['resources_path'];
        $full_resources_path = $this->_real_base_path . '/' . $resources_path;
        $this->_getChildren($full_resources_path, false);

        $this->json .= ']';
        $this->json = str_replace(",]", "]", $this->json);

        //$arr = json_decode($this->json, true);
        
        return $this->json;
    }
    
    private function _getChildren($dir, $child)
    {
        $objects = @scandir($dir);
        if ($objects === false)
        {
            return;
        }
        
        foreach ($objects as $file)
        {
            if ($file != '.' AND $file != '..' )
            {
                $full_path = $dir . "/" . $file;
                
                if (filetype($full_path) == 'dir')
                {
                    $this->json .= '{"text":"'.$file.'", "id": "'.$full_path.'", "children": [';
                    $this->_getChildren($full_path, true);
                }
                /*else
                {
                    $this->json .= '{"text":"'.$file.'", "leaf": true, "id": "'.$full_path.'"},';
                }*/
            }
        }            

        if ($child)
        {
            $this->json .=  ']},';
        }
    }

    private function _countSubDir($dir)
    {
        $dh = opendir($dir);
        $countdir = 0;
        while (($file = readdir($dh)) !== false)
        {
            if ($file != '.' AND $file != '..' )
            {
                if (filetype($dir . $file) == 'dir')
                {
                    $countdir++;
                }
            }
        }
        closedir($dh);
        return $countdir;
    }
    
    public function getFile($params)
    {
        error_reporting(0); // For disabling NOTICE on exif_imagetype
        $resources_path = $params['resources_path'];
        $full_resources_path = $this->_real_base_path . '/' . $resources_path;
        
        if(isset($params['dir']))
        {
            if($params['dir'] == 'root' || empty($params['dir']))
            {
                $dir = $full_resources_path;
            }
            else
            {
                $dir = $params['dir'];
            }
        }
        else
        {
            $dir = $full_resources_path;
        }

        $data = array();
        $objects = @scandir($dir);
        if ($objects !== false)
        {
            foreach ($objects as $file)
            {
                if ($file != '.' AND $file != '..' )
                {
                    $full_file_path = $dir . "/". $file;
                    if (filetype($full_file_path) == 'file')
                    {
                        $rel_path = str_replace($full_resources_path.'/', '', $dir);
                        $size = round(filesize($full_file_path) / 1024, 2);
                        $pathinfo = pathinfo($full_file_path);
                        $extension = $pathinfo['extension'];
                        $is_image = exif_imagetype($full_file_path);
                        
                        $can_be_viewed = (strtoupper($extension)==='PDF' || $is_image !== false);

                        $data[] = array(
                            'relativePath' => $rel_path,
                            'filename' => $file,
                            'filesize' => $size.' KB',
                            'filedate' => date("F d Y H:i:s", filemtime($full_file_path)),
                            'fileextension' => $extension,
                            'is_image' => $is_image,
                            'can_be_viewed' => $can_be_viewed
                        );
                    }
                }
            }
        }    
            
        return helpers::resStruct(true, "", $data);    
    }
    
    public function newFolder($params)
    {
        $resources_path = $params['resources_path'];
        $full_resources_path = $this->_real_base_path . '/' . $resources_path;
        
        if(isset($params['base_dir']))
        {
            if($params['base_dir'] == 'root' || empty($params['base_dir']))
            {
                $base_dir = $full_resources_path;
            }
            else
            {
                $base_dir = $params['base_dir'];
            }
        }
        else
        {
            $base_dir = $full_resources_path;
        }
        
        $target_dir = $base_dir . '/'. $params['dir_name'];
        
        if(@mkdir($target_dir))
        {
            return helpers::resStruct(true);
        }
        else
        {
            return helpers::resStruct(false, "Error creating folder (maybe due to permissions error)");
        } 
    }
    
    public function deleteFolder($params)
    {
//        $resources_path = $params['resources_path'];
//        $full_resources_path = $this->_real_base_path . '/' . $resources_path;
        
        if(!is_null($params['dir']))
        {
            if($params['dir'] == 'root')
            {
                return helpers::resStruct(false);
            }
            if($this->_rrmdir($params['dir']))
            {
                return helpers::resStruct(true);
            }
            else
            {
                return helpers::resStruct(false);
            } 
        }
        else
        {
            return helpers::resStruct(false);
        }
    }
    
    private function _rrmdir($dir)
    {
        if (is_dir($dir))
        {
            $objects = @scandir($dir);
            if ($objects === false)
            {
                return false;
            }
            foreach ($objects as $object)
            {
                if ($object != "." && $object != "..")
                {
                    if (filetype($dir."/".$object) == "dir")
                    {
                        $ret = self::_rrmdir($dir."/".$object);
                        if ($ret === false)
                        {
                            return false;
                        }                        
                    }
                    else
                    {
                        $ret = @unlink($dir."/".$object);
                        if ($ret === false)
                        {
                            return false;
                        }
                    }
                }
            }
            reset($objects);
            $ret = @rmdir($dir);
            if ($ret === false)
            {
                return false;
            }
        }
        else
        {
            return false;
        }
        
        return true;
   }
    
    public function deleteFile($params)
    {
        $resources_path = $params['resources_path'];
        $full_resources_path = $this->_real_base_path . '/' . $resources_path;
        $file = $params['file'];
        
        if(!is_null($file))
        {
            if(strrpos($file, 'root') !== false)
            {
                $file = str_replace('root', $full_resources_path, $file); 
            }
            if(@unlink($file))
            {
                return helpers::resStruct(true);
            }
            else
            {
                return helpers::resStruct(false);
            } 
        }
    }
    
    public function uploadFile($params)
    {
        $dir = $params['dir_id'];

        // Check path
        if (!file_exists($dir))
        {
            return helpers::resStruct(false, "Path doesn't exist: ".$dir);
        }
        
        if (!isset($_FILES) || empty($_FILES))
        {
            return helpers::resStruct(false, "No files to upload!");
        }
        
        // reArrayFiles
        $file_post = $_FILES['files'];
        $file_ary = array();
        $file_count = count($file_post['name']);
        $file_keys = array_keys($file_post);
        for ($i=0; $i<$file_count; $i++) {
            foreach ($file_keys as $key) {
                $file_ary[$i][$key] = $file_post[$key][$i];
            }
        }
        
        foreach ($file_ary as $file_values)
        {
            $temp_filename = $file_values['tmp_name'];
            $original_filename = $file_values['name'];

            // Set the path to upload
            $filename = $dir.'/'.$original_filename;

            move_uploaded_file ($temp_filename, $filename);            
        }
        
        //return helpers::resStruct(false, "Ha ocurrido un error al subir el archivo");
        return helpers::resStruct(true);
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
