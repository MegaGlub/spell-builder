@echo off
xcopy /s/e/y/i %~dp0\images %~dp0\out\spell-builder-win32-x64\images
xcopy /s/e/y/i %~dp0\data %~dp0\out\spell-builder-win32-x64\data
cd out
set /p "version=Enter current version: "
tar.exe -a -c -f spell-builder-%version%.zip spell-builder-win32-x64