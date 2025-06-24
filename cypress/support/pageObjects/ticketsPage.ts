export default class TicketsPage {
  get header(): Cypress.Chainable {
    return cy.getDataCy('navigation-header')
  }

  get adultTicketCounter(): Cypress.Chainable {
    return cy.getDataCy('ticket-counter-Adult')
  }

  get addAdultTicketsButton(): Cypress.Chainable {
    return this.adultTicketCounter.findCy('increase-button')
  }

  get childTicketCounter(): Cypress.Chainable {
    return cy.getDataCy('ticket-counter-Child')
  }

  get addChildTicketsButton(): Cypress.Chainable {
    return this.childTicketCounter.findCy('increase-button')
  }

  /**
   * Validates that page header and tickets counters are visible
   */
  validatePage() {
    this.header.should('be.visible').and('contain.text', 'Tickets')
    this.adultTicketCounter.should('be.visible')
    this.childTicketCounter.should('be.visible')
  }

  /**
   * Adds tickets to the cart
   * @param adultTickets number of Adult tickets to be bought
   * @param childTickets number of Child tickets to be bought
   */
  addTickets(adultTickets: number, childTickets: number): void {
    Cypress._.times(adultTickets, () => this.addAdultTicketsButton.click())
    Cypress._.times(childTickets, () => this.addChildTicketsButton.click())
  }
}