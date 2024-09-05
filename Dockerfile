# Use an official Ubuntu as a parent image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages and dependencies
RUN apt-get update && \
    apt-get install -y \
    sudo \
    xfce4 \
    xfce4-goodies \
    xrdp \
    dbus-x11 \
    wget \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Ngrok
RUN wget https://bin.equinox.io/c/4b4E1sW7V9s/ngrok-stable-linux-amd64.zip && \
    unzip ngrok-stable-linux-amd64.zip && \
    mv ngrok /usr/local/bin/ngrok && \
    rm ngrok-stable-linux-amd64.zip

# Create a new user with sudo privileges
RUN useradd -m -s /bin/bash myuser && \
    echo "myuser:password" | chpasswd && \
    echo "myuser ALL=(ALL:ALL) ALL" >> /etc/sudoers

# Configure XRDP to use XFCE
RUN echo "xfce4-session" > /home/myuser/.xsession && \
    chown myuser:myuser /home/myuser/.xsession

# Start XRDP and Ngrok
CMD ["sh", "-c", "service xrdp start && ngrok tcp 3389 && tail -f /var/log/xrdp-sesman.log"]
