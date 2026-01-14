@echo off
REM Simple batch file wrapper for the PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1"
