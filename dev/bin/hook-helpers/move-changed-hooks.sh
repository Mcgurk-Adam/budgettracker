#!/bin/sh
FILES=git-hooks/*.sh
for f in $FILES
do
	WAS_CHANGED=`git diff HEAD@{1} --stat -- $f | wc -l`
	if [ $WAS_CHANGED -gt 0 ]
	then
		F_NAME="$(cut -d'/' -f2 <<<"$f")"
		FILE_NAME_NO_EXTENSION="$(cut -d'.' -f1 <<<"$F_NAME")"
		cp -v -f $f .git/hooks/$FILE_NAME_NO_EXTENSION
		chmod +x .git/hooks/$FILE_NAME_NO_EXTENSION
	fi
done