# ZippyCoin Wallet UI/UX Development Plan for Bolt.new

## 📋 Executive Summary

This document outlines the comprehensive plan for developing the ZippyCoin wallet user interface and user experience using Bolt.new. The focus is on creating a modern, intuitive, and secure cryptocurrency wallet interface that showcases ZippyCoin's unique trust-based features.

## 🎯 Project Objectives

### Primary Goals
1. **Create a production-ready wallet UI** that can be deployed as a web application
2. **Showcase ZippyCoin's unique features** (trust scores, quantum resistance, DeFi integration)
3. **Develop a responsive design** that works on desktop, tablet, and mobile
4. **Implement modern UX patterns** for cryptocurrency wallets
5. **Build a component library** that can be ported to React Native and Electron

### Success Metrics
- **User Onboarding**: <30 seconds to create first wallet
- **Transaction Flow**: <5 clicks to send ZippyCoin
- **Trust Score Understanding**: >80% user comprehension
- **Mobile Responsiveness**: Perfect display on all screen sizes
- **Performance**: <2 second page load times

## 🏗️ Technical Architecture for Bolt.new

### Technology Stack
```
Frontend Framework: React 18+ with TypeScript
Styling: Tailwind CSS + Custom CSS Variables
State Management: Zustand (lightweight alternative to Redux)
Routing: React Router v6
Animations: Framer Motion
Charts/Graphs: Recharts
Icons: Lucide React
Development: Vite (built into Bolt.new)
```

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI elements (buttons, inputs, cards)
│   ├── wallet/          # Wallet-specific components
│   ├── trust/           # Trust score related components
│   └── defi/            # DeFi interface components
├── pages/               # Main application pages
├── hooks/               # Custom React hooks
├── stores/              # Zustand state stores
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── assets/              # Images, icons, fonts
└── styles/              # Global styles and Tailwind config
```

## 📱 User Interface Specifications

### Design System

#### Color Palette
```css
/* Primary Colors */
--zippy-blue: #007AFF;      /* Primary brand color */
--zippy-blue-dark: #0056CC; /* Dark variant */
--zippy-blue-light: #4DA6FF; /* Light variant */

/* Trust Score Colors */
--trust-excellent: #34C759;  /* 800-1000 trust score */
--trust-good: #30D158;       /* 600-799 trust score */
--trust-average: #FF9500;    /* 400-599 trust score */
--trust-low: #FF6B6B;        /* 200-399 trust score */
--trust-poor: #FF3B30;       /* 0-199 trust score */

/* Semantic Colors */
--success: #34C759;
--warning: #FF9500;
--error: #FF3B30;
--info: #007AFF;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Dark Mode */
--dark-bg-primary: #000000;
--dark-bg-secondary: #1C1C1E;
--dark-bg-tertiary: #2C2C2E;
--dark-text-primary: #FFFFFF;
--dark-text-secondary: #8E8E93;
```

#### Typography
```css
/* Font Stack */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Type Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

#### Spacing System
```css
/* Spacing Scale (8px base) */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Component Library Specifications

#### 1. Button Components
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

// Usage Examples:
<Button variant="primary" size="lg">Send ZippyCoin</Button>
<Button variant="outline" icon={<QrCodeIcon />}>Scan QR</Button>
<Button variant="danger" loading>Processing...</Button>
```

#### 2. Card Components
```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outline' | 'glass';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}

// Specialized Cards:
<BalanceCard balance="1,234.56" currency="ZPC" usdValue="$2,469.12" />
<TrustScoreCard score={750} trend="increasing" />
<TransactionCard transaction={txData} />
```

#### 3. Input Components
```typescript
interface InputProps {
  type: 'text' | 'number' | 'password' | 'email';
  label?: string;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
  value: string;
  onChange: (value: string) => void;
}

// Specialized Inputs:
<AmountInput currency="ZPC" value={amount} onChange={setAmount} />
<AddressInput value={address} onChange={setAddress} validate />
<PinInput length={6} value={pin} onChange={setPin} />
```

