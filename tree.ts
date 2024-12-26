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
    // calculate X
    
    for (const child of node.children) {
      this.calculateXMod(child)
    }

    console.log(`Calculating:\t${node.name}`)

    if (node.isLeafNode()) {
      // is the first child
      if (!node.previousSibling) {
        node.X = 0
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
      }
    } else if (node.children.length == 1) {
      if (!node.previousSibling) {
        node.X = node.children[0].X
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - node.children[0].X
      }
    } else {
      if (!node.previousSibling) {
        node.X = (node.children[0].X + node.children.splice(-1)[0].X) / 2
      } else {
        node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE
        node.mod = node.X - (node.children[0].X + node.children.splice(-1)[0].X) / 2 // currentX - desired
      }
    }

    // check if subtrees clash, adjust X and mod if so
    this.checkConflicts(node)
  }

  finalizeX(node: TreeNode, modSum: number) {
    node.X += modSum
    modSum += node.mod

    for (const child of node.children) {
      this.finalizeX(child, modSum)
    }
  }

  static checkConflicts(node: TreeNode) {
    // get left contour of right subtree and right contour of left subtree
  }

  isLeafNode() {
    return this.children.length == 0
  }

}

const sunny = new TreeNode("Sunny", [])
const vivian = new TreeNode("Vivian", [])

const raj = new TreeNode("Raj", [])
const sam = new TreeNode("Sam", [])
const alice = new TreeNode("Alice", [sunny, vivian])

const bob = new TreeNode("Bob", [raj, sam, alice])
TreeNode.initializeNodes(bob, null, 0)

console.log(bob)
