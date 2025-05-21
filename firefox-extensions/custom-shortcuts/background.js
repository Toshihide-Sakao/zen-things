console.log("Background script loaded!");

let lastFocusedWindowId = null;
let currentFocusedWindowId = null;

// Track window focus
browser.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === browser.windows.WINDOW_ID_NONE) return;
    console.log("Window focus changed: " + windowId + " last: " + currentFocusedWindowId);
    lastFocusedWindowId = currentFocusedWindowId;
    currentFocusedWindowId = windowId;

    console.log("Focus changed:");
    console.log("Previous:", lastFocusedWindowId);
    console.log("Current: " + currentFocusedWindowId + " rec: " + windowId);
});

browser.commands.onCommand.addListener(async (command) => {
    console.log("Command received: ${command}");
    if (command === "move-tab-new-window") {
        moveTabToWindow();
    } else if (command === "move-tab-last-window") {
        if (lastFocusedWindowId || lastFocusedWindowId) {
            moveTabToLastWindow();
            return;
        }
        moveTabToWindow();
    }

});

async function moveTabToWindow() {
    // console.log("Moving tab");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    // console.log("tab: " + tab + " url: " + tab.url + " id: " + tab.id);
    if (tab && tab.url) {
        await browser.windows.create({ tabId: tab.id });
        // await browser.tabs.remove(tab.id);
    }
}

async function moveTabToLastWindow() {
    // console.log("Moving tab to last window");
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    try {
        await browser.tabs.move(tab.id, { windowId: lastFocusedWindowId, index: -1 });
        await browser.windows.update(lastFocusedWindowId, { focused: true });
        await browser.tabs.update(tab.id, { active: true });
    } catch (err) {
        console.error("Failed to move tab:", err);
    }
}