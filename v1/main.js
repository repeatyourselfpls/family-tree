import { levelOrderTraversal, createNode} from './family.js'
import { setupBackground, drawAllNodes } from '../drawers.js'

const canvas = document.querySelector("#treeCanvas")
const width = canvas.width = window.innerWidth  
const height = canvas.height = window.innerHeight
const ctx = canvas.getContext("2d")

setupBackground(ctx, width, height)

const leaf1 = createNode("B", createNode("D", null, null), createNode("E", createNode("H", null, null), createNode("I", null, null)))
const leaf2 = createNode("C", createNode("F", null, null), createNode("G", createNode("J", null, null), createNode("K", null, null)))
const parent = createNode("A", leaf1, leaf2)

const leveledNodes = levelOrderTraversal(parent)

drawAllNodes(ctx, width, height, structuredClone(leveledNodes))