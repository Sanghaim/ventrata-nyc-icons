export default class FooterFragment {
  get footerButton(): Cypress.Chainable {
    return cy.getDataCy('footer-button')
  }

  get totalPrice(): Cypress.Chainable {
    return cy.getDataCy('cart-price')
  }
}