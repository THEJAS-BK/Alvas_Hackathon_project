// Report page load to background script
const reportActivity = () => {
  const data = {
    url: window.location.href,
    title: document.title,
    timestamp: new Date().toISOString()
  };

  chrome.runtime.sendMessage({ type: 'PAGE_VISIT', data });
};

// Initial report
reportActivity();

// Listen for pushState/replaceState changes (for SPAs)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    reportActivity();
  }
}).observe(document, { subtree: true, childList: true });
