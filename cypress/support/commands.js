// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('findBySel', {
    prevSubject: 'element'
  }, (subject, selector, ...args)  => {
  return cy.wrap(subject).find(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('GetNewPortGroupDialog', (TestFirewallDescription) => {
    cy.location('pathname').should('eq', '/manage/default/settings/security/threat-management/firewall/rule/form/new')
    cy.get('#name').type(TestFirewallDescription)
    cy.get('button').contains('Apply Changes').should('be.visible')
    cy.get('.main-panel').contains('Destination').click()
    cy.getBySel('content').contains('Port Group')
    cy.get('#firewallRuleDstPortGroup').click()
    cy.getBySel('options').should('be.visible')
    cy.getBySel('options').contains('Create New Group').click()

})
