<?php

namespace base\core\controller;

/**
 * Management of images
 * 
 * @author Dani Gilabert
 * 
 */
class image
{
    
    public static function getImageProperties($image_path)
    {
        if (!file_exists($image_path))
        {
            return null;
        }
        
        $imagesize = getimagesize($image_path);
        $pathinfo = pathinfo($image_path);
        $filesize = filesize($image_path);

        $ret = new \stdClass();
        $ret->path = $image_path;
        $ret->dirname = $pathinfo['dirname'];
        $ret->extension = $pathinfo['extension'];
        $ret->basename = $pathinfo['basename'];
        $ret->filename = $pathinfo['filename'];
        $ret->width = $imagesize[0];
        $ret->height = $imagesize[1];
        $ret->type = $imagesize[2];
        $ret->attr = $imagesize[3];
        $ret->filesize = $filesize. ' bytes';
        $ret->bytes = $filesize;
        $ret->filedate = date("F d Y H:i:s", filemtime($image_path));
        
        return $ret;        
    }
    
    public static function createImage($src_path, $dst_path, $new_witdh, $new_height, $quality = 100, $type = IMAGETYPE_JPEG)
    {
        switch ( $type ){
            case IMAGETYPE_JPEG:
                $original = imagecreatefromjpeg( $src_path );
                break;
            case IMAGETYPE_PNG:
                $original = imagecreatefrompng( $src_path );
                break;
            case IMAGETYPE_GIF:
                $original = imagecreatefromgif( $src_path );
        }

        if ($original !== false)
        {
           $thumb = imageCreatetrueColor($new_witdh, $new_height);
           if ($thumb !== false)
            {
              $width = imagesx($original);
              $height = imagesy($original);

              imagecopyresampled($thumb, $original, 0, 0, 0, 0, $new_witdh, $new_height, $width, $height);
              $ret = imagejpeg($thumb, $dst_path, $quality);
              imagedestroy($thumb);
              return $ret;
           }
        }
        
        return false;
     } 
     
    public static function reduceBase64Image($base64, $new_witdh, $new_height, $quality = 100)
    {
        if (empty($base64))
        {
            return '';
        }
        
        $data = base64_decode($base64);
        $original = imagecreatefromstring($data);
        
        $thumb = imageCreatetrueColor($new_witdh, $new_height);
        if ($thumb !== false)
        {
            $width = imagesx($original);
            $height = imagesy($original);

            imagecopyresampled($thumb, $original, 0, 0, 0, 0, $new_witdh, $new_height, $width, $height);
            
            // Buffering
            /*
            ob_start();
            imagejpeg($thumb, null, $quality);
            $data = ob_get_contents();
            ob_end_clean();
            */
            
            $path_img = '/opt/tmp/tmp-picture';
            $ret = imagejpeg($thumb, $path_img, $quality);
            $data = base64_encode(file_get_contents($path_img));            
            
           // Liberar memoria
           imagedestroy($thumb);
           
           return $data;
        }
        
        return '';
     }
}
