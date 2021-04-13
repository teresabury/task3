describe('Login and go into firewall rules creation', () => {
  beforeEach(() => {
    cy.request('POST', '/api/login', { username: Cypress.env('USERNAME'), password: Cypress.env('PASSWORD')})
      .its('body')
      .as('currentUser')

    cy.visit('/manage/default/dashboard')
    cy.getBySel('navigation-settings').click()
    cy.location('pathname').should('eq', '/manage/default/settings/wifi')

    cy.getBySel('security').click()
    cy.location('pathname').should('eq', '/manage/default/settings/security')

    cy.get('.main-panel').contains('Internet Threat Management').click()
    cy.location('pathname').should('eq', '/manage/default/settings/security/threat-management')

    cy.get('#accordion-panel-firewall > div > span > span')
      .should('have.text', 'Firewall')
      .click()
    cy.get('button').contains('Create New Rule').click()
    cy.location('pathname').should('eq', '/manage/default/settings/security/threat-management/firewall/rule/form/new')
  })


  it('Test Description field cannot be empty', function() {
    cy.location('pathname').should('eq', '/manage/default/settings/security/threat-management/firewall/rule/form/new')
    cy.get('#name').type('My test description')
    cy.get('button').contains('Apply Changes').should('be.visible')
    cy.get('#name').clear()
    cy.get('button').contains('Apply Changes').should('not.be.visible')
  })


  it('Create firewall rule with defined destination port group', function() {

    const TestFirewallDescription = 'My test Firewall Description'
    const TestPortGroupName = 'My test Port Group'
    const Port = 443

    cy.GetNewPortGroupDialog(TestFirewallDescription)

    cy.get('div[role="dialog"]').within(($dialog) => {
        cy.get('#name').type(TestPortGroupName)
        cy.get('button[name="multi-input-add-group_members"]').click()
        cy.get('input[name="group_members[0]"]').type(Port)
        cy.get('button').contains('Create New Group').click()

    })
    cy.get('input#firewallRuleDstPortGroup').should('have.value', TestPortGroupName)
    cy.get('button').contains('Apply Changes').click()
    cy.visit('/manage/default/settings/security/threat-management')
    cy.get('#accordion-panel-firewall > div > span > span').should('have.text', 'Firewall').click()
    cy.getBySel('content').contains(TestFirewallDescription)
  })


  it('Create firewall rule with defined destination port group fails when specified port is invalid', function() {

    const TestFirewallDescription = 'My test Firewall Description'
    const TestPortGroupName = 'My test Port Group'
    const Port = 'invalid_port_number'

    cy.GetNewPortGroupDialog(TestFirewallDescription)

    cy.get('div[role="dialog"]').within(($dialog) => {
        cy.get('#name').type(TestPortGroupName)
        cy.get('button[name="multi-input-add-group_members"]').click()
        cy.get('input[name="group_members[0]"]').type(Port)
        cy.get('button').contains('Create New Group').click()
        cy.get('span').contains('This field must be a valid Port')
        cy.get('button').contains('Create New Group').should('be.visible')
    })
  })

})
