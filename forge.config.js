const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    icon: path.resolve(__dirname, 'assets/icon'),
    osxUniversal: {},
    extraResource: [
      path.resolve(__dirname, 'LICENSE.txt')
    ],
    ignore: [
      "^/\\.git",
      "^/\\.vscode",
      "^/out",
      "^/forge.config.js",
      "^/README.md"
    ],
    ...(process.env.APPLE_ID && process.env.APPLE_PASSWORD && process.env.APPLE_TEAM_ID ? {
      osxSign: {
        identity: 'Developer ID Application',
        'hardened-runtime': true,
        'gatekeeper-assess': false,
        entitlements: 'entitlements.plist',
        'entitlements-inherit': 'entitlements.plist'
      },
      osxNotarize: {
        tool: 'notarytool',
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_PASSWORD,
        teamId: process.env.APPLE_TEAM_ID
      }
    } : {})
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: path.resolve(__dirname, 'assets/icon.ico')
      },
    },
    // --- DMG CONFIG (KORRIGIERT) ---
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.resolve(__dirname, 'assets/icon.icns'),
        name: 'Osci-Painter-V1_Installer',
        format: 'ULFO',
        background: path.resolve(__dirname, 'assets/dmg-background.png'),
        license: path.resolve(__dirname, 'LICENSE.txt'),
        window: {
            size: { width: 600, height: 400 }
        },
        // WICHTIG: Hier geben wir den Zielpfad als festen String an.
        // Dieser Pfad wird erst abgerufen, wenn der 'Package'-Schritt fertig ist.
        contents: [
          {
            x: 160,
            y: 200,
            type: 'file',
            // Wir zeigen direkt auf den Ort, wo die App landen wird:
            path: path.resolve(__dirname, 'out/Osci-Painter-darwin-arm64/Osci-Painter.app')
          },
          {
            x: 440,
            y: 200,
            type: 'link',
            path: '/Applications'
          }
        ]
      }
    },
    // -------------------------------
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: { icon: path.resolve(__dirname, 'assets/icon.png') }
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};