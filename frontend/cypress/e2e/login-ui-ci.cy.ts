describe('login ui ci isolated', () => {
  it('renders login form and validates required fields without calling backend', () => {
    cy.intercept('**/api/v1/**').as('api');

    cy.visit('/login');

    cy.get('[data-cy="login-page"]').should('be.visible');
    cy.get('[data-cy="login-email"]').should('be.visible');
    cy.get('[data-cy="login-password"]').should('be.visible');
    cy.get('[data-cy="login-submit"]').should('be.visible').and('contain.text', 'Entrar');

    cy.get('[data-cy="login-submit"]').click();

    cy.url().should('include', '/login');
    cy.contains('small', 'Ingresa un email valido.').should('be.visible');
    cy.contains('small', 'El password es obligatorio.').should('be.visible');

    cy.get('@api.all').should('have.length', 0);
  });
});
