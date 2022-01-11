const { lambdaHandler } = require('./app.js')


const MARKETS = {
  "americanas": {
    "market": {
      "use_browser": true,
      "name": "americanas",
      "fullname": "Americanas (São Paulo)",
      "market_id": 61
    },
    "url": "https://www.americanas.com.br/produto/36035735"
  },
  "martins": {
    "market": {
      "use_browser": true,
      "name": "martins",
      "fullname": "Martins Atacado (Brasil)",
      "market_id": 178
    },
    "url": "https://www.martinsatacado.com.br//mercearia-doce/p/amandita-mirabel-chocolate-lacta-emb-contem-1un-de-200g-amandita-martins_1500810"
  }
}

lambdaHandler({ "body": JSON.stringify(MARKETS[process.argv[2]]) })