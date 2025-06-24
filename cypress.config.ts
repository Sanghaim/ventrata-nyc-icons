import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    includeShadowDom: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 80000,
  },
  env: {
    apiUrl: 'https://checkout-api.ventrata.com/octo',
    device: 'desktop',
  },
})

