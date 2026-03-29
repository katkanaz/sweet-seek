# SweetSeek Frontend

Frontend for the SweetSeek web application. Utilized technologies:

- React
- Tanstack Query
- Tanstack Router
- Chakra UI

## Install prerequisites

- `node`, `npm`

```bash
npm install
```

## Build

```bash
npm run build
```

Produces build artifacts in the `dist/` directory.


## Running during development

```bash
npm run dev
```

Starts a development server with hot module reloading. Proxies all request made
to `/api` to the backend, whose address can be configured in `vite.config.ts`
under the `proxy` option.
