describe('empleados admin crud smoke', () => {
  it('creates, updates and deletes an empleado as admin', () => {
    const marker = Date.now();
    const email = `cy-emp-${marker}@demo.com`;
    const editedName = `Empleado ${marker} Editado`;
    let createdClave = '';
    const authHeader = `Basic ${btoa('admin@demo.com:admin123')}`;

    cy.login('admin@demo.com', 'admin123');
    cy.intercept('POST', '**/api/v1/empleados').as('createEmpleado');
    cy.intercept('PUT', '**/api/v1/empleados/*').as('updateEmpleado');
    cy.intercept('DELETE', '**/api/v1/empleados/*').as('deleteEmpleado');

    cy.visit('/empleados/nuevo');
    cy.get('[data-cy="empleado-nombre"]').type(`Empleado ${marker}`);
    cy.get('[data-cy="empleado-direccion"]').type('Av Cypress 123');
    cy.get('[data-cy="empleado-telefono"]').type('5551234');
    cy.get('[data-cy="empleado-email"]').type(email);
    cy.get('[data-cy="empleado-password"]').type('Pass12345');
    cy.get('[data-cy="empleado-role"]').select('USER');
    cy.get('[data-cy="empleado-submit"]').click();
    cy.wait('@createEmpleado').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      createdClave = interception.response?.body?.clave as string;
      expect(createdClave).to.match(/^EMP-/);
    });
    cy.url().should('include', '/empleados');

    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/empleados/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.email).to.eq(email);
      });
    });

    cy.then(() => {
      cy.visit(`/empleados/${createdClave}/editar`);
      cy.get('[data-cy="empleado-nombre"]').clear().type(editedName);
      cy.get('[data-cy="empleado-password"]').clear().type('Pass12345');
      cy.get('[data-cy="empleado-submit"]').click();
    });
    cy.wait('@updateEmpleado').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/empleados');

    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/empleados/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.clave).to.eq(createdClave);
        expect(response.body.nombre).to.contain(editedName);
      });
    });

    cy.then(() => {
      cy.window().then((win) => {
        void win.fetch(`http://localhost:8080/api/v1/empleados/${createdClave}`, {
          method: 'DELETE',
          headers: {
            Authorization: authHeader
          }
        });
      });
    });
    cy.wait('@deleteEmpleado').its('response.statusCode').should('eq', 204);

    cy.then(() => {
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/api/v1/empleados/${createdClave}`,
        auth: { username: 'admin@demo.com', password: 'admin123' },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });
});
