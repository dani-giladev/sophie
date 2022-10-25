<?php

namespace wizards\controller;

/**
 * Plugin's metacode
 * REMEMBER. In order this script to work like a charm you need:
 * sudo visudo (sudoers):
 * 
 * www-data ALL=NOPASSWD: /bin/chgrp
 * www-data ALL=NOPASSWD: /bin/chown
 * www-data ALL=NOPASSWD: /bin/chmod
 * www-data ALL=NOPASSWD: /bin/touch
 * www-data ALL=NOPASSWD: /usr/bin/unlink
 * 
 * Also: vi /etc/passwd
 * www-data:x:33:33:www-data:/var/www:/bin/bash
 *
 *
 * @author Xavier Piquer
 * @author Dani Gilabert
 *
 */

class pluginMetacode
{
    private $_module_name;
    private $_module_description = array();
    private $_author;

    // Base paths
    private $_base_path;
    private $_resources_path;
    private $_templates_base_path;
    private $_replacementcode_base_path;
    
    private $_template_path = array();
    private $_replacementcode_path = array();
    private $_target_path = array();
    
    public function __construct($name, $description, $author)
    {
        $this->_module_name = $name;
        $this->_module_description['ca'] = $description;
        $this->_module_description['es'] = $description;
        $this->_author = $author;
        
        // Set all paths
        $this->_setPaths();
        
        // Prepare files grants
        $this->_setGrants();
    }
    
    private function _setPaths()
    {
        $template_type = 'module';
        
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
        $this->_replacementcode_path['jsAdminUserController'] = $this->_replacementcode_base_path."/jsAdminUserController";
        $this->_replacementcode_path['adminUserModel'] = $this->_replacementcode_base_path."/adminUserModel";
        $this->_replacementcode_path['adminUserControllerGetAll'] = $this->_replacementcode_base_path."/adminUserControllerGetAll";
        $this->_replacementcode_path['adminUserControllerSave'] = $this->_replacementcode_base_path."/adminUserControllerSave";
        $this->_replacementcode_path['adminUserControllerSaveVar'] = $this->_replacementcode_base_path."/adminUserControllerSaveVar";

        // Target paths
        $this->_target_path['modules'] = $this->_base_path."/modules";
        $this->_target_path['REST'] = $this->_base_path."/REST/app/route";
        $this->_target_path['jsMain'] = $this->_base_path."/base/UI-dev/app/controller/main/Main.js";
        $this->_target_path['jsAdminUserController'] = $this->_base_path."/modules/admin/UI/controller/user.js";
        $this->_target_path['model_user'] = $this->_base_path."/modules/admin/model/user.php";
        $this->_target_path['controller_user'] = $this->_base_path."/modules/admin/controller/user.php";
        $this->_target_path['ui_plugin'] = $this->_base_path."/base/UI-dev/app/plugins/modules";        
    }
    
