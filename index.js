async function clickConnectButtons() {
  const connectButtons = document.querySelectorAll(
    "button[aria-label^='Invite'][aria-label$='to connect']"
  );
  for (let i = 0; i < connectButtons.length; i++) {
    const button = connectButtons[i];
    const connectionName = button
      .getAttribute("aria-label")
      .split(" to connect")[0]
      .replace("Invite ", "");
    console.log("Attempting to connect with ", connectionName); // Click the "Connect" button
    button.click();
    await sleep(getRandomDelay(2000, 3000)); // Wait for the modal to appear
    const modal = await waitForElement(".artdeco-modal");
    if (!modal) {
      console.log("Modal didn't appear for ", connectionName);
      continue;
    } // Look for the "Send" button within the modal
    const sendButton = modal.querySelector(
      "button[aria-label='Send without a note'], button[aria-label='Send now']"
    );
    if (sendButton) {
      sendButton.click();
      console.log("Clicked 'Send' button for ", connectionName);
    } else {
      console.log("Couldn't find 'Send' button for ", connectionName); // If we can't find the send button, close the modal
      const closeButton = modal.querySelector("button[aria-label='Dismiss']");
      if (closeButton) {
        closeButton.click();
        console.log("Closed modal for ", connectionName);
      }
    }
    await sleep(getRandomDelay(3000, 5000));
    await scrollDownUntilEnd();
  } // Navigate to the next page
  const nextPageButton = document.querySelector("button[aria-label='Next']");
  if (nextPageButton) {
    nextPageButton.click();
    console.log("Navigating to the next page...");
    await sleep(getRandomDelay(3000, 5000));
    await clickConnectButtons(); // Recursive call for the next page
  }
}

async function scrollDownUntilEnd() {
  let previousHeight;
  do {
    previousHeight = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    await sleep(1000); // Brief pause for content to load
  } while (document.body.scrollHeight > previousHeight);
}

// Helper function to wait for an element to appear

function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));

        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,

      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();

      resolve(null);
    }, timeout);
  });
}

// Existing helper functions

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Start the process

clickConnectButtons();
