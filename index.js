async function scrollDownUntilEnd() {
  let previousHeight;
  do {
    previousHeight = document.body.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    await sleep(1000); // Brief pause for content to load

  } while (document.body.scrollHeight > previousHeight);
}

async function clickConnectButtons() {
    await scrollDownUntilEnd(); 
  const connectButtons = document.querySelectorAll(
    ".entity-result__actions.entity-result__divider"
  );

  for (let i = 0; i < connectButtons.length; i++) {
    // Click the "Connect" button for each profile
    const parentElement = connectButtons[i].parentElement;

    if (!parentElement) continue;

    const getConnectionName = parentElement
      ?.querySelector(
        ".entity-result__content.entity-result__divider > .mb1 .t-roman.t-sans .entity-result__title-text > .app-aware-link > span"
      )
      ?.innerText.split("\n")[0];

    console.log("Adding ", getConnectionName);

    const isConnectButton = ["Connect", "Conectar"].includes(
      connectButtons[i].innerText
    );

    if (!isConnectButton) continue;

    const addButton = connectButtons[i].querySelector("button");
    addButton?.click();

    await sleep(getRandomDelay(2000, 5000)); // Random delay between 2-5 seconds

    const sendButtonModal = document.querySelector(
      ".send-invite button[aria-label='Send now']"
    );
    const closeButtonModal = document.querySelector(".artdeco-modal__dismiss");

    if (sendButtonModal) {
      sendButtonModal.click();
      console.log("Clicked 'Send' button for ", getConnectionName);
    } else if (closeButtonModal) {
      closeButtonModal.click();
      console.log("Clicked 'Close' button for modal");
      await sleep(getRandomDelay(2000, 5000)); // Random delay between 2-5 seconds
      continue; // Skip to the next iteration
    }

    await sleep(getRandomDelay(2000, 5000));
    await scrollDownUntilEnd(); 
  }

  // Navigate to the next page
  const nextPageButton = document.querySelector("button[aria-label='Next']");

  if (nextPageButton) {
    nextPageButton.click();
    console.log("Navigating to the next page...");

    await sleep(getRandomDelay(5000, 7000)); // Random delay between 2-5 seconds

    await clickConnectButtons(); // Click "Connect" buttons on the new page
  }
}

// Start clicking "Connect" buttons
clickConnectButtons();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getRandomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
