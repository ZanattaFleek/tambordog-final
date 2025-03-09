@echo off
cls

rem del "C:\Users\programador\Desktop\FSD0043 - AreaDeTrabalho\tambordog\tambordog-frontend\src\backendImports\types\*.ts"

rem xcopy "C:\Users\programador\Desktop\FSD0043 - AreaDeTrabalho\tambordog\tambordog-backend\src\types\*.ts" "C:\Users\programador\Desktop\FSD0043 - AreaDeTrabalho\tambordog\tambordog-frontend\src\backendImports\types"

xcopy "C:\Users\programador\Desktop\FSD0043 - AreaDeTrabalho\tambordog\tambordog-auth\src\config\*.ts" "C:\Users\programador\Desktop\FSD0043 - AreaDeTrabalho\tambordog\tambordog-frontend\src\backendImports\config" /y
