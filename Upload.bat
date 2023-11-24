@echo off

:: Ask the user for the directory name
set /p directory_name=Enter directory name: 

:: Create a temporary VBScript file to display the folder selection dialog
echo Set objShell = CreateObject("Shell.Application") > %temp%\FolderDialog.vbs
echo Set objFolder = objShell.BrowseForFolder(0, "Select a destination folder", 0, 0) >> %temp%\FolderDialog.vbs
echo If Not objFolder Is Nothing Then >> %temp%\FolderDialog.vbs
echo     Wscript.Echo objFolder.Self.Path >> %temp%\FolderDialog.vbs
echo End If >> %temp%\FolderDialog.vbs

:: Run the VBScript and capture the selected folder path
for /f %%A in ('cscript //nologo %temp%\FolderDialog.vbs') do set "destination_path=%%A"

:: Delete the temporary VBScript file
del %temp%\FolderDialog.vbs

:: Check if the user canceled the folder selection
if "%destination_path%" == "" (
    echo Folder selection canceled.
    pause
    exit /b
)

:: Create the directory in the selected path
if not exist "%destination_path%\%directory_name%" (
    mkdir "%destination_path%\%directory_name%"
    echo Directory "%directory_name%" created in  "%destination_path%".
    

) else (
    echo Directory "%directory_name%" already exists in "%destination_path%".
)

pause
