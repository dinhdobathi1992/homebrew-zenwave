cask "zenwave" do
  arch arm: "arm64"

  version "0.16.11"
  sha256 "a34fd131aea21a3983838e366f37d745160e60679f2742418fa00c40d1a5c415"

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
