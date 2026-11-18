@echo off
setlocal
echo Starting SkillSwap Application (Frontend + Backend)...
call "%~dp0tools\node.cmd" "%~dp0tools\launch_servers.cjs"
endlocal
