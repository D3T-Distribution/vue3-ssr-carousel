context('misc', () => {
  beforeEach(() => {
    cy.visit('/misc');
  });
  it('respects responsive gutters when carousel would be disabled at other breakpoint', () => {
    cy.get('[data-cy=disabling]').within(() => {
      cy.viewport(1024, 660)
        .get('.ssr-carousel-slide')
        .first()
        .should('have.css', 'margin-right', '20px')
        .percySnapshot('20px gutters', {
          widths: [1024]
        });
      cy.viewport(767, 660)
        .get('.ssr-carousel-slide')
        .first()
        .should('have.css', 'margin-right', '10px')
        .percySnapshot('10px gutters', {
          widths: [767]
        });
    });
  });
  it('supports dynamically adding slides', () => {
    cy.get('[data-cy=await-slides]').within(() => {
      cy.wait(1000);
      // Add 1 slide
      cy.get('button.add-slide').click().percySnapshot('1 dynamic slides');
      // Verify there is one slide
      cy.pages(1).slideVisible(1);
      // Add a 2nd slide
      cy.get('button.add-slide').click().percySnapshot('2 dynamic slides');
      // Verify there are two slides that can be navigated to
      cy.pages(2)
        .slideVisible(1)
        .slideHidden(2)
        .dragLeft()
        .slideVisible(2)
        .slideHidden(1);
    });
  });
});