#### 4. Navigation Components
```typescript
<TabNavigation
  tabs={[
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'send', label: 'Send', icon: <SendIcon /> },
    { id: 'receive', label: 'Receive', icon: <ReceiveIcon /> },
    { id: 'trust', label: 'Trust', icon: <TrustIcon /> },
    { id: 'defi', label: 'DeFi', icon: <DefiIcon /> },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

## 📄 Page-by-Page Specifications

### 1. Welcome/Onboarding Flow

#### Welcome Screen
```typescript
// Purpose: First impression, value proposition
// Key Elements:
- ZippyCoin logo and branding
- Tagline: "Quantum-Resistant Trust-Based Cryptocurrency"
- Key features highlights
- "Create Wallet" and "Import Wallet" CTAs
- "Learn More" link

// Layout:
<WelcomeScreen>
  <HeroSection>
    <Logo />
    <Heading>Welcome to ZippyCoin</Heading>
    <Subtitle>The future of secure, trust-based digital currency</Subtitle>
    <FeatureHighlights />
  </HeroSection>
  <ActionSection>
    <Button variant="primary">Create New Wallet</Button>
    <Button variant="outline">Import Existing Wallet</Button>
  </ActionSection>
</WelcomeScreen>
```

#### Create Wallet Flow
```typescript
// Step 1: Security Information
<SecurityInfoScreen>
  <InfoCard title="Your Security is Our Priority">
    <SecurityFeature icon={<ShieldIcon />} title="Quantum-Resistant">
      Protected against future quantum computers
    </SecurityFeature>
    <SecurityFeature icon={<KeyIcon />} title="You Control Your Keys">
      We never store your private keys
    </SecurityFeature>
    <SecurityFeature icon={<LockIcon />} title="Hardware Security">
      Leverages your device's secure storage
    </SecurityFeature>
  </InfoCard>
</SecurityInfoScreen>

// Step 2: Generate Seed Phrase
<SeedPhraseScreen>
  <SeedPhraseGrid words={seedWords} />
  <SecurityWarning>
    Write down these words in order. This is the only way to recover your wallet.
  </SecurityWarning>
  <ActionButtons>
    <Button variant="outline">I've Written It Down</Button>
    <Button variant="primary">Continue</Button>
  </ActionButtons>
</SeedPhraseScreen>

// Step 3: Verify Seed Phrase
<VerifySeedScreen>
  <SeedPhraseVerification 
    originalWords={seedWords}
    onVerificationComplete={handleVerification}
  />
</VerifySeedScreen>

// Step 4: Set Security
<SecuritySetupScreen>
  <BiometricOption available={biometricAvailable} />
  <PinSetup required />
  <BackupOptions />
</SecuritySetupScreen>
```

### 2. Main Dashboard

#### Dashboard Layout
```typescript
<DashboardPage>
  <Header>
    <AccountSelector />
    <NotificationBell />
    <SettingsButton />
  </Header>
  
  <BalanceSection>
    <MainBalanceCard 
      balance="1,234.5678"
      currency="ZPC"
      usdValue="$2,469.12"
      change24h={+3.45}
    />
  </BalanceSection>
  
  <QuickActionsGrid>
    <QuickAction icon={<SendIcon />} label="Send" />
    <QuickAction icon={<ReceiveIcon />} label="Receive" />
    <QuickAction icon={<TrustIcon />} label="Trust" />
    <QuickAction icon={<SwapIcon />} label="DeFi" />
  </QuickActionsGrid>
  
  <TrustScoreSection>
    <TrustScoreWidget score={750} />
  </TrustScoreSection>
  
  <PortfolioSection>
    <PortfolioChart timeframe="24h" />
  </PortfolioSection>
  
  <RecentActivity>
    <TransactionList limit={5} />
  </RecentActivity>
</DashboardPage>
```

#### Trust Score Widget
```typescript
<TrustScoreWidget>
  <TrustScoreCircle 
    score={750}
    maxScore={1000}
    color={getTrustColor(750)}
    animated
  />
  <TrustDetails>
    <TrustLevel>Excellent</TrustLevel>
    <TrustTrend trend="increasing" change={+15} />
    <TrustFactors>
      <Factor label="Transaction History" value={95} />
      <Factor label="Network Participation" value={78} />
      <Factor label="Identity Verification" value={85} />
    </TrustFactors>
  </TrustDetails>
  <TrustActions>
    <Button variant="outline" size="sm">View Details</Button>
    <Button variant="primary" size="sm">Delegate Trust</Button>
  </TrustActions>
