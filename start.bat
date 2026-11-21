@echo off
title SkillSwap - Frontend ^& Backend Server
cd /d "%~dp0"
echo ===================================================================
echo   Starting SkillSwap Application (Ember Noir UI + Backend API)
echo ===================================================================
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000/api/v1
echo ===================================================================
echo.
call tools\node.cmd tools\launch_servers.cjs
pause
