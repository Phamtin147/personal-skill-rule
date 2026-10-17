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

:: Thiet lap thu muc luu Model AI sang o F de bao ve o C 128GB
set "HF_HOME=F:\AI_Cache\huggingface"
set "TORCH_HOME=F:\AI_Cache\torch"

:: 1. Uu tien so 1: Chay truc tiep bang Python 3.11 GPU cuc bo (NVIDIA RTX 3070 Ti)
if exist "F:\Python311\python.exe" (
    echo [Phat hien NVIDIA GPU Python 3.11] Dang chay Faster-Whisper + Demucs cuc nhanh...
    "F:\Python311\python.exe" "%~dp0engine\transcribe.py" "%VIDEO_FILE%" --model large-v3 --separate
    goto END
)

:: 2. Uu tien so 2: Docker GPU (neu may khac clone repo ve co Docker)
where docker >nul 2>nul
if %errorlevel% equ 0 (
    echo [Phat hien Docker] Dang chay AI Engine qua Docker GPU...
    docker run --rm --gpus all -v "%~dp1:/videos" phamtin147/anime-transcribe-engine:latest "/videos/%~nx1" --model large-v3 --separate
    echo [Giai phong tai nguyen] Dang tat Docker de tiet kiem RAM va GPU...
    docker compose down >nul 2>nul
    goto END
)

:: 3. Uu tien so 3: Python he thong
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [Phat hien Python] Dang chay engine Python truc tiep...
    python "%~dp0engine\transcribe.py" "%VIDEO_FILE%" --model large-v3 --separate
    goto END
)

echo [THONG BAO] Khong tim thay Docker hoac Python tren may.
echo Ban co the chay truc tiep 100%% Free tren Google Colab qua file:
echo notebooks/Google_Colab_Anime_Transcribe.ipynb
pause

:END
echo [XONG] Da tao file _dialogues.json va phu de thoai goc!
pause
