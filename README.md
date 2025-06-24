# 🧪 Ventrata E2E showcase

Automated E2E test for the **NYC Icons Express** widget using [Cypress](https://www.cypress.io/).  
Covers checkout flow scenario with edge case when no slots for attraction are available.

## ⚙️ Requirements
| Requirement | Version                                        |
|-------------|------------------------------------------------|
| Node.js     | `>=18.x` (LTS recommended)                     |
| npm / yarn  | `>=8.6.0`                                      |
| OS          | Windows 10+, Ubuntu 20.04+, macOS 11 and above |

---

## 🛠️ Configuration

This project uses a custom Cypress configuration defined in `cypress.config.ts` to tailor 
test execution for the Ventrata Checkout application.

Most notable are environment settings, that states the `apiUrl` and `device`.

You can override these settings via the CLI with `--env` flag, e.g.:
```bash
  npx cypress run --env device=mobile
```
or creating a `cypress.env.json` file and set the variables there.


## 🚀 Getting Started

To run the Cypress end-to-end tests, follow these steps:

---

1. **Clone the repo:**

   ```bash
   git clone https://github.com/Sanghaim/ventrata-nyc-icons.git
   cd ventrata-nyc-icons
   
2. **Install dependencies:**

    ```bash
    npm install

3. **Serve the App:**
   Make sure the app (e.g. `index.html`) is being served locally. 
   You can use [`http-server`](https://www.npmjs.com/package/http-server) to quickly spin up a local server:

   ```bash
   npx http-server -p 8080
   ```
   
   This will serve the app at http://localhost:8080, which matches the `baseUrl` set in the Cypress config.

4. **Run the tests:**
   ```bash
   npm run test
   ```
   This command will spin up a local server on `http://localhost:8080/` by default and then runs the Cypress test.