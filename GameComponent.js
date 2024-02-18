export class GameComponent{

   #tableElement;
   #resultsElement;
    #game
    constructor(game) {
        this.#tableElement = document.getElementById('game-grid')
        this.#resultsElement = document.getElementById('results')
        this.#game=game
        game.eventEmitter.on("change",()=>{
           this.render()
        })
    }
   render (){
        this.#tableElement.innerHTML=""
        this.#resultsElement.innerHTML=""
        this.#resultsElement.append(`player 1:  ${this.#game.score.player1};  player 2:  ${this.#game.score.player2}`)
        for (let y=1; y <= this.#game.settings.gridSize.rows; y++) {
            const trElement = document.createElement("tr")
            for (let x=1; x <= this.#game.settings.gridSize.columns; x++) {
                const tdElement = document.createElement("td")
                if(this.#game.google.position.x===x && this.#game.google.position.y===y){
                    const imgElement=document.createElement("img")
                    imgElement.src = "./assets/google.png"
                    tdElement.append(imgElement)
                }

                if(this.#game.player1.position.x===x && this.#game.player1.position.y===y){
                    const imgElement=document.createElement("img")
                    imgElement.src = "./assets/player1.jpg"
                    tdElement.append(imgElement)
                }

                if(this.#game.player2.position.x===x && this.#game.player2.position.y===y){
                    const imgElement=document.createElement("img")
                    imgElement.src = "./assets/player2.jpg"
                    tdElement.append(imgElement)
                }
                trElement.append(tdElement)
            }

            this.#tableElement.append(trElement)
        }
    }
}

