<?php

/* 
 * [MODULE_NAME] module configuration file
 */

$config = array(
    "NAME"      => "[MODULE_NAME]",
    "VERSION"   => "1.0.0.0",
    "ICON"      => "x-fa fa-question",

    "DBPARAMS" => array(

    ),

    "MENU"      => array(
        "UI"    => array(
            array(
                "alias"     => "[MODULE_NAME]-admin",
                "label"     => "",
                "icon"      => "x-fa fa-cog",
                "children"  => array(
                    array(
                        "alias"     => "[MODULE_NAME]-userGroup",
                        "icon"      => "x-fa fa-group",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "[MODULE_NAME]-user",
                        "icon"      => "x-fa fa-user",
                        "label"     => "",
                        "children"  => array()
                    ),
                    array(
                        "alias"     => "[MODULE_NAME]-config",
                        "icon"      => "x-fa fa-cog",
                        "label"     => "",
                        "children"  => array()
                    )
                )
            ),
            array(
                "alias"     => "[MODULE_NAME]-main",
                "label"     => "",
                "icon"      => "x-fa fa-sun-o",
                "children"  => array(
// [WIZARD_MAINTENANCE_MENU_UI_TAG]             
                )
            )
        ),
        "admin" => array(
            array(
                "alias"     => "[MODULE_NAME]-userGroup",
                "icon"      => "x-fa fa-group",
                "label"     => "",
                "children"  => array()
            ),
            array(
                "alias"     => "[MODULE_NAME]-user",
                "icon"      => "x-fa fa-user",
                "label"     => "",
                "children"  => array()
            ),
            array(
                "alias"     => "[MODULE_NAME]-config",
                "icon"      => "x-fa fa-cog",
                "label"     => "",
                "children"  => array()
            )
        )        
    )
);
