<?php

namespace wizards\controller;

/**
 * Maintenance's metacode
 *
 * @author Dani Gilabert
 *
 */

class maintenanceMetacode
{
    private $_plugin_code;
    private $_plugin_name = array();
    private $_code;
    private $_name = array();
    private $_icon;
    private $_author;

    // Base paths
    private $_base_path;
    private $_resources_path;
    private $_templates_base_path;
    private $_replacementcode_base_path;
    
    private $_template_path = array();
    private $_replacementcode_path = array();
    private $_target_path = array();
    
    public function __construct($plugin_code, $plugin_name, $code, $names, $icon, $author)
    {
        $this->_plugin_code = $plugin_code;
        $this->_plugin_name = $plugin_name;
        $this->_code = $code;
        $this->_name = $names;
        $this->_icon = $icon;
        $this->_author = $author;
        
        // Set all paths
        $this->_setPaths();
        
        // Prepare files grants
        $this->_setGrants();
    }
    
    private function _setPaths()
    {
        $template_type = 'maintenance';
        
        // Base paths
        $this->_base_path = realpath(__DIR__."/../..");
        $this->_resources_path = $this->_base_path."/wizards/res";
        $this->_templates_base_path = $this->_resources_path."/".$template_type."/templates";
        $this->_replacementcode_base_path = $this->_resources_path."/".$template_type."/replacementCode";
        
        // Template paths
        $this->_template_path['module'] = $this->_templates_base_path."/modules/[MODULE_NAME]";
        $this->_template_path['REST'] = $this->_templates_base_path."/REST/app/route/[MODULE_NAME]";
        
        // Replacement code
        $this->_replacementcode_path['jsMain'] = $this->_replacementcode_base_path."/jsMain";
        $this->_replacementcode_path['config'] = $this->_replacementcode_base_path."/config";
        $this->_replacementcode_path['uiLang']['ca'] = $this->_replacementcode_base_path."/uiLangCa";
        $this->_replacementcode_path['uiLang']['es'] = $this->_replacementcode_base_path."/uiLangEs";
        $this->_replacementcode_path['serverLangMenu']['ca'] = $this->_replacementcode_base_path."/serverLangMenuCa";
        $this->_replacementcode_path['serverLangMenu']['es'] = $this->_replacementcode_base_path."/serverLangMenuEs";
        $this->_replacementcode_path['serverLangLabels']['ca'] = $this->_replacementcode_base_path."/serverLangLabelsCa";
        $this->_replacementcode_path['serverLangLabels']['es'] = $this->_replacementcode_base_path."/serverLangLabelsEs";

        // Target paths
        $this->_target_path['modules'] = $this->_base_path."/modules";
        $this->_target_path['module'] = $this->_base_path."/modules/".$this->_plugin_code;
        $this->_target_path['REST'] = $this->_base_path."/REST/app/route";
        $this->_target_path['REST_module'] = $this->_base_path."/REST/app/route/".$this->_plugin_code;
        $this->_target_path['jsMain'] = $this->_base_path."/base/UI-dev/app/controller/main/Main.js";
        $this->_target_path['config'] = $this->_target_path['module']."/config.php";
        $this->_target_path['uiLang']['ca'] = $this->_target_path['module']."/res/lang/UI/ca.php";
        $this->_target_path['uiLang']['es'] = $this->_target_path['module']."/res/lang/UI/es.php";
        $this->_target_path['serverLang']['ca'] = $this->_target_path['module']."/res/lang/server/ca.php";
        $this->_target_path['serverLang']['es'] = $this->_target_path['module']."/res/lang/server/es.php";
    }
    
