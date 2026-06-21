# Flor de Altura Café - Mobile App

React Native mobile application for Flor de Altura Café using Expo SDK 51.

## Tech Stack

- **Expo SDK 51** — Managed workflow, no build config needed
- **Expo Router v3** — File-based navigation (mirrors Next.js App Router)
- **NativeWind** — Tailwind CSS for React Native
- **Zustand** — State management (reusable from web)
- **React Native MMKV** — Fast localStorage alternative
- **Axios** — HTTP client
- **React Native 0.74**

## Project Structure

```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx — Catalog / Home
│   │   ├── carrito.tsx — Shopping Cart
│   │   ├── perfil.tsx — User Profile
│   │   └── _layout.tsx — Tab navigation
│   ├── auth/
│   │   ├── signin.tsx — Login
│   │   └── signup.tsx — Registration
│   └── _layout.tsx — Root layout
├── store/
│   ├── auth-store.ts — User + token state
│   └── cart-store.ts — Cart state (persisted)
├── package.json
├── app.json — Expo config
├── babel.config.js
├── tailwind.config.js
└── .env.example
```

## Getting Started

### Prerequisites

- Node 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator or Android Emulator (for testing)

### Installation

```bash
cd mobile
npm install
```

### Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `EXPO_PUBLIC_API_URL` to point to your running backend.

### Running

**Development (Expo Go app)**
```bash
npm start
```

Press `i` for iOS simulator, `a` for Android emulator, `w` for web.

**Build for Production**
```bash
eas build --platform ios
eas build --platform android
```

## Features

### Auth
- Email/password login via `/api/auth/signup`
- Token persisted in MMKV
- Auto-rehydrate on app open

### Catalog
- Fetch products from `/api/recommendations` (trending strategy)
- Product grid with images + prices
- Add to cart button

### Cart
- MMKV persistence (survives app restart)
- Add/remove items
- Show total amount
- Minimal checkout UI (button to payment flow)

### Profile
- Display user email, name, country
- Logout button clears auth store

## API Integration

All endpoints use the same backend (`EXPO_PUBLIC_API_URL`):

- `POST /api/auth/signup` — Register
- `POST /api/recommendations` — Get products
- `POST /api/orders/create` — Create order (authenticated)
- `POST /api/payments/create-intent` — Stripe payment (authenticated)
- etc.

**Authentication**: Pass Bearer token in Authorization header (retrieved from auth-store).

## Styling

NativeWind provides Tailwind CSS classes directly in React Native:

```jsx
<View className="flex-1 bg-cream p-4">
  <Text className="text-espresso font-playfair text-lg font-semibold">Title</Text>
</View>
```

Color palette (defined in `tailwind.config.js`):
- `espresso`, `gold`, `cream`, `sand`, `organic`, `clay`

## Performance Considerations

1. **Image Optimization**: Cache images with Expo Image Cache (`expo-image`)
2. **Bundle Size**: NativeWind generates optimized styles; avoid inline CSS
3. **State**: Zustand stores are lightweight; reuse from web where possible
4. **API Calls**: Debounce search/filter requests
5. **Persistence**: MMKV is 10x faster than AsyncStorage

## Future Enhancements

- Google Sign-In (via `expo-google-app-auth`)
- Apple Sign-In (via `expo-apple-authentication`)
- Push notifications (via `expo-notifications`)
- Camera access for profile photo (via `expo-image-picker`)
- Payment sheet UI (Stripe mobile UI)
- Offline mode (WatermelonDB)
- Real-time updates (Socket.io or Supabase Realtime)

## Deployment

### App Stores

1. **Apple App Store**:
   ```bash
   eas build --platform ios --auto-submit
   ```

2. **Google Play Store**:
   ```bash
   eas build --platform android --auto-submit
   ```

### EAS Updates

Enable OTA updates (without rebuilding app):

```bash
eas update
```

Automatically fetches latest JavaScript bundled code on app start.

## Troubleshooting

**Metro bundler issues**:
```bash
expo start --clear
```

**MMKV not persisting**:
- Check device storage permissions
- Restart app to confirm persistence

**API requests 401**:
- Verify token is being set in auth-store
- Check Authorization header format (Bearer <token>)

## Links

- [Expo Documentation](https://docs.expo.dev)
- [Expo Router](https://docs.expo.dev/router/introduction)
- [NativeWind](https://nativewind.dev)
- [Zustand](https://zustand-demo.vercel.app)
- [React Native MMKV](https://github.com/mrousavy/react-native-mmkv)

---

**Backend**: Flor de Altura Café Next.js 14 server  
**Status**: MVP (Catalog, Cart, Auth, Profile)  
**Release**: Q3 2026
