# 1. Base image: A clean Ubuntu 22.04 environment
FROM ubuntu:22.04

# 2. Prevent interactive prompts during package installation (e.g., timezone configuration)
ENV DEBIAN_FRONTEND=noninteractive

# 3. Update package lists and install development tools: compiler, CMake, and Git
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    git \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# 4. Set the working directory inside the container (equivalent to 'cd /app')
WORKDIR /app

# 5. Copy all project files from the host machine into the container
COPY . .

# 6. Create a build directory, configure the project with CMake, and compile it
RUN mkdir build && cd build && cmake .. && make
# 7. Set the default command to execute when the container starts
CMD ["./build/wolt_recommender_app", "5555"]