describe('empleados role visibility', () => {
  it('shows write actions to admin and hides for user', () => {
    cy.login('admin@demo.com', 'admin123');
    cy.visit('/empleados');
    cy.get('[data-cy="empleados-new"]').should('exist');
    cy.visit('/empleados/nuevo');
    cy.url().should('include', '/empleados/nuevo');
    cy.get('[data-cy="logout-button"]').click();

    cy.login('user@demo.com', 'user123');
    cy.visit('/empleados');
    cy.get('[data-cy="empleados-new"]').should('not.exist');
    cy.visit('/empleados/nuevo');
    cy.url().should('not.include', '/empleados/nuevo');
  });
});
