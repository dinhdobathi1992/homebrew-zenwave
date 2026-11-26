cask "zenwave" do
  arch arm: "arm64"

  version "0.16.10"
  sha256 "aa9ce7c1c71633a4d46a4c327fb6df33a60edce5ff94effa213f8869860e660b"

  url "https://github.com/dinhdobathi1992/homebrew-zenwave/releases/download/zw-v#{version}/ZenWave-darwin-#{arch}-#{version}.zip"
  name "ZenWave"
  desc "Terminal workspace for macOS built on Wave Terminal"
  homepage "https://github.com/dinhdobathi1992/homebrew-zenwave"

  depends_on arch: :arm64

  auto_updates true

  app "ZenWave.app"

  zap trash: [
    "~/.config/zenwave",
    "~/Library/Application Support/zenwave",
    "~/Library/Caches/zenwave",
  ]

  caveats <<~EOS
    ZenWave is signed with a self-signed certificate (not Apple-notarized).
    After installing for the first time, clear the quarantine flag before launching:

      xattr -dr com.apple.quarantine /Applications/ZenWave.app

    If macOS prompts to access "ZenWave Safe Storage" in your keychain, click "Always Allow".
    Future updates can be installed directly inside the app.
  EOS
end
