# Base image with Node.js 20 on Debian Bookworm
FROM node:20-bookworm

# Prevent interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PYTHONIOENCODING=utf-8
ENV NODE_PATH=/app/node_modules

# Install Python3, FFmpeg, Chromium, Fonts, and system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    chromium \
    fontconfig \
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy source code and scripts
COPY . .

# Clean install Node dependencies inside Linux container
RUN rm -rf node_modules package-lock.json && npm install --registry=https://registry.npmmirror.com

# Install Python dependencies
RUN pip3 install --no-cache-dir pydub requests --break-system-packages || pip3 install --no-cache-dir pydub requests

# Create necessary runtime directories
RUN mkdir -p data renders downloads public

# Expose Web Server port
EXPOSE 3980

# Start Express server
CMD ["node", "server.js"]
