/// <reference types="cypress" />
describe('Who is that Pokemon App - E2E Tests', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/pokemon/random', {
            statusCode: 200,
            body: {
                name: 'Pikachu',
                sprites: {
                    official_artwork: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
                },
                options: ['Pikachu', 'Charmander', 'Bulbasaur', 'Squirtle']
            }
        }).as('getRandomPokemon');

        cy.visit('http://localhost:4200');
        cy.get('.start-game-button').should('be.visible').click();
        cy.wait('@getRandomPokemon');
        cy.get('.pokemon__shadow').should('be.visible');
    });

    it('should start the game when the Start Game button is clicked', () => {
        cy.get('.game__container').should('be.visible');
        cy.get('.options__panel').should('be.visible');
        cy.get('.score__panel').should('be.visible');
    });

    it('should reveal the Pokemon name after selecting an answer', () => {
        cy.get('.options__container button').should('be.visible').first().click();

        cy.get('.pokemon__image').should('be.visible');
        cy.get('.pokemon-name').should(($el) => {
            const text = $el.text().trim();
            expect(text).not.to.be.empty;
        });
    });

    it('should update the score after selecting an answer', () => {
        cy.get('.options__container button').should('be.visible').first().click();

        cy.get('.score__panel-actual')
            .contains('Actual Score')
            .siblings('p')
            .should(($p) => {
                const text = parseInt($p.text(), 10);
                expect(text).to.be.greaterThan(0);
            });
    });

    it('should skip the current Pokemon when Skip button is clicked', () => {
        cy.get('.options__container-skip').should('be.visible').click();

        cy.get('.score__panel-actual')
            .contains('Skipped')
            .siblings('p')
            .should(($p) => {
                const text = parseInt($p.text(), 10);
                expect(text).to.be.greaterThan(0);
            });
    });
});
