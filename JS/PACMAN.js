
const canvas = document.querySelector('canvas') // des canvas verwenden
const c = canvas.getContext('2d') // mit dem kann ich jetzt funktionen im canvas verwenden und dieses 2d holt diese API

const punkt = document.querySelector('#punkt')
console.log(punkt)
const looser = document.querySelector('#looser')
let level = 1
const reset = document.querySelector('#reset')

canvas.width = 760 //grose vom element 'max grose'
canvas.height = 880
//macht 'dynamischen aufbau moglich'
class box {
    static width = 40 // ist der abstand dann
    static height = 40 
    constructor({position, image}){ // ({}) schreibe das argument durch objekt als eigenschaft, muss deswegen nicht die reihenflge der eigenschaften
        this.position = position
        // dynamische x und y
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw () {
        //c.fillStyle = 'blue'
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y) 
    }
}
const boxen = [] // was zum auffüllen
// spieler kreieren
class spieler {
    constructor({
        position, velocity}){ // properties of kreis 
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = 0.75
        this.openRate = 0.1   
        this.rotation = 0    
    } 
    draw() { // zeichnung
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, this.radians, 
             Math.PI * 2 -this.radians)
        c.lineTo(this.position.x, this.position.y )
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }
    // moglich machen das ich den player upadted drawn
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.radians < 0 || this.radians > .75) this.openRate
        = -this.openRate
        this. radians += this.openRate
    }
}

// den spieler spawnen
const gelberspieler = new spieler({
    position: { // position
        x: (box.width * 9) + box.width / 2,
        y: (box.height * 16 )+ box.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    }
})

class Ghost {
    static speed = 3
    constructor({
        position, velocity, color}){ // properties of kreis 
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollision = []
        this.speed = 3
        this.scared = false
    } 
    draw() { // zeichnung
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 
             Math.PI * 2) //min 30
            c.fillStyle =this.scared ? 'blue' : this.color
            c.fill()
            c.closePath()
    }
    // moglich machen das ich den player upadted drawn
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
    
}

const ghosts = 
[new Ghost({position: {
    x: (box.width * 9) + box.width / 2,
    y: (box.height * 8 )+ box.height / 2
    },
    velocity: {
        x: Ghost.speed,
        y: 0
    },
    color: 'red'
}),
new Ghost({position: {
    x: (box.width * 8) + box.width / 2,
    y: (box.height * 10 )+ box.height / 2
    },
    velocity: {
        x: 0,
        y: -Ghost.speed
    },
    color: '#71eeb8'
    
}),
new Ghost({position: {
    x: (box.width * 9) + box.width / 2,
    y: (box.height * 10 )+ box.height / 2
    },
    velocity: {
        x: 0,
        y: -Ghost.speed
    },
    color: '#a38995'
    
}),
new Ghost({position: {
    x: (box.width * 10) + box.width / 2,
    y: (box.height * 10 )+ box.height / 2
    },
    velocity: {
        x: 0,
        y: -Ghost.speed
    },
    color: '#ff7514'

})
]
 


class coins{
    constructor({position}){ // properties of kreis 
        this.position = position
        this.radius = 3
    } 
    draw() { // zeichnung
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //min 30
            c.fillStyle = 'white'
            c.fill()
            c.closePath()
    }
}
const coinshalter = []


// für das projeziern  von der karte machma eine funktion die diese argumente interpretiert
class PowerUp{
    constructor({position}){ // properties of kreis 
        this.position = position
        this.radius = 10
    } 
    draw() { // zeichnung
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //min 30
            c.fillStyle = 'white'
            c.fill()
            c.closePath()
    }
}

const powerup = []
// status suchen
const tasten = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

let letztetaste = "" // luckenfuller damit bewegung smooth
let score = 0

