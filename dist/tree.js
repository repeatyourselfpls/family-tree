"use strict";
class TreeNode {
    constructor(name, children) {
        this.name = '';
        this.children = [];
        this.previousSibling = null;
        this.mod = 0;
        this.X = 0;
        this.Y = -1;
        this.name = name;
        this.children = children;
    }
    // Attaches previous siblings and a base Y for each level 
    static initializeNodes(node, previousSibling, startingY) {
        node.Y = startingY;
        node.previousSibling = previousSibling;
        for (let i = 0; i < node.children.length; i++) {
            this.initializeNodes(node.children[i], i > 0 ? node.children[i - 1] : null, startingY + 1);
        }
    }
    // Calculates the X and Mod bottom up
    static calculateXMod(node) {
        for (const child of node.children) {
            this.calculateXMod(child);
        }
        if (node.isLeafNode()) {
            if (!node.previousSibling) {
                node.X = 0;
            }
            else {
                node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;
            }
        }
        else if (node.children.length == 1) {
            if (!node.previousSibling) {
                node.X = node.getLeftMostChildNode().X;
            }
            else {
                node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;
                node.mod = node.X - node.getLeftMostChildNode().X;
            }
        }
        else {
            if (!node.previousSibling) {
                node.X = (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2;
            }
            else {
                node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;
                node.mod = node.X - (node.getLeftMostChildNode().X + node.getRightMostChildNode().X) / 2; // currentX - desired
            }
        }
        // console.log(`Calculating ${node.name}: (${node.X}, ${node.Y}) Mod: ${node.mod}`)
        // check if subtrees clash, adjust X and mod if so
        // if (node.children.length > 1) {
        //   this.checkConflicts(node)
        // }
    }
    static checkConflicts(node) {
        // get left contour of right subtree and right contour of left subtree
        for (let i = 1; i < node.children.length; i++) {
            // if (node.children[i-1].children.length && node.children[i].children.length) {
            const rightNode = node.children[i];
            const leftNode = node.children[i - 1];
            let rightContour = TreeNode.getRightContour(leftNode);
            const leftContour = TreeNode.getLeftContour(rightNode);
            // you only need to check minimum depth
            const depth = Math.min(rightContour.length, leftContour.length);
            for (let d = 0; i < depth; i++) {
                const distance = rightContour[d].X - leftContour[d].X;
                if (distance < 0) {
                    rightNode.X += Math.abs(distance) + TreeNode.SIBLING_DISTANCE + TreeNode.NODE_SIZE;
                    rightNode.mod += Math.abs(distance) + TreeNode.SIBLING_DISTANCE + TreeNode.NODE_SIZE;
                    // TODO: Recalculate contours afterwards?
                    rightContour = TreeNode.getRightContour(rightNode);
                }
            }
        }
    }
    // level order traversal of leftmost node's X positions w/ modifier added
    static getLeftContour(node) {
        const contour = [];
        const queue = [[node, 0]];
        let nextLevel = 0;
        while (queue.length) {
            const [n, curLevel] = queue.splice(0, 1)[0];
            if (curLevel === nextLevel) {
                nextLevel += 1;
                contour.push(n);
            }
            for (const child of n.children) {
                queue.push([child, curLevel + 1]);
            }
        }
        return contour;
    }
    // level order traversal of rightmost node's X positions w/ modifier added
    static getRightContour(node) {
        const contour = [];
        const queue = [[node, 0]];
        let nextLevel = 0;
        while (queue.length) {
            const [n, curLevel] = queue.splice(0, 1)[0];
            if (curLevel === nextLevel) {
                nextLevel += 1;
                contour.push(n);
            }
            for (const child of n.children.reverse()) {
                queue.push([child, curLevel + 1]);
            }
        }
        return contour;
    }
    static finalizeX(node, modSum) {
        node.X += modSum;
        modSum += node.mod;
        for (const child of node.children) {
            this.finalizeX(child, modSum);
        }
    }
    static levelOrderTraversal(node) {
        const queue = [[node, 0]];
        const traversal = [];
        while (queue.length) {
            const [curr, level] = queue.splice(0, 1)[0];
            traversal.push([curr, level]);
            if (curr.children.length) {
                for (const child of curr.children) {
                    queue.push([child, level + 1]);
                }
            }
        }
        return traversal;
    }
    isLeafNode() {
        return this.children.length == 0;
    }
    getRightMostChildNode() {
        return this.children.slice(-1)[0];
    }
    getLeftMostChildNode() {
        return this.children[0];
    }
}
TreeNode.NODE_SIZE = 1;
TreeNode.SIBLING_DISTANCE = 0;
const B = new TreeNode("B", []);
const C = new TreeNode("C", []);
const H = new TreeNode("H", []);
const I = new TreeNode("I", []);
const J = new TreeNode("J", []);
const K = new TreeNode("K", []);
const L = new TreeNode("L", []);
const A = new TreeNode("A", []);
const D = new TreeNode("D", [B, C]);
const G = new TreeNode("G", []);
const M = new TreeNode("M", [H, I, J, K, L]);
const E = new TreeNode("E", [A, D]);
const F = new TreeNode("F", []);
const N = new TreeNode("N", [G, M]);
const O = new TreeNode("O", [E, F, N]);
TreeNode.initializeNodes(O, null, 0);
TreeNode.calculateXMod(O);
TreeNode.finalizeX(O, 0);
const traversedNodes = TreeNode.levelOrderTraversal(O);
for (const [n, level] of traversedNodes) {
    console.log(level, n.name, n.X);
}
console.log(TreeNode.getLeftContour(O));
console.log(TreeNode.getRightContour(O));
