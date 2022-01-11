async function extractTheData(page, recipe) {

    const productData = await page.evaluate(
        (recipeJson) => {
            const recipe = JSON.parse(recipeJson)

            function extractAsArray(selectorMap) {
                const items = Array.from(document.querySelectorAll(selectorMap.selector))
                return items.map(
                    item => {
                        if (item && selectorMap.attribute) {
                            item = item.getAttribute(selectorMap.attribute)
                        }
                        if (item && selectorMap.regex) {
                            item = item.match(new RegExp(selectorMap.regex))
                        }
                        return item
                    }
                )
            }

            function extract(selectorMap) {
                if (typeof (selectorMap) === "string") {
                    const element = document.querySelector(selectorMap)
                    return element ? element.textContent : null
                }

                if (typeof (selectorMap) === "object") {
                    if (selectorMap.type === 'array') {
                        return extractAsArray(selectorMap)
                    }
                    let obj;
                    if (selectorMap.selector) {
                        obj = document.querySelector(selectorMap.selector)
                    }
                    if (obj && selectorMap.attribute) {
                        obj = obj.getAttribute(selectorMap.attribute)
                    }
                    if (selectorMap.runJs) {
                        obj = window.eval(selectorMap.runJs)
                    }
                    if (selectorMap.regex) {
                        obj = obj.match(new RegExp(selectorMap.regex))
                    }
                    return obj
                }
            }

            function extractPrice(selector) {
                const value = extract(selector, 'price') || ''
                return Number(value.replace(/[^0-9,\.]+/, "").replace('.', "").replace(',', "."))
            }

            return {
                url: window.location.href,
                market_id: recipe.market_id,
                name: extract(recipe.name),
                internal_id: extract(recipe.internal_id),
                primary_image: extract(recipe.primary_image),
                secondary_images: extract(recipe.secondary_images),
                available_to_buy: extract(recipe.available_to_buy) !== null,
                price: extractPrice(recipe.price)
            }
        },
        [JSON.stringify(recipe)]
    )

    return productData || []
}

const SUPORTED_MARKETS = {
    americanas: 1,
    martins: 2,
}

function getRecipe(marketId) {

    const recipes = {

        [SUPORTED_MARKETS.americanas]: {
            name: 'span[class^="src__Text"]',
            internal_id: {
                runJs: 'window.location.href.match(/(?!\\/produto\\/)(\\d+)/)[0]'
            },
            primary_image: {
                selector: 'div[class^="product-info"] img[class^="src__Image"]',
                attribute : 'src'
            },
            secondary_images: {
                type: 'array',
                selector: '[class^="thumb-gallery"] div[src]',
                attribute: 'src',
            },
            available_to_buy: 'div[class^="buy-area"]',
            price: 'div[class^="src__BestPrice"]'
        },

        [SUPORTED_MARKETS.martins]: {
            name: {
                runJs: 'document.querySelector("[class=\\"title\\"]").textContent.replaceAll("\\t","").replaceAll("\\n","")'
            },
            internal_id: '[itemprop="sku"]',
            primary_image: {
                selector: 'img[role="presentation"]',
                attribute: 'src'
            },
            secondary_images: {
                type: 'array',
                selector: '[class="slick-track"] a:not(.slick-cloned) img',
                attribute: 'src',
            },
            available_to_buy: '.value',
            price: '.value'
        }
    }

    const recipe = recipes[marketId]
    recipe['market_id'] = marketId
    return recipe
}

module.exports = {
    getRecipe,
    extractTheData,
    SUPORTED_MARKETS,
}
