export default class ProductDetailFragment {
  get calendar(): Cypress.Chainable {
    return cy.getDataCy('calendar')
  }

  get calendarDay(): Cypress.Chainable {
    return cy.getDataCy('calendar-day')
  }

  get saveButton(): Cypress.Chainable {
    return cy.contains('Save').should('not.be.disabled')
  }

  get closeButton(): Cypress.Chainable {
    return cy.getDataCy('close-selection')
  }

  get timeslot(): Cypress.Chainable {
    return cy.get('fieldset').find('label')
  }

  get timeslotTitle(): Cypress.Chainable {
    return cy.get('h2').contains('Select time')
  }

  get calendarNextMonthButton(): Cypress.Chainable {
    return cy.getDataCy('month-navigation-right')
  }

  /**
   * Finds and select the last available day for booking.
   *
   * Checks if the last day in month is still available it navigates to the next month.
   * When calendar data is loaded, selects last available day.
   *
   */
  findAndSelectLastAvailableDay() {
    this.calendar.should('be.visible')
    Cypress._.times(2, () => {
      this.calendarDay.last().then((button) => {
        if (!button.is(':disabled')) {
          this.calendarNextMonthButton.click()
          cy.wait('@calendar')
        }
      })
    })
    cy.get('[data-cy="calendar-day"]:not([disabled])').last().click()
  }
}