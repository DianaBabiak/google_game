const {Game, Settings, Position, NumberUtils, Player} = require('./game')

describe('tests game', () => {
    let game
    beforeEach(()=>{
        game = new Game()
    })





    it('settings test', () => {
        let settings = game.settings
        expect(settings.gridSize.columns).toBe(4)
        expect(settings.gridSize.rows).toBe(5)
        expect(game.status).toBe('pending')

    })

    it('start game test', async () => {
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

    it('check position players', async () => {

        for (let i; i < 10; i++) {
            const game = new Game()
            game.settings = {
                gridSize: {
                    columns: 3,
                    rows: 4,
                },
            };

            await game.start();

            expect([1, 2, 3, 4]).toContain(game.player1.position.x);
            expect([1, 2, 3]).toContain(game.player1.position.y);

            expect([1, 2, 3, 4]).toContain(game.player2.position.x);
            expect([1, 2, 3]).toContain(game.player2.position.y);

            expect([1, 2, 3, 4]).toContain(game.google.position.x);
            expect([1, 2, 3]).toContain(game.google.position.y);
        }


    })

    it('Players and Google positions should not overlap', async () => {



        for (let i; i < 10; i++) {
            const game = new Game();
            await game.start();

            const player1Position = game.player1.position;
            const player2Position = game.player2.position;
            const googlePosition = game.google.position;

            expect(player1Position.x === player2Position.x && player1Position.y === player2Position.y).toBe(false);
            expect(player2Position.x === googlePosition.x && player2Position.y === googlePosition.y).toBe(false);
            expect(googlePosition.x === player1Position.x && googlePosition.y === player1Position.y).toBe(false);
        }

    });

    it('Google change position', async () => {


        game.settings = {
            gridSize: {
                columns: 1,
                rows: 4,
            },
            googleJumpInterval: 150
        };
        await game.start();

        const prevPosition = game.google.position.clone()
        expect(game.google.position.equal(prevPosition)).toBe(true);

        await sleep(200)
        expect(game.google.position.equal(prevPosition)).toBe(false);

    });
    it('Player 1 or Player 2 catch Google x-vector', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();
            game.settings = {
                gridSize: {
                    columns: 3,
                    rows: 1,
                },
            };
            await game.start();


            const deltaPlayer1 = game.player1.position.x - game.google.position.x
            const prevGooglePosition = game.google.position.clone()

            if (Math.abs(deltaPlayer1) === 2) {

                const deltaPlayer2 = game.player2.position.x - game.google.position.x
                if (deltaPlayer2 > 0) {
                    game.movePlayer2ToLeft()
                    return
                } else {
                    game.movePlayer2ToRight()
                }
                expect(game.score.player1 === 0).toBe(true)
                expect(game.score.player2 === 1).toBe(true)
                return
            } else {
                if (deltaPlayer1 > 0) {
                    game.movePlayer1ToLeft()
                    return
                } else {
                    game.movePlayer1ToRight()
                }
                expect(game.score.player1 === 1).toBe(true)
                expect(game.score.player2 === 0).toBe(true)
            }
            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
        }
    });
    it('Player 1 or Player 2 catch Google y-vector', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();
            game.settings = {
                gridSize: {
                    columns: 1,
                    rows: 3,
                },
            };
            await game.start();


            const deltaPlayer1 = game.player1.position.y - game.google.position.y
            const prevGooglePosition = game.google.position.clone()

            if (Math.abs(deltaPlayer1) === 2) {

                const deltaPlayer2 = game.player2.position.y - game.google.position.y
                if (deltaPlayer2 > 0) {
                    game.movePlayer2ToUp()
                    return
                } else {
                    game.movePlayer2ToUnder()
                }
                expect(game.score.player1 === 0).toBe(true)
                expect(game.score.player2 === 1).toBe(true)
                return
            } else {
                if (deltaPlayer1 > 0) {
                    game.movePlayer1ToUp()
                    return
                } else {
                    game.movePlayer1ToUnder()
                }
                expect(game.score.player1 === 1).toBe(true)
                expect(game.score.player2 === 0).toBe(true)
            }
            expect(game.google.position.equal(prevGooglePosition)).toBe(false)
        }

    });
    it('Player 1 or Player 2 winner', async () => {
        game.settings = {
            pointsToWin:3,
            gridSize: {
                columns: 3,
                rows: 1,
            },
        };

        await game.start();


        const deltaPlayer1 = game.player1.position.x - game.google.position.x
        const prevGooglePosition = game.google.position.clone()

        if (Math.abs(deltaPlayer1) === 2) {

            const deltaPlayer2 = game.player2.position.x - game.google.position.x
            if (deltaPlayer2 > 0) {
                game.movePlayer2ToLeft()
                game.movePlayer2ToRight()
                game.movePlayer2ToLeft()
                return
            } else {
                game.movePlayer2ToRight()
                game.movePlayer2ToLeft()
                game.movePlayer2ToRight()
            }
            expect(game.score.player1 === 0).toBe(true)
            expect(game.score.player2 === 3).toBe(true)
            return
        } else {
            if (deltaPlayer1 > 0) {
                game.movePlayer1ToLeft()
                game.movePlayer1ToRight()
                game.movePlayer1ToLeft()
                return
            } else {
                game.movePlayer1ToRight()
                game.movePlayer1ToLeft()
                game.movePlayer1ToRight()
            }
            expect(game.score.player1 === 3).toBe(true)
            expect(game.score.player2 === 0).toBe(true)
        }
        expect(game.status).toBe('finished')
    });



})


const sleep = (sm) => new Promise((res) => {
    setTimeout(res, sm)
})