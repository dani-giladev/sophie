<?php

namespace base\core\controller;

// Controllers
use base\core\controller\config;

/**
 * Description of helpers
 *
 * @author administrador
 */
class helpers
{
    public static $echo = true;

    public static function getClassStruct($class)
    {
        $classObj = new \stdClass();
        $class_path = \substr($class, 0, strrpos($class, "\\"));
        $class_name_raw = strrchr($class,"\\");
        $class_name = substr($class_name_raw,1,strlen($class_name_raw));
        $module = \str_replace("\\controller", "" ,\str_replace("modules\\", "", $class_path));
        if (strpos($module, "\\"))
        {
            $module = substr($module, 0, strpos($module, "\\"));
        }
        
        $classObj->class = $class;
        $classObj->classname = $class_name;
        $classObj->classpath = $class_path;
        $classObj->module = $module;
        
        return $classObj;
    }
    
    /**
     * Transforms json string to object
     *
     * @param $data: (string)
     * @return $ret (standard object).
     */
    public static function objectize($data)
    {
        $ret = (is_array($data)) ? json_decode(json_encode($data), false) : $data;
        
        return $ret;
    }
    
    public static function resStruct($success, $msg = "", $data = array())
    {
        return array (
            "success"   => $success,
            "msg"       => $msg,
            "data"      => json_decode(json_encode($data), true) // Important: It must always return an array
        );
    }
    
    public static function sortArrayByField($array, $field, $sense = SORT_ASC)
    {
        $sort_field = array();
        
        if(count($array) <= 0)
        {
            return $array;
        }
        
        foreach($array as $c => $key)
        {
            if(isset($key[$field]))
            {
                $sort_field[] = $key[$field];
            }
        }

        if(count($array) > 0)
        {
            array_multisort($sort_field, $sense, $array);
        }

        return $array;
    }
    
    /**
     * Return a sorted array with multiple fields
     *
     * @param $arrayToSort: the array to sort
     * @param $sortOrder: array which contains the fields to sort
     *              ex: array("field1" => "asc", "field2" => "desc", ...)
     * @return $arrayToSort already sorted
     */       
    public static function sortArrayByMultipleFields($arrayToSort, $sortOrder) 
    { 
        $n_parameters = (count($sortOrder) * 2) + 1;
        $arg_list[0] = $arrayToSort; 
        $arg_list_counter=1;
        foreach($sortOrder as $sort_key => $sort_value)
        {
            $arg_list[$arg_list_counter] = $sort_key;
            $arg_list_counter++;
            $sense = ($sort_value == 'asc') ? SORT_ASC : SORT_DESC;
            $arg_list[$arg_list_counter] = $sense;
            $arg_list_counter++;
        }  

        $final_array = $arg_list[0]; 

        $toEval = "foreach (\$final_array as \$row){\n"; 
        for ($i=1; $i<$n_parameters; $i+=2) 
        { 
            $toEval .= "  \$field{$i}[] = \$row['$arg_list[$i]'];\n"; 
        } 
        $toEval .= "};\n"; 
        $toEval .= "array_multisort(\n"; 
        for ($i=1; $i<$n_parameters; $i+=2) 
        { 
            $toEval .= "  \$field{$i}, SORT_REGULAR, \$arg_list[".($i+1)."],\n"; 
        } 
        $toEval .= "  \$final_array);"; 
        eval($toEval);
        
        return $final_array; 
    } 
    
    /** 
     * Convert number of seconds into hours, minutes and seconds 
     * and return an array containing those values 
     * 
     * @param integer $inputSeconds Number of seconds to parse 
     * @return array 
     */ 
    public static function seconds2Time($rawInputSeconds, $enable_days = true)
    {
        $inputSeconds = \abs($rawInputSeconds);
        
        $secondsInAMinute = 60;
        $secondsInAnHour  = 60 * $secondsInAMinute;
        $secondsInADay    = 24 * $secondsInAnHour;

        // extract days
        $days = floor($inputSeconds / $secondsInADay);

        // extract hours
        $hourSeconds = $inputSeconds % $secondsInADay;
        $hours = floor($hourSeconds / $secondsInAnHour);

        // extract minutes
        $minuteSeconds = $hourSeconds % $secondsInAnHour;
        $minutes = floor($minuteSeconds / $secondsInAMinute);

        // extract the remaining seconds
        $remainingSeconds = $minuteSeconds % $secondsInAMinute;
        $seconds = ceil($remainingSeconds);

        if (!$enable_days && $days > 0)
        {
            $hours = $hours + ($days * 24);
            $days = 0;
        }
        
       $negative = ($rawInputSeconds < 0) ? 1 : 0;
        
        // return the final array
        $obj = array(
            'negative' => $negative,
            'd' => (int) $days,
            'h' => (int) $hours,
            'm' => (int) $minutes,
            's' => (int) $seconds,
        );
        return $obj;
    }  
    
