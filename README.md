# Image Gallery (React Native assessment)

React Native **0.85** app demonstrating Redux Toolkit, Apollo Client (GraphQL), a custom **DeviceDetails** native module, form validation, Reanimated animations, and a performant image grid.

## Prerequisites

- Node.js **22+** (see `package.json` engines)
- Watchman (recommended for Metro)
- **Android**: Android Studio, SDK, and `ANDROID_HOME` set (or `android/local.properties` with `sdk.dir=...`)
- **iOS**: Xcode **15+**, CocoaPods (`pod` CLI)

## Install

From the project root:

```sh
npm install
```

**iOS native dependencies** (after installs or when native deps change):

```sh
cd ios && pod install && cd ..
```

## Run

Start Metro in one terminal:

```sh
npm start
```

If you see **`[Worklets] Failed to create a worklet`**, stop Metro, clear its cache, and rebuild the native app (Babel must emit worklets; a stale bundle will crash at runtime):

```sh
npm start -- --reset-cache
```

Then run **Clean Build Folder** in Xcode (or `cd ios && xcodebuild clean`) and `npm run ios` again.

**Android** (device or emulator):

```sh
npm run android
```

**iOS** (Simulator):

```sh
npm run ios
```

## Tests and lint

```sh
npm test
npm run lint
```

## What this app does

### Registration

- Fields: **Name**, **Email**, **Phone**, **Password**
- **Email**: standard format check
- **Phone**: exactly **10 digits**, numbers only (non-digits stripped while typing)
- **Password**: minimum **8** characters
- Inline error messages; on success, navigates to the gallery (password is not stored in Redux)

### Gallery (GraphQL + Redux)

- **GraphQL**: [Rick and Morty API](https://rickandmortyapi.com/graphql) — characters are shown as gallery items (**image**, **title** = name, **author** = species, **likes** = episode count plus your local “like” toggle)
- **Redux** holds: image list, per-user liked ids, loading, and error state
- **Grid** (`FlatList`, two columns), **pull-to-refresh**, tap to open details, **like** on the card
- **Performance**: tuned `FlatList` props (`windowSize`, `maxToRenderPerBatch`, `removeClippedSubviews` on Android)

### Image details + animations (Reanimated)

- Full image, title, author (species), generated **description**, total likes
- **Zoom / fade-in** when the hero image appears
- **Like**: spring scale on the heart control plus a short **burst** heart overlay

### Native module: `DeviceDetails`

- **Android** (required): Kotlin module `DeviceDetails` exposes `getDeviceDetails()` → brand, manufacturer, model, device, product, `systemVersion`, `sdkInt`
- **iOS** (optional): Swift + `RCT_EXTERN_MODULE` bridge, same JS API with Apple-oriented fields where applicable
- JS wrapper: `src/native/DeviceDetails.ts`; UI: expandable **Device (native bridge)** card on the gallery screen

## Project layout (high level)

| Path | Role |
|------|------|
| `App.tsx` | Providers (Redux, Apollo, gesture handler, safe area) + navigator |
| `src/apollo/client.ts` | Apollo `HttpLink` + `InMemoryCache` |
| `src/graphql/` | Queries + TypeScript result shapes |
| `src/store/` | Redux slices (`auth`, `gallery`) |
| `src/screens/` | Registration, gallery, image detail |
| `src/navigation/` | Native stack + types |
| `android/.../DeviceDetails*.kt` | Android native module + package registration |
| `ios/imageGallery/DeviceDetails*.swift/m` | iOS native module |

## Notes for reviewers

- Network access is required for the public GraphQL endpoint.
- “Likes” from the API are approximated by **episode count**; Redux adds **+1** when you tap like (local only).
- Reanimated **4** is used with the **New Architecture** (`newArchEnabled=true` on Android). `babel.config.js` lists **`react-native-worklets/plugin` last**, as required by the [Reanimated 4 RN CLI install guide](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#react-native-community-cli).

## License

Private / assessment use unless you add your own license.
