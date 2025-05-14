
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create a .env file in the container if it doesn't exist
RUN touch .env

EXPOSE 5000

# Use environment variables from .env file
CMD ["python", "app.py"]
