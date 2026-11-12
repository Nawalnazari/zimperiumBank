# zimperiumBank

A React Native test app for validating Zimperium zDefend mobile threat detection.

---

## 1. Requirements

| Tool           | Version                                    |
| -------------- | ------------------------------------------ |
| Node.js        | >= 20                                      |
| React Native   | 0.86.3                                     |
| React          | 19.2.3                                     |
| TypeScript     | ^5.8.3                                     |
| Ruby / Bundler | Required for iOS CocoaPods                 |
| Xcode          | Latest stable (iOS deployment target 15.1) |
| Android Studio | Latest stable (minSdk 24, compileSdk 36)   |
| CocoaPods      | Installed via `bundle install`             |

**zDefend SDK**

The SDK is distributed as a local tarball — it is not on npm. The file must exist at:

```
src/zDefend/zdefend-rn-multikey-zimperiumBank-5.10.85.tgz
```

---

## 2. How to Run the App

### 2.1 Install dependencies

```bash
npm install
```

### 2.2 iOS — install native pods

```bash
bundle install          # only needed once, installs CocoaPods itself
cd ios && pod install && cd ..
```

### 2.3 Run

Each environment maps to a `.env.*` file which sets `APP_ENV` and selects the matching zDefend license key.

| Command                                     | Environment | License key used |
| ------------------------------------------- | ----------- | ---------------- |
| `npm run android:uat` / `npm run ios:uat`   | UAT         | UAT              |
| `npm run android:prod` / `npm run ios:prod` | PROD        | PROD             |

```bash
# Android
npm run android:prod

Metro starts automatically. Watch the logs for lines prefixed `[zDefend]` — a healthy start shows:

```

[zDefend] Available license keys: [...]
[zDefend] Env: SIT | License key: SIT
[zDefend] deviceStatusCallback fired
[zDefend] loginStatus: logged_in
[zDefend] scanProgress: 100

````

### 2.4 Clean builds

```bash
# Android (clears Gradle + codegen cache)
npm run clean:android

# iOS (clears Xcode derived data)
npm run clean:ios

# Full reset (removes node_modules, Pods, reinstalls everything)
npm run clean
````

---

## 3. How to Integrate zDefend SDK

\*\*do this on your own project

### 3.1 Configure zDefend SDK

java -jar config*sdk*<version>.jar
-s <original-rn-sdk>.tgz
-o zdefend-titan-multikey.tgz
-ka PROD=<PROD_ANDROID_KEY>
-ki PROD=<PROD_IOS_KEY>
-ba com.mbb.titan.my
-bi com.mbb.titan.my
-ka UAT=<UAT_ANDROID_KEY>
-ki UAT=<UAT_IOS_KEY>
-ba com.mbb.titan.uat
-bi com.mbb.titan.uat

### 3.2 Add the SDK tarball

Place the SDK tarball inside the project (or one level above) and reference it in `package.json`:

```json
"zdefend": "file:src/zDefend/zdefend-rn-multikey-zimperiumBank-5.10.85.tgz"
```

Then run `npm install`.

### 3.3 Android — link the AAR

The SDK's native Android library is not auto-linked. Add it manually in `android/app/build.gradle`:

```gradle
dependencies {
    implementation files("../../node_modules/zdefend/android/libs/zdefend.aar")
}
```
