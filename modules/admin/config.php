<?php

/* 
 * ADMIN module configuration file
 */

$config = array(
    "NAME"      => "ADMIN",
    "VERSION"   => "1.0.0.0",
    "ICON"      => "x-fa fa-cog",
    
    "DBPARAMS" => array(

    ),

    "MENU"      => array(
        "UI" => array(
            array(
                "alias"     => "admin",
                "icon"      => "x-fa fa-cog",
                "label"     => "",
                "children"  => array(
                    array(
                        "alias"     => "admin-userGroup",
                        "icon"      => "x-fa fa-group",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "admin-user",
                        "icon"      => "x-fa fa-user",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "admin-plugin",
                        "icon"      => "x-fa fa-plug",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "admin-config",
                        "icon"      => "x-fa fa-cog",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "admin-baseConfig",
                        "icon"      => "x-fa fa-cog color-red",
                        "label"     => "",
                        "children"  => array()
                    )
// [WIZARD_MAINTENANCE_MENU_UI_TAG] 
                )
            )
        ),
        "admin"    => array()
    )
);