    public static function transDay($day, $lang)
    {
        $day = strtolower($day);
        
        $days_array = array(
            "es"    => array(
                "monday"    => "lunes",
                "tuesday"   => "martes",
                "wednesday" => "miércoles",
                "thursday"  => "jueves",
                "friday"    => "viernes",
                "saturday"  => "sábado",
                "sunday"    => "domingo"
            ),
            "ca"    => array(
                "monday"    => "dilluns",
                "tuesday"   => "dimarts",
                "wednesday" => "dimecres",
                "thursday"  => "dijous",
                "friday"    => "divendres",
                "saturday"  => "dissabte",
                "sunday"    => "diumenge"
            )
        );
        
        return $days_array[$lang][$day];
    }
    
    public static function isPHP7()
    {
        if (version_compare(phpversion(), '7.0', '>='))
        {
            return true;
        }
        
        return false;
    }
    
    public static function getNumberOfDays($start_date, $end_date, $dates_are_strtotime = false)
    {
        if ($dates_are_strtotime)
        {
            $s_date = $start_date;
            $e_date = $end_date;
        }
        else
        {
            $s_date = \strtotime($start_date);
            $e_date = \strtotime($end_date);
        }
        
        $days = round(abs($e_date - $s_date) / 86400);
        
        //$days = ($days >= 1) ? $days : 1;
                
        return $days;
    }

    public static function replaceTilde($html)
    {
        $search = array("á", "é", "í", "ó", "ú",
            "à", "è", "ò", "ñ",
            "Á", "É", "Í", "Ó", "Ú",
            "À", "È", "Ò", "Ñ",
            "ï", "Ï", "ü", "Ü",
            "·", "ç", "Ç");
        $replace = array("&aacute;", "&eacute;", "&iacute;", "&oacute;", "&uacute;",
            "&agrave;", "&egrave;", "&ograve;", "&ntilde;",
            "&Aacute;", "&Eacute;", "&Iacute;", "&Oacute;", "&Uacute;",
            "&Agrave;", "&Egrave;", "&Ograve;", "&Ntilde;",
            "&iuml;", "&Iuml;", "&uuml;", "&Uuml;",
            "&middot;", "&ccedil;", "&Ccedil;");

        return str_replace($search, $replace, $html);
    }
    
