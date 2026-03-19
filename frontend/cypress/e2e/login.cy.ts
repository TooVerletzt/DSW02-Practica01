describe('login flow', () => {
  it('allows valid credentials and rejects invalid credentials', () => {
    cy.login('admin@demo.com', 'admin123');
    cy.url().should('not.include', '/login');
    cy.get('[data-cy="session-data"]').should('contain.text', 'ADMIN');

    cy.get('[data-cy="logout-button"]').click();
    cy.url().should('include', '/login');

    cy.get('[data-cy="login-email"]').clear().type('admin@demo.com');
    cy.get('[data-cy="login-password"]').clear().type('bad-password');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/login');
    cy.get('[data-cy="api-feedback"]').should('contain.text', 'Credenciales invalidas');
  });
});
