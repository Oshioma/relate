# Relate video transcriber — see README.md.
FROM python:3.12-slim

# ffmpeg cuts the audio into chunks; deno is the JavaScript runtime yt-dlp
# needs to get past YouTube's player challenges.
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
 && rm -rf /var/lib/apt/lists/*
COPY --from=denoland/deno:bin /deno /usr/local/bin/deno

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py start.sh ./
RUN chmod +x start.sh

ENV PORT=8080 \
    JOBS_DIR=/data/jobs \
    PYTHONUNBUFFERED=1
EXPOSE 8080

# One process on purpose: jobs live in this process's memory (mirrored to
# JOBS_DIR). Concurrency is MAX_CONCURRENT_JOBS threads inside it.
CMD ["./start.sh"]
