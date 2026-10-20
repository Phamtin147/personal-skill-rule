# Dockerfile for Anime Sub Speech-to-Text Engine
# Author: Amtia(NOFACE)
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

# Cài đặt ffmpeg và các công cụ hệ thống cần thiết
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libsndfile1 \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cài đặt dependencies Python
COPY engine/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code engine
COPY engine/ /app/engine/

# Mặc định ánh xạ thư mục phim vào /videos
WORKDIR /videos

ENTRYPOINT ["python", "/app/engine/transcribe.py"]
CMD ["--help"]
