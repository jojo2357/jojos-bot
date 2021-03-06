@echo off

set version=%1
if "%1"=="" set version=1

TITLE Connect-4 bot running attempt #%version%

set /A version=version+1

javac connect-4-bot/*.java
echo Compilation complete

REM ensures that the directory is correct just in case it gets run from somewhere else
REM this sets the cwd to be wherever the file is located
set directory=%~dp0
Pushd %directory%

FOR /F %%A IN ('WMIC OS GET LocalDateTime ^| FINDSTR \.') DO @SET B=%%A
echo %B:~0,4%-%B:~4, 2%-%B:~6,2%, %time%

node --no-warnings .\index.js

REM see EXIT_CODES.MD for what each one is. 
REM On 1 and 0, the log is not saved becasue the exit was intentional. 
REM On exit of 2 or -1, the log is not immediately deleted for debugging purposes because something went wrong

if errorlevel 2 (
   start call run %version%
   pause
   goto end
)
if errorlevel 1 (
   start call run %version%
   pause
   goto end
)
if errorlevel 0 (
   goto end
)
if errorlevel -1(
   start call run %version%
   pause
   goto end
)

:end
exit
