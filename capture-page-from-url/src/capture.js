const puppeteer = require('puppeteer-core')
const chromium = require('chrome-aws-lambda');

async function visitThePage (pageUrl, proxy) {
    proxy = proxy || getHardCodedProxy()
    const browser = await createBrowser(proxy)
    const page = await createPage(browser, proxy)
    await page.goto(pageUrl)
    return page
}

async function getHardCodedProxy () {
    return {
		"source": "",
		"host": "",
		"port": 3135,
		"location": "",
		"user": "",
		"pass": ""
	}
}

async function createBrowser (proxy) {

    const args = getArgs(proxy);
    const options = {
        headless: true,
        ignoreHTTPSErrors: true,
        executablePath: await chromium.executablePath,
        args: [...args, ...chromium.args],
    };

    const browser = await puppeteer.launch(options)
    return browser
}

function getArgs(proxy) {
    const args = [];
    args.push('--window-size=1600,1200');
    args.push('--ignore-certificate-errors');
    args.push('--disable-features=site-per-process');
    args.push('--disable-dev-shm-usage');
    args.push('--full-memory-crash-report');
    args.push('--no-sandbox');

    if (proxy.host && process.env.PROXY !== 'false') {
        args.push(`--proxy-server=${proxy.host}:${proxy.port}`);
    }

    return args;
}

async function createPage (browser, proxy) {
    const page = await browser.newPage()
    await setupPage(page, proxy)
    return page
}

async function setupPage(page, proxy) {
    await page.setViewport({
        width: 1366,
        height: 768
    });

    if (proxy.user) {
        await page.authenticate({
            username: proxy.user,
            password: proxy.pass
        });
    }
    await page.setUserAgent(randUserAgent());
}

function randUserAgent() {
    const USER_AGENTS = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (X11; Linux i686; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:78.0) Gecko/20100101 Firefox/78.0',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/83.0.478.58',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
    ];

    return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

async function close(page) {
    await page.browser().close()
}

module.exports = {
    visitThePage,
    close,
}