    private function _setGrants()
    {
        $output = system("sudo /bin/chown -R www-data ".$this->_resources_path, $retval);
        $output = system("sudo /bin/chown -R www-data ".$this->_target_path['module'], $retval);
        $output = system("sudo /bin/chown -R www-data ".$this->_target_path['REST_module'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['jsMain'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_base_path."/refresh-autoload.sh", $retval);
        
        $output = system("sudo /bin/chmod -R 775 ".$this->_resources_path, $retval);
        $output = system("sudo /bin/chmod -R 775 ".$this->_target_path['module'], $retval);
        $output = system("sudo /bin/chmod -R 775 ".$this->_target_path['REST_module'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['jsMain'], $retval);
    }
    
    private function _restoreGrants()
    {
        $output = system("sudo /bin/chgrp -R administrador ". $this->_target_path['module'], $retval);
        $output = system("sudo /bin/chgrp -R administrador ". $this->_target_path['REST_module'], $retval);
        $output = system("sudo /bin/chgrp -R administrador ".$this->_target_path['jsMain'], $retval);
        
        $output = system("sudo /bin/chmod -R 775 ".$this->_target_path['module'], $retval);
        $output = system("sudo /bin/chmod -R 775 ".$this->_target_path['REST_module'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['jsMain'], $retval);
    }

    public function checkRequirements()
    {
        // Check if module classes already exists
        $mod_dir = $this->_target_path['modules']."/".$this->_plugin_code;
        if (!file_exists($mod_dir))
        {
            return array(
                'success' => false,
                'msg' => 'El módulo no existe. Primero tiene que crear el módulo.'
            );
        }    
        
        // Check if maintenance already exists
        $maint_dir = $this->_target_path['module'].'/controller/'.$this->_code.'.php';
        if (file_exists($maint_dir))
        {
            return array(
                'success' => false,
                'msg' => 'El mantenimiento ya existe'
            );
        } 
        
        // Try to write and delete file in some target folders
        $file = "test.test";
        $paths = array(
            $this->_resources_path,
            $this->_target_path['module'],
            $this->_target_path['REST_module']
        );
        foreach ($paths as $path)
        {
            $output = system("sudo /bin/touch ".$file." ".$path."/".$file, $retval);
            if ($output === false ||$retval === 1)
            {
                return array(
                    'success' => false,
                    'msg' => 'La ruta '.$path.' no tiene los permisos adecuados'
                );
            }
            $output = system("sudo /usr/bin/unlink ".$path."/".$file, $retval);
        }

        return array(
            'success' => true,
            'msg' => ''
        );
    }

    public function create()
    {
        $this->_setModuleFiles();
        $this->_setRESTFiles();
        $this->_setMainCode();
        
        $this->_modifyConfig();
        $this->_modifyUILang();
        $this->_modifyServerLang();
        
        $this->_refreshPaths();    
        $this->_restoreGrants();
        $this->_refreshPaths(); 
    }

    private function _refreshPaths()
    {
        $cmd = "cd ".$this->_base_path." && ./refresh-autoload.sh";
        $output = system($cmd, $retval);

        return true;
    }

    private function _setModuleFiles()
    {
        // Copy template to final modules directory
        $command = "cp -r ".$this->_template_path['module']."/* ".$this->_target_path['module']."/";
        $command = str_replace('[MODULE_NAME]', '\[MODULE_NAME\]', $command);
        $output = system($command, $retval);

        // Replace filenames
        $command = 'find '.$this->_target_path['module'].' -name "*\[MAINTENANCE_NAME\]*" -exec rename \'s/\[MAINTENANCE_NAME\]/'.$this->_code.'/\' {} ";"';
        $output = system($command, $retval);
        $output = system($command, $retval);

        // Replace file contents
        $phpfiles = $this->_getDirContents($this->_target_path['module'], '/'.$this->_code.'.php$/');
        $jsfiles = $this->_getDirContents($this->_target_path['module'], '/'.$this->_code.'.js$/');
        $couchdbviewfile = $this->_getDirContents($this->_target_path['module'].'/view/views/'.$this->_code, '/\.js$/');
        $jsviewfiles = $this->_getDirContents($this->_target_path['module'].'/UI/view/'.$this->_code, '/\.js$/');

        $allfiles = array_merge($phpfiles, $jsfiles, $couchdbviewfile, $jsviewfiles);
        $allfiles = array_unique($allfiles);
        
        foreach($allfiles as $file)
        {
            $content = \file_get_contents($file);
            $content = $this->_replaceData($content);

            \file_put_contents($file, $content);
        }

        return true;
    }

    private function _setRESTFiles()
    {
        // Copy template to final modules directory
        $command = "cp -r ".$this->_template_path['REST']."/* ".$this->_target_path['REST_module']."/";
        $command = str_replace('[MODULE_NAME]', '\[MODULE_NAME\]', $command);
        $output = system($command, $retval);

        // Replace filenames
        $command = 'find '.$this->_target_path['REST_module'].' -name "*\[MAINTENANCE_NAME\]*" -exec rename \'s/\[MAINTENANCE_NAME\]/'.$this->_code.'/\' {} ";"';
        $output = system($command, $retval);

        // Replace file contents
        $phpfiles = $this->_getDirContents($this->_target_path['REST_module'], '/'.$this->_code.'.php$/');

        foreach($phpfiles as $phpfile)
        {
            $content = \file_get_contents($phpfile);
            $content = $this->_replaceData($content);

            \file_put_contents($phpfile, $content);
        }

        return true;
    }

    private function _setMainCode()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['jsMain']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['jsMain']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG]", $s_text, $t_text);

        \file_put_contents($this->_target_path['jsMain'], $f_text);

        return true;
    }

    private function _modifyConfig()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['config']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['config']);

        $f_text = str_replace("// [WIZARD_MAINTENANCE_MENU_UI_TAG]", $s_text, $t_text);

        \file_put_contents($this->_target_path['config'], $f_text);

        return true;
    }

