export default class SummaryPage {
  get orderSummary(): Cypress.Chainable {
    return cy.getDataCy('order-summary', { timeout: 60000 })
  }

  get paidAmount(): Cypress.Chainable {
    return cy.getDataCy('paid-amount')
  }
}
