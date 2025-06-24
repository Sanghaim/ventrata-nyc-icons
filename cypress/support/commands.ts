/// <reference types="cypress" />
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by `data-cy` attribute.
     * @param selector - string to match `data-cy` attribute.
     * @param args - Optional arguments to pass through to `cy.get()`.
     * @example cy.dataCy('greeting')
     */
    getDataCy(selector: string, ...args: Partial<SelectOptions>[]): Cypress.Chainable;

    /**
     * Custom command to find DOM element in parent element by `data-cy` attribute.
     * @param selector - string to match `data-cy` attribute.
     * @param args - Optional arguments to pass through to `cy.find()`.
     * @example cy.get('div').findCy('card')
     */
    findCy(selector: string, ...args: Partial<SelectOptions>[]): Cypress.Chainable;

    /**
     * Custom command that selects DOM elements whose `data-cy` attribute
     * **contains** the given substring.
     * @param selector - Substring to match within the `data-cy` attribute.
     * @param args - Optional arguments to pass through to `cy.get()`.
     * @example
     * // Matches <div data-cy="user-card-123">
     * cy.getDataCyLike("user-card")
     */
    getDataCyLike(selector: string, ...args: Partial<SelectOptions>[]): Cypress.Chainable;

    /**
     * Custom command to find DOM element in parent element by given `data-cy` substring.
     * @param selector - Substring to match within the `data-cy` attribute.
     * @param args - Optional arguments to pass through to `cy.find()`.
     * @example cy.get('div').findCyLike('card')
     */
    findCyLike(selector: string, ...args: Partial<SelectOptions>[]): Cypress.Chainable;
  }
}

Cypress.Commands.add('getDataCy', (selector, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add('findCy', { prevSubject: 'element' }, (subject, selector, ...args) => {
  return cy.wrap(subject).find(`[data-cy=${selector}]`, ...args)
})

Cypress.Commands.add('getDataCyLike', (selector, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args)
})

Cypress.Commands.add('findCyLike', { prevSubject: 'element' }, (subject, selector, ...args) => {
  return cy.wrap(subject).find(`[data-cy*=${selector}]`, ...args)
})