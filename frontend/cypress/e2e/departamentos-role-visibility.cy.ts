describe('departamentos role visibility', () => {
  it('shows write actions to admin and hides for user', () => {
    cy.login('admin@demo.com', 'admin123');
    cy.visit('/departamentos');
    cy.get('[data-cy="departamentos-new"]').should('exist');
    cy.visit('/departamentos/nuevo');
    cy.url().should('include', '/departamentos/nuevo');
    cy.get('[data-cy="logout-button"]').click();

    cy.login('user@demo.com', 'user123');
    cy.visit('/departamentos');
    cy.get('[data-cy="departamentos-new"]').should('not.exist');
    cy.visit('/departamentos/nuevo');
    cy.url().should('not.include', '/departamentos/nuevo');
  });
});
