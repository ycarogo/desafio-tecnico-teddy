describe("Clientes - Paginação e itens por página", () => {
  const makeUsers = (count: number, startId = 1) =>
    Array.from({ length: count }).map((_, i) => ({
      id: startId + i,
      name: `Cliente ${startId + i}`,
      salary: 1000 + i,
      companyValuation: 2000 + i,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  it("deve mudar clientes por página para 8 e renderizar 8 cards", () => {
    cy.intercept("GET", "**/users?page=1&limit=16", {
      statusCode: 200,
      body: {
        clients: makeUsers(16),
        currentPage: 1,
        totalPages: 2,
      },
    }).as("getUsers16");

    cy.visit("/");
    cy.wait("@getUsers16");
    cy.contains("h1", "Clientes").should("be.visible");

    cy.intercept("GET", "**/users?page=1&limit=8", {
      statusCode: 200,
      body: {
        clients: makeUsers(8),
        currentPage: 1,
        totalPages: 4,
      },
    }).as("getUsers8");

    // Mudar o select para 8
    cy.get("select").select("8");
    cy.wait("@getUsers8");

    // Verificar 8 cards
    cy.get(".grid .bg-white.rounded-sm").should("have.length", 8);
  });
});


