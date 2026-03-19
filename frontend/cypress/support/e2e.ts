Cypress.on('uncaught:exception', () => false);

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-cy="login-email"]').clear().type(email);
  cy.get('[data-cy="login-password"]').clear().type(password);
  cy.get('[data-cy="login-submit"]').click();
  cy.url().should('not.include', '/login');
  cy.get('[data-cy="session-data"]').should('contain.text', email);
});

export {};
