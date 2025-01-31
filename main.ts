import { drawAllNodesv2, fitToScreen as positionNodesWithinBounds, setupBackground } from "./draw.js"
import { TreeNode } from "./tree.js"

const B = new TreeNode("B", [])
const C = new TreeNode("C", [])
const H = new TreeNode("H", [])
const I = new TreeNode("I", [])
const J = new TreeNode("J", [])
const K = new TreeNode("K", [])
const L = new TreeNode("L", [])

const A = new TreeNode("A", [new TreeNode("sam", []), new TreeNode("test", [])])
const D = new TreeNode("D", [B, C])
const G = new TreeNode("G", [])
const M = new TreeNode("M", [H, I, J, K, L])

const E = new TreeNode("E", [A, D])
const F = new TreeNode("F", [])
const N = new TreeNode("N", [G, M])

const O = new TreeNode("O", [E, F, N])

TreeNode.initializeNodes(O, null, null, null, 0)
TreeNode.calculateXMod(O)
TreeNode.finalizeX(O, 0)

const traversedNodes = TreeNode.levelOrderTraversal(O)
for (const [n, level] of traversedNodes) {
  console.log(level, n.name, `(${n.X}, ${n.mod})`)
}

const canvas = document.querySelector("#treeCanvas") as HTMLCanvasElement
const width = canvas.width = window.innerWidth  
const height = canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")
const positionedNodes = positionNodesWithinBounds(structuredClone(traversedNodes), width, height)


setupBackground(ctx, width, height) 
drawAllNodesv2(ctx, positionedNodes[0], null)