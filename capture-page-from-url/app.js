const { visitThePage, close } = require('./src/capture');
const { extractTheData, getRecipe } = require('./src/extractor');
const { loginInThePage } = require('./src/navigator');

/**
 *
 * @param {*} event
 *  {
 * 	    "market": {
 *          "use_browser": true,
 *          "name": "americanas",
 *          "fullname": "Americanas (São Paulo)",
 *          "market_id": 61
 *      },
 * 	    "url": "https://www.americanas.com.br/produto/6800296"
 *  }
 * @param {*} context
 * @param {*} callback
 * @returns
 *  {
 * 	    "url": "https://www.americanas.com.br/produto/6800296",
 * 	    "market_id": 61,
 * 	    "name": "Nome do produto",
 * 	    "internal_id": "4582394", //id Interno do produto
 *      "primary_image": "https://images-americanas.b2w.io/produtos/01/00/img/2816876/4/2816876435_1SZ.jpg",
 * 	    "secondary_images": [ //Lista de imagens secundárias, pode ser vazia
 * 		    "https://images-americanas.b2w.io/produtos/01/00/img/2.jpg",
 * 		    "https://images-americanas.b2w.io/produtos/01/00/img/3.jpg"
 * 	    ]
 *   	"available_to_buy": true //produto está disponível para compra,
 * 	    "price": 45.90 //preço com maior destaque
 *  }
 */
exports.lambdaHandler = async (event, context, callback) => {
    console.log('Running version 1.1.0')

    let body = event.body
    //if came from lambda test, don't need to parse
    if (typeof body === 'string') {
        body = JSON.parse(event.body)
    }

    const {
        url,
        recipe,
        proxy,
        market: {
            market_id: marketId
        }
    } = body

    const supportedRecipe = recipe || getRecipe(marketId)
    if (!supportedRecipe) {
        throw 'unsupported market!'
    }

    try {

        let page = await visitThePage(url, proxy)

        page = await loginInThePage(page, marketId)

        const productData = await extractTheData(page, supportedRecipe)
        await close(page)
        return responseWithJson(productData)
    } catch (e) {
        console.log(e.message)
        callback(e)
    }

    return null
}

function responseWithJson(obj) {
    return {
        statusCode: 200,
        body: JSON.stringify(
            obj
        )
    }
}
