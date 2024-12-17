var TreeNode = /** @class */ (function () {
    function TreeNode(name, children) {
        this.name = "";
        this.children = [];
        this.childPosition = 0;
        this.desiredX = 0;
        this.modifier = 0;
        this.previousSibling = null;
        this.name = name;
        this.children = children;
        this.attachSiblings(children);
        this.calculateChildPosition(children);
    }
    TreeNode.prototype.attachSiblings = function (children) {
        if (children.length > 1) {
            for (var i = 1; i < children.length; i++) {
                children[i].previousSibling = children[i - 1];
            }
        }
    };
    TreeNode.prototype.calculateChildPosition = function (children) {
        for (var i = 0; i < children.length; i++) {
            children[i].childPosition = i;
        }
    };
    // calculates the initial X position of each node from the positions of it's child nodes
    // 1) If 1 child, then X is child X
    // 2) If > 1 child, then X is midpoint
    TreeNode.calculateDesiredX = function (node) {
        if (!node)
            return;
        for (var _i = 0, _a = node.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.calculateDesiredX(child);
        }
        if (node.children.length > 1) {
            var last = node.children.length - 1;
            node.desiredX = (node.children[last].childPosition - node.children[0].childPosition) / 2;
        }
        else if (node.children.length == 1) {
            node.desiredX = node.children[0].childPosition;
        }
        else {
            node.desiredX = node.childPosition;
        }
    };
    TreeNode.calculateFinalModifierAndX = function (node) {
    };
    return TreeNode;
}());
var sunny = new TreeNode("Sunny", []);
var vivian = new TreeNode("Vivian", []);
var raj = new TreeNode("Raj", []);
var sam = new TreeNode("Sam", []);
var alice = new TreeNode("Alice", [sunny, vivian]);
var bob = new TreeNode("Bob", [raj, sam, alice]);
TreeNode.calculateDesiredX(bob);
TreeNode.calculateFinalModifierAndX(bob);
console.log(bob);
