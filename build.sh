#!/bin/bash

#VERSION=${1};
#if [[ -z "$VERSION" ]]
#then
#    echo "Version is required!";
#    exit 1;
#fi


#rm -rf base/UI/index.php # Only enable if index is index.php

cd base/UI-dev/
./../libs/Sencha/Cmd/6.2.2.36/sencha app refresh
./../libs/Sencha/Cmd/6.2.2.36/sencha app build production
cd ../../

#mv base/UI/index.html base/UI/index.php # Only enable if index is index.php