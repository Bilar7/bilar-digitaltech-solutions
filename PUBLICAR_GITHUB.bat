@echo off
setlocal
cd /d "%~dp0"

echo ================================================================
echo BILAR DIGITALTECH SOLUTIONS - PUBLICAR NO GITHUB
echo ================================================================
where git >nul 2>nul
if errorlevel 1 (
  echo ERRO: Git nao esta instalado ou nao esta no PATH.
  pause
  exit /b 1
)
set /p REPO_URL=Cole aqui o URL do repositorio GitHub: 
if "%REPO_URL%"=="" (
  echo URL nao informado.
  pause
  exit /b 1
)
if not exist .git (
  git init
)
git branch -M main
git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin "%REPO_URL%"
) else (
  git remote set-url origin "%REPO_URL%"
)
git add .
git commit -m "Bilar DigitalTech Solutions - producao"
git push -u origin main
if errorlevel 1 (
  echo.
  echo O push falhou. Verifique o login do GitHub, o URL do repositorio e as permissoes.
  pause
  exit /b 1
)
echo.
echo Publicacao enviada para o GitHub com sucesso.
pause
endlocal
