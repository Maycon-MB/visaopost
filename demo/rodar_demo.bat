@echo off
set PYTHON=C:\Users\MayconBruno\AppData\Local\Programs\Python\Python313\python.exe
echo.
echo Gerando post da otica...
%PYTHON% generate_post.py
echo.
echo Iniciando servidor para o celular...
echo (mantenha esta janela aberta, pressione Ctrl+C para sair)
echo.
%PYTHON% serve.py
pause
