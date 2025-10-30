describe("Clientes - Modal de criação", () => {
  const makeUsers = (count: number, startId = 1) =>
    Array.from({ length: count }).map((_, i) => ({
      id: startId + i,
      name: `Cliente ${startId + i}`,
      salary: 1000 + i,
      companyValuation: 2000 + i,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

  beforeEach(() => {
    cy.intercept("GET", "**/users?page=1&limit=16", {
      statusCode: 200,
      body: {
        clients: makeUsers(16),
        currentPage: 1,
        totalPages: 3,
      },
    }).as("getUsersPage1Limit16");
  });

  it("deve abrir o modal ao clicar em 'Criar cliente' e criar um novo cliente", () => {
    cy.visit("/");
    cy.wait("@getUsersPage1Limit16");
    cy.contains("h1", "Clientes").should("be.visible");

    // Abrir modal
    cy.contains("button", "Criar cliente").click();
    cy.contains("h2", "Criar cliente").should("be.visible");

    // Preencher formulário
    cy.get('input[placeholder="Digite o nome do cliente"]').type("Fulano de Tal");
    cy.get('input[placeholder="Digite o salário"]').type("1500");
    cy.get('input[placeholder="Digite o valor da empresa"]').type("3500");

    // Interceptar criação e o refresh da lista
    cy.intercept("POST", "**/users", (req) => {
      expect(req.body).to.have.property("name", "Fulano de Tal");
      req.reply({
        statusCode: 201,
        body: {
          id: 999,
          name: req.body.name,
          salary: Number(req.body.salary) || 1500,
          companyValuation: Number(req.body.companyValuation) || 3500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }).as("createUser");

    cy.intercept("GET", "**/users?page=1&limit=16", {
      statusCode: 200,
      body: {
        clients: [{
          id: 999,
          name: "Fulano de Tal",
          salary: 1500,
          companyValuation: 3500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, ...makeUsers(15, 1)],
        currentPage: 1,
        totalPages: 3,
      },
    }).as("refreshUsers");

    // Enviar
    cy.contains("button", "Criar cliente").click();
    cy.wait("@createUser");
    cy.wait("@refreshUsers");

    // Feedback de sucesso
    cy.contains("Cliente criado com sucesso").should("be.visible");
  });
});


