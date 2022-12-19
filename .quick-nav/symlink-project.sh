#!/bin/bash
DIR=$(cd "$(dirname "$0")"; pwd)

if [ -z "$DIR" ]
then
  DIR=.
fi

projects=(api devops mock-api)


for p in "${projects[@]}"
do
  link=$DIR/${p}-root
  source=../apps/$p/src
#  if [ -L ${link} ] ; then
#     if [ -e ${link} ] ; then
#        echo "Good link"
#     else
#        echo "Broken link"
#     fi
#  elif
  if [ -e ${link} ] ; then
     echo "existing link '${link}'"
  else
     ln -s $source $link
  fi
done

