import { defineBackground } from "#imports";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener((details) => {
    if (details.reason === "install") {
      void browser.tabs.create({ url: "https://twitter.com/" });
    }
  });
});
