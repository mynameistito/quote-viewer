import { defineBackground } from "#imports";

export default defineBackground(() => {
  browser.action.onClicked.addListener(() => {
    void browser.tabs.create({
      url: "https://github.com/mynameistito/quote-viewer",
    });
  });
});
