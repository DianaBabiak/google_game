import {WebSocketServer} from 'ws';
import {EventEmitter} from "../utils/eventEmitter/EventEmitter.js";
import {EventsFactory, Game, MODE} from "../game.js";
import {DIRECTION} from "../controller2.js";

const wss = new WebSocketServer({port: 3000});

const eventEmitter = new EventEmitter()
const eventsFactory = new EventsFactory()
const game = new Game(eventEmitter, eventsFactory)
game.settings.mode = MODE.SERVER

game.eventEmitter.subscribe('change', (e) => {
    connections.forEach((ws) => {
        ws.send(JSON.stringify(e))
    })
})
const connections = []

wss.on('connection', async function connection(ws) {
    console.log(connections.length,'connections.length')
    connections.push(ws)
    console.log(connections.length,'connections.length')
    if (connections.length === 2) {
        game.settings.mode = MODE.CLIENT
        await game.start()
    }

    ws.on('message', function message(data) {
        const command = JSON.parse(data)
        if (command.commandType === "MOVE-PLAYER") {
            switch (command.payload.direction) {
                case DIRECTION.UP:
                    game[`movePlayer${command.payload.playerNumber}ToUp`]()
                    break;
                case DIRECTION.DOWN:
                    game[`movePlayer${command.payload.playerNumber}ToUnder`]()
                    break;

                case DIRECTION.RIGHT:
                    game[`movePlayer${command.payload.playerNumber}ToRight`]()
                    break;

                case DIRECTION.LEFT:
                    game[`movePlayer${command.payload.playerNumber}ToLeft`]()
                    break;

            }
        }}
    )})