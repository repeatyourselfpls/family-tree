export const RADIUS = 50;
export const DIAMETER = RADIUS * 2;
export const SPACING_X = 40;
export const SPACING_Y = 150;
export function setupBackground(ctx, width, height) {
    ctx.fillStyle = "wheat";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "rgba(0 0 0 / 5%)";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 15) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += 15) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }
}
// pre order traversal drawing
export function drawAllNodesv2(ctx, node, parentNode) {
    drawNode(ctx, node.X * DIAMETER, node.Y * SPACING_Y, node.name);
    if (parentNode) {
        drawParentLink(ctx, node, parentNode);
    }
    for (const child of node.children) {
        drawAllNodesv2(ctx, child, node);
    }
}
function drawNode(ctx, x, y, val) {
    ctx.fillStyle = "pink";
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 50, degreeToRadians(0), degreeToRadians(360), false);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.font = "24px arial";
    const textWidth = ctx.measureText(`${val}`).width;
    const textHeight = ctx.measureText("M").width;
    ctx.fillText(`${val}`, x - textWidth / 2, y + textHeight / 2);
}
function drawParentLink(ctx, node, parent) {
    const parent_x = parent.X;
    const parent_y = parent.Y;
    const node_x = node.X;
    const node_y = node.Y;
    const deltaX = node_x - parent_x;
    const deltaY = node_y - parent_y;
    const theta = Math.atan(deltaY / Math.abs(deltaX)); // positive val
    const parent_x_delta = deltaX < 0 ? -1 * Math.cos(theta) * RADIUS : Math.cos(theta) * RADIUS;
    const parent_y_delta = Math.sin(theta) * RADIUS;
    const node_x_delta = -1 * parent_x_delta;
    const node_y_delta = -1 * parent_y_delta;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(parent_x + parent_x_delta, parent_y + parent_y_delta);
    ctx.lineTo(node_x + node_x_delta, node_y + node_y_delta);
    ctx.stroke();
}
function degreeToRadians(deg) {
    return (deg / 360) * (2 * Math.PI);
}
