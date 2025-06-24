import Actions from '../support/actions'

import CheckoutPage from '../support/pageObjects/checkoutPage'
import ProductsPage from '../support/pageObjects/productsPage'
import QuestionsPage from '../support/pageObjects/questionsPage'
import TicketsPage from '../support/pageObjects/ticketsPage'
import SummaryPage from '../support/pageObjects/fragments/summaryPage'

import ErrorBannerFragment from '../support/pageObjects/fragments/errorBannerFragment'
import FooterFragment from '../support/pageObjects/fragments/footerFragment'
import ProductDetailFragment from '../support/pageObjects/fragments/productDetailFragment'

import {
  REQUIRED_ERROR_MESSAGE,
  ALL_REQUIRED_PRODUCTS_ERROR_MESSAGE,
  LIBERTY_REQUIRED_ERROR_MESSAGE
} from '../support/testConsts'

const actions = new Actions()

const checkoutPage = new CheckoutPage()
const productsPage = new ProductsPage()
const questionsPage = new QuestionsPage()
const summaryPage = new SummaryPage()
const ticketsPage = new TicketsPage()

const errorBannerFragment = new ErrorBannerFragment()
const footerFragment = new FooterFragment()
const productDetailFragment = new ProductDetailFragment()

const [adultTickets, childTickets] = actions.adultAndChildTickets
const totalPrice = actions.calculateTotalPrice(adultTickets, childTickets)

const today = new Date().getDate().toString()

describe('NYC Icons Express', () => {
  it('Complete checkout flow', () => {
    actions.setupViewport(Cypress.env('device'))
    actions.registerIntercepts()

    cy.visit('/')
    cy.wait('@appLoaded')
    cy.getDataCy('package-product').click()

    // Add tickets
    ticketsPage.validatePage()
    ticketsPage.addTickets(adultTickets, childTickets)
    footerFragment.footerButton.click()

    // Products are visible and disabled except first product
    productsPage.header.should('exist')
    productsPage.products.should('have.length', 4)
    productsPage.validateInitialState()

    // Add first product to the cart and verify
    productsPage.getProductButtonByIndex(0).click()
    productDetailFragment.calendar.should('be.visible')
    cy.wait('@calendar')
    productDetailFragment.calendar.should('contain.text', today).first().click()
    cy.wait('@firstProduct')

    // User misses the 'Save' button under the product and clicks 'Continue' in the footer
    footerFragment.footerButton.click()
    errorBannerFragment.banner.should('contain.text', ALL_REQUIRED_PRODUCTS_ERROR_MESSAGE)
    errorBannerFragment.closeButton.click()
    errorBannerFragment.banner.should('not.exist')

    productDetailFragment.saveButton.click()
    productsPage.verifyProductCompleted(0)
    productsPage.counter.should('contain.text', '1/4 Selected')

    // Other products are enabled
    productsPage.getProductButtonByIndex(1).should('not.be.disabled')
    productsPage.getProductButtonByIndex(2).should('not.be.disabled')
    productsPage.getProductButtonByIndex(3).should('not.be.disabled')

    // Add second product and reset selection
    productsPage.getProductButtonByIndex(1).click()
    actions.selectSlotIfAvailable()
    productsPage.resetSelectionButton.click()
    cy.wait('@bookingEdit')
    productsPage.validateInitialState()

    // Add all products
    productsPage.getProductButtonByIndex(0).click()
    productDetailFragment.findAndSelectLastAvailableDay()
    cy.wait('@firstProduct')
    productDetailFragment.saveButton.click()
    productsPage.verifyProductCompleted(0)
    productsPage.counter.should('contain.text', '1/4 Selected')

    // User selects a first timeslot in the day, then changes his mind and selects the last timeslot
    let selectedTimeSlot = ''
    productsPage.getProductButtonByIndex(1).click()
    cy.wait(['@calendar', '@secondProduct'])
    productDetailFragment.timeslot.first().then((button) => selectedTimeSlot = button.text())
    productDetailFragment.timeslot.first().click()
    productDetailFragment.saveButton.click()
    productsPage.verifyProductCompleted(1)
    productsPage.counter.should('contain.text', '2/4 Selected')
    cy.then(() => {
      productDetailFragment.getProductTravelDateByIndex(1).should('contain.text', selectedTimeSlot.trim())
    })

    productDetailFragment.getProductTravelDateByIndex(1).click()
    cy.wait(['@calendar', '@secondProduct'])
    productDetailFragment.timeslot.last().then((button) => selectedTimeSlot = button.text())
    productDetailFragment.timeslot.last().click()
    productDetailFragment.saveButton.click()
    productsPage.verifyProductCompleted(1)
    productsPage.counter.should('contain.text', '2/4 Selected')
    cy.then(() => {
      productDetailFragment.getProductTravelDateByIndex(1).should('contain.text', selectedTimeSlot.trim())
    })


    // User misses the last mandatory product, error banner disappears after the last product is opened
    footerFragment.footerButton.click()
    errorBannerFragment.banner.should('contain.text', LIBERTY_REQUIRED_ERROR_MESSAGE)
    productsPage.getProductButtonByIndex(3).click()
    cy.wait('@fourthProduct')
    errorBannerFragment.banner.should('not.exist')
    productDetailFragment.saveButton.click()
    productsPage.verifyProductCompleted(3)
    productsPage.counter.should('contain.text', '3/4 Selected')
    footerFragment.footerButton.click()

    // Validate questions page and check if validations are in place
    questionsPage.validateQuestionsPage(adultTickets, childTickets)
    footerFragment.footerButton.click()
    questionsPage.textareaSection
      .getDataCyLike('textarea-error')
      .should('contain.text', REQUIRED_ERROR_MESSAGE)
    questionsPage.selectSection
      .findCyLike('input-error')
      .should('contain.text', REQUIRED_ERROR_MESSAGE)
    questionsPage.adultSection
      .findCyLike('error')
      .and('contain.text', REQUIRED_ERROR_MESSAGE)
      .and('have.length', adultTickets)
    questionsPage.childSection
      .findCyLike('error')
      .and('contain.text', REQUIRED_ERROR_MESSAGE)
      .and('have.length', childTickets)

    // Fill mandatory fields and checkboxes
    questionsPage.textareaSection.find('textarea').type('Filling')
    actions.filterOptionsAndSelect(questionsPage.selectSection, 'one', 'one')
    questionsPage.checkAllAdultCheckboxes()
    questionsPage.checkAllChildCheckboxes()
    footerFragment.footerButton.click()

    // Check total price, if on mobile device, continue
    checkoutPage.cartInformation.should('be.visible')
    footerFragment.totalPrice.should('contain.text', totalPrice)
    if (Cypress.env('device') === 'mobile') {
      footerFragment.footerButton.click()
    }

    // Use promo code, fill contact information and submit order
    actions.usePromoCodeAndCheckPrice()
    checkoutPage.firstNameInput.type('Test')
    checkoutPage.lastNameInput.type('Testingson')
    actions.filterOptionsAndSelect(checkoutPage.countrySelect, 'Czech Republic', 'cz')
    checkoutPage.stateInput.should('be.visible').type('Morava')
    checkoutPage.bookingTermsCheckbox.click()
    checkoutPage.cancellationPolicyCheckbox.click()
    footerFragment.footerButton.click()

    // Check success
    summaryPage.orderSummary.should('contain.text', 'Thanks for your purchase')
    summaryPage.paidAmount.should('contain.text', '€0')
  })
})

