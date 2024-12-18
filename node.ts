class DefaultDict {
  constructor(defaultValue: number) {
    return new Proxy({}, {
      get: (target, name) => name in target ? target[name] : defaultValue
    })
  }
}

class DrawNode {
  x: number
  y: number
  val: string
  children: DrawNode[]
  mod: number

  constructor(val: string, depth: number, children: DrawNode[]) {
    this.x = -1
    this.y = depth
    this.val = val
    this.children = children
    this.mod = 0  
  }
}

function setup(tree, depth, nexts, offset) {
  if (!nexts) nexts = new DefaultDict(0) // pass these in for all children
  if (!offset) offset = new DefaultDict(0)

  for (const c in tree.children) {
    setup(c, depth+1, nexts, offset)
  }

  tree.y = depth // set the current depth

  let place: number
  if (tree.children.length == 0) {
    place = nexts[depth] // set to 0, will it always be 0?
    tree.x = place
  } else if (tree.children.length == 1) {
    place = tree.children[0].x - 1 // why are we subtracting? 
  } else {
    place = (tree.children[0].x + tree.children.slice(-1).x) / 2
  }

  offset[depth] = Math.max(offset[depth], nexts[depth]-place)

  if (tree.children.length > 0)
    tree.x = place + offset[depth]

  nexts[depth] += 2
  tree.mod = offset[depth]
}

function addmods(tree) {

}

function layout(tree) {
  setup(tree, 0, null, null)
  addmods(tree)
  return tree
}