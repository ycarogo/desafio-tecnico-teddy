## Desafio Técnico – Micro-frontend (Host + Clients)

Este repositório contém dois aplicativos React com Vite organizados em pastas separadas:

- `host`: aplicação principal que consome, via Module Federation, páginas do micro-frontend de clientes.
- `clients`: micro-frontend que expõe páginas de clientes para o host.

Ambos são TypeScript, utilizam Tailwind e Vite 7, e o host possui testes com Vitest e Testing Library.

### Requisitos

- Node.js 18+ (recomendado 20+)
- npm 9+

### Estrutura do projeto

```
./
  host/      # app principal (consome o remote)
  clients/   # micro-frontend (exposto ao host)
```

## Instalação

Execute a instalação de dependências em cada app:

```bash
cd clients && npm install
cd ../host && npm install
```

## Desenvolvimento (local)

O host depende do `clients` rodando e acessível via URL configurada em variável de ambiente.

1. Suba o `clients` (porta 5173 por padrão):

```bash
cd clients
npm run dev
```

2. Configure no `host` a URL do remote do `clients` (dev):

Crie um arquivo `.env` dentro de `host/` com o conteúdo:

```bash
# URL base onde o clients está sendo servido em dev
VITE_URL_REMOTE=http://localhost:5173
```

3. Suba o `host` em outra porta (ex.: 5174) para evitar conflito com o `clients`:

```bash
cd host
npm run dev -- --port 5174
```

4. Acesse o host em `http://localhost:5174`.

Observações:

- O `host/vite.config.ts` usa `VITE_URL_REMOTE` para montar o caminho do `remoteEntry.js` do `clients`.
- O `clients/vite.config.ts` expõe `./Clients` e `./ListClients` via Module Federation.

## Variáveis de ambiente

No `host/.env` defina:

```bash
VITE_URL_REMOTE=http://localhost:5173
```

Em produção, aponte `VITE_URL_REMOTE` para a URL onde o build do `clients` foi publicado (raiz do site do `clients`). O host calculará `"${VITE_URL_REMOTE}/assets/remoteEntry.js"`.

## Build de produção

Gere os builds em cada app:

```bash
cd clients && npm run build
cd ../host && npm run build
```

Isso criará as pastas `dist/` em cada projeto. Publique o `clients/dist` primeiro e configure `VITE_URL_REMOTE` no `host` para apontar para a origem pública do `clients`.

### Pré-visualizar o build localmente

```bash
cd clients && npm run preview
cd ../host && npm run preview -- --port 5174
```

## Testes (host)

O `host` possui testes com Vitest:

```bash
cd host
npm run test        # modo watch
npm run coverage    # execução com cobertura
```

## Lint

Você pode rodar o lint em cada app:

```bash
cd clients && npm run lint
cd ../host && npm run lint
```

## Dicas e problemas comuns

- Porta em uso: se `5173` já estiver ocupada, rode `clients` em outra porta: `npm run dev -- --port 5175` e ajuste `VITE_URL_REMOTE` no `host` para `http://localhost:5175`.
- Cache do navegador: ao trocar builds do `clients`, limpe o cache se o host continuar apontando para artefatos antigos.
- CORS: sirva ambos com HTTP local padrão. Em produção, garanta que a origem do `clients` esteja acessível publicamente pelo `host`.

## Scripts úteis

- `clients:dev`: `cd clients && npm run dev`
- `host:dev`: `cd host && npm run dev -- --port 5174`
- `clients:build`: `cd clients && npm run build`
- `host:build`: `cd host && npm run build`
- `host:test`: `cd host && npm run test`
- `host:coverage`: `cd host && npm run coverage`
