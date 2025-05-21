console.log("Background script loaded!");
browser.commands.onCommand.addListener(async (command) => {
    console.log("Command received: ${command}");
    if (command === "move-tab") {
        console.log("Moving tab");
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
        console.log("tab: " + tab + " url: " + tab.url + " id: " + tab.id);
        if (tab && tab.url) {
            await browser.windows.create({ tabId: tab.id });
            // await browser.tabs.remove(tab.id);
        }
    }

});