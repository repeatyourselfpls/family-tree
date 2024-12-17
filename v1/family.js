export function createNode(val, left, right) {
  return { val, left, right }
}

export function levelOrderTraversal(root) {
  const bfs = []
  const q = [[root, null, 1]]

  while (q.length) {
    const [curr, parent, level] = q.shift()

    if (curr.left) {
      q.push([curr.left, curr, level+1])
    }
    if (curr.right) {
      q.push([curr.right, curr, level+1])
    }

    if (bfs.length < level) {
      bfs.push([])
      bfs[level-1].push([curr, parent])
    } else {
      bfs[level-1].push([curr, parent])
    }
  }

  return bfs
}

/**
 * @param { string } name 
 * @param { TreeNode[] } children 
 * @returns { name, children, previousSibling: FamilyNode, childPosition, X, modifier }
 */
export function FamilyNode(name, children) {
  for (let i = 1; i < children.length; i++) {
    children[i].previousSibling = children[i-1]
  }

  return {
    name,
    children,
    previousSibling: null,
    childPosition: 0,
    X: 0,
    modifier: 0,
  }
}


function calculateInitialX(node) {
  if (!node) return

  for (const child of node.children) {
    calculateInitialX(child)
  }

  console.log(node.name, `my older sibling: ${node.previousSibling}`)

  if (node.previousSibling) {
    node.childPosition = node.previousSibling.childPosition + 1
    node.X = node.previousSibling.X + 1
  } else {
    node.childPosition = 0
    node.X = 0
  }
}

function calculateParentXAndModifier(node) {
  if (!node) return 

  for (const child of node.children) {
    calculateParentXAndModifier(child)
  }

  if (node.children.length > 1) {
    const previousX = node.X
    node.X = (node.children[node.children.length-1].X - node.children[0].X) / 2 
    
    if (node.previousSibling) { // shift this parent node half of the distance between it's children
      node.modifier = previousX - node.X
    }
  } else {
    node.X = node.children[0].X
  }

}

// const grandchild1 = new FamilyNode("Vivian", [])
// const grandchild2 = new FamilyNode("Sunny", [])

// const child1 = new FamilyNode("Raj", [grandchild2])
// const child2 = new FamilyNode("Sam", [], child1)
// const child3 = new FamilyNode("Alice", [grandchild1])

// const parent = new FamilyNode("Bob", [child1, child2, child3], null)

// calculateInitialX(parent)
// console.log(levelOrderTraversal(parent))
// calculateParentXAndModifier(parent)
// console.log(parent)