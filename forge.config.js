const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path'); // WICHTIG: Path Modul für absolute Pfade

module.exports = {
  packagerConfig: {
    asar: true,
    // Pfad zum App-Icon absolut auflösen
    icon: path.resolve(__dirname, 'assets/icon'),
    
    // HIER NEU: Universal Build aktivieren (WICHTIG für Ventura/Silicon Macs)
    // Erstellt eine App, die nativ auf Intel UND Apple Silicon läuft.
    osxUniversal: {},

    // Ressourcen wie Lizenzdatei explizit kopieren
    extraResource: [
      path.resolve(__dirname, 'LICENSE.txt')
    ],

    // Unnötige Dateien ignorieren
    ignore: [
      "^/\\.git",
      "^/\\.vscode",
      "^/out",
      "^/forge.config.js",
      "^/README.md"
    ],

    // Apple Signing & Notarization (aktiv nur wenn Daten vorhanden)
    ...(process.env.APPLE_ID && process.env.APPLE_PASSWORD && process.env.APPLE_TEAM_ID ? {
      osxSign: {
        identity: 'Developer ID Application',
        'hardened-runtime': true,
        'gatekeeper-assess': false,
        entitlements: 'entitlements.plist', // Optional: Falls du später Rechte brauchst
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
    // DMG Maker Config (KORRIGIERT)
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: path.resolve(__dirname, 'assets/icon.icns'),
        name: 'OsciPainterInstaller',
        format: 'ULFO',
        // Lizenz anzeigen (Absoluter Pfad ist hier entscheidend!)
        license: path.resolve(__dirname, 'LICENSE.txt'),
        // Hintergrundbild (Absoluter Pfad) - Wenn Datei fehlt, Zeile löschen!
        background: path.resolve(__dirname, 'assets/dmg-background.png'),
        
        // WICHTIG: 'contents' entfernt, damit die automatische Positionierung greift.
        // Das verhindert den Fehler und zentriert die Icons automatisch.
        window: {
            size: { width: 600, height: 400 }
        }
      }
    },
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