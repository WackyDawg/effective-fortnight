# Use the official Ubuntu as the base image
FROM ubuntu:latest

# Set the maintainer label
LABEL maintainer="your-email@example.com"

# Update the package list and install necessary packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    vim \
    git \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Create a directory for Anonsurf
RUN mkdir /Anonsurf

# Set the working directory to /Anonsurf
WORKDIR /Anonsurf

# Clone the Anonsurf repository
RUN git clone https://github.com/Und3rf10w/kali-anonsurf.git

# Change the directory to the cloned repository
WORKDIR /Anonsurf/kali-anonsurf

# Run the installer script
RUN chmod +x installer.sh && ./installer.sh

# Expose a port (if needed)
EXPOSE 8080

# Run Anonsurf start command
CMD ["anonsurf", "start"]
