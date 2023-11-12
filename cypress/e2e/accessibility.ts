context('accessibility', function () {
  beforeEach(function () {
    return cy.visit('/accessibility');
  });
  // Simply capture a snapshot
  return it('renders', function () {
    return cy.percySnapshot('Accessibility demo');
  });
});
