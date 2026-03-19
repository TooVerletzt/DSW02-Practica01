describe('user forced write rejection', () => {
  it('rejects user write attempt with 403', () => {
    cy.login('user@demo.com', 'user123');
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/departamentos',
      body: { nombre: `DEP-CY-${Date.now()}` },
      auth: { username: 'user@demo.com', password: 'user123' },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(403);
    });

    cy.visit('/departamentos');
    cy.get('[data-cy="api-feedback"]').should('not.exist');
  });
});
