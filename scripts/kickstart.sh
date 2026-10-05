#!/bin/bash

# Setup script for Faktion project
# This script ensures the correct Node.js version, pnpm, and Python environment are set up

# http://redsymbol.net/articles/unofficial-bash-strict-mode/
set -euo pipefail

echo "🚀 Setting up Faktion development environment..."

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*)    echo "macos";;
        Linux*)     echo "linux";;
        CYGWIN*|MINGW32*|MSYS*|MINGW*) echo "windows";;
        *)          echo "unknown";;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install brew if not present (macOS only)
install_brew() {
    if [ "$(detect_os)" = "macos" ]; then
        if ! command_exists brew; then
            echo "📦 Installing Homebrew..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
            echo "✅ Homebrew installed successfully"
        fi
    fi
}

# Function to install pre-commit using appropriate method
install_precommit() {
    echo "📦 Setting up pre-commit..."
    
    if ! command_exists pre-commit; then
        case "$(detect_os)" in
            macos)
                install_brew
                echo "📦 Installing pre-commit via Homebrew..."
                brew install pre-commit
                ;;
            linux)
                echo "📦 Installing pre-commit via pip..."
                python3 -m pip install --user pre-commit
                ;;
            *)
                echo "📦 Installing pre-commit via pip..."
                python3 -m pip install --user pre-commit
                ;;
        esac
        echo "✅ pre-commit installed successfully"
    else
        echo "✅ pre-commit already installed"
    fi
}

# Function to install nvm if not present
install_nvm() {
    if ! command_exists nvm; then
        echo "📦 Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        
        # Source nvm in current shell
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
        
        echo "✅ nvm installed successfully"
    fi
}

# Function to setup Node.js
setup_nodejs() {
    echo "📦 Setting up Node.js..."
    
    # Load nvm
    #
    # v.dzyuba@faktion.com: I added `--no-use` as a workaround for
    # https://github.com/nvm-sh/nvm/issues/1985
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" --no-use
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    # Check if nvm is available after loading
    if ! command_exists nvm; then
        echo "❌ nvm is not available. Installing nvm..."
        install_nvm
        # Reload nvm
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    fi
    
    # Use the Node.js version specified in .nvmrc
    echo "📦 Installing/using Node.js version from .nvmrc..."

     # Try to use the version, install if it doesn't exist
    if ! nvm use 2>/dev/null; then
        echo "📦 Node.js version not found, installing from .nvmrc..."
        nvm install
        nvm use
    fi

    nvm use
    
    # Verify Node.js version
    NODE_VERSION=$(node --version)
    echo "✅ Node.js version: $NODE_VERSION"
}

# Function to setup pnpm
setup_pnpm() {
    echo "📦 Setting up pnpm..."

    export COREPACK_ENABLE_DOWNLOAD_PROMPT=0

    # Corepack was removed from the Node distribution in Node 25+; install it
    # from npm when missing so package.json#packageManager still works.
    if ! command_exists corepack; then
        echo "📦 Installing Corepack..."
        npm install -g corepack@latest
    fi

    echo "📦 Enabling Corepack..."
    corepack enable

    local package_manager
    package_manager="$(node -p "require('./package.json').packageManager" 2>/dev/null || true)"
    if [ -z "${package_manager}" ]; then
        echo "❌ package.json is missing a packageManager field"
        exit 1
    fi

    echo "📦 Preparing ${package_manager}..."
    corepack prepare "${package_manager}" --activate

    if ! pnpm --version >/dev/null 2>&1; then
        echo "❌ pnpm is not runnable after Corepack prepare"
        echo "   Tried to activate: ${package_manager}"
        echo "   Corepack version: $(corepack --version)"
        exit 1
    fi

    echo "✅ pnpm: $(pnpm --version)"
}

