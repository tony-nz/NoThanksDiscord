/**
 * @name NoThanksDiscord
 * @author tony-nz
 * @version 1.0.0
 * @description Hides the Nitro, Shop, and Quests tabs from your Discord sidebar. No upsells, no clutter — just the stuff you actually use. Toggle each one in settings.
 * @source https://github.com/tony-nz/NoThanksDiscord
 * @website https://github.com/tony-nz/NoThanksDiscord
 */

const NAME = "NoThanksDiscord";

module.exports = class NoThanksDiscord {
  constructor() {
    this.defaults = { nitro: true, shop: true, quests: true };
    this.settings = Object.assign(
      {},
      this.defaults,
      BdApi.Data.load(NAME, "settings"),
    );
  }

  start() {
    this.apply();
  }

  stop() {
    BdApi.DOM.removeStyle(NAME);
  }

  apply() {
    const rules = [];

    // Nitro tab
    if (this.settings.nitro) {
      rules.push(`a[href="/store"]`);
      rules.push(`[aria-label="Nitro" i]`);
    }

    // Shop tab
    if (this.settings.shop) {
      rules.push(`a[href="/shop"]`);
      rules.push(`[aria-label="Shop" i]`);
    }

    // Quests tab (Discord ships these under a few different element types)
    if (this.settings.quests) {
      rules.push(`a[href="/quests"]`);
      rules.push(`a[data-list-item-id$="___quests"]`);
      rules.push(`div[class*="questsButton_"]`);
      rules.push(`div[class*="questsContainer_"]`);
      rules.push(`[aria-label="Quests" i]`);
    }

    BdApi.DOM.removeStyle(NAME);
    if (rules.length) {
      BdApi.DOM.addStyle(
        NAME,
        `${rules.join(",\n")} { display: none !important; }`,
      );
    }
  }

  getSettingsPanel() {
    return BdApi.UI.buildSettingsPanel({
      settings: [
        {
          type: "switch",
          id: "nitro",
          name: "Hide Nitro",
          note: "Removes the Nitro tab.",
          value: this.settings.nitro,
        },
        {
          type: "switch",
          id: "shop",
          name: "Hide Shop",
          note: "Removes the Shop tab.",
          value: this.settings.shop,
        },
        {
          type: "switch",
          id: "quests",
          name: "Hide Quests",
          note: "Removes the Quests tab.",
          value: this.settings.quests,
        },
      ],
      onChange: (_category, id, value) => {
        this.settings[id] = value;
        BdApi.Data.save(NAME, "settings", this.settings);
        this.apply();
      },
    });
  }
};
