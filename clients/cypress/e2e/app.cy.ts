describe("Teste de integração da aplicação de clientes", () => {
  it("deve exibir a página de clientes", () => {
    cy.visit("/");
    cy.get("h1").should("have.text", "Clientes");
  });
});