const karte = [
    //1    2    3   4     5    6    7    8    9   10   11   12   13   14   15   16   17   18    19
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '9', '-', '-', '-', '-', '-', '-', '-', '-', '2'], // 1
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '|'], // 2
    ['|', '.', 'a', 'b', '.', 'a', 'p', 'b', '.', '|', '.', 'a', 'p', 'b', '.', 'a', 'b', '.', '|'], // 3
    ['|', 'u', 'd', 'c', '.', 'd', 'q', 'c', '.', '&', '.', 'd', 'q', 'c', '.', 'd', 'c', 'u', '|'], // 4
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'], // 5
    ['|', '.', '<', '>', '.', '%', '.', '<', '-', '9', '-', '>', '.', '%', '.', '<', '>', '.', '|'], // 6
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '|', '.', '.', '.', '|', '.', '.', '.', '.', '|'], // 7
    ['4', '-', '-', '2', '.', '8', '-', '>', ' ', '&', ' ', '<', '-', '7', '.', '1', '-', '-', '3'], // 8
    ['x', 'x', 'x', '|', '.', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', '.', '|', 'x', 'x', 'x'], // 9
    ['<', '-', '-', '3', '.', '&', ' ', '1', '>', ' ', '<', '2', ' ', '&', '.', '4', '-', '-', '>'], // 10
    [' ', ' ', ' ', ' ', '.', ' ', ' ', '|', ' ', ' ', ' ', '|', ' ', ' ', '.', ' ', ' ', ' ', ' '], // 11
    ['<', '-', '-', '2', '.', '%', ' ', '4', '-', '-', '-', '3', ' ', '%', '.', '1', '-', '-', '>'], // 12
    ['x', 'x', 'x', '|', '.', '|', ' ', ' ', ' ', ' ', ' ', ' ', ' ', '|', '.', '|', 'x', 'x', 'x'], // 13
    ['1', '-', '-', '3', '.', '&', ' ', '<', '-', '9', '-', '>', ' ', '&', '.', '4', '-', '-', '2'], // 14
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '|'], // 15
    ['|', '.', '<', '2', '.', '<', '-', '>', '.', '&', '.', '<', '-', '>', '.', '1', '>', '.', '|'], // 16
    ['|', 'u', '.', '|', '.', '.', '.', '.', '.', ' ', '.', '.', '.', '.', '.', '|', '.', 'u', '|'], // 17
    ['8', '>', '.', '&', '.', '%', '.', '<', '-', '9', '-', '>', '.', '%', '.', '&', '.', '<', '7'], // 18
    ['|', '.', '.', '.', '.', '|', '.', '.', '.', '|', '.', '.', '.', '|', '.', '.', '.', '.', '|'], // 19
    ['|', '.', '<', '-', '-', '0', '-', '>', '.', '&', '.', '<', '-', '0', '-', '-', '>', '.', '|'], // 20
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'], // 21
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3'], // 22
    
] // zeile und spalte ergeben dann die spielfloche im space wird sich bewegt
// funktion fur die karte um array zu lesen

function createImage(src){
    const image = new Image()
    image.src = src
    return image
}



