class TreeNode {
  static NODE_SIZE = 1 
  static SIBLING_DISTANCE = 0

  name = ''
  children: TreeNode[] = []
  previousSibling: TreeNode | null = null
  mod = 0
  X = 0
  Y = -1

  constructor(name: string, children: TreeNode[]) {
    this.name = name
    this.children = children
  }

  // Attaches previous siblings and a base Y for each level 
  static initializeNodes(node: TreeNode, previousSibling: TreeNode | null, startingY: number) {
    node.Y = startingY
    node.previousSibling = previousSibling
    for (let i = 0; i < node.children.length; i++) {
      this.initializeNodes(
        node.children[i], 
        i > 0 ? node.children[i-1] : null, 
        startingY+1) 
    }
  }

  // Calculates the X and Mod bottom up
  static calculateXMod(node: TreeNode) {
    for (const child of node.children) {
      this.calculateXMod(child)
    }

    if (node.isLeafNode()) {
      if (!node.previousSibling) {
        node.X = 0
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.getLeftMostChildNode().X
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - node.getLeftMostChildNode().X
      }
    } else {
      if (!node.previousSibling) {
        node.X = (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2 // currentX - desired
      }
    }

    // console.log(`Calculating ${node.name}: (${node.X}, ${node.Y}) Mod: ${node.mod}`)

    // check if sibling subtrees clash, adjust X and mod if so
    if (node.children.length) {
      this.checkConflicts(node)
    }
  }

  static checkConflicts(node: TreeNode) {
    let previousSibling = node.previousSibling
    while (previousSibling) {
      let leftContour = TreeNode.getLeftContour(node)
      const rightContour = TreeNode.getRightContour(previousSibling)

      const depth = Math.min(rightContour.length, leftContour.length)

      for (let d = 0; d < depth; d++) {
        const distance = leftContour[d][1] - rightContour[d][1]
        if (distance < 0) {
          const shift = Math.abs(distance) + TreeNode.SIBLING_DISTANCE + TreeNode.NODE_SIZE
          node.X += shift
          node.mod += shift
          
          leftContour = TreeNode.getLeftContour(node) // make adjusted comparison further level down
          const siblingsInBetween = TreeNode.getSiblingsInBetween(previousSibling, node)
          this.fixSiblingSeparation(siblingsInBetween, shift)
          this.checkConflicts(node)
        }
      }
      previousSibling = previousSibling.previousSibling
    }
  }

  static fixSiblingSeparation(siblingsInBetween: TreeNode[], shiftDistance: number) {
    const apportionAmount = shiftDistance / (siblingsInBetween.length + 1)

    for (const sibling of siblingsInBetween.reverse()) {
      sibling.X += apportionAmount
      sibling.mod += apportionAmount
    }
  }

  static getSiblingsInBetween(start: TreeNode, end: TreeNode) {
    let siblingsInBetween: TreeNode[] = []
    while (end.previousSibling && end.previousSibling !== start) {
      siblingsInBetween.push(end.previousSibling)
      end = end.previousSibling
    }

    return siblingsInBetween
  }

  // level order traversal of leftmost node's X positions w/ modifier added
  // this is used to adjust siblings collisions, we do not alter the node's X value yet
  static getLeftContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = []
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]]
    let nextLevel = 0

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0]
      if (level === nextLevel) {
        nextLevel += 1
        contour.push([n, n.X + modSum])
      }
      
      for (const child of n.children) {
        queue.push([child, level+1, modSum + n.mod])
      }
    }

    return contour
  }

  // level order traversal of rightmost node's X positions w/ modifier added
  static getRightContour(node: TreeNode) {
    const contour: [TreeNode, calculatedX: number][] = []
    const queue: [TreeNode, level: number, modSum: number][] = [[node, 0, 0]]
    let nextLevel = 0

    while (queue.length) {
      const [n, level, modSum] = queue.splice(0, 1)[0]
      if (level === nextLevel) {
        nextLevel += 1
        contour.push([n, n.X + modSum])
      }
      
      for (const child of n.children.reverse()) {
        queue.push([child, level+1, modSum + n.mod])
      }
    }

    return contour
  }

  static finalizeX(node: TreeNode, modSum: number) {
    node.X += modSum
    modSum += node.mod

    for (const child of node.children) {
      this.finalizeX(child, modSum)  
    }
  }

  static levelOrderTraversal(node: TreeNode) {
    const queue: [TreeNode, number][] = [[node, 0]]
    const traversal: [TreeNode, number][] = []

    while (queue.length) {
      const [curr, level] = queue.splice(0, 1)[0]
      traversal.push([curr, level])
      if (curr.children.length) {
        for (const child of curr.children) {
          queue.push([child, level+1])
        }
      }
    }

    return traversal
  }

  isLeafNode() {
    return this.children.length == 0
  }

  getRightMostChildNode() {
    return this.children.slice(-1)[0]
  }

  getLeftMostChildNode() {
    return this.children[0]
  }
}

const B = new TreeNode("B", [])
const C = new TreeNode("C", [])
const H = new TreeNode("H", [])
const I = new TreeNode("I", [])
const J = new TreeNode("J", [])
const K = new TreeNode("K", [])
const L = new TreeNode("L", [])

const A = new TreeNode("A", [])
const D = new TreeNode("D", [B, C])
const G = new TreeNode("G", [])
const M = new TreeNode("M", [H, I, J, K, L])

const E = new TreeNode("E", [A, D])
const F = new TreeNode("F", [])
const N = new TreeNode("N", [G, M])

const O = new TreeNode("O", [E, F, N])

TreeNode.initializeNodes(O, null, 0)
TreeNode.calculateXMod(O)
TreeNode.finalizeX(O, 0)

const traversedNodes = TreeNode.levelOrderTraversal(O)
for (const [n, level] of traversedNodes) {
  console.log(level, n.name, n.X)
}
