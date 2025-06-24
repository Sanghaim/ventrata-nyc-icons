export default class QuestionsPage {

  /**
   * Validates that the Questions page is rendered correctly based on ticket counts.
   *
   * Ensures the mandatory sections are visible.
   * Verifies the correct number of adult and child sections are present.
   *
   * @param adultTickets - Number of adult ticket sections expected.
   * @param childTickets - Number of child ticket sections expected.
   */
  validateQuestionsPage(adultTickets: number, childTickets: number) {
    this.textareaSection.should('exist')
    this.selectSection.should('exist')
    this.adultSection.should('have.length', adultTickets)
    this.childSection.should('have.length', childTickets)
  }

  get textareaSection(): Cypress.Chainable {
    return cy.getDataCyLike('question-true-a2b21620')
  }

  get selectSection(): Cypress.Chainable {
    return cy.getDataCyLike('question-true-04bd3c99')
  }

  get adultSection(): Cypress.Chainable {
    return cy.getDataCyLike('question-true-d5f2fc7d')
  }

  get childSection(): Cypress.Chainable {
    return cy.getDataCyLike('question-true-a1a666c4')
  }

  checkAllAdultCheckboxes() {
    cy.getDataCyLike('d5f2fc7d-0f60-411c-b28d-cee4e8623287-checkbox').click({ multiple: true })
  }

  checkAllChildCheckboxes() {
    cy.getDataCyLike('a1a666c4-f7f9-4ca0-9992-30cb2f22eff2-checkbox').click({ multiple: true })
  }
}