karte.forEach((zeile, x) => { // durch das loopen, index i der elemnte fur sagen in welcher zeile
    zeile.forEach((stuck, y) => { //durch das loopen, index y das element fur welche position rais kommt
        switch(stuck) {
            case '-': //fur jedes '-' was will ich 
                boxen.push( //in das boxen array eine box hinneinmalen
                    new box({
                        position: {
                            x: box.width * y, // mal der yachse damit position sich verandert
                            y: box.height * x  // -""-
                        }   // die grose machma statisch werden aus der class geholt dynamische grose
                        ,image: createImage('./diebilder/pipeHorizontal.png')
                    })
                )
            break
            case '|': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeVertical.png')
                })
            )
            break
            case '1': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCorner1.png')
                })
            )
            break
            case '2': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCorner2.png')
                })
            )
            break
            case '3': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCorner3.png')
                })
            )
            break
            case '4': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCorner4.png')
                })
            )
            break
            case '<': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/capLeft.png')
                })
            )
            break
            case '>': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/capRight.png')
                })
            )
            break
            case '%': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/capTop.png')
                })
            )
            break
            case '&': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/capBottom.png')
                })
            )
            break
            case 'p': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipehalfVtop.png')
                })
            )
            break
            case 'q': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipehalfVbottom.png')
                })
            )
            break
            case 'a': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCornerCorner1.png')
                })
            )
            break
            case 'b': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCornerCorner2.png')
                })
            )
            break
            case 'c': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCornerCorner3.png')
                })
            )
            break
            case 'd': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeCornerCorner4.png')
                })
            )
            break
            case '7': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeConnectorLeft.png')
                })
            )
            break
            case '8': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeConnectorRight.png')
                })
            )
            break
            case '9': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeConnectorBottom.png')
                })
            )
            break
            case '0': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/pipeConnectorTop.png')
                })
            )
            break
            case 'x': //fur jedes '-' was will ich 
            boxen.push( //in das boxen array eine box hinneinmalen
                new box({
                    position: {
                        x: box.width * y, // mal der yachse damit position sich verandert
                        y: box.height * x  // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                    ,image: createImage('./diebilder/empty.png')
                })
            )
            break
            case '.': //fur jedes '-' was will ich 
            coinshalter.push( //in das boxen array eine box hinneinmalen
                new coins({
                    position: {
                        x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                        y: box.height * x + box.height / 2 // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                })
            )
            
            break
            case 'u': //fur jedes '-' was will ich 
            powerup.push( //in das boxen array eine box hinneinmalen
                new PowerUp({
                    position: {
                        x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                        y: box.height * x + box.height / 2 // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                })
            )
            break
           }
    })
}) 

function resetCoinshalter() {
    coinshalter.splice(0, coinshalter.length);
    coinPositions.forEach((position) => {
      const coin = new coins({ position });
      coinshalter.push(coin);
    });
  }
/////////////////////////////////////////

function kreistrifftquada ({kreis, quada}){
    const padding = box.width / 2 - kreis.radius - 1
    return (kreis.position.y - kreis.radius + kreis.velocity.y <= quada.position.y + quada.height + padding 
        && kreis.position.x + kreis.radius + kreis.velocity.x >= quada.position.x - padding
        && kreis.position.y + kreis.radius + kreis.velocity.y >= quada.position.y - padding
        && kreis.position.x - kreis.radius + kreis.velocity.x <= quada.position.x + quada.width + padding)
}



// eine art loop mit dem animation
function animation() { // seite updaten
    const animationLoop = requestAnimationFrame(animation);
    c.clearRect(0, 0, canvas.width, canvas.height) //damit keine linien entstehen
    
    if (tasten.w.pressed && letztetaste === "w") {
        for(let i = 0; i < boxen.length; i++){
            const boxzeichner = boxen[i]
        if (kreistrifftquada({
            kreis: {...gelberspieler, velocity: {
                x: 0,
                y: -5
            }},
            quada: boxzeichner
        })){
        gelberspieler.velocity.y = 0
        break
    }else {
        gelberspieler.velocity.y = -5
    }
    }
}
    else if (tasten.a.pressed && letztetaste === "a") {
        for(let i = 0; i < boxen.length; i++){
            const boxzeichner = boxen[i]
        if (kreistrifftquada({
            kreis: {...gelberspieler, velocity: {
                x: -5,
                y: 0
            }},
            quada: boxzeichner
        })){
        gelberspieler.velocity.x = 0
        break
    }else {
        gelberspieler.velocity.x = -5
    }
    }
    }
    else if (tasten.s.pressed && letztetaste === "s") {
        for(let i = 0; i < boxen.length; i++){
            const boxzeichner = boxen[i]
        if (kreistrifftquada({
            kreis: {...gelberspieler, velocity: {
                x: 0,
                y: 5
            }},
            quada: boxzeichner
        })){
        gelberspieler.velocity.y = 0
        break
    }else {
        gelberspieler.velocity.y = 5
    }
    }
    }else if (tasten.d.pressed && letztetaste === "d") {
        for(let i = 0; i < boxen.length; i++){
            const boxzeichner = boxen[i]
        if (kreistrifftquada({
            kreis: {...gelberspieler, velocity: {
                x: 5,
                y: 0
            }},
            quada: boxzeichner
        })){
        gelberspieler.velocity.x = 0
        break
    }else {
        gelberspieler.velocity.x = 5
    }
    }
    }
    
    
    
    for (let i = powerup.length - 1; 0 <= i; i--){
       const einpowerup = powerup[i]
       einpowerup.draw() 
       if (Math.hypot(
        einpowerup.position.x - gelberspieler.position.x,
        einpowerup.position.y - gelberspieler.position.y
    ) <
    einpowerup.radius + gelberspieler.radius){
        powerup.splice(i, 1)
            score += 50
            punkt.innerHTML = "Score: " + score
            
            ghosts.forEach(Ghost => {
                Ghost.scared = true
                


                setTimeout(() => {
                    Ghost.scared = false
                }, 5000)
            })
    }
    if (coinshalter.length === 0 && powerup.length === 0) {
        level++
        ghosts.forEach(ghost => {
            ghost.speed += .1})
        karte.forEach((zeile, x) => { // durch das loopen, index i der elemnte fur sagen in welcher zeile
            zeile.forEach((stuck, y) => { //durch das loopen, index y das element fur welche position rais kommt
        switch(stuck) { case '.': //fur jedes '-' was will ich 
        coinshalter.push( //in das boxen array eine box hinneinmalen
            new coins({
                position: {
                x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                y: box.height * x + box.height / 2 // -""-
            }   // die grose machma statisch werden aus der class geholt dynamische grose
        })
    )
  
    break
    case 'u': //fur jedes '-' was will ich 
        powerup.push( //in das boxen array eine box hinneinmalen
            new PowerUp({
                position: {
                    x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                    y: box.height * x + box.height / 2 // -""-
                }   // die grose machma statisch werden aus der class geholt dynamische grose
            })
        )
        break
}
})
}) 
document.getElementById("level").innerHTML = "Lvl:" + level; }
    }



    // touch  pellets
    for (let i = coinshalter.length - 1; 0 <= i; i--){
        const pellet = coinshalter[i]
        pellet.draw()

        if (Math.hypot(
            pellet.position.x - gelberspieler.position.x,
            pellet.position.y - gelberspieler.position.y
        ) <
        pellet.radius + gelberspieler.radius){
            console.log('touch')
            coinshalter.splice(i, 1)
            score += 10
            punkt.innerHTML = "Score:" + score
        }
        if (coinshalter.length === 0 && powerup.length === 0) {
            level++
            ghosts.forEach(ghost => {
                ghost.speed += 0.2})
            karte.forEach((zeile, x) => { // durch das loopen, index i der elemnte fur sagen in welcher zeile
                zeile.forEach((stuck, y) => { //durch das loopen, index y das element fur welche position rais kommt
            switch(stuck) { case '.': //fur jedes '-' was will ich 
            coinshalter.push( //in das boxen array eine box hinneinmalen
                new coins({
                    position: {
                    x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                    y: box.height * x + box.height / 2 // -""-
                }   // die grose machma statisch werden aus der class geholt dynamische grose
            })
        )
      
        break
        case 'u': //fur jedes '-' was will ich 
            powerup.push( //in das boxen array eine box hinneinmalen
                new PowerUp({
                    position: {
                        x: box.width * y + box.width / 2, // mal der yachse damit position sich verandert
                        y: box.height * x + box.height / 2 // -""-
                    }   // die grose machma statisch werden aus der class geholt dynamische grose
                })
            )
            break
    }
    })
    }) 
    document.getElementById("level").innerHTML = "Lvl:" + level; }

    }
    
     
    
    boxen.forEach((boxzeichner) => { //boxzeichen ist des variable wast e
            boxzeichner.draw()
// das folgende ist kollischen tetektschen
// 1. oben 2. rechts 3. unten 4. links
            if (kreistrifftquada({kreis: gelberspieler, quada: boxzeichner}))
                {
                    gelberspieler.velocity.x = 0
                    gelberspieler.velocity.y = 0
                }
        })
        
        gelberspieler.update() // zeichnema den und lass ihn bewegen
        
        ghosts.forEach((Ghost) =>{
            Ghost.update()
            
           if (Math.hypot(
                Ghost.position.x - gelberspieler.position.x,
                Ghost.position.y - gelberspieler.position.y
            ) <
            Ghost.radius + gelberspieler.radius && !Ghost.scared){
                cancelAnimationFrame(animationLoop);
                console.log('ulose')
                looser.textContent = "GAME OVER";
                reset.textContent = "RESET";
            }
            
            

            const collisions = []
           
            boxen.forEach(box => {
                if(
                    !collisions.includes('right') &&  kreistrifftquada({
                    kreis:{...Ghost,
                    velocity: {
                        x: Ghost.speed,
                        y: 0 
                    }}, 
                    quada: box 
                })){
                    collisions.push('right')
                }

                if(
                    !collisions.includes('left') && kreistrifftquada({
                    kreis:{...Ghost,
                    velocity: {
                        x: -Ghost.speed,
                        y: 0 
                    }}, 
                    quada: box 
                })){
                    collisions.push('left')
                }

                if(
                    !collisions.includes('down') && kreistrifftquada({
                    kreis:{...Ghost,
                    velocity: {
                        x: 0,
                        y: Ghost.speed
                    }}, 
                    quada: box 
                })){
                    collisions.push('down')
                }

                if(
                    !collisions.includes('up') && kreistrifftquada({
                    kreis:{...Ghost,
                    velocity: {
                        x: 0,
                        y: -Ghost.speed 
                    }}, 
                    quada: box 
                })){
                    collisions.push('up')
                }
            })
            if(collisions.length > Ghost.prevCollision)
            Ghost.prevCollision = collisions

            if (JSON.stringify(collisions) !== JSON.stringify(Ghost.prevCollision)){
                
                console.log(collisions)
                console.log(Ghost.prevCollision)
                
                if (Ghost.velocity.x > 0) Ghost.prevCollision.push('right')
                else if (Ghost.velocity.x < 0) Ghost.prevCollision.push('left')
                else if (Ghost.velocity.y < 0) Ghost.prevCollision.push('up')
                else if (Ghost.velocity.y > 0) Ghost.prevCollision.push('down')

                const pathways = Ghost.prevCollision.filter(collision => {
                    return !collisions.includes(collision)
                })
                //console.log({pathways})
                let direction;

                if (pathways.length > 0) {
                direction = pathways[Math.floor(Math.random() * pathways.length)];
                } else {
                // If the ghost has reached a dead end, turn back and follow the path it just came from
                if (Ghost.velocity.x > 0) {
                    direction = 'left';
                } else if (Ghost.velocity.x < 0) {
                    direction = 'right';
                } else if (Ghost.velocity.y > 0) {
                    direction = 'up';
                } else if (Ghost.velocity.y < 0) {
                    direction = 'down';
                }
                }

                //console.log({direction})

                switch(direction){
                    case 'down':
                        Ghost.velocity.y = Ghost.speed
                        Ghost.velocity.x = 0
                        break
                    case 'up':
                        Ghost.velocity.y = -Ghost.speed
                        Ghost.velocity.x = 0
                        break
                    case 'right' :
                        Ghost.velocity.y = 0
                        Ghost.velocity.x = Ghost.speed
                        break
                    case 'left' : 
                        Ghost.velocity.y = 0
                        Ghost.velocity.x = -Ghost.speed
                }
                Ghost.prevCollision = []
             
            }
            
        })
        ghosts.forEach(ghost => {
        if (ghost.position.x < 0)
        ghost.position.x = canvas.width;
        if (ghost.position.x > canvas.width)
        ghost.position.x = 0;}) 
        

      if (gelberspieler.velocity.x > 0) gelberspieler.rotation = 0
      else if (gelberspieler.velocity.x < 0)  gelberspieler.rotation = Math.PI
      else if (gelberspieler.velocity.y > 0)  gelberspieler.rotation = Math.PI / 2  
      else if (gelberspieler.velocity.y < 0)  gelberspieler.rotation = Math.PI * 1.5

        if (gelberspieler.position.x <= 0)
            gelberspieler.position.x = canvas.width;
        if (gelberspieler.position.x > canvas.width)
            gelberspieler.position.x = 0;  
}



animation() //call


// tasttatur inputs lesen als key
addEventListener('keydown',  ({key}) => { //'gelesener' {genau}
    switch(key) {
        case 'w':
            tasten.w.pressed = true
            letztetaste = "w"
            break
        case 'a':
            tasten.a.pressed = true
            letztetaste = "a"
            break
        case 's':
            tasten.s.pressed = true
            letztetaste = "s"
            break
        case 'd':
            tasten.d.pressed = true
            letztetaste = "d"
            break
    }
})

addEventListener('keyup',  ({key}) => { //'gelesener' {genau}
    switch(key) {
        case 'w':
            tasten.w.pressed = false
            break
        case 'a':
            tasten.a.pressed = false
            break
        case 's':
            tasten.s.pressed = false
            break
        case 'd':
            tasten.d.pressed = false
            break
    }
})




