@echo off
cd /d "%~dp0"
node --trace-uncaught .
cmd /k