    private function _modifyUILang()
    {
        foreach ($this->_replacementcode_path['uiLang'] as $lang => $path) 
        {
            $s_text = \file_get_contents($path);
            $s_text = $this->_replaceData($s_text);

            $t_text = \file_get_contents($this->_target_path['uiLang'][$lang]);

            $f_text = str_replace("// [WIZARD_MAINTENANCE_TAG]", $s_text, $t_text);

            \file_put_contents($this->_target_path['uiLang'][$lang], $f_text);            
        }

        return true;
    }

    private function _modifyServerLang()
    {
        foreach ($this->_replacementcode_path['serverLangMenu'] as $lang => $path) 
        {
            $s_text = \file_get_contents($path);
            $s_text = $this->_replaceData($s_text);

            $t_text = \file_get_contents($this->_target_path['serverLang'][$lang]);

            $f_text = str_replace("// [WIZARD_MAINTENANCE_MENU_TAG]", $s_text, $t_text);

            \file_put_contents($this->_target_path['serverLang'][$lang], $f_text);            
        }
        
        foreach ($this->_replacementcode_path['serverLangLabels'] as $lang => $path) 
        {
            $s_text = \file_get_contents($path);
            $s_text = $this->_replaceData($s_text);

            $t_text = \file_get_contents($this->_target_path['serverLang'][$lang]);

            $f_text = str_replace("// [WIZARD_MAINTENANCE_LABELS_TAG]", $s_text, $t_text);

            \file_put_contents($this->_target_path['serverLang'][$lang], $f_text);            
        }

        return true;
    }

    private function _getDirContents($dir, $filter = '', &$results = array())
    {
        $files = scandir($dir);

        foreach($files as $key => $value)
        {
            $path = realpath($dir.DIRECTORY_SEPARATOR.$value);

            if(!is_dir($path))
            {
                if(empty($filter) || preg_match($filter, $path))
                {
                    $results[] = $path;
                }
            }
            elseif($value != "." && $value != "..")
            {
                $this->_getDirContents($path, $filter, $results);
            }
        }

        return $results;
    }

    private function _replaceData($text)
    {
        $search = array(
            "[MODULE_NAME]",
            "[CA_MODULE_DESCRIPTION]", "[ES_MODULE_DESCRIPTION]", 
            
            "[MAINTENANCE_NAME]", "[MAINTENANCE_NAME_lowercase]", 
            "[CA_MAINTENANCE_DESCRIPTION]", "[ES_MAINTENANCE_DESCRIPTION]",
            
            "[ICON]",
            "[AUTHOR]", 
            "_TEMPLATE_");
        
        $replace = array(
            $this->_plugin_code,
            $this->_plugin_name['ca'], $this->_plugin_name['es'],
            
            $this->_code, strtolower($this->_code), 
            $this->_name['ca'], $this->_name['es'],
            
            $this->_icon,
            $this->_author,
            "");

        $text = str_replace($search, $replace, $text);

        return $text;
    }
}