    public static function getBasicCharMap()
    {
        return array(
            // Latin
            'À' => 'A', 'Á' => 'A', 'Â' => 'A', 'Ã' => 'A', 'Ä' => 'A', 'Å' => 'A', 'Æ' => 'AE', 'Ç' => 'C', 
            'È' => 'E', 'É' => 'E', 'Ê' => 'E', 'Ë' => 'E', 'Ì' => 'I', 'Í' => 'I', 'Î' => 'I', 'Ï' => 'I', 
            'Ð' => 'D', 'Ñ' => 'N', 'Ò' => 'O', 'Ó' => 'O', 'Ô' => 'O', 'Õ' => 'O', 'Ö' => 'O', 'Ő' => 'O', 
            'Ø' => 'O', 'Ù' => 'U', 'Ú' => 'U', 'Û' => 'U', 'Ü' => 'U', 'Ű' => 'U', 'Ý' => 'Y', 'Þ' => 'TH', 
            'ß' => 'ss', 
            'à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'æ' => 'ae', 'ç' => 'c', 
            'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 
            'ð' => 'd', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ő' => 'o', 
            'ø' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ű' => 'u', 'ý' => 'y', 'þ' => 'th', 
            'ÿ' => 'y',
            // Latin symbols
            '©' => '(c)',
            // Greek
            'Α' => 'A', 'Β' => 'B', 'Γ' => 'G', 'Δ' => 'D', 'Ε' => 'E', 'Ζ' => 'Z', 'Η' => 'H', 'Θ' => '8',
            'Ι' => 'I', 'Κ' => 'K', 'Λ' => 'L', 'Μ' => 'M', 'Ν' => 'N', 'Ξ' => '3', 'Ο' => 'O', 'Π' => 'P',
            'Ρ' => 'R', 'Σ' => 'S', 'Τ' => 'T', 'Υ' => 'Y', 'Φ' => 'F', 'Χ' => 'X', 'Ψ' => 'PS', 'Ω' => 'W',
            'Ά' => 'A', 'Έ' => 'E', 'Ί' => 'I', 'Ό' => 'O', 'Ύ' => 'Y', 'Ή' => 'H', 'Ώ' => 'W', 'Ϊ' => 'I',
            'Ϋ' => 'Y',
            'α' => 'a', 'β' => 'b', 'γ' => 'g', 'δ' => 'd', 'ε' => 'e', 'ζ' => 'z', 'η' => 'h', 'θ' => '8',
            'ι' => 'i', 'κ' => 'k', 'λ' => 'l', 'μ' => 'm', 'ν' => 'n', 'ξ' => '3', 'ο' => 'o', 'π' => 'p',
            'ρ' => 'r', 'σ' => 's', 'τ' => 't', 'υ' => 'y', 'φ' => 'f', 'χ' => 'x', 'ψ' => 'ps', 'ω' => 'w',
            'ά' => 'a', 'έ' => 'e', 'ί' => 'i', 'ό' => 'o', 'ύ' => 'y', 'ή' => 'h', 'ώ' => 'w', 'ς' => 's',
            'ϊ' => 'i', 'ΰ' => 'y', 'ϋ' => 'y', 'ΐ' => 'i',
            // Turkish
            'Ş' => 'S', 'İ' => 'I', 'Ç' => 'C', 'Ü' => 'U', 'Ö' => 'O', 'Ğ' => 'G',
            'ş' => 's', 'ı' => 'i', 'ç' => 'c', 'ü' => 'u', 'ö' => 'o', 'ğ' => 'g', 
            // Russian
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D', 'Е' => 'E', 'Ё' => 'Yo', 'Ж' => 'Zh',
            'З' => 'Z', 'И' => 'I', 'Й' => 'J', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N', 'О' => 'O',
            'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T', 'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'C',
            'Ч' => 'Ch', 'Ш' => 'Sh', 'Щ' => 'Sh', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '', 'Э' => 'E', 'Ю' => 'Yu',
            'Я' => 'Ya',
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd', 'е' => 'e', 'ё' => 'yo', 'ж' => 'zh',
            'з' => 'z', 'и' => 'i', 'й' => 'j', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n', 'о' => 'o',
            'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't', 'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'c',
            'ч' => 'ch', 'ш' => 'sh', 'щ' => 'sh', 'ъ' => '', 'ы' => 'y', 'ь' => '', 'э' => 'e', 'ю' => 'yu',
            'я' => 'ya',
            // Ukrainian
            'Є' => 'Ye', 'І' => 'I', 'Ї' => 'Yi', 'Ґ' => 'G',
            'є' => 'ye', 'і' => 'i', 'ї' => 'yi', 'ґ' => 'g',
            // Czech
            'Č' => 'C', 'Ď' => 'D', 'Ě' => 'E', 'Ň' => 'N', 'Ř' => 'R', 'Š' => 'S', 'Ť' => 'T', 'Ů' => 'U', 
            'Ž' => 'Z', 
            'č' => 'c', 'ď' => 'd', 'ě' => 'e', 'ň' => 'n', 'ř' => 'r', 'š' => 's', 'ť' => 't', 'ů' => 'u',
            'ž' => 'z', 
            // Polish
            'Ą' => 'A', 'Ć' => 'C', 'Ę' => 'e', 'Ł' => 'L', 'Ń' => 'N', 'Ó' => 'o', 'Ś' => 'S', 'Ź' => 'Z', 
            'Ż' => 'Z', 
            'ą' => 'a', 'ć' => 'c', 'ę' => 'e', 'ł' => 'l', 'ń' => 'n', 'ó' => 'o', 'ś' => 's', 'ź' => 'z',
            'ż' => 'z',
            // Latvian
            'Ā' => 'A', 'Č' => 'C', 'Ē' => 'E', 'Ģ' => 'G', 'Ī' => 'i', 'Ķ' => 'k', 'Ļ' => 'L', 'Ņ' => 'N', 
            'Š' => 'S', 'Ū' => 'u', 'Ž' => 'Z',
            'ā' => 'a', 'č' => 'c', 'ē' => 'e', 'ģ' => 'g', 'ī' => 'i', 'ķ' => 'k', 'ļ' => 'l', 'ņ' => 'n',
            'š' => 's', 'ū' => 'u', 'ž' => 'z'
        );        
    }
    
