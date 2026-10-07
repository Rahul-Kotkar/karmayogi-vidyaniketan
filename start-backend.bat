@echo off
echo ========================================================
echo Starting Karmayogi Vidyaniketan / Public School Backend Server...
echo API URL: http://localhost:8000/api/info
echo ========================================================
cd backend
if exist "C:\xampp\php\php.exe" (
    "C:\xampp\php\php.exe" -S localhost:8000 router.php
) else (
    php -S localhost:8000 router.php
)
pause
