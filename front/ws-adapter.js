import {EventEmitter} from "../utils/eventEmitter/EventEmitter.js";

export const socket = new WebSocket('ws://localhost:3000/');

socket.onopen=function (event){

}

export class WSAdapter extends EventEmitter {
    #socket
    constructor(socket) {
        super()
        this.#socket=socket
        this.#socket.onmessage=  (e)=>{
            const event = JSON.parse(e.data)
            this.emit('new-message',event)
            console.log("get message :" + event.data)
        }

    }
    send(data){
        this.#socket.send(JSON.stringify(data))

    }
}