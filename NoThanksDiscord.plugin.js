/**
 * @name NoThanksDiscord
 * @author tony-nz
 * @version 1.1.0
 * @description Hides the Nitro, Shop, Quests, and other upsell clutter from your Discord sidebar, and stops seasonal (Halloween/Winter) sounds from overriding your soundpack. No upsells, no clutter — just the stuff you actually use. Toggle each item in settings.
 * @source https://github.com/tony-nz/NoThanksDiscord
 * @website https://github.com/tony-nz/NoThanksDiscord
 */

const NAME = "NoThanksDiscord";

/**
 * Each UI feature is hidden by injecting CSS that targets stable attributes
 * (href, aria-label) or stable class-name *prefixes* (e.g. `questsButton_`).
 * Discord rotates the hash suffix on its class names every build, but the
 * prefix before the underscore stays put, so `[class*="prefix_"]` survives
 * where a full class name would not.
 *
 * `stable: false` marks selectors that lean harder on class prefixes / newer
 * surfaces — they're more likely to need a tweak after a Discord update than
 * the rock-solid sidebar tabs.
 */
const UI_FEATURES = [
  {
    id: "nitro",
    name: "Hide Nitro",
    note: "Removes the Nitro tab from the sidebar.",
    default: true,
    stable: true,
    selectors: [`a[href="/store"]`, `[aria-label="Nitro" i]`],
  },
  {
    id: "shop",
    name: "Hide Shop",
    note: "Removes the Shop tab from the sidebar.",
    default: true,
    stable: true,
    selectors: [`a[href="/shop"]`, `[aria-label="Shop" i]`],
  },
  {
    id: "quests",
    name: "Hide Quests",
    note: "Removes the Quests tab from the sidebar.",
    default: true,
    stable: true,
    selectors: [
      `a[href="/quests"]`,
      `a[data-list-item-id$="___quests"]`,
      `div[class*="questsButton_"]`,
      `div[class*="questsContainer_"]`,
      `[aria-label="Quests" i]`,
    ],
  },
  {
    id: "giftButton",
    name: "Hide gift button",
    note: "Removes the gift-a-Nitro icon next to the message box.",
    default: true,
    stable: true,
    selectors: [`button[aria-label="Send a gift" i]`],
  },
  {
    id: "appLauncher",
    name: "Hide app launcher",
    note: "Removes the activities / app-launcher button next to the message box. Off by default — some people use it.",
    default: false,
    stable: true,
    selectors: [
      `button[aria-label="Launch Activities" i]`,
      `button[aria-label="Open Application Launcher" i]`,
    ],
  },
  {
    id: "boostBanners",
    name: "Hide boost upsells",
    note: "Removes 'Boost this server' banners and boost-progress prompts. Experimental selectors — may need an update after a Discord change.",
    default: true,
    stable: false,
    selectors: [
      `div[class*="upsellBanner_"]`,
      `div[class*="boostButton_"]`,
      `div[class*="premiumGuild"]`,
    ],
  },
  {
    id: "nitroUpsells",
    name: "Hide Nitro upsells",
    note: "Removes 'Get/Try Nitro' prompts in the emoji picker, profiles, and elsewhere. Experimental selectors.",
    default: true,
    stable: false,
    selectors: [
      `[aria-label="Get Nitro" i]`,
      `[aria-label="Try Nitro" i]`,
      `div[class*="premiumUpsell_"]`,
    ],
  },
  {
    id: "serverDiscovery",
    name: "Hide server discovery",
    note: "Removes the 'Discover' / explore-servers compass at the bottom of the guild list. Off by default.",
    default: false,
    stable: true,
    selectors: [
      `[aria-label="Discover" i]`,
      `a[href="/discovery"]`,
    ],
  },
  {
    id: "activeNow",
    name: "Hide Active Now",
    note: "Removes the 'Active Now' friend-activity panel on the Home page. Off by default. Experimental selectors.",
    default: false,
    stable: false,
    selectors: [`div[class*="nowPlayingColumn_"]`],
  },
];

// Soundpack values Discord swaps in during seasonal events. When the store
// reports one of these, we force "classic" so your normal sounds come back —
// while leaving any non-seasonal pack you actually picked (ducky, retro, …)
// untouched.
const SEASONAL_SOUNDPACKS = ["halloween", "winter_holiday"];

module.exports = class NoThanksDiscord {
  constructor() {
    this.defaults = { classicSounds: true };
    for (const f of UI_FEATURES) this.defaults[f.id] = f.default;

    this.settings = Object.assign(
      {},
      this.defaults,
      BdApi.Data.load(NAME, "settings"),
    );
  }

  start() {
    this.applyStyles();
    this.applySounds();
  }

  stop() {
    BdApi.DOM.removeStyle(NAME);
    BdApi.Patcher.unpatchAll(NAME);
  }

  applyStyles() {
    const rules = [];
    for (const f of UI_FEATURES) {
      if (this.settings[f.id]) rules.push(...f.selectors);
    }

    BdApi.DOM.removeStyle(NAME);
    if (rules.length) {
      BdApi.DOM.addStyle(
        NAME,
        `${rules.join(",\n")} { display: none !important; }`,
      );
    }
  }

  applySounds() {
    BdApi.Patcher.unpatchAll(NAME);
    if (!this.settings.classicSounds) return;

    try {
      const store =
        BdApi.Webpack.getStore?.("SoundpackStore") ||
        BdApi.Webpack.getModule(
          (m) => m && typeof m.getSoundpack === "function",
        );

      if (!store) {
        BdApi.Logger?.warn?.(
          NAME,
          "SoundpackStore not found — can't force the classic soundpack. Discord internals may have changed.",
        );
        return;
      }

      // Only override when a *seasonal* pack is active; otherwise leave the
      // user's chosen pack alone.
      BdApi.Patcher.instead(NAME, store, "getSoundpack", (_self, args, original) => {
        const current = original(...args);
        return SEASONAL_SOUNDPACKS.includes(String(current).toLowerCase())
          ? "classic"
          : current;
      });
    } catch (e) {
      console.error(`[${NAME}] Failed to enforce classic soundpack:`, e);
    }
  }

  getSettingsPanel() {
    const settings = UI_FEATURES.map((f) => ({
      type: "switch",
      id: f.id,
      name: f.name,
      note: f.note,
      value: this.settings[f.id],
    }));

    settings.push({
      type: "switch",
      id: "classicSounds",
      name: "Force classic sounds during seasonal events",
      note: "Stops Halloween / Winter sound packs from overriding your sounds. Your own non-seasonal soundpack choice is left alone.",
      value: this.settings.classicSounds,
    });

    return BdApi.UI.buildSettingsPanel({
      settings,
      onChange: (_category, id, value) => {
        this.settings[id] = value;
        BdApi.Data.save(NAME, "settings", this.settings);
        if (id === "classicSounds") this.applySounds();
        else this.applyStyles();
      },
    });
  }
};
