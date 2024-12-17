class TreeNode {
  name = ""
  children: TreeNode[] = []
  desiredX = -1
  modifier = 0
  X = 0
  previousSibling: TreeNode | null = null

  constructor(name: string, children: TreeNode[]) {
    this.name = name
    this.children = children

    this.attachSiblings(children)
    this.calculateChildPosition(children)
  }

  private attachSiblings(children: TreeNode[]) {
    if (children.length > 1) {
      for (let i = 1; i < children.length; i++) {
        children[i].previousSibling = children[i-1]
      }
    }
  }

  private calculateChildPosition(children: TreeNode[]) {
    for (let i = 0; i < children.length; i++) {
      children[i].X = i
    }
  }

  // calculates the initial X position of each node from the positions of it's child nodes
  // 1) If 1 child, then X is child X
  // 2) If > 1 child, then X is midpoint
  static calculateDesiredX(node: TreeNode) {
    if (!node) return
    
    for (const child of node.children) {
      this.calculateDesiredX(child)
    }
    
    if (node.children.length > 1) {
      const last = node.children.length - 1
      node.desiredX = (node.children[last].X - node.children[0].X) / 2
    } else if (node.children.length == 1) {
      node.desiredX = node.children[0].X
    }

  }

  // check if the parent node has any siblings to it's left, then adjust it's modifier, so it doesn't clash
  static calculateFinalModifierAndX(node: TreeNode) {
    if (!node) return

    for (const child of node.children) {
      this.calculateFinalModifierAndX(child)
    }

    if (node.children.length != 0) {
      if (!node.previousSibling) {
        node.X = node.desiredX
      } else { // set the modifier to shift the children 
        node.modifier = node.X - node.desiredX
      }
    }
  }
}

const sunny = new TreeNode("Sunny", [])
const vivian = new TreeNode("Vivian", [])

const raj = new TreeNode("Raj", [])
const sam = new TreeNode("Sam", [])
const alice = new TreeNode("Alice", [sunny, vivian])

const bob = new TreeNode("Bob", [raj, sam, alice])

TreeNode.calculateDesiredX(bob)
TreeNode.calculateFinalModifierAndX(bob)
console.log(bob)
