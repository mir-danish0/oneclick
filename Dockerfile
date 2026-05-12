# --- Frontend Build Stage ---
FROM node:20-bookworm AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Backend & System Dependencies Stage ---
FROM node:20-bookworm

# Prevent interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    ghostscript \
    python3 \
    python3-pip \
    python3-venv \
    poppler-utils \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set up Python virtual environment
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install --no-cache-dir \
    pypdf \
    pdf2image \
    pikepdf \
    reportlab \
    Pillow \
    yt-dlp \
    pdf2docx

# Working directory for backend
WORKDIR /app

# Copy backend package.json and install
COPY backend/package*.json ./
RUN npm ci

# Copy backend source
COPY backend/ ./

# Copy built frontend from the builder stage into backend's dist folder
COPY --from=frontend-builder /frontend/dist ./dist

# Create tmp directory
RUN mkdir -p tmp

# Expose port 5000
EXPOSE 5000

# Start server
CMD ["npm", "start"]
