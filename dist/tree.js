"use strict";
var _a, _TreeNode_NODE_SIZE;
class TreeNode {
    constructor(name, children) {
        this.name = "";
        this.children = [];
        this.previousSibling = null;
        this.modifier = 0;
        this.X = 0;
        this.Y = -1;
        this.name = name;
        this.children = children;
    }
    static initializeNodes(node, previousSibling, startingY) {
        node.Y = startingY;
        node.previousSibling = previousSibling;
        for (let i = 0; i < node.children.length; i++) {
            this.initializeNodes(node.children[i], i > 0 ? node.children[i - 1] : null, startingY + 1);
        }
    }
    // post order traversal that calculates x and mod from the bottom up
    calculateXMod(node) {
        // calculate X
        // adjust X and mod based on clashes
    }
    finalizeX(node) {
    }
}
_a = TreeNode;
_TreeNode_NODE_SIZE = { value: 1 };
const sunny = new TreeNode("Sunny", []);
const vivian = new TreeNode("Vivian", []);
const raj = new TreeNode("Raj", []);
const sam = new TreeNode("Sam", []);
const alice = new TreeNode("Alice", [sunny, vivian]);
const bob = new TreeNode("Bob", [raj, sam, alice]);
TreeNode.initializeNodes(bob, null, 0);
console.log(bob);
