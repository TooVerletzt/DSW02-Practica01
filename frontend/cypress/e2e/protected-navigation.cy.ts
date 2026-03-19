describe('protected navigation', () => {
  it('redirects unauthenticated users to login', () => {
    cy.visit('/empleados');
    cy.url().should('include', '/login');
  });
});
