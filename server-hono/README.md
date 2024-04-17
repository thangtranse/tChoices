## Features

1. Rate limit request
2. Get tag id

## Getting Started

### Setup database

Go to [Upstash](https://console.upstash.com) and register your database

### Start project

First, create `.env` file

```
REDIS_URL=
REDIS_TOKEN=
```

Second, create `wrangler.toml` file

```
compatibility_date = "2024-04-17"
name = "placeholder-api-2"

[vars]
REDIS_URL = "your redis url"
REDIS_TOKEN = "your redis token"
```

Third, run the development server:

```bash
yarn dev
```