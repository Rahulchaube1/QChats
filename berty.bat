@echo off
REM Wrapper script to run Berty via WSL with CGO and Linux toolchain support
wsl -e bash -c "cd '/mnt/c/Users/Rahul Chaube/OneDrive/berty-master/berty-master' && ./berty %*"