</TrustScoreWidget>
```

### 3. Send Money Flow

#### Send Screen
```typescript
<SendScreen>
  <RecipientSection>
    <AddressInput 
      placeholder="Enter ZippyCoin address or scan QR"
      value={recipient}
      onChange={setRecipient}
      onScan={handleQRScan}
    />
    <ContactsList favorites={favoriteContacts} />
  </RecipientSection>
  
  <AmountSection>
    <AmountInput 
      currency="ZPC"
      value={amount}
      onChange={setAmount}
      balance={walletBalance}
    />
    <CurrencyToggle currencies={['ZPC', 'USD']} />
    <MaxButton onClick={() => setAmount(walletBalance)} />
  </AmountSection>
  
  <DetailsSection>
    <FeeSelector 
      options={[
        { label: 'Standard', fee: '0.001', time: '~1 min' },
        { label: 'Fast', fee: '0.005', time: '~30 sec' },
        { label: 'Custom', fee: customFee, time: 'Variable' }
      ]}
    />
    <MemoInput optional placeholder="Add a note (optional)" />
  </DetailsSection>
  
  <PreviewSection>
    <TransactionPreview 
      recipient={recipient}
      amount={amount}
      fee={selectedFee}
      total={calculateTotal()}
    />
  </PreviewSection>
  
  <ActionSection>
    <Button 
      variant="primary" 
      size="lg" 
      onClick={handleSend}
      disabled={!isValidTransaction}
    >
      Send {amount} ZPC
    </Button>
  </ActionSection>
</SendScreen>
```

#### Transaction Confirmation
```typescript
<TransactionConfirmation>
  <SecurityHeader>
    <ShieldIcon />
    <Title>Confirm Transaction</Title>
    <Subtitle>Review all details carefully</Subtitle>
  </SecurityHeader>
  
  <TransactionSummary>
    <DetailRow label="To" value={formatAddress(recipient)} />
    <DetailRow label="Amount" value={`${amount} ZPC`} />
    <DetailRow label="Network Fee" value={`${fee} ZPC`} />
    <DetailRow label="Total" value={`${total} ZPC`} emphasized />
  </TransactionSummary>
  
  <TrustImpact>
    <TrustScoreChange 
      current={currentTrustScore}
      predicted={predictedTrustScore}
      change={trustScoreChange}
    />
  </TrustImpact>
  
  <SecurityActions>
    <BiometricButton onAuthenticate={handleConfirm} />
    <AlternativeAuth>
      <Button variant="outline">Use PIN Instead</Button>
    </AlternativeAuth>
  </SecurityActions>
</TransactionConfirmation>
```

### 4. Receive Money

#### Receive Screen
```typescript
<ReceiveScreen>
  <AddressSection>
    <QRCodeDisplay 
      value={walletAddress}
      size={200}
      logo={zippyCoinLogo}
    />
    <AddressDisplay 
      address={walletAddress}
      onCopy={handleCopyAddress}
    />
  </AddressSection>
  
  <CustomizeSection>
    <AmountInput 
      optional
      placeholder="Request specific amount"
      value={requestAmount}
      onChange={setRequestAmount}
    />
    <MemoInput 
      optional
      placeholder="Add payment note"
      value={memo}
      onChange={setMemo}
    />
  </CustomizeSection>
  
  <ShareSection>
    <ShareButton 
      method="copy"
      data={generatePaymentLink()}
      icon={<CopyIcon />}
    >
      Copy Link
    </ShareButton>
    <ShareButton 
      method="qr"
      data={walletAddress}
      icon={<QrIcon />}
    >
      Show QR
    </ShareButton>
    <ShareButton 
      method="email"
      data={generateEmailShare()}
      icon={<EmailIcon />}
    >
      Email
    </ShareButton>
  </ShareSection>
