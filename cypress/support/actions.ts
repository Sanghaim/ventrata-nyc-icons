import { INTERCEPT_ALIASES } from './testConsts'
import ProductDetailFragment from './pageObjects/fragments/productDetailFragment'
import ProductsPage from './pageObjects/productsPage'
import CheckoutPage from './pageObjects/checkoutPage'
import FooterFragment from './pageObjects/fragments/footerFragment'

const productDetailFragment = new ProductDetailFragment()
const productsPage = new ProductsPage()
const checkoutPage = new CheckoutPage()
const footerFragment = new FooterFragment()

export default class Actions {
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * Returns an array of randomly generated amount of tickets to use in test.
   * Maximum number of tickets per order is 20.
   */
  get adultAndChildTickets(): number[] {
    const adults = this.getRandomNumber(1, 19)
    const children = this.getRandomNumber(1, 19 - adults)

    return [adults, children]
  }

  /**
   * Filters options in a searchable dropdown and selects the desired value.
   *
   * @param selector - The Cypress chainable wrapping the dropdown container.
   * @param filter - The text to type into the dropdown input to filter options.
   * @param value - The value identifier used to select the matching option.
   *
   * Example:
   *   filterOptionsAndSelect(countrySelect, 'Czech', 'cz')
   *   → types "Czech" into the input and selects the option with data-cy="select-option--cz"
   */
  filterOptionsAndSelect(selector: Cypress.Chainable, filter: string, value: string) {
    selector.find('input').type(filter)
    cy.getDataCy(`select-option--${value}`).first().click()
  }

  calculateTotalPrice(adultTickets: number, childTickets: number): number {
    const ticketsPrice = (30 * adultTickets) + (15 * childTickets)
    const bookingFee = ticketsPrice * 0.1

    return ticketsPrice + bookingFee
  }

  /**
   * Registers all necessary Cypress network intercepts used during the test flow.
   *
   * - Intercepts app config load, calendar availability, and order updates.
   * - Sets up aliases for specific product availability requests using `INTERCEPT_ALIASES`.
   *
   * Aliases created:
   * - @appLoaded – App configuration fetch
   * - @calendar – Calendar availability fetch
   * - @bookingEdit – PATCH request for editing bookings
   * - @<productAlias> – Dynamic alias for each product based on its productId
   */
  registerIntercepts() {
    cy.intercept({
      url: `${Cypress.env('apiUrl')}/ventrata/checkout/config`,
      method: 'GET',
    }).as('appLoaded')

    cy.intercept(`${Cypress.env('apiUrl')}/availability/calendar`).as('calendar')

    cy.intercept({
      url: `${Cypress.env('apiUrl')}/orders/*`,
      method: 'PATCH',
    }).as('bookingEdit')

    INTERCEPT_ALIASES.forEach((intercept) => {
      cy.intercept(`${Cypress.env('apiUrl')}/availability`, (req) => {
        if (req.body?.productId === intercept.productId) {
          req.alias = intercept.alias
        }
      })
    })
  }

  /**
   * Handles slot selection for a product if available.
   *
   * Waits for calendar availability and checks if a day is available.
   * If no availability, logs a message and closes the product modal.
   * If available, waits for slot data, selects a random time slot, saves it,
   * and verifies the product as completed.
   */
  selectSlotIfAvailable() {
    cy.wait('@calendar')
      .its('response.body')
      .should('be.an', 'array')
      .and('have.length', 1)
      .then(([calendarItem]) => {
        expect(calendarItem).to.have.property('available')

        if (!calendarItem.available) {
          cy.log('No slots, closing')

          return productDetailFragment.closeButton.click()
        }

        cy.wait('@secondProduct')
          .its('response.body')
          .should('be.an', 'array')
          .then((slots) => {
            const numberOfSlots = slots.length
            cy.log(`${numberOfSlots} slots available, selecting and saving`)

            productDetailFragment.timeslotTitle.should('exist')
            productDetailFragment.timeslot.eq(this.getRandomNumber(0, numberOfSlots - 1)).click()
            productDetailFragment.saveButton.click()

            productsPage.verifyProductCompleted(1)

            productsPage.counter.should('contain.text', '2/4 Selected')
          })
      })
  }

  /**
   * Applies a predefined promo code and verifies the total price is updated.
   *
   * Enters the "CYPRESSFREE" discount code.
   * Submits the code and checks for confirmation tag.
   * Asserts that the total price is reduced to €0.
   */
  usePromoCodeAndCheckPrice() {
    checkoutPage.enterDiscountButton.click()
    checkoutPage.discountCodeInput.type('CYPRESSFREE')
    checkoutPage.submitDiscountCodeButton.click()

    checkoutPage.promoTag.should('contain.text', 'Promotion (FREE)')
    footerFragment.totalPrice.should('contain.text', '€0')
  }

  setupViewport(mode: 'mobile' | 'desktop') {
    cy.viewport(mode === 'mobile' ? 'iphone-xr' : 'macbook-11')
  }
}