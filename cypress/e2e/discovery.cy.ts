describe("restaurant discovery", () => {
  it("opens a restaurant from the listing page", () => {
    cy.visit("/restaurants")

    cy.get("h1").should("contain.text", "Restaurants")

    cy.contains("a", "Aarhus Trattoria").click()

    cy.location("pathname").should("eq", "/restaurants/aarhus-trattoria")

    cy.get("h1").should("contain.text", "Aarhus Trattoria")

    cy.contains('[role="tab"]', "Menu").should("be.visible")
  })

  it("searches for a restaurant", () => {
    cy.visit("/search")

    cy.get("#restaurant-search").type("ramen")
    cy.contains("button", "Search").click()

    cy.location("search").should("contain", "q=ramen")

    cy.contains("a", "Harbor Ramen").should("be.visible")
  })

  it("filters restaurants by city", () => {
    cy.visit("/search")

    cy.get("#search-city").click()
    cy.get('[role="option"]').contains("Aarhus").click()

    cy.contains("button", "Search").click()

    cy.location("search").should("contain", "city=aarhus")

    cy.contains("Aarhus Trattoria").should("be.visible")
  })

  it("shows the custom not-found page", () => {
    cy.visit("/restaurants/does-not-exist", {
      failOnStatusCode: false,
    })

    cy.get("h1").should("contain.text", "Restaurant not found")
  })

  it("opens the mobile navigation", () => {
    cy.viewport(375, 667)
    cy.visit("/")

    cy.get("header button").click()

    cy.get('[role="dialog"]').contains("a", "Restaurants").should("be.visible")
  })
})
