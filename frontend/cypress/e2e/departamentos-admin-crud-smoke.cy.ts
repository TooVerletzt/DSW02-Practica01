describe('departamentos admin crud smoke', () => {
  it('creates, updates and deletes a departamento as admin', () => {
    const marker = Date.now();
    const name = `Depto Cy ${marker}`;
    const editedName = `Depto Cy ${marker} Editado`;
    let createdClave = '';
    const authHeader = `Basic ${btoa('admin@demo.com:admin123')}`;

    cy.login('admin@demo.com', 'admin123');
    cy.intercept('POST', '**/api/v1/departamentos').as('createDepartamento');
    cy.intercept('PUT', '**/api/v1/departamentos/*').as('updateDepartamento');
    cy.intercept('DELETE', '**/api/v1/departamentos/*').as('deleteDepartamento');

    cy.visit('/departamentos/nuevo');
    cy.get('[data-cy="departamento-nombre"]').type(name);
    cy.get('[data-cy="departamento-submit"]').click();
    cy.wait('@createDepartamento').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      createdClave = interception.response?.body?.clave as string;
      expect(createdClave).to.match(/^DEP-/);
    });
    cy.url().should('include', '/departamentos');
    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/departamentos/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.nombre).to.eq(name);
      });
    });

    cy.then(() => {
      cy.visit(`/departamentos/${createdClave}/editar`);
      cy.get('[data-cy="departamento-nombre"]').clear().type(editedName);
      cy.get('[data-cy="departamento-submit"]').click();
    });
    cy.wait('@updateDepartamento').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/departamentos');

    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/departamentos/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.clave).to.eq(createdClave);
        expect(response.body.nombre).to.include('Editado');
      });
    });

    cy.then(() => {
      cy.window().then((win) => {
        void win.fetch(`http://localhost:8080/api/v1/departamentos/${createdClave}`, {
          method: 'DELETE',
          headers: {
            Authorization: authHeader
          }
        });
      });
    });
    cy.wait('@deleteDepartamento').its('response.statusCode').should('eq', 204);

    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/departamentos/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