    private function _setGrants()
    {
        $output = system("sudo /bin/chown -R www-data ".$this->_resources_path, $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['modules'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['REST'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['jsMain'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['jsAdminUserController'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['ui_plugin'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['model_user'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_target_path['controller_user'], $retval);
        $output = system("sudo /bin/chown www-data ".$this->_base_path."/refresh-autoload.sh", $retval);

        $output = system("sudo /bin/chmod -R 775 ".$this->_resources_path, $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['modules'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['REST'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['jsMain'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['jsAdminUserController'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['ui_plugin'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['model_user'], $retval);
        $output = system("sudo /bin/chmod 775 ".$this->_target_path['controller_user'], $retval);
    }
    
    private function _restoreGrants()
    {
        $mod_dir = $this->_target_path['modules']."/".$this->_module_name;
        $output = system("sudo /bin/chgrp -R administrador ".$mod_dir, $retval);
        
        $rest_dir = $this->_target_path['REST']."/".$this->_module_name;
        $output = system("sudo /bin/chgrp -R administrador ".$rest_dir, $retval);
        
        $output = system("sudo /bin/chgrp -R administrador ".$this->_target_path['jsMain'], $retval);
        $output = system("sudo /bin/chgrp -R administrador ".$this->_target_path['jsAdminUserController'], $retval);
    }

    public function checkRequirements()
    {
        // Check if module classes already exists
        $mod_dir = $this->_target_path['modules']."/".$this->_module_name;
        if (file_exists($mod_dir))
        {
            return array(
                'success' => false,
                'msg' => 'El módulo ya existe'
            );
        }    
        
        // Try to write and delete file in some target folders
        $file = "test.test";
        $paths = array(
            $this->_resources_path,
            $this->_target_path['modules'],
            $this->_target_path['REST'],
            $this->_target_path['ui_plugin']
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
        $this->_setJsMain();
        $this->_setJsAdminUserController();
        
        $this->_createPluginLink();
        
        $this->_modifyUserModel();
        $this->_modifyUserControllerGetAllMethod();
        $this->_modifyUserControllerSaveMethod();
        $this->_modifyUserControllerSaveVarMethod();
        
        $this->_refreshPaths();    
        $this->_restoreGrants();
    }

    private function _refreshPaths()
    {
        $cmd = "cd ".$this->_base_path." && ./refresh-autoload.sh";
        $output = system($cmd, $retval);

        return true;
    }

    private function _setModuleFiles()
    {
        $mod_dir = $this->_target_path['modules']."/".$this->_module_name;

        // Copy template to final modules directory
        $command = "cp -av ".$this->_template_path['module']." ".$this->_target_path['modules']."/";

        \shell_exec($command);

        // Rename module files
        $old_name = $this->_target_path['modules']."/[MODULE_NAME]";
        $new_name = $mod_dir;
        \rename($old_name, $new_name);

        // Replace file contents
        $phpfiles = $this->_getDirContents($new_name, '/\.php$/');
        $jsfiles = $this->_getDirContents($new_name, '/\.js$/');

        $allfiles = array_merge($phpfiles, $jsfiles);

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
        $rest_dir = $this->_target_path['REST']."/".$this->_module_name;

        // Copy template to final modules directory
        $command = "cp -av ".$this->_template_path['REST']." ".$this->_target_path['REST']."/";

        \shell_exec($command);

        $old_name = $this->_target_path['REST']."/[MODULE_NAME]";
        $new_name = $rest_dir;
        \rename($old_name, $new_name);

        // Replace file contents
        $phpfiles = $this->_getDirContents($new_name, '/\.php$/');

        foreach($phpfiles as $phpfile)
        {
            $content = \file_get_contents($phpfile);
            $content = $this->_replaceData($content);

            \file_put_contents($phpfile, $content);
        }

        return true;
    }

    private function _createPluginLink()
    {
        $target = "../../../../../../modules/".$this->_module_name."/UI";
        $link = $this->_target_path['ui_plugin']."/".$this->_module_name;

        \mkdir($link);

        \symlink ( $target, $link."/UI");

        return true;
    }

    private function _replaceData($text)
    {
        $search = array(
            "[MODULE_NAME]",
            "[CA_MODULE_DESCRIPTION]", "[ES_MODULE_DESCRIPTION]", 
            "[AUTHOR]", 
            "_TEMPLATE_");
        
        $replace = array(
            $this->_module_name,
            $this->_module_description['ca'], $this->_module_description['es'],
            $this->_author,
            "");

        $text = str_replace($search, $replace, $text);

        return $text;
    }

    private function _setJsMain()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['jsMain']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['jsMain']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG]", $s_text, $t_text);

        \file_put_contents($this->_target_path['jsMain'], $f_text);

        return true;
    }

    private function _setJsAdminUserController()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['jsAdminUserController']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['jsAdminUserController']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG]", $s_text, $t_text);

        \file_put_contents($this->_target_path['jsAdminUserController'], $f_text);

        return true;
    }

    private function _modifyUserModel()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['adminUserModel']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['model_user']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG]", $s_text, $t_text);

        \file_put_contents($this->_target_path['model_user'], $f_text);

        return true;
    }

    private function _modifyUserControllerGetAllMethod()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['adminUserControllerGetAll']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['controller_user']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG_USER_GETALL]", $s_text, $t_text);

        \file_put_contents($this->_target_path['controller_user'], $f_text);

        return true;
    }

    private function _modifyUserControllerSaveMethod()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['adminUserControllerSave']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['controller_user']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG_USER_SAVE]", $s_text, $t_text);

        \file_put_contents($this->_target_path['controller_user'], $f_text);

        return true;
    }

    private function _modifyUserControllerSaveVarMethod()
    {
        $s_text = \file_get_contents($this->_replacementcode_path['adminUserControllerSaveVar']);
        $s_text = $this->_replaceData($s_text);

        $t_text = \file_get_contents($this->_target_path['controller_user']);

        $f_text = str_replace("// [WIZARD_MODULE_TAG_USER_SAVE_VAR]", $s_text, $t_text);

        \file_put_contents($this->_target_path['controller_user'], $f_text);

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
}