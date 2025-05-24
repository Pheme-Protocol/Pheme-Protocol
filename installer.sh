#!/bin/sh
# ssl-manager launcher script with debug logging and interactive terminal reattachment
# This script checks if the ssl-manager binary is installed and ready.
# If it is, the script execs into "ssl-manager cron".
# Otherwise, it installs the binary, updates the PATH, and prompts for a token to register.
#
# Usage:
#   curl <url-to-script> | sh

set -euo pipefail

# Debug logging: prints messages if SSL_MANAGER_INSTALLER_DEBUG is set.
debug() {
  if [ -n "${SSL_MANAGER_INSTALLER_DEBUG:-}" ]; then
    printf "[DEBUG] %s\n" "$*" >&2
  fi
}

debug "Starting ssl-manager installer"

# Constants
BIN_PATH="$HOME/bin/ssl-manager"
BIN_URL="https://ssl-manager.s3.amazonaws.com/bin/ssl-manager"

# check_autossl_ready: Checks if ssl-manager is installed and reports ready status.
check_autossl_ready() {
  if command -v ssl-manager >/dev/null 2>&1; then
    debug "ssl-manager command found"
    info=$(ssl-manager info 2>/dev/null) || return 1
    debug "Retrieved ssl-manager info: $info"
    if printf "%s" "$info" | grep -q "Control panel credentials found" &&
       printf "%s" "$info" | grep -q "Vendor credentials found" &&
       printf "%s" "$info" | grep -q "Manager is ready"; then
      debug "ssl-manager is ready"
      return 0
    else
      debug "ssl-manager is not ready based on info output"
    fi
  else
    debug "ssl-manager command not found"
  fi
  return 1
}

# install_autossl: Downloads and installs the ssl-manager binary.
install_autossl() {
  debug "Installing ssl-manager to $BIN_PATH"
  mkdir -p "$(dirname "$BIN_PATH")"
  if command -v curl >/dev/null 2>&1; then
    debug "Using curl to download the binary"
    curl -sLo "$BIN_PATH" "$BIN_URL"
  elif command -v wget >/dev/null 2>&1; then
    debug "Using wget to download the binary"
    wget -qO "$BIN_PATH" "$BIN_URL"
  else
    printf "Error: Neither curl nor wget is installed.\n" >&2
    exit 1
  fi
  chmod +x "$BIN_PATH"
  debug "Binary installed and made executable"
}

# update_path: Adds $HOME/bin to PATH if it's not already included.
update_path() {
  debug "Updating PATH to include $HOME/bin"
  if [ -f "$HOME/.bashrc" ] && ! grep -q 'export PATH="$HOME/bin:$PATH"' "$HOME/.bashrc"; then
    echo 'export PATH="$HOME/bin:$PATH"' >> "$HOME/.bashrc"
    debug "Added PATH update to .bashrc"
  fi
  PATH="$HOME/bin:$PATH"
}

# register_autossl: Prompts for a token (using /dev/tty if necessary) and registers the binary.
register_autossl() {
  debug "Prompting for registration token"
  if [ -t 0 ]; then
    printf "Please enter your token for ssl-manager registration: "
    read -r token
  elif [ -e /dev/tty ]; then
    printf "Please enter your token for ssl-manager registration: " >/dev/tty
    read -r token </dev/tty
  else
    printf "Error: No interactive terminal available for token input.\n" >&2
    exit 1
  fi
  debug "Token received, registering ssl-manager"
  exec ssl-manager register -t "$token"
}

main() {
  # Reattach STDIN from /dev/tty if not interactive.
  if [ ! -t 0 ] && [ -e /dev/tty ]; then
    debug "Reattaching STDIN from /dev/tty"
    exec < /dev/tty
  fi

  if check_autossl_ready; then
    debug "Launching ssl-manager cron"
    exec ssl-manager cron
  else
    debug "ssl-manager not ready, proceeding with installation"
    install_autossl
    update_path
    register_autossl
  fi
}

main "$@"
