# ZippyCoin Wallet Development Guide

This guide provides detailed instructions for setting up, developing, and contributing to the ZippyCoin wallet application.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Architecture Overview](#architecture-overview)
4. [Development Workflow](#development-workflow)
5. [Platform-Specific Setup](#platform-specific-setup)
6. [Testing](#testing)
7. [Security Guidelines](#security-guidelines)
8. [Contributing](#contributing)

## Prerequisites

### Required Software

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Mobile Development

#### iOS Development
- **macOS** (required for iOS development)
- **Xcode** 14+ with iOS 15+ SDK
- **iOS Simulator** or physical iOS device
- **CocoaPods** for iOS dependency management

#### Android Development
- **Android Studio** with Android SDK
- **Android Emulator** or physical Android device
- **Java Development Kit (JDK)** 11+

### Desktop Development
- **Electron** compatible OS (Windows, macOS, Linux)
- Platform-specific build tools (Xcode Command Line Tools on macOS, Visual Studio Build Tools on Windows)

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/zippyfoundation/zippycoin-wallet.git
cd zippycoin-wallet
```

### 2. Install Dependencies

```bash
# Install root dependencies and setup all modules
npm install

# This will automatically run:
# - npm run setup:shared
# - npm run setup:mobile  
# - npm run setup:desktop
```

### 3. Environment Configuration

Create environment files for each platform:

#### Shared Module (`shared/.env`)
```bash
NETWORK=testnet
API_URL=https://api-testnet.zippycoin.org
WEBSOCKET_URL=wss://ws-testnet.zippycoin.org
```

#### Mobile App (`mobile/.env`)
```bash
BUNDLE_ID=org.zippyfoundation.wallet
APP_NAME=ZippyCoin Wallet
DEEP_LINK_SCHEME=zippycoin
```

#### Desktop App (`desktop/.env`)
```bash
REACT_APP_NAME=ZippyCoin Wallet
REACT_APP_VERSION=1.0.0
REACT_APP_API_URL=https://api-testnet.zippycoin.org
```

## Architecture Overview

### Module Structure

```
zippycoin-wallet/
├── shared/                 # Shared business logic
│   ├── src/
│   │   ├── crypto/        # Cryptographic operations
│   │   ├── trust/         # Trust engine integration
│   │   ├── api/           # Blockchain API client
│   │   ├── types/         # TypeScript definitions
│   │   └── utils/         # Utility functions
│   └── package.json
├── mobile/                # React Native mobile app
│   ├── src/
│   │   ├── screens/       # React Native screens
│   │   ├── components/    # Reusable components
│   │   ├── services/      # Platform-specific services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Mobile-specific utilities
│   ├── ios/               # iOS native code
│   ├── android/           # Android native code
│   └── package.json
├── desktop/               # Electron desktop app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # Desktop services
│   │   ├── store/         # Redux store
│   │   └── electron/      # Electron main process
│   └── package.json
└── docs/                  # Documentation
```

### Data Flow

1. **UI Layer**: React Native (mobile) / React (desktop)
2. **State Management**: Redux Toolkit with Redux Persist
3. **Business Logic**: Shared TypeScript modules
4. **Cryptography**: Hardware-backed secure storage + post-quantum crypto
5. **Network**: REST API + WebSocket for real-time updates
6. **Storage**: Platform-specific secure storage

## Development Workflow

### 1. Start Development Servers

#### Mobile Development
```bash
# Start React Native metro bundler
npm run dev:mobile

# In separate terminals:
npm run ios     # iOS simulator
npm run android # Android emulator
```

#### Desktop Development
```bash
npm run dev:desktop
```

### 2. Make Changes

1. **Shared Logic**: Edit files in `shared/src/`
2. **Mobile UI**: Edit files in `mobile/src/`
3. **Desktop UI**: Edit files in `desktop/src/`

### 3. Testing Changes

```bash
# Run all tests
npm test

# Run platform-specific tests
npm run test:shared
npm run test:mobile
npm run test:desktop
```

### 4. Building for Production

```bash
# Build all platforms
npm run build:all

# Build specific platforms
npm run build:mobile
npm run build:desktop
```

## Platform-Specific Setup

### iOS Setup

1. **Install CocoaPods dependencies**:
```bash
cd mobile/ios
pod install
cd ../..
```

2. **Configure signing** in Xcode:
   - Open `mobile/ios/ZippyCoinWallet.xcworkspace`
   - Select project → Signing & Capabilities
   - Set your Team and Bundle Identifier

3. **Add capabilities**:
   - Keychain Sharing
   - Face ID usage
   - Camera usage (for QR scanning)

### Android Setup

1. **Configure signing**:
   - Generate keystore: `keytool -genkey -v -keystore release.keystore -alias zippycoin -keyalg RSA -keysize 2048 -validity 10000`
   - Update `android/gradle.properties`

2. **Set permissions** in `android/app/src/main/AndroidManifest.xml`:
   - Biometric authentication
   - Camera access
   - Internet access

### Desktop Setup

1. **Install platform build tools**:

   **macOS**:
   ```bash
   xcode-select --install
   ```

   **Windows**:
   ```bash
   npm install --global windows-build-tools
   ```

   **Linux**:
   ```bash
   sudo apt-get install build-essential
   ```

2. **Configure app signing** (for distribution):
   - Code signing certificates
   - App notarization (macOS)

## Testing

### Unit Tests

```bash
# Run unit tests for shared logic
cd shared && npm test

# Watch mode for development
cd shared && npm run test:watch
```

### Integration Tests

```bash
# Test mobile app functionality
cd mobile && npm test

# Test desktop app functionality  
cd desktop && npm test
```

### End-to-End Tests

```bash
# Mobile E2E (using Detox)
cd mobile && npm run e2e:ios
cd mobile && npm run e2e:android

# Desktop E2E (using Spectron)
cd desktop && npm run e2e
```

### Security Testing

```bash
# Cryptographic tests
npm run test:crypto

# Security audit
npm run security:audit

# Dependency vulnerability scan
npm audit
```

## Security Guidelines

### Code Security

1. **Never store private keys in code**
2. **Use hardware-backed storage** when available
3. **Validate all inputs** from users and external APIs
4. **Use prepared statements** for any database queries
5. **Implement proper error handling** without leaking sensitive information

### Cryptographic Best Practices

1. **Use approved algorithms**: CRYSTALS-Dilithium, Kyber, AES-256-GCM
2. **Generate secure random numbers** using platform crypto APIs
3. **Implement proper key derivation** with PBKDF2 (100k+ iterations)
4. **Zero out sensitive memory** after use
5. **Use constant-time comparisons** for secrets

### Network Security

1. **Pin TLS certificates** for API endpoints
2. **Validate server certificates** and use TLS 1.3+
3. **Implement request signing** for sensitive operations
4. **Use WebSocket secure connections** (WSS)
5. **Implement request rate limiting**

## Contributing

### Branch Naming

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `security/security-issue` - Security fixes
- `refactor/component-name` - Code refactoring

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `security`, `refactor`, `test`, `docs`

### Code Style

1. **Use TypeScript** for all new code
2. **Follow ESLint rules** configured in project
3. **Use Prettier** for code formatting
4. **Write meaningful variable names**
5. **Add JSDoc comments** for public APIs

### Pull Request Process

1. **Create feature branch** from `main`
2. **Make your changes** following coding standards
3. **Add tests** for new functionality
4. **Update documentation** if needed
5. **Run full test suite** and ensure all pass
6. **Create pull request** with detailed description

### Code Review Checklist

- [ ] Code follows project style guidelines
- [ ] Security considerations have been addressed
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No hardcoded secrets or credentials
- [ ] Error handling is implemented
- [ ] Performance impact is acceptable

## Troubleshooting

### Common Issues

#### Metro bundler cache issues
```bash
cd mobile
npx react-native start --reset-cache
```

#### iOS build failures
```bash
cd mobile/ios
pod deintegrate && pod install
```

#### Android build failures
```bash
cd mobile/android
./gradlew clean
```

#### Electron build issues
```bash
cd desktop
rm -rf node_modules build dist
npm install
```

### Debug Mode

#### Enable React Native debugging
```bash
# iOS Simulator: Cmd+D
# Android Emulator: Cmd+M (Mac) or Ctrl+M (Windows/Linux)
```

#### Debug Electron app
```bash
cd desktop
npm run electron:dev
# Open Chrome DevTools: Ctrl+Shift+I
```

## Performance Optimization

### Mobile Performance

1. **Use FlatList** for large data sets
2. **Optimize images** and use appropriate formats
3. **Minimize bridge communications**
4. **Use InteractionManager** for heavy operations
5. **Profile with Flipper** or React DevTools

### Desktop Performance

1. **Minimize main process work**
2. **Use web workers** for crypto operations
3. **Optimize bundle size** with code splitting
4. **Cache API responses** appropriately
5. **Profile with Chrome DevTools**

## Deployment

### Mobile App Stores

#### iOS App Store
1. Build release version: `npm run build:ios`
2. Archive in Xcode
3. Upload to App Store Connect
4. Submit for review

#### Google Play Store
1. Build release APK: `npm run build:android`
2. Sign with release keystore
3. Upload to Google Play Console
4. Submit for review

### Desktop Distribution

#### Auto-updates
1. Configure update server in `electron-builder`
2. Sign releases for auto-update verification
3. Test update mechanism thoroughly

#### Manual Distribution
1. Build platform packages: `npm run build:windows/macos/linux`
2. Sign executables for security
3. Distribute through website or package managers

---

For additional help, please:
- Check the [FAQ](./FAQ.md)
- Open an issue on GitHub
- Join our [Discord community](https://discord.gg/zippycoin)
- Email: dev-support@zippyfoundation.org 