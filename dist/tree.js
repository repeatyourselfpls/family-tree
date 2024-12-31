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
                node.X = node.getLeftMostNode().X;
            }
            else {
                node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;
                node.mod = node.X - node.getLeftMostNode().X;
            }
        }
        else {
            if (!node.previousSibling) {
                node.X = (node.getLeftMostNode().X + node.getRightMostNode().X) / 2;
            }
            else {
                node.X = node.previousSibling.X + TreeNode.NODE_SIZE + TreeNode.SIBLING_DISTANCE;
                node.mod = node.X - (node.getLeftMostNode().X + node.getRightMostNode().X) / 2; // currentX - desired
            }
        }
        // console.log(`Calculating ${node.name}: (${node.X}, ${node.Y}) Mod: ${node.mod}`)
        // check if subtrees clash, adjust X and mod if so
        if (node.children.length > 1) {
            this.checkConflicts(node);
        }
    }
    finalizeX(node, modSum) {
        node.X += modSum;
        modSum += node.mod;
        for (const child of node.children) {
            this.finalizeX(child, modSum);
        }
    }
    static checkConflicts(node) {
        // get left contour of right subtree and right contour of left subtree
        for (let i = 1; i < node.children.length; i++) {
            // if (node.children[i-1].children.length && node.children[i].children.length) {
            const rightNode = node.children[i];
            const leftNode = node.children[i - 1];
            const rightContour = TreeNode.getRightContour(leftNode);
            const leftContour = TreeNode.getLeftContour(rightNode);
            // you only need to check minimum depth
            const depth = Math.min(rightContour.length, leftContour.length);
            for (let d = 0; i < depth; i++) {
                const distance = rightContour[d].X - leftContour[d].X;
                if (distance < 0) {
                    rightNode.X += Math.abs(distance) + TreeNode.SIBLING_DISTANCE + TreeNode.NODE_SIZE;
                    rightNode.mod += Math.abs(distance) + TreeNode.SIBLING_DISTANCE + TreeNode.NODE_SIZE;
                }
            }
        }
    }
    // for each level, returns the list of leftmost node
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
    // for each level, returns the list of rightmost nodes
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
    isLeafNode() {
        return this.children.length == 0;
    }
    getRightMostNode() {
        return this.children.slice(-1)[0];
    }
    getLeftMostNode() {
        return this.children[0];
    }
}
TreeNode.NODE_SIZE = 1;
TreeNode.SIBLING_DISTANCE = 0;
const sunny = new TreeNode("Sunny", []);
const vivian = new TreeNode("Vivian", []);
const raj = new TreeNode("Raj", []);
const sam = new TreeNode("Sam", []);
const alice = new TreeNode("Alice", [sunny, vivian]);
const bob = new TreeNode("Bob", [raj, sam, alice]);
TreeNode.initializeNodes(bob, null, 0);
TreeNode.calculateXMod(bob);
console.log(TreeNode.getLeftContour(bob));
console.log(TreeNode.getRightContour(bob));
