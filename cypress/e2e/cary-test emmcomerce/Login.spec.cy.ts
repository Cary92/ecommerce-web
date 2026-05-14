describe('Proceso de Login', () => {
  it('Intercepta y valida login', () => {
    cy.intercept('POST', '**/auth/login').as('loginRequest');

    cy.visit('/login');

    cy.fixture('users').then((users) => {
    cy.login(users.UsuarioValido.Username, users.UsuarioValido.Password);
    });

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest').then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
      expect(interception.response?.body).to.have.property('token');
    });
  });
});

