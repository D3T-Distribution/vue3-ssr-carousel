describe('events', () => {
  beforeEach(() => {
    cy.visit('/events');
  });

  it('can be manipulated via v-model', () => {
    cy.get('[data-cy=v-model]')
      .first()
      .within(() => {
        // Should start on page 2
        cy.get('.now').should('contain', 'Current Page: 2');
        cy.slideVisible(2);
        cy.slideHidden(1);

        // Clicking the back button (the first one), should go back to page 1
        cy.contains('Back').click();
        cy.slideVisible(1);
        cy.slideHidden(2);
      });
  });
});
