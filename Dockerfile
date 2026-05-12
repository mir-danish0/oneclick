# Use a Debian-based Node image (Bookworm) so we can easily install LibreOffice via apt
FROM node:20-bookworm

# Prevent interactive prompts during apt installations
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies: 
# - libreoffice (for office to pdf)
# - ghostscript (for pdf compression)
# - python3, pip, venv (for pdf scripts)
# - poppler-utils (required by pdf2image)
# - ffmpeg (required by yt-dlp for video processing)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libreoffice \
    ghostscript \
    python3 \
    python3-pip \
    python3-venv \
    poppler-utils \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Set up a Python virtual environment and install Python dependencies
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN pip install --no-cache-dir \
    pypdf \
    pdf2image \
    pikepdf \
    reportlab \
    Pillow \
    yt-dlp

# Set the working directory to the backend folder
WORKDIR /app

# Copy the backend package.json and install Node dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy the rest of the backend files
COPY backend/ ./

# Create the tmp directory
RUN mkdir -p tmp

# Expose the port the Express server runs on
EXPOSE 5000

# Start the Express server
CMD ["npm", "start"]
