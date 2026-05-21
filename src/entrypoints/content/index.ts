import { defineContentScript } from "#imports";

import { getTweetDetails, viewQuotedTweets } from "../../lib/tweet";

import "./style.css";

const QUOTE_ICON_SVG = `<svg width="1.6em" height="1.6em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M10 12H5C4.44772 12 4 11.5523 4 11V7.5C4 6.94772 4.44772 6.5 5 6.5H9C9.55228 6.5 10 6.94772 10 7.5V12ZM10 12C10 14.5 9 16 6 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M20 12H15C14.4477 12 14 11.5523 14 11V7.5C14 6.94772 14.4477 6.5 15 6.5H19C19.5523 6.5 20 6.94772 20 7.5V12ZM20 12C20 14.5 19 16 16 17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path></svg>`;

const setViewQuotedTweetsIcon = (article: Element): void => {
  if (article.querySelector(".quoted-tweets-container")) {
    return;
  }

  const bookmark =
    article.querySelector('[data-testid="bookmark"]') ??
    article.querySelector('[data-testid="removeBookmark"]');
  const bookmarkContainer = bookmark?.parentNode;
  if (!(bookmarkContainer instanceof Element)) {
    return;
  }

  const container = document.createElement("div");
  container.classList.add("quoted-tweets-container");

  const icon = document.createElement("div");
  icon.innerHTML = QUOTE_ICON_SVG;
  icon.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    const { tweetId, twitterHandle } = getTweetDetails(article);
    if (tweetId) {
      viewQuotedTweets(twitterHandle, tweetId);
    }
  });

  container.append(icon);
  bookmarkContainer.before(container);
};

export default defineContentScript({
  cssInjectionMode: "manifest",
  main() {
    console.log("view quoted tweets extension: setting up observer");

    // Initial pass over existing articles on the page
    for (const article of document.querySelectorAll("article")) {
      setViewQuotedTweetsIcon(article);
    }

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (node.tagName === "ARTICLE") {
            setViewQuotedTweetsIcon(node);
          } else {
            for (const article of node.querySelectorAll("article")) {
              setViewQuotedTweetsIcon(article);
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  },
  matches: ["https://twitter.com/*", "https://x.com/*"],
});
