const { SUPORTED_MARKETS } = require("./extractor");

const loginMap = {
    [SUPORTED_MARKETS.americanas]: (page) => {
        return page;
    },
    [SUPORTED_MARKETS.martins]: (page) => {
        return loginWithMartins(page);
    }
}

async function loginInThePage(page, marketId) {
    const login = loginMap[+marketId]
    return login ? login(page) : page
}

async function loginWithMartins(page) {
    /**
     * REMOVER DEPOIS DO HACKATHON
     */
    const credentials = {
        user: 'erika.rosa@mdlz.com',
        password: 'monica08',
    }

    await page.waitForSelector('#go-login')
    await page.hover('#go-login')
    await page.type('input#j_username', credentials.user)
    await page.type('input#j_password', credentials.password)

    try {
        await page.waitForSelector('[value^="4211591"]')
    } catch(e) {}
    await page.click('.pt-btn-login')
    await page.waitForNavigation()
    return page
}

module.exports = {
    loginInThePage,
}