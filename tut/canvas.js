// helpers

const degreeToRadians = (deg) => {
  return (deg / 360) * (2 * Math.PI)
}

const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const canvasOne = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "rgb(255, 255, 200)"
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "rgb(255 0 0)"
  ctx.fillRect(50, 50, 100, 150)

  ctx.fillStyle = "rgb(0 255 0)"
  ctx.fillRect(75, 75, 20, 20)

  ctx.fillStyle = "rgb(0 0 255 / 50%)"
  ctx.fillRect(1000, 600, 20, 20)

  ctx.lineWidth = 5
  ctx.strokeStyle = "rgb(0 0 0)"
  ctx.strokeRect(25, 25, 100, 100)
}

// triangle
const canvasTwo = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "rgb(255, 255, 200)"
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "rgb(255 0 0)"
  ctx.strokeStyle = "rgb(255 0 0)"
  ctx.lineWidth = 5

  ctx.beginPath()
  ctx.moveTo(50, 50)

  ctx.lineTo(150, 50);
  const triHeight = 50 * Math.tan(degreeToRadians(60))
  ctx.lineTo(100, 50 + triHeight)
  ctx.lineTo(50, 50)
  ctx.fill()
}

// circle
const canvasThree = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "rgb(255, 255, 200)"
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "red"
  ctx.beginPath()
  ctx.arc(150, 106, 50, degreeToRadians(0), degreeToRadians(360), false)
  ctx.fill()

  ctx.fillStyle = 'yellow'
  ctx.beginPath()
  ctx.arc(200, 106, 50, degreeToRadians(-45), degreeToRadians(45), true)
  ctx.lineTo(200, 106);
  ctx.fill()
}

// text
const canvasFour = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "rgb(255, 255, 200)"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "black"
  ctx.lineWidth = 1
  ctx.font = "36px arial"
  ctx.strokeText("Canvas Text", 50, 50)
  
  ctx.fillStyle = "red"
  ctx.font = "48px georgia"
  ctx.fillText("Canvas text", 50, 150)

  canvas.setAttribute("aria-label", "Canvas text")
}

// loop
const canvasFive = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "rgb(255, 255, 200)"
  ctx.fillRect(0, 0, width, height)
  ctx.translate(width / 2, height / 2)

  let length = 250
  let moveOffset = 20

  for (let i = 0; i < length; i++) {
    ctx.fillStyle = `rgb(${255 - length} 0 ${255 - length} / 90%)`;
    ctx.beginPath();
    ctx.moveTo(moveOffset, moveOffset);
    ctx.lineTo(moveOffset + length, moveOffset);
    const triHeight = (length / 2) * Math.tan(degreeToRadians(60));
    ctx.lineTo(moveOffset + length / 2, moveOffset + triHeight);
    ctx.lineTo(moveOffset, moveOffset);
    ctx.fill();
    
    length--;
    moveOffset += 0.7;
    ctx.rotate(degreeToRadians(5));
  }
}

// animation
const canvasSix = () => {
  const canvas = document.querySelector("#treeCanvas")
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext("2d")

  ctx.translate(width / 2, height / 2)

  const image = new Image()
  image.src = "walk-right.png"

  const draw = () =>{
    ctx.fillRect(-(width / 2), -(height / 2), width, height)
    ctx.drawImage(image, sprite * 102, 0, 102, 148, 0 + posX, -74, 102, 148)
  
    if (posX % 13 === 0) {
      if (sprite === 5) {
        sprite = 0;
      } else {
        sprite++;
      }
    }
  
    if (posX > width / 2) {
      let newStartPos = -(width / 2 + 102);
      posX = Math.ceil(newStartPos);
    } else {
      posX += 2;
    }  x

    requestAnimationFrame(draw)
  }

  let sprite = 0
  let posX = 0
  
  image.onload = draw
}

canvasOne()
canvasTwo()
canvasThree()
canvasFour()
canvasFive()
// canvasSix()

