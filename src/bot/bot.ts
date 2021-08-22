import * as puppeteer from 'puppeteer';

export const addItem = async (itemName: string) => {
    const [browser, page] = await init();

    await signIn(page);

    const resultElement = await search(page, itemName);
    if (resultElement) {
        const addToListButton = await resultElement.$('.shopping-list-menu_container button');
        const actionLabel = await addToListButton.evaluate(n => n.getAttribute('aria-label'));
        if (actionLabel.includes('remove')) {
            console.log(`Item ${itemName} is already in cart`);
        }
        else {
            await addToListButton.click();
            console.log(`Item ${itemName} added to cart`)
        }
    }
    else {
        console.log(`Could not find item ${itemName}`);
    }

    await browser.close();
}



const search = async (page: puppeteer.Page, query: string): Promise<puppeteer.ElementHandle<Element> | null> => {
    const searchInput = await page.waitForSelector('#typeahead-search-input');
    await searchInput.type(query);

    const searchButton = await page.$('.search-button');
    await searchButton.click();

    await page.waitForTimeout(5000);

    const resultElement = await page.$('.product-cell');
    return resultElement || null;
}

const signIn = async (page: puppeteer.Page): Promise<puppeteer.Page> => {
    const accountButton = await page.$('#header-account-button');
    await accountButton.click();

    const signInButton = await page.$("#nav-sign-in");
    await signInButton.click();

    const usernameInput = await page.waitForSelector("#login-username");
    await typeWithDelay(page, usernameInput, process.env.STOP_AND_SHOP_EMAIL);

    const passwordInput = await page.$("#login-password");
    await passwordInput.type(process.env.STOP_AND_SHOP_PASSWORD);

    const signInButton2 = await page.$("#sign-in-button");
    await signInButton2.click();
    await page.waitForTimeout(3000);

    const alertButton = await page.waitForSelector('#alert-button_primary-button');
    await alertButton.click();

    return page;
}

const init = async (): Promise<[puppeteer.Browser, puppeteer.Page]> => {
    const isProd = process.env.ENVIRONMENT === 'prod';
    const options: puppeteer.LaunchOptions & puppeteer.BrowserLaunchArgumentOptions & puppeteer.BrowserConnectOptions = {
        headless: isProd,
        defaultViewport: { height: 1000, width: 1680 }
    };
    if (!isProd) {
        options.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.goto('https://stopandshop.com');
    return [browser, page];
}

const typeWithDelay = async (page: puppeteer.Page, input: puppeteer.ElementHandle<Element>, text: string) => {
    const diffSize = 9;
    const numParts = Math.ceil(text.length / diffSize);
    for (let i = 0; i < numParts; i++) {
        const offset = diffSize * i;
        const inputText = text.substring(offset, offset + diffSize);
        await input.type(inputText);
        await page.waitForTimeout(1000);
    }
}