    public static function normalizeSpecialChars($str)
    {
        $char_map = self::getBasicCharMap();
        $ret = str_replace(array_keys($char_map), $char_map, $str);
        return $ret;
    }

    // Unset everything in a string but numbers, a-z, A-Z characters and blank spaces
    public static function sanitize($str, $replacement = "", $remove_blanks = true)
    {
        $regex = ($remove_blanks) ? "/[^\\dA-Za-z ]/" : "/[^\\dA-Za-z]/";

        $res = \preg_replace($regex, $replacement, $str);

        return $res;
    }

    public static function isDateBetween($dt_start, $dt_end, $dt_check)
    {
        if(strtotime($dt_check) > strtotime($dt_start) && strtotime($dt_check) < strtotime($dt_end))
        {
            return true;
        }

        return false;
    }

    public static function isDateBetweenOrEqual($dt_start, $dt_end, $dt_check)
    {
        if(strtotime($dt_check) >= strtotime($dt_start) && strtotime($dt_check) <= strtotime($dt_end))
        {
            return true;
        }

        return false;
    }    
    
    /**
     * Return date (string) with the new format
     *
     * @param $date: the date to convert (string)
     * @param $oldFormatDate: the current format
     *              ex: 'dd/mm/yyyy'
     * @param $newFormatDate: the new format
     *              ex: 'yyyy-mm-dd' 
     * @return date with the new format (string)
     */       
    public static function changeDateFormat($date, $oldFormatDate, $newFormatDate)
    {
        $resultDate = array();
                
        $oldFormatDelimiter = '-';
        $posDelimiter = strpos($oldFormatDate, '/');
        if($posDelimiter !== false)
        {
            $oldFormatDelimiter = '/';
        }
        $oldFormatDatePieces = explode($oldFormatDelimiter, $oldFormatDate);        
        $oldDatePieces = explode($oldFormatDelimiter, $date);            

        $newFormatDelimiter = '-';
        $posDelimiter = strpos($newFormatDate, '/');
        if($posDelimiter !== false)
        {
            $newFormatDelimiter = '/';
        }        
        $newFormatDatePieces = explode($newFormatDelimiter, $newFormatDate);              
        
        foreach($newFormatDatePieces as $newFormat_key => $newFormat_vaule)
        {
            foreach($oldFormatDatePieces as $oldFormat_key => $oldFormat_vaule)
            {
                if($newFormat_vaule == $oldFormat_vaule)
                {
                    $resultDate[] = $oldDatePieces[$oldFormat_key];
                    break;
                }      
            }            
      
        }        
        
        return $resultDate[0].$newFormatDelimiter.$resultDate[1].$newFormatDelimiter.$resultDate[2];
    }

    public static function show($str)
    {
        if(self::$echo)
        {
            echo $str.PHP_EOL;
        }
    }
    
    public static function html2pdf($html, $path, $filename)
    {
        $html_filename = $path."/".$filename.".html";
        file_put_contents($html_filename, $html);

//        $converter = '/usr/bin/xvfb-run /usr/bin/wkhtmltopdf';
        $config = new config();
        $converter = $config->getBaseDBPARAM("PDF_CONVERTER");
        
        $pdf_filename = $path."/".$filename.".pdf";
        $command = $converter." ".$html_filename." ".$pdf_filename;
        $output = array();
        $return_var = 0;
        $exec = exec($command, $output, $return_var);             
    }   
    
    /** 
     * Get substring between tags (strings)
     * 
     * Example:
     *      $fullstring = "this is my [tag]dog[/tag]";
     *      $parsed = getStringBetween($fullstring, "[tag]", "[/tag]");
     *      echo $parsed; // (result = dog)    
     */     
    public static function getStringBetween($string, $start, $end)
    {
        $string = " ".$string;
        $ini = strpos($string,$start);
        if ($ini == 0) return "";
        $ini += strlen($start);
        $len = strpos($string,$end,$ini) - $ini;
        return substr($string,$ini,$len);
    }
}
