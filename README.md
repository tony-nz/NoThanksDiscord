# NoThanksDiscord

A [BetterDiscord](https://betterdiscord.app/) plugin that hides the **Nitro**, **Shop**, and **Quests** tabs from your sidebar. No upsells, no clutter — just the stuff you actually use.

Each tab has its own toggle, so you can hide all three or just the ones that bug you.

## Screenshot

<!-- TODO: add a before/after screenshot of the sidebar -->
![NoThanksDiscord settings panel](./screenshot.png)

## Install

1. Install [BetterDiscord](https://betterdiscord.app/) if you haven't already.
2. Download [`NoThanksDiscord.plugin.js`](./NoThanksDiscord.plugin.js).
3. Drop it into your BetterDiscord `plugins` folder (see paths below).
4. In Discord, open **Settings → Plugins** and enable **NoThanksDiscord**.

You can also open the plugins folder straight from Discord: **Settings → Plugins → Open Plugins Folder**.

### Plugins folder location

| OS      | Path                                                            |
| ------- | -------------------------------------------------------------- |
| macOS   | `~/Library/Application Support/BetterDiscord/plugins`          |
| Windows | `%AppData%\BetterDiscord\plugins`                              |
| Linux   | `~/.config/BetterDiscord/plugins`                             |

## Settings

Open **Settings → Plugins → NoThanksDiscord → ⚙️** to toggle each tab independently:

- **Hide Nitro** — removes the Nitro tab.
- **Hide Shop** — removes the Shop tab.
- **Hide Quests** — removes the Quests tab.

All three are hidden by default.

## How it works

Hiding is done by injecting CSS that targets stable attributes like `href` and
`aria-label` (e.g. `a[href="/quests"]`, `[aria-label="Nitro" i]`) rather than
Discord's class names. Discord rotates its class hashes constantly, so
class-based selectors break on every update — attribute selectors don't.

Quests ships under a few different element types depending on the build, so it
gets extra fallback selectors.

## License

MIT
