export default class ErrorBannerFragment {
  get banner(): Cypress.Chainable {
    return cy.getDataCy('error-banner')
  }

  get closeButton(): Cypress.Chainable {
    return cy.getDataCy('close-error')
  }
}