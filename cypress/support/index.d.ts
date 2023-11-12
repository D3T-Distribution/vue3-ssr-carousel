declare namespace Cypress {
  interface Chainable {
    dragLeft(): Chainable;

    dragRight(): Chainable;

    trackAtEnd(): Chainable;

    page(number: Number): Chainable;

    pages(number: Number): Chainable;

    slideVisible(number: Number): Chainable;

    slideHidden(number: Number): Chainable;

    percySnapshot(name: string): Chainable;
  }
}
