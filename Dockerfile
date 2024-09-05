# Use an official Ubuntu as a parent image
FROM ubuntu:20.04

# Set environment variables to avoid interactive prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Update package list and install wget, sudo, and other dependencies
RUN apt-get update && \
    apt-get install -y wget sudo

# Download the Chrome Remote Desktop Debian package
RUN wget https://dl.google.com/linux/direct/chrome-remote-desktop_current_amd64.deb

# Install the downloaded Debian package
RUN sudo apt install -y ./chrome-remote-desktop_current_amd64.deb

# Clean up
RUN rm chrome-remote-desktop_current_amd64.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Run Chrome Remote Desktop setup
RUN DISPLAY= \
    /opt/google/chrome-remote-desktop/start-host --code="4/0AQlEd8wuBY2nfB4CMPepsoBe5d4ORVIPVQqScxHYyvXRhV6Qf7XM7heawx5-ryUkTKnOSg" \
    --redirect-url="https://remotedesktop.google.com/_/oauthredirect" \
    --name=$(hostname) && \
    echo "123456" | /opt/google/chrome-remote-desktop/start-host --pin && \
    echo "123456" | /opt/google/chrome-remote-desktop/start-host --pin && \
    sudo DEBIAN_FRONTEND=noninteractive apt install --assume-yes xfce4 desktop-base dbus-x11 xscreensaver && \
    sudo bash -c 'echo "exec /etc/X11/Xsession /usr/bin/xfce4-session" > /etc/chrome-remote-desktop-session' && \
    sudo systemctl disable lightdm.service

# Replace CMD with the service or application you want to run
# Example: start the remote desktop service if applicable
CMD ["/opt/google/chrome-remote-desktop/chrome-remote-desktop"]