</ReceiveScreen>
```

### 5. Trust Dashboard

#### Trust Overview
```typescript
<TrustDashboard>
  <TrustHeader>
    <CurrentTrustScore score={750} />
    <TrustRanking rank={1250} total={50000} />
    <TrustProgress 
      current={750}
      nextLevel={800}
      progress={0.75}
    />
  </TrustHeader>
  
  <TrustMetrics>
    <MetricCard 
      title="Delegations Received"
      value={42}
      change={+3}
      icon={<TrustIcon />}
    />
    <MetricCard 
      title="Delegations Given"
      value={15}
      change={+1}
      icon={<HandshakeIcon />}
    />
    <MetricCard 
      title="Trust Network Size"
      value={127}
      change={+8}
      icon={<NetworkIcon />}
    />
  </TrustMetrics>
  
  <TrustActions>
    <ActionCard 
      title="Delegate Trust"
      description="Share trust with other users"
      action="Delegate"
      icon={<DelegateIcon />}
    />
    <ActionCard 
      title="Verify Identity"
      description="Increase your trust score"
      action="Verify"
      icon={<VerifyIcon />}
    />
    <ActionCard 
      title="Build Network"
      description="Connect with trusted users"
      action="Connect"
      icon={<ConnectIcon />}
    />
  </TrustActions>
  
  <TrustHistory>
    <TrustActivityList />
  </TrustHistory>
</TrustDashboard>
```

#### Trust Delegation Flow
```typescript
<TrustDelegationFlow>
  <RecipientSelection>
    <UserSearch 
      placeholder="Search by address or username"
      onSelect={setDelegationTarget}
    />
    <TrustedContacts />
  </RecipientSelection>
  
  <DelegationAmount>
    <TrustAmountSlider 
      max={availableTrust}
      value={delegationAmount}
      onChange={setDelegationAmount}
    />
    <DelegationImpact 
      current={currentTrustScore}
      afterDelegation={predictedTrustScore}
    />
  </DelegationAmount>
  
  <DelegationTerms>
    <ExpirationSelector 
      options={['1 month', '3 months', '6 months', '1 year', 'Permanent']}
      value={expiration}
      onChange={setExpiration}
    />
    <ConditionsInput 
      placeholder="Add conditions (optional)"
      value={conditions}
      onChange={setConditions}
    />
  </DelegationTerms>
</TrustDelegationFlow>
```

### 6. DeFi Dashboard

#### DeFi Overview
```typescript
<DeFiDashboard>
  <DeFiHeader>
    <TotalValueLocked value="$12,450.00" change={+5.2} />
    <TrustBonus multiplier={1.15} benefit="15% bonus APY" />
  </DeFiHeader>
  
  <ProtocolGrid>
    <ProtocolCard 
      name="ZippyLend"
      type="lending"
      apy={8.5}
      trustMultiplier={1.2}
      deposited="1,000 ZPC"
      icon={<LendingIcon />}
    />
    <ProtocolCard 
      name="ZippyStake"
      type="staking"
      apy={12.0}
      trustMultiplier={1.15}
      staked="500 ZPC"
      icon={<StakingIcon />}
    />
    <ProtocolCard 
      name="ZippySwap"
      type="liquidity"
      apy={15.5}
      trustMultiplier={1.1}
      provided="750 ZPC"
      icon={<SwapIcon />}
    />
  </ProtocolGrid>
  
  <ActivePositions>
    <PositionCard 
      protocol="ZippyLend"
      amount="1,000 ZPC"
      earned="45.2 ZPC"
      apy={10.2}
      trustBonus={1.2}
    />
  </ActivePositions>
  
  <DeFiActions>
    <Button variant="primary">Explore Protocols</Button>
    <Button variant="outline">Claim Rewards</Button>
  </DeFiActions>
</DeFiDashboard>
```

## 🎨 Animation & Interaction Specifications

### Micro-Interactions
```typescript
// Trust Score Animation
const trustScoreAnimation = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: { type: "spring", stiffness: 260, damping: 20 }
};

// Balance Counter Animation
const balanceCounterAnimation = {
  from: 0,
  to: balance,
  duration: 1000,
  ease: "easeOutCubic"
};

// Transaction Success
const successAnimation = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
  transition: { type: "spring", stiffness: 300, damping: 25 }
};

// Loading States
const loadingSpinner = {
  animate: { rotate: 360 },
  transition: { duration: 1, repeat: Infinity, ease: "linear" }
};
```

### Page Transitions
```typescript
const pageTransitions = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};
```

### Responsive Design Breakpoints
```css
/* Mobile First Approach */
.container {
  @apply px-4 mx-auto;
}

