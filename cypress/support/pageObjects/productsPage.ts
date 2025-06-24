export default class ProductsPage {
  get header(): Cypress.Chainable {
    return cy.get('[data-cy-title="Date and Time"]', { timeout: 80000 })
  }

  get products(): Cypress.Chainable {
    return cy.getDataCyLike('include-product')
  }

  get counter(): Cypress.Chainable {
    return cy.getDataCy('selected-counter')
  }

  get resetSelectionButton(): Cypress.Chainable {
    return cy.contains('Reset selection')
  }

  getProductButtonByIndex(index: number): Cypress.Chainable {
    return cy.getDataCy(`include-product-${index}`).findCy('select-date-and-time-button')
  }

  /**
   * Validates that no product is in cart and only first product is available to interact with
   */
  validateInitialState() {
    this.counter.contains('0/4 Selected', { timeout: 80000 })
    this.getProductButtonByIndex(0).should('not.be.disabled')
    this.getProductButtonByIndex(1).should('be.disabled')
    this.getProductButtonByIndex(2).should('be.disabled')
    this.getProductButtonByIndex(3).should('be.disabled')
  }

  /**
   * Checks complete badge on product
   * @param index - index of product to be verified
   */
  verifyProductCompleted(index: number): Cypress.Chainable {
    return cy.getDataCy(`isCompleted-${index}`, { timeout: 80000 }).should('exist')
  }
}