# Function to setup Python environment
setup_python() {
    echo "🐍 Setting up Python environment..."

    # Check if UV is installed
    if ! command_exists uv; then
        TARGET_UV_VERSION='0.8.13'

        echo "📦 Installing uv..."
        curl -LsSf "https://astral.sh/uv/${TARGET_UV_VERSION}/install.sh" | sh

         # Make uv immediately available in this script
        if [ -f "$HOME/.local/bin/env" ]; then
            source "$HOME/.local/bin/env"
        fi
    fi

    # Check if UV version command works, if not show error and exit
    if ! uv self version >/dev/null 2>&1; then
        echo "❌ Error: UV is installed but the 'self version' command is not supported."
        echo "   This usually means you have an old version of UV installed."
        echo ""
        echo "   Please upgrade UV to the latest version:"
        echo "   • If installed via Homebrew: brew upgrade uv"
        echo "   • If installed via pip: pip install --upgrade uv"
        echo "   • If installed via curl: curl -LsSf https://astral.sh/uv/install.sh | sh"
        echo ""
        echo "   After upgrading, run this script again."
        exit 1
    fi

    # Check UV version
    UV_VERSION="$(uv self version)"
    echo "✅ ${UV_VERSION}"
    
    # Check Python version
    PYTHON_VERSION="$(uv run --no-sync python --version)"
    echo "✅ ${PYTHON_VERSION}"
    
    # Install dependencies
    echo "📦 Installing Python dependencies..."
    uv sync --all-packages --no-dev
    
    # Install dev.dependencies
    echo "📦 Installing Python dev dependencies..."
    uv sync --all-packages --group dev

    # Install pre-commit hooks
    echo "📦 Installing pre-commit hooks..."
    uv run pre-commit install --install-hooks
    
    echo "✅ Python environment setup complete"
}

# Function to setup environment files
setup_environment_files() {
    echo "🔧 Setting up environment files..."
    
    # Find all .env.example files in apps and packages directories
    while IFS= read -r -d '' example_file; do
        # Get the directory of the example file
        dir=$(dirname "$example_file")
        # Create the corresponding .env file path
        env_file="$dir/.env"
        
        if [ ! -f "$env_file" ]; then
            echo "📄 Creating $env_file from $(basename "$example_file")"
            cp "$example_file" "$env_file"
        else
            echo "✅ $env_file already exists, skipping"
        fi
    done < <(find apps packages -name ".env.example" -type f -print0 2>/dev/null)
    
    echo "✅ Environment files setup complete"
}

# Function to setup TypeScript dependencies
setup_typescript() {
    echo "📦 Setting up TypeScript dependencies..."
    
    # Install dependencies
    echo "📦 Installing Node.js dependencies..."
    pnpm install
    
    echo "✅ TypeScript dependencies setup complete"
}

# Function to verify setup
verify_setup() {
    echo "🔍 Verifying setup..."
    
    # Check Node.js
    if command_exists node; then
        echo "✅ Node.js: $(node --version)"
    else
        echo "❌ Node.js not found"
        return 1
    fi
    
    # Check pnpm
    if command_exists pnpm; then
        echo "✅ pnpm: $(pnpm --version)"
    else
        echo "❌ pnpm not found"
        return 1
    fi
    
    # Check Python virtual environment
    if [ -d ".venv" ]; then
        echo "✅ Python virtual environment exists"
    else
        echo "❌ Python virtual environment not found"
        return 1
    fi
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        echo "✅ Node.js dependencies installed"
    else
        echo "❌ Node.js dependencies not found"
        return 1
    fi
    
    # Check pre-commit
    if command_exists pre-commit; then
        echo "✅ pre-commit: $(pre-commit --version)"
    else
        echo "❌ pre-commit not found"
        return 1
    fi
    
    # Check environment files
    echo "🔍 Checking environment files..."
    env_files_count=0
    while IFS= read -r -d '' env_file; do
        if [ -f "$env_file" ]; then
            env_files_count=$((env_files_count + 1))
        fi
    done < <(find apps packages -name ".env" -type f -print0 2>/dev/null)
    
    if [ $env_files_count -gt 0 ]; then
        echo "✅ Found $env_files_count environment file(s)"
    else
        echo "⚠️  No environment files found (this might be expected)"
    fi

    echo "✅ All verifications passed!"
}

# Main execution
main() {
    echo "🖥️  Detected OS: $(detect_os)"
    
    # Setup Node.js and pnpm
    setup_nodejs
    setup_pnpm
    
    # Install pre-commit (before Python setup to ensure it's available)
    install_precommit
    
    # Setup environment files (before Python and TypeScript setup)
    setup_environment_files
    
    # Setup Python environment
    setup_python
    
    # Setup TypeScript dependencies
    setup_typescript
    
    # Verify everything is set up correctly
    verify_setup
    
    echo ""
    echo "🎉 Setup complete! You can now run:"
    echo "   pnpm dev        # Start development server (both TS and Python)"
    echo "   pnpm dev:sw     # Start only TypeScript development server"
    echo "   pnpm dev:ml     # Start only Python development server"
    echo "   pnpm build      # Build the project"
    echo "   pnpm lint       # Run linting"
    echo ""
}

# Run main function
main "$@" 