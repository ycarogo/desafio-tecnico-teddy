/// <reference types="cypress" />
/* eslint-env cypress */

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

  it("deve navegar entre páginas quando a paginação existir", () => {
    // Página inicial 1/2 com 16 por página
    cy.intercept("GET", "**/users?page=1&limit=16", {
      statusCode: 200,
      body: {
        clients: makeUsers(16, 1),
        currentPage: 1,
        totalPages: 2,
      },
    }).as("getUsersP1L16");

    cy.visit("/");
    cy.wait("@getUsersP1L16");
    cy.contains("h1", "Clientes").should("be.visible");

    // Pré-configura próxima página 2/2
    cy.intercept("GET", "**/users?page=2&limit=16", {
      statusCode: 200,
      body: {
        clients: makeUsers(16, 17),
        currentPage: 2,
        totalPages: 2,
      },
    }).as("getUsersP2L16");

    // Se botão Próxima existir (paginação renderizada), navega para página 2
    cy.get("body").then(($body) => {
      if ($body.find("button:contains(›)").length) {
        cy.contains("button", "›").click();
        cy.wait("@getUsersP2L16");
        cy.get(".grid .bg-white.rounded-sm")
          .first()
          .should("contain.text", "Cliente 17");

        // Volta para página 1
        cy.intercept("GET", "**/users?page=1&limit=16", {
          statusCode: 200,
          body: {
            clients: makeUsers(16, 1),
            currentPage: 1,
            totalPages: 2,
          },
        }).as("getUsersBackP1L16");

        cy.contains("button", "‹").click();
        cy.wait("@getUsersBackP1L16");
        cy.get(".grid .bg-white.rounded-sm")
          .first()
          .should("contain.text", "Cliente 1");
      } else {
        // Caso a paginação não exista, apenas garante que os cards foram renderizados
        cy.get(".grid .bg-white.rounded-sm")
          .its("length")
          .should("be.greaterThan", 0);
      }
    });
  });
});
