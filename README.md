# ZenWave

Homebrew Cask tap and macOS release binaries for **ZenWave** (an Apache-2.0 fork of [Wave Terminal](https://github.com/wavetermdev/waveterm); see [LICENSE](LICENSE) and [NOTICE](NOTICE)).

## Install (macOS Apple Silicon)

```sh
brew install --cask dinhdobathi1992/zenwave/zenwave
```

Because ZenWave uses a self-signed certificate (`ZenWave Local Signing`) and is not notarized, clear the quarantine attribute after the first install:

```sh
xattr -dr com.apple.quarantine /Applications/ZenWave.app
```

### Updates & macOS Keychain

- **In-app updates:** Future updates are delivered in-app (**Install and restart** or **Settings -> Advanced -> Updates -> Check now**). The updater verifies SHA-256 checksums, pins the app's signing certificate hash, and clears `com.apple.quarantine` automatically.
- **Keychain (`ZenWave Safe Storage`):** When macOS prompts for Keychain access after an install or update, enter your login password and click **Always Allow** (never **Deny**, or saved secrets cannot be decrypted).
