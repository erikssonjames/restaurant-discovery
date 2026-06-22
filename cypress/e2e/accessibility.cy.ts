const pages = [
  "/",
  "/restaurants",
  "/search",
  "/about",
  "/contact",
  "/restaurants/aarhus-trattoria",
  "/restaurants/city/aarhus",
  "/restaurants/cuisine/italian",
]

describe("accessibility", () => {
  for (const page of pages) {
    it(`${page} has no detectable accessibility violations`, () => {
      cy.visit(page)
      cy.injectAxe()

      cy.checkA11y(undefined, {
        retries: 2,
        interval: 500,
      })
    })
  }
})