/* Small devices (phones) */
@media (min-width: 640px) {
  .container { @apply px-6; }
}

/* Medium devices (tablets) */
@media (min-width: 768px) {
  .container { @apply px-8 max-w-4xl; }
}

/* Large devices (desktops) */
@media (min-width: 1024px) {
  .container { @apply px-12 max-w-6xl; }
}

/* Extra large devices */
@media (min-width: 1280px) {
  .container { @apply px-16 max-w-7xl; }
}
```

## 🔧 State Management Architecture

### Zustand Store Structure
```typescript
interface WalletStore {
  // Wallet State
  wallet: Wallet | null;
  balance: string;
  accounts: Account[];
  currentAccount: Account | null;
  
  // UI State
  isLoading: boolean;
  activeTab: string;
  theme: 'light' | 'dark' | 'auto';
  
  // Actions
  setWallet: (wallet: Wallet) => void;
  updateBalance: (balance: string) => void;
  switchAccount: (accountId: string) => void;
  setTheme: (theme: ThemeType) => void;
}

interface TrustStore {
  // Trust State
  trustScore: number;
  trustRank: number;
  delegations: TrustDelegation[];
  
  // Actions
  updateTrustScore: (score: number) => void;
  addDelegation: (delegation: TrustDelegation) => void;
  revokeDelegation: (delegationId: string) => void;
}

interface DeFiStore {
  // DeFi State
  protocols: Protocol[];
  positions: Position[];
  totalValueLocked: string;
  
  // Actions
  updatePositions: (positions: Position[]) => void;
  addPosition: (position: Position) => void;
  removePosition: (positionId: string) => void;
}
```

## 📊 Performance Specifications

### Loading Performance
- **First Contentful Paint**: <1.5 seconds
- **Largest Contentful Paint**: <2.5 seconds
- **Time to Interactive**: <3 seconds
- **Bundle Size**: <500KB gzipped

### Optimization Strategies
```typescript
// Code Splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SendPage = lazy(() => import('./pages/SendPage'));
const ReceivePage = lazy(() => import('./pages/ReceivePage'));

// Image Optimization
const optimizedImages = {
  logo: '/assets/logo-optimized.webp',
  qrCode: 'data:image/svg+xml;base64,...',
  trustBadge: '/assets/trust-badge.svg'
};

// Memo for Expensive Components
const TrustScoreWidget = memo(({ score, ...props }) => {
  return <TrustScoreDisplay score={score} {...props} />;
});
```

## 🧪 Testing Strategy

### Component Testing
```typescript
// Example Test Suite
describe('TrustScoreWidget', () => {
  it('displays correct trust score', () => {
    render(<TrustScoreWidget score={750} />);
    expect(screen.getByText('750')).toBeInTheDocument();
  });
  
  it('shows correct trust level', () => {
    render(<TrustScoreWidget score={750} />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });
  
  it('animates score changes', async () => {
    const { rerender } = render(<TrustScoreWidget score={700} />);
    rerender(<TrustScoreWidget score={750} />);
    
    await waitFor(() => {
      expect(screen.getByText('750')).toBeInTheDocument();
    });
  });
});
```

### User Flow Testing
```typescript
// End-to-End Test Examples
describe('Send Money Flow', () => {
  it('completes successful transaction', async () => {
    // 1. Navigate to send page
    // 2. Enter recipient address
    // 3. Enter amount
    // 4. Confirm transaction
    // 5. Verify success message
  });
  
  it('handles insufficient balance error', async () => {
    // Test error handling
  });
});
```

## 🚀 Deployment Plan

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['framer-motion', 'lucide-react'],
          charts: ['recharts']
        }
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});
```

### Environment Configuration
```typescript
// Environment Variables
VITE_API_URL=https://api.zippycoin.org
VITE_WEBSOCKET_URL=wss://ws.zippycoin.org
VITE_NETWORK=mainnet
VITE_APP_VERSION=1.0.0
```

This comprehensive plan provides everything needed to build the ZippyCoin wallet UI in Bolt.new, from component specifications to deployment strategies. The focus is on creating a modern, secure, and user-friendly interface that showcases ZippyCoin's unique trust-based features. 