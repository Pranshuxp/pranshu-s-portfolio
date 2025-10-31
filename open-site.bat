@echo off
REM Open the portfolio index.html in the default browser (file://)
SET SCRIPT_DIR=%~dp0
start "" "%SCRIPT_DIR%index.html"
exit /b 0
