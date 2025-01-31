export class TreeNode {
    constructor(name, children) {
        this.name = '';
        this.children = [];
        this.parent = null;
        this.previousSibling = null;
        this.nextSibling = null;
        this.mod = 0;
        this.X = 0;
        this.Y = -1;
        this.name = name;
        this.children = children;
    }
    // Attaches previous siblings and a base Y for each level 
    static initializeNodes(node, parent, previousSibling, nextSibling, startingY) {
        node.Y = startingY;
        node.previousSibling = previousSibling;
        node.nextSibling = nextSibling;
        node.parent = parent;
        for (let i = 0; i < node.children.length; i++) {
            this.initializeNodes(node.children[i], node, i > 0 ? node.children[i - 1] : null, i < node.children.length ? node.children[i + 1] : null, startingY + 1);
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
        // check if sibling subtrees clash, adjust X and mod if so
        if (node.children.length) {
            this.checkConflicts(node);
        }
    }
    static checkConflicts(node) {
        const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE;
        let leftSibling = node.getLeftMostSibling();
        while (leftSibling && leftSibling != node) {
            let leftContour = TreeNode.getLeftContour(node);
            const rightContour = TreeNode.getRightContour(leftSibling);
            const depth = Math.min(rightContour.length, leftContour.length);
            for (let d = 0; d < depth; d++) {
                const distance = leftContour[d][1] - rightContour[d][1];
                if (distance < minDistance) {
                    const shift = distance < 0 ? Math.abs(distance) + minDistance : minDistance - distance;
                    node.X += shift;
                    node.mod += shift;
                    leftContour = TreeNode.getLeftContour(node); // make adjusted comparison further level down
                    const siblingsInBetween = TreeNode.getSiblingsInBetween(leftSibling, node);
                    this.fixSiblingSeparation(siblingsInBetween, shift);
                    this.checkConflicts(node);
                }
            }
            leftSibling = leftSibling.getNextSibling();
        }
    }
    static checkConflicts2(node) {
        const minDistance = TreeNode.NODE_SIZE + TreeNode.TREE_DISTANCE;
        let shiftValue = 0; // only shift after u find the max shift distance for each level of each sibling
        let sibling = node.getLeftMostSibling();
        while (sibling && sibling !== node) {
            let leftContour = TreeNode.getLeftContour(node);
            const rightContour = TreeNode.getRightContour(sibling);
            const depth = Math.min(leftContour.length, rightContour.length);
            for (let d = 0; d < depth; d++) {
                const distance = leftContour[d][1] - rightContour[d][1];
                if (distance + shiftValue < minDistance) {
                    shiftValue = Math.max(minDistance - distance, shiftValue);
                }
            }
            if (shiftValue) {
                const siblingsInBetween = TreeNode.getSiblingsInBetween(sibling, node);
                this.fixSiblingSeparation(siblingsInBetween, shiftValue);
                this.checkConflicts2(node);
            }
            sibling = sibling.getNextSibling();
        }
        if (shiftValue) {
            node.X += shiftValue;
            node.mod += shiftValue;
            shiftValue = 0;
        }
    }
    static fixSiblingSeparation(siblingsInBetween, shiftDistance) {
        const apportionAmount = shiftDistance / (siblingsInBetween.length + 1);
        for (const sibling of siblingsInBetween.reverse()) {
            sibling.X += apportionAmount;
            sibling.mod += apportionAmount;
        }
    }
    static getSiblingsInBetween(start, end) {
        let siblingsInBetween = [];
        while (end.previousSibling && end.previousSibling !== start) {
            siblingsInBetween.push(end.previousSibling);
            end = end.previousSibling;
        }
        return siblingsInBetween;
    }
    // level order traversal of leftmost node's X positions w/ modifier added
    // this is used to adjust siblings collisions, we do not alter the node's X value yet
    static getLeftContour(node) {
        const contour = [];
        const queue = [[node, 0, 0]];
        let nextLevel = 0;
        while (queue.length) {
            const [n, level, modSum] = queue.splice(0, 1)[0];
            if (level === nextLevel) {
                nextLevel += 1;
                contour.push([n, n.X + modSum]);
            }
            for (const child of n.children) {
                queue.push([child, level + 1, modSum + n.mod]);
            }
        }
        return contour;
    }
    // level order traversal of rightmost node's X positions w/ modifier added
    // this is used to adjust siblings collisions, we do not alter the node's X value yet
    static getRightContour(node) {
        const contour = [];
        const queue = [[node, 0, 0]];
        let nextLevel = 0;
        while (queue.length) {
            const [n, level, modSum] = queue.splice(0, 1)[0];
            if (level === nextLevel) {
                nextLevel += 1;
                contour.push([n, n.X + modSum]);
            }
            for (const child of n.children.reverse()) {
                queue.push([child, level + 1, modSum + n.mod]);
            }
        }
        return contour;
    }
    // if a node falls off the screen, shift nodes so it's visible
    static ensureChildrenOnScreen(node) {
        const leftContour = TreeNode.getLeftContour(node);
        let shiftAmount = 0;
        for (const [_, x] of leftContour) {
            shiftAmount = Math.min(shiftAmount, x);
        }
        if (shiftAmount < 0) {
            node.X += Math.abs(shiftAmount);
            node.mod += Math.abs(shiftAmount);
        }
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
    getPreviousSibling() {
        return this.previousSibling;
    }
    getNextSibling() {
        return this.nextSibling;
    }
    getLeftMostSibling() {
        return this.parent ? this.parent.children[0] : null;
    }
    getRightMostSibling() {
        if (this.parent) {
            const l = this.parent.children.length;
            return this.parent.children[l - 1];
        }
        return null;
    }
}
TreeNode.NODE_SIZE = 1;
TreeNode.SIBLING_DISTANCE = 0;
TreeNode.TREE_DISTANCE = 0;
