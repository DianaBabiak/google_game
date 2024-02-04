const {Game, Settings, Position, NumberUtils, Player} = require('./game')

describe('tests game', () => {
    it('settings test', () => {
        const game = new Game()
        let settings = game.settings
        expect(settings.gridSize.columns).toBe(4)
        expect(settings.gridSize.rows).toBe(5)
        expect(game.status).toBe('pending')

    })

    it('start game test', async () => {
        const game = new Game()
        game.settings = {
            gridSize: {
                columns: 6,
                rows: 8
            }
        }
        let settings = game.settings;
        expect(settings.gridSize.columns).toBe(6)
        expect(settings.gridSize.rows).toBe(8)

        await game.start()
        expect(game.status).toBe('in-progress')
    })

    it('check position players',async () => {
        const game = new Game()
        for (let i; i<10; i++){
            game.settings = {
                gridSize: {
                    columns: 3,
                    rows: 4,
                },
            };

            await game.start();

            expect([1, 2,3,4]).toContain(game.player1.position.x);
            expect([1, 2, 3]).toContain(game.player1.position.y);

            expect([1, 2,3,4]).toContain(game.player2.position.x);
            expect([1, 2, 3]).toContain(game.player2.position.y);

            expect([1, 2,3,4]).toContain(game.google.position.x);
            expect([1, 2, 3]).toContain(game.google.position.y);
        }


    })

    it('Players and Google positions should not overlap', async () => {

        const game = new Game();

        for(let i; i<10;i++){
            await game.start();

            const player1Position = game.player1.position;
            const player2Position = game.player2.position;
            const googlePosition = game.google.position;

            expect(player1Position.x === player2Position.x && player1Position.y === player2Position.y).toBe(false);
            expect(player2Position.x === googlePosition.x && player2Position.y === googlePosition.y).toBe(false);
            expect(googlePosition.x === player1Position.x && googlePosition.y === player1Position.y).toBe(false);
        }

    });
})
