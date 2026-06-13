FROM python:3.11-slim

# Install system dependencies for OpenCV (cv2) and ReportLab
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files
COPY . .

# Expose the default port (can be overridden by the runner)
EXPOSE 5001

# Run the Flask app with Gunicorn binding to port 5001 (or Hugging Face's 7860)
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
