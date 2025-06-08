@echo off
if exist "out/" (
	rmdir /s /q "out" || goto :error
)
xcopy /s/e/y/i "images" "out/spell-builder-win32-x64/images" || goto :error
xcopy /s/e/y/i "data" "out/spell-builder-win32-x64/data" || goto :error
cd out || goto :error
set /p "version=Enter current version: " || goto :error
tar -a -c -f "spell-builder-%version%.zip" "spell-builder-win32-x64" || goto :error
goto :EOF

:error
echo "Failed with error #%errorlevel%."
exit /b %errorlevel%