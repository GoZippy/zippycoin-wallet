# ZippyCoin Wallet - Cross-Platform Application

A secure, quantum-resistant wallet application for ZippyCoin cryptocurrency, supporting desktop (Windows, macOS, Linux), Android, and iOS platforms.

## 🚀 Features

### Core Wallet Features
- **Multi-Platform Support**: Native apps for iOS, Android, and Desktop
- **Quantum-Resistant Security**: CRYSTALS-Dilithium and Kyber cryptography
- **HD Wallet**: BIP32/BIP44 compatible with ZippyCoin extensions
- **Trust Score Integration**: Real-time trust score display and delegation
- **Biometric Authentication**: Face ID, Touch ID, Fingerprint support
- **Hardware Security**: Secure Enclave (iOS) and Android Keystore integration

### Advanced Features
- **DeFi Integration**: Yield farming, staking, and lending protocols
- **Cross-Chain Bridge**: Multi-blockchain asset management
- **Privacy Controls**: Selective disclosure and privacy layers
- **Multi-Signature**: Origin Wallet and user multi-sig support
- **Offline Capabilities**: Air-gapped transaction signing
- **Recovery System**: Encrypted backup and recovery across devices

## 🏗️ Architecture

```
zippycoin-wallet/
├── mobile/                 # React Native (iOS & Android)
│   ├── ios/               # iOS-specific native code
│   ├── android/           # Android-specific native code
│   └── src/               # Shared React Native code
├── desktop/               # Electron + React (Windows, macOS, Linux)
│   ├── src/               # Main desktop application
│   └── public/            # Static assets
├── shared/                # Shared business logic
│   ├── crypto/            # Cryptographic operations
│   ├── trust/             # Trust engine integration
│   ├── api/               # Blockchain API client
│   └── types/             # TypeScript definitions
└── docs/                  # Documentation
```

## 🔐 Security Architecture

### Key Management
```
Master Seed (256-bit entropy)
├── Wallet Keys (m/44'/2187'/0')
│   ├── Transaction Keys (m/44'/2187'/0'/0/n)
│   ├── Trust Delegation Keys (m/44'/2187'/0'/1/n)
│   └── Identity Keys (m/44'/2187'/0'/2/n)
├── DeFi Protocol Keys (m/44'/2187'/1')
└── Emergency Recovery Keys (m/44'/2187'/2')
```

### Cryptographic Stack
- **Post-Quantum**: CRYSTALS-Dilithium, Kyber, SPHINCS+
- **Classical**: Ed25519, secp256k1 (for compatibility)
- **Encryption**: AES-256-GCM, ChaCha20-Poly1305
- **Hashing**: SHA3-256, BLAKE3

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- Electron

### Quick Start
```bash
# Clone the repository
git clone https://github.com/zippyfoundation/zippycoin-wallet.git
cd zippycoin-wallet

# Install dependencies
npm install

# Mobile development
cd mobile
npm install
npx pod-install ios  # iOS only

# Desktop development
cd desktop
npm install

# Shared modules
cd shared
npm install
```

### Platform-Specific Setup

#### iOS Development
```bash
cd mobile
npx react-native run-ios
```

#### Android Development
```bash
cd mobile
npx react-native run-android
```

#### Desktop Development
```bash
cd desktop
npm run electron:dev
```

## 📱 Platform Features

### iOS
- Secure Enclave integration
- Face ID / Touch ID authentication
- App Transport Security
- Background app refresh
- Shortcuts app integration
- Widget support

### Android
- Android Keystore integration
- Biometric API support
- Network Security Config
- Background sync
- Adaptive icons
- Widget support

### Desktop
- Hardware wallet integration
- Multi-monitor support
- System tray integration
- Auto-updates
- Cross-platform compatibility

## 🧪 Testing

### Security Testing
- Cryptographic validation
- Key storage security
- Network security testing
- Memory protection
- Anti-debugging measures

### Functional Testing
- Transaction flows
- Trust calculations
- Cross-platform compatibility
- Performance benchmarks
- Offline functionality

## 📦 Build & Deploy

### Mobile Apps
```bash
# iOS Release Build
cd mobile
npx react-native run-ios --configuration Release

# Android Release Build
cd mobile
npx react-native run-android --variant=release
```

### Desktop Apps
```bash
cd desktop
npm run build:windows
npm run build:macos
npm run build:linux
```

## 🔒 Security Considerations

- All private keys stored in hardware-backed secure storage
- Zero-knowledge architecture - keys never leave device unencrypted
- Regular security audits and penetration testing
- Compliance with financial app store guidelines
- Emergency recovery mechanisms with social recovery options

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/zippyfoundation/zippycoin-wallet/issues)
- **Community**: [Discord](https://discord.gg/zippycoin)
- **Email**: support@zippyfoundation.org 