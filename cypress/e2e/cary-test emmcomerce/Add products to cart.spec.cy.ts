describe("Test 3: Agregar 2 productos al carrito", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/auth/login").as("loginRequest");
    cy.intercept("GET", "**/products*").as("getProducts");
  });

  it("Agregar dos productos al carrito y verificar el badge", () => {
    // 1. Login
    cy.visit("/login");

    cy.fixture("users").then((users) => {
      cy.login(users.UsuarioValido.Username, users.UsuarioValido.Password);
    });

    cy.get('button[type="submit"]').click();
    cy.wait("@loginRequest", { timeout: 10000 }).then((interception) => {
      expect(interception.response?.statusCode).to.eq(201);
    });

    // 2. Ir a productos
    cy.visit("/");
    cy.wait("@getProducts");

    // 3. Agregar el primer producto
    cy.get("button:contains('Add')").first().click();
    cy.wait(500);

    // 4. Verificar badge contiene 1
    cy.get("span.bg-red-500")
      .should("be.visible")
      .and("contain.text", "1");

    // 5. Agregar el segundo producto
    cy.get("button:contains('Add')").eq(1).click();
    cy.wait(500);

    // 6. Verificar badge contiene 2
    cy.get("span.bg-red-500")
      .should("be.visible")
      .and("contain.text", "2");
  });
});