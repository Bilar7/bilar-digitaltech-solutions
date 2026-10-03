@echo off
setlocal EnableExtensions
cd /d "%~dp0"

echo ================================================================
echo BILAR DIGITALTECH SOLUTIONS
echo LANÇAMENTO 2.0.0 - SERVIDOR LOCAL
echo PORTA FIXA: 5530
echo ================================================================

if not exist package.json (
  echo ERRO: package.json nao encontrado.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo ERRO: Node.js nao esta instalado ou nao esta no PATH.
  echo Instale uma versao LTS do Node.js e execute este ficheiro novamente.
  pause
  exit /b 1
)

where npm >nul 2>&1
if errorlevel 1 (
  echo ERRO: npm nao esta disponivel no PATH.
  pause
  exit /b 1
)

echo Node: 
node --version
echo npm:  
npm --version
echo.

rem Verifica uma dependencia critica em vez de verificar apenas a pasta node_modules.
if not exist "node_modules\vite\bin\vite.js" goto INSTALL_DEPS
if not exist "node_modules\react\package.json" goto INSTALL_DEPS
if not exist "node_modules\firebase\package.json" goto INSTALL_DEPS

echo [1/2] Dependencias completas encontradas.
goto START_SITE

:INSTALL_DEPS
echo [1/2] Dependencias ausentes ou incompletas. A reparar/instalar...
echo.
echo A primeira tentativa usa o cache local sempre que possivel e varias tentativas de rede.
call npm install --prefer-offline --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
if not errorlevel 1 goto VERIFY_DEPS

echo.
echo A primeira tentativa falhou. A verificar o cache e a tentar novamente...
call npm cache verify >nul 2>&1
call npm install --prefer-offline --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
if errorlevel 1 (
  echo.
  echo ================================================================
  echo ERRO: as dependencias nao puderam ser instaladas.
  echo ================================================================
  echo.
  echo O erro ECONNRESET indica uma interrupcao da ligacao com o npm.
  echo O EPERM indica que alguns ficheiros da instalacao anterior estao bloqueados.
  echo.
  echo FECHA outras janelas de terminal/VS Code que estejam a executar este projecto
  echo e executa este BAT novamente com uma ligacao de Internet estavel.
  echo.
  echo IMPORTANTE: o site NAO sera iniciado com dependencias incompletas.
  pause
  exit /b 1
)

:VERIFY_DEPS
if not exist "node_modules\vite\bin\vite.js" (
  echo.
  echo ERRO: npm terminou, mas o Vite nao foi instalado correctamente.
  echo Execute este BAT novamente depois de fechar processos Node deste projecto.
  pause
  exit /b 1
)
if not exist "node_modules\react\package.json" (
  echo ERRO: React nao foi instalado correctamente.
  pause
  exit /b 1
)
if not exist "node_modules\firebase\package.json" (
  echo ERRO: Firebase nao foi instalado correctamente.
  pause
  exit /b 1
)

echo.
echo Dependencias verificadas com sucesso.

:START_SITE
echo.
echo [2/2] A iniciar o site na porta dedicada 5530...
echo SITE:  http://localhost:5530/
echo ADMIN: http://localhost:5530/admin
echo.
echo Nao feche esta janela enquanto estiver a usar o site.
echo.
call npm run dev
set CODE=%errorlevel%
if not "%CODE%"=="0" (
  echo.
  echo O servidor terminou com o codigo %CODE%.
  pause
)
endlocal
