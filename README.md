# NoThanksDiscord

A [BetterDiscord](https://betterdiscord.app/) plugin that strips the **Nitro**, **Shop**, **Quests**, and other upsell clutter from your sidebar — and stops Discord's **seasonal sounds** (Halloween, Winter) from overriding your soundpack. No upsells, no clutter — just the stuff you actually use.

Everything is a separate toggle, so you can hide all of it or just the bits that bug you.

**🌐 Website:** [tony-nz.github.io/NoThanksDiscord](https://tony-nz.github.io/NoThanksDiscord) · **⬇️ [Download the plugin](https://raw.githubusercontent.com/tony-nz/NoThanksDiscord/main/NoThanksDiscord.plugin.js)**

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

Open **Settings → Plugins → NoThanksDiscord → ⚙️** to toggle each item independently.

**Sidebar / UI (on by default):**

- **Hide Nitro** — removes the Nitro tab.
- **Hide Shop** — removes the Shop tab.
- **Hide Quests** — removes the Quests tab.
- **Hide gift button** — removes the gift-a-Nitro icon by the message box.
- **Hide boost upsells** — removes "Boost this server" banners and prompts.
- **Hide Nitro upsells** — removes "Get/Try Nitro" prompts in the emoji picker, profiles, etc.

**UI (off by default — opt in):**

- **Hide app launcher** — removes the activities button by the message box.
- **Hide server discovery** — removes the "Discover" compass in the guild list.
- **Hide Active Now** — removes the friend-activity panel on Home.

**Sounds:**

- **Force classic sounds during seasonal events** — when Discord swaps in a
  Halloween or Winter sound pack, this forces it back to **Classic**. Any
  non-seasonal pack you picked yourself (Ducky, Retro, …) is left alone.

## How it works

**UI hiding** injects CSS that targets stable attributes like `href` and
`aria-label` (e.g. `a[href="/quests"]`, `[aria-label="Nitro" i]`), or stable
class-name *prefixes* (`[class*="questsButton_"]`) — never full class names.
Discord rotates the hash suffix on its class names every build, but the prefix
and the `href`/`aria-label` attributes stay put, so these selectors survive
where class-based ones break. The newer surfaces (boost/Nitro upsells, Active
Now) lean harder on class prefixes and may occasionally need a selector bump
after a big Discord update.

**Seasonal sounds** are handled by patching Discord's `SoundpackStore`: when
`getSoundpack()` reports a seasonal pack (`halloween`, `winter_holiday`), the
plugin returns `classic` instead. Discord re-applies seasonal packs on its own
during events even after you pick Classic in **Settings → Notifications → Sound
Pack** — this enforces your preference so it sticks.

## License

MIT
