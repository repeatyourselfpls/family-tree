export const RADIUS = 50
export const DIAMETER = RADIUS * 2
export const SPACING_X = 40
export const SPACING_Y = 150

export function setupBackground(ctx, width, height) {
  ctx.fillStyle = "wheat"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "rgba(0 0 0 / 5%)"
  ctx.lineWidth = 1

  for (let i = 0; i < width; i += 15) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i, height)
    ctx.stroke()
  }

  for (let i = 0; i < height; i += 15) {
    ctx.beginPath()
    ctx.moveTo(0, i)
    ctx.lineTo(width, i)
    ctx.stroke()
  }
}

export const drawAllNodes = (ctx, width, height, levelNodes) => {  
  let y = RADIUS + 10
  let x = width / 2
  const locationMap = new Map()

  while (levelNodes.length) {
    const nodes = levelNodes.shift()
    const nodeLevelCount = nodes.length

    if (nodeLevelCount == 1) {
      const rootNode = nodes[0][0]
      locationMap.set(rootNode.val, [x, y])
      
      drawNode(ctx, x, y, rootNode.val)
    } else {
      const countOnEachSide = Math.ceil(nodeLevelCount / 2)
      x = (width / 2 - (DIAMETER * countOnEachSide) + RADIUS) - ((SPACING_X / 2) * countOnEachSide)
      
      if (nodes) {
        for (const [node, parent] of nodes) {
          locationMap.set(node.val, [x, y])

          drawNode(ctx, x, y, node.val)
          drawParentLink(ctx, node.val, parent.val, locationMap)

          x += DIAMETER + SPACING_X
        }
      }
    }
    y += SPACING_Y
  }
}

function drawNode(ctx, x, y, val) {
  ctx.fillStyle = "pink"
  ctx.strokeStyle = "red"
  ctx.lineWidth = 2

  ctx.beginPath()
  ctx.arc(x, y, 50, degreeToRadians(0), degreeToRadians(360), false)
  ctx.fill()
  ctx.stroke()
  
  ctx.fillStyle = "black"
  ctx.font = "24px arial"
  const textWidth = ctx.measureText(`${val}`).width
  const textHeight = ctx.measureText("M").width
  ctx.fillText(`${val}`, x - textWidth / 2, y + textHeight / 2)
}

function drawParentLink(ctx, node, parent, locationMap) {  
  const parent_x = locationMap.get(parent)[0]
  const parent_y = locationMap.get(parent)[1]
  const node_x = locationMap.get(node)[0]
  const node_y = locationMap.get(node)[1]

  const deltaX = node_x - parent_x
  const deltaY = node_y - parent_y
  const theta = Math.atan(deltaY / Math.abs(deltaX)) // positive val

  const parent_x_delta = deltaX < 0 ? -1 * Math.cos(theta) * RADIUS : Math.cos(theta) * RADIUS
  const parent_y_delta = Math.sin(theta) * RADIUS
  const node_x_delta = -1 * parent_x_delta
  const node_y_delta = -1 * parent_y_delta

  ctx.lineWidth = 1

  ctx.beginPath()
  ctx.moveTo(parent_x + parent_x_delta, parent_y + parent_y_delta)
  ctx.lineTo(node_x + node_x_delta, node_y + node_y_delta)

  ctx.stroke()
}

function degreeToRadians(deg) {
  return (deg / 360) * (2 * Math.PI)
}