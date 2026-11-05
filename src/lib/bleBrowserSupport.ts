/**
 * Which browsers ship Web Bluetooth, for the three BLE tools.
 *
 * Read on 2026-11-05 from MDN's browser-compat-data, api/Bluetooth.json
 * (raw.githubusercontent.com/mdn/browser-compat-data/main/api/Bluetooth.json):
 *   Bluetooth.requestDevice: chrome version_added "56"; chrome_android,
 *     edge, opera, opera_android, samsunginternet_android "mirror" (of
 *     Chrome); firefox version_added false; safari version_added false;
 *     safari_ios and webview_ios "mirror" (of Safari); webview_android false.
 *   Bluetooth (interface), chrome: version_added "70", partial_implementation,
 *     notes "Linux support is not enabled by default."
 *   status: experimental true, standard_track true.
 * The sentence below says no more than those fields. Re-read the file before
 * changing it.
 */
/**
 * The Web Bluetooth specification on which services a page may use, read on
 * 2026-11-05 from the spec's source (index.bs on the WebBluetoothCG
 * repository's main branch), section "Device Discovery". Verbatim apart from
 * Bikeshed's {{…}} link markup, which renders as the plain member name.
 */
export const WEB_BLUETOOTH_SERVICES_RULE = {
  url: "https://webbluetoothcg.github.io/web-bluetooth/#device-discovery",
  readFrom: "https://raw.githubusercontent.com/WebBluetoothCG/web-bluetooth/main/index.bs",
  readOn: "2026-11-05",
  quote: "If a site uses acceptAllDevices, it will only be able to use services listed in optionalServices.",
} as const;

export const BLE_BROWSER_SUPPORT = {
  url: "https://github.com/mdn/browser-compat-data/blob/main/api/Bluetooth.json",
  readOn: "2026-11-05",
  sentence:
    "Web Bluetooth is a Chromium feature. MDN's compatibility data lists it in Chrome (requestDevice since version 56), Edge, Opera and Samsung Internet, with the note that Chrome's Linux support is not enabled by default, and marks the API experimental. It lists no support in Firefox, in Safari on macOS or iOS, or in Android's WebView.",
} as const;
