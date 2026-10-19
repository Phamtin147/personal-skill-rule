#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
transcribe.py - Autonomous Audio Speech-to-Text Engine for Anime & Movies
Author: Phamtin147
Chức năng:
  - Tách âm thanh từ Video
  - (Tùy chọn) Tách giọng nói khỏi nhạc nền bằng Demucs v4
  - Chép lời thoại chính xác bằng Faster-Whisper / Kotoba-Whisper
  - Xuất file _dialogues.json, .ass và .srt sẵn sàng cho pipeline dịch thuật
"""

import os
import sys
import argparse
import subprocess
import json
import shutil
from pathlib import Path

# Fix Unicode on Windows CMD/PowerShell
try:
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    if hasattr(sys.stderr, 'reconfigure'):
        sys.stderr.reconfigure(encoding='utf-8')
except Exception:
    pass

# Cấu hình cache sang ổ F để bảo vệ ổ C (tránh đầy ổ C 128GB)
if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = r"F:\AI_Cache\huggingface"
if "TORCH_HOME" not in os.environ:
    os.environ["TORCH_HOME"] = r"F:\AI_Cache\torch"

# Tự động nạp Scripts của Python hiện tại vào PATH (để tìm ffmpeg.exe và demucs.exe)
scripts_dir = str(Path(sys.executable).parent / "Scripts")
python_dir = str(Path(sys.executable).parent)
current_path = os.environ.get("PATH", "")
if scripts_dir not in current_path:
    os.environ["PATH"] = f"{scripts_dir};{python_dir};{current_path}"

def format_timestamp_ass(seconds: float) -> str:
    """Đổi giây sang định dạng ASS: H:MM:SS.cs"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    cs = int(round((seconds - int(seconds)) * 100))
    if cs == 100:
        s += 1
        cs = 0
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def format_timestamp_srt(seconds: float) -> str:
    """Đổi giây sang định dạng SRT: HH:MM:SS,ms"""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int(round((seconds - int(seconds)) * 1000))
    if ms == 1000:
        s += 1
        ms = 0
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def extract_audio(video_path: Path, output_wav: Path):
    """Trích xuất âm thanh 16kHz Mono từ video"""
    print(f"[1/4] Trích xuất âm thanh từ: {video_path.name}...")
    cmd = [
        "ffmpeg", "-i", str(video_path),
        "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1",
        str(output_wav), "-y"
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

def separate_vocals(audio_wav: Path, output_dir: Path) -> Path:
    """Dùng Demucs v4 để tách riêng giọng nói, loại bỏ 100% nhạc nền BGM"""
    print("[2/4] Đang tách giọng nói khỏi nhạc nền bằng Demucs (Vocal Isolation)...")
    cmd = [
        "demucs", "--two-stems=vocals", "-n", "htdemucs",
        "-o", str(output_dir), str(audio_wav)
    ]
    subprocess.run(cmd, check=True)
    vocals_path = output_dir / "htdemucs" / audio_wav.stem / "vocals.wav"
    if vocals_path.exists():
        print(f" -> Đã tách giọng nói sạch: {vocals_path}")
        return vocals_path
    return audio_wav

def main():
    parser = argparse.ArgumentParser(description="AI Transcribe Engine by Phamtin147")
    parser.add_argument("input", help="Đường dẫn file video hoặc audio")
    parser.add_argument("--model", default="large-v3", help="Model: large-v3, medium, small, hoặc kotoba-tech/kotoba-whisper-v2.0")
    parser.add_argument("--language", default="ja", help="Mã ngôn ngữ: ja (tiếng Nhật), ko (Hàn), en (Anh),...")
    parser.add_argument("--separate", action="store_true", help="Bật tính năng tách nhạc nền trước khi chép lời (Demucs)")
    parser.add_argument("--device", default="auto", help="Thiết bị: cuda, cpu hoặc auto")
    parser.add_argument("--output_dir", default="", help="Thư mục xuất kết quả")

    args = parser.parse_args()
    input_path = Path(args.input).resolve()
    if not input_path.exists():
        print(f"Lỗi: Không tìm thấy file {input_path}")
        sys.exit(1)

    output_dir = Path(args.output_dir).resolve() if args.output_dir else input_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)
    base_name = input_path.stem

    temp_dir = output_dir / f"temp_{base_name}"
    temp_dir.mkdir(exist_ok=True)
    raw_wav = temp_dir / "raw_audio.wav"

    try:
        # Bước 1: Trích xuất audio
        extract_audio(input_path, raw_wav)

        # Bước 2: Tách giọng nếu được yêu cầu
        target_wav = raw_wav
        if args.separate:
            try:
                target_wav = separate_vocals(raw_wav, temp_dir)
            except Exception as e:
                print(f"[Cảnh báo] Lỗi khi chạy Demucs ({e}). Chuyển sang dùng audio gốc.")

        # Bước 3: Chạy Faster-Whisper
        print(f"[3/4] Đang nhận diện lời thoại bằng model '{args.model}' (Ngôn ngữ: {args.language})...")
        from faster_whisper import WhisperModel
        import torch

        if args.device == "auto":
            device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            device = args.device

        compute_type = "float16" if device == "cuda" else "int8"
        print(f" -> Chạy trên phần cứng: {device.upper()} (Compute: {compute_type})")

        cache_hub = os.environ.get("HF_HUB_CACHE", r"F:\AI_Cache\huggingface\hub")
        model = WhisperModel(args.model, download_root=cache_hub, device=device, compute_type=compute_type)
        segments, info = model.transcribe(
            str(target_wav),
            language=args.language,
            beam_size=5,
            vad_filter=True, # Tự động lọc các khoảng lặng không có tiếng người
            vad_parameters=dict(min_silence_duration_ms=500)
        )

        dialogues = []
        ass_lines = []
        srt_blocks = []

        print("[4/4] Đang tổng hợp và tạo file phụ đề...")
        idx = 0
        for seg in segments:
            text = seg.text.strip()
            if not text:
                continue

            start_ass = format_timestamp_ass(seg.start)
            end_ass = format_timestamp_ass(seg.end)
            start_srt = format_timestamp_srt(seg.start)
            end_srt = format_timestamp_srt(seg.end)

            dialogues.append({
                "id": idx,
                "start": start_ass,
                "end": end_ass,
                "speaker": "UNKNOWN",
                "text": text
            })

            # Tạo dòng ASS
            ass_lines.append(f"Dialogue: 0,{start_ass},{end_ass},Default,,0,0,0,,{text}")

            # Tạo khối SRT
            idx_srt = idx + 1
            srt_blocks.append(f"{idx_srt}\n{start_srt} --> {end_srt}\n{text}\n")

            idx += 1

        # Ghi file JSON cho AI dịch
        json_file = output_dir / f"{base_name}_dialogues.json"
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump({
                "source": "AI_TRANSCRIBE_ENGINE",
                "language": args.language,
                "totalDialogues": len(dialogues),
                "dialogues": dialogues
            }, f, ensure_ascii=False, indent=2)

        # Ghi file ASS gốc
        ass_file = output_dir / f"{base_name}_raw.ass"
        ass_header = """[Script Info]
Title: Raw Transcription by Phamtin147
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 640
PlayResY: 360

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,1.5,0,2,20,20,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
        with open(ass_file, "w", encoding="utf-8") as f:
            f.write(ass_header + "\n".join(ass_lines) + "\n")

        # Ghi file SRT gốc
        srt_file = output_dir / f"{base_name}_raw.srt"
        with open(srt_file, "w", encoding="utf-8") as f:
            f.write("\n".join(srt_blocks))

        print(f"\n[HOÀN THÀNH XUẤT SẮC] Đã nhận diện được {len(dialogues)} câu thoại!")
        print(f" -> File JSON đối chiếu dịch: {json_file}")
        print(f" -> File ASS gốc: {ass_file}")
        print(f" -> File SRT gốc: {srt_file}")

    finally:
        # Dọn dẹp thư mục tạm
        if temp_dir.exists():
            shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    main()
