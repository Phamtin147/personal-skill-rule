@echo off
chcp 65001 >nul
echo ========================================================
echo   ANIME SPEECH-TO-TEXT ENGINE (By Phamtin147)
echo ========================================================

if "%~1"=="" (
    echo [Huong dan] Keo tha file video vao day hoac go lenh:
    echo run_transcribe.bat "duong_dan_video.mkv"
    pause
    exit /b
)

set VIDEO_FILE=%~1
echo [Dang xu ly file]: %VIDEO_FILE%

:: Kiem tra neu co Docker
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo [Phat hien Docker] Dang chay AI Engine qua Docker GPU...
    docker run --rm --gpus all -v "%~dp1:/videos" phamtin147/anime-transcribe-engine:latest "/videos/%~nx1" --model large-v3 --separate
    echo [Giai phong tai nguyen] Dang tat Docker de tiet kiem RAM va GPU...
    docker compose down >nul 2>nul
    goto END
)

:: Kiem tra neu co Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [Phat hien Python] Dang chay engine Python truc tiep...
    python engine/transcribe.py "%VIDEO_FILE%" --model large-v3 --separate
    goto END
)

echo [THONG BAO] Khong tim thay Docker hoac Python tren may.
echo Ban co the chay truc tiep 100%% Free tren Google Colab qua file:
echo notebooks/Google_Colab_Anime_Transcribe.ipynb
pause

:END
echo [XONG] Da tao file _dialogues.json va phu de thoai goc!
pause
