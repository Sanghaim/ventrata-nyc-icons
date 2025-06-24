export default class CheckoutPage {
  get cartInformation() {
    return cy.getDataCy('cart-info-wrapper', { timeout: 60000 })
  }

  get firstNameInput(): Cypress.Chainable {
    return cy.getDataCy('firstName-input')
  }

  get lastNameInput(): Cypress.Chainable {
    return cy.getDataCy('lastName-input')
  }

  get countrySelect(): Cypress.Chainable {
    return cy.getDataCy('select')
  }

  get stateInput(): Cypress.Chainable {
    return cy.getDataCy('state-input')
  }

  get bookingTermsCheckbox(): Cypress.Chainable {
    return cy.getDataCy('bookingTerms-checkbox')
  }

  get cancellationPolicyCheckbox(): Cypress.Chainable {
    return cy.getDataCy('cancellationPolicy-checkbox')
  }

  get enterDiscountButton(): Cypress.Chainable {
    return cy.getDataCy('enter-code-button')
  }

  get discountCodeInput(): Cypress.Chainable {
    return cy.getDataCy('code-input')
  }

  get submitDiscountCodeButton(): Cypress.Chainable {
    return cy.getDataCy('code-check-button')
  }

  get promoTag(): Cypress.Chainable {
    return cy.getDataCy('promo-code-tag', { timeout: 60000 })
  }
}
