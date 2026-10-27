# saucedemo-playwright-tests

## API tests

This project uses Playwright's built-in API request fixture to test the free
JSONPlaceholder mock REST API. SauceDemo is the UI test target; this repository
does not currently use a documented SauceDemo API.

Set `API_BASE_URL` in `.env` to override the default
`https://jsonplaceholder.typicode.com`, then run the API suite with:

```bash
npm run test:api
```

The API project tests `GET /posts/1`, `GET /users/1`, and
`GET /posts?userId=1`. These are public mock endpoints and do not persist
changes.