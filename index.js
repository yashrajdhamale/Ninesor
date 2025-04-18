const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const logging = require("selenium-webdriver/lib/logging");
const readline = require("readline");

// Readline to get URL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Please enter the URL to test: ", async function (url) {
  if (!url) {
    console.error("❌ No URL provided. Exiting...");
    rl.close();
    return;
  }

  const options = new chrome.Options();
  const prefs = new logging.Preferences();
  prefs.setLevel(logging.Type.BROWSER, logging.Level.ALL);
  options.setLoggingPrefs(prefs);

  let driver;

  try {
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    console.log(`\n🚀 Navigating to ${url}...`);
    await driver.get(url);
    await driver.sleep(2000);

    const elementCount = await driver.executeScript(`
      return document.querySelectorAll('*').length;
    `);
    console.log(`\n✅ Total elements in DOM: ${elementCount}`);

    const logs = await driver.manage().logs().get("browser");
    console.log("\n🧾 Browser Console Logs:");
    logs.forEach((log) => {
      console.log(log.message);
    });

  } catch (error) {
    console.error("❌ An error occurred:", error.message);
  } finally {
    if (driver) await driver.quit();
    rl.close();
  }
});
