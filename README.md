# capture-page-from-url

## Saiba como executar
---
### Ambiente Local:

##### Requisitos:

- Instale o SAM AWS:
    [Instalar aAWS SAMCLI do no Linux](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-sam-cli-install-linux.html)

##### Execução:

- Suba a API utilizando:
```bash
sam build && sam local start-api
```

- Envie uma mensagem no formato a seguir para  o `http://localhost:3000` :

```json
{
    "market": {
        "use_browser": true,
        "name": "americanas",
        "fullname": "Americanas (São Paulo)",
        "market_id": 61
    },
    "url": "https://www.americanas.com.br/produto/6800296"
}
```
