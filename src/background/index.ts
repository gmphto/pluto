// Background service worker for the extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Pinterest Stats Analyzer installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'OPEN_STATS_PAGE') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('stats.html'),
    });
    sendResponse({ success: true });
  }

  return true; // Keep the message channel open for async responses
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Open stats page
    chrome.tabs.create({
      url: chrome.runtime.getURL('stats.html'),
    });
  }
});
