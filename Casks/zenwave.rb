cask "zenwave" do
  arch arm: "arm64"

  version "0.16.12"
  sha256 "dd60b3b1fd6b6bf98b34e721644c05c5125377f55b9979a2c438e594ce9c4849"

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
