// Solve and visualize the game of capturing tic-tac-toe.
// The game states can repeat so the game theoretic value
// of a state may not be uniquely determined.
// It is however possible to determine unique lower and
// upper bounds on the value.
// For each state it is assumed that it is the starting
// position with no history.
// The low value is then the game theoretic value assuming
// that a repetion is an absolute loss.
// The high value is respectively the game theoretic value
// assuming that a repetition is an absolute win.

// Game related

var mirror_p = [2, 1, 0, 5, 4, 3, 8, 7, 6];
var rotation_p = [2, 5, 8, 1, 4, 7, 0, 3, 6];


function mirror(state)
{
    var old = state.slice();
    for (var i = 0; i < 9; i++){
        state[mirror_p[i]] = old[i];
    }
}


function rotate(state)
{
    var old = state.slice();
    for (var i = 0; i < 9; i++){
        state[rotation_p[i]] = old[i];
    }
}


function capture(state, index)
{
    if (index == 0){
        if (state[1] + state[2] == -2){
            state[1] = state[2] = 0;
        }
        if (state[3] + state[6] == -2){
            state[3] = state[6] = 0;
        }
        // Diagonal captures disabled.
        /*
        if (state[4] + state[8] == -2){
            state[4] = state[8] = 0;
        }
        */
    }
    else if (index == 1){
        if (state[0] + state[2] == -2){
            state[0] = state[2] = 0;
        }
        if (state[4] + state[7] == -2){
            state[4] = state[7] = 0;
        }
    }
    else if (index == 4){
        // Diagonal captures disabled.
        /*
        if (state[0] + state[8] == -2){
            state[0] = state[8] = 0;
        }
        */
        if (state[1] + state[7] == -2){
            state[1] = state[7] = 0;
        }
    }
}


function make_move(state, index)
{
    // Don't mutate input
    var state = state.slice();
    // Play the move.
    state[index] = 1;
    // Capture pieces:
    // If the row or column where the move was made contains
    // two opposing pieces then they are removed from the board.
    for (var i = 0; i < 4; i++){
        capture(state, index);
        index = rotation_p[index];
        rotate(state);
    }
    // Switch turns.
    for (var i = 0; i < 9; i++){
        state[i] = -state[i];
    }
    // Eliminate symmetries.
    var canonical_state = state.slice();
    for (var i = 0; i < 3; i++){
        rotate(state);
        if (state.toString() < canonical_state.toString()){
            canonical_state = state.slice();
        }
    }
    mirror(state);
    if (state.toString() < canonical_state.toString()){
        canonical_state = state.slice();
    }
    for (var i = 0; i < 3; i++){
        rotate(state);
        if (state.toString() < canonical_state.toString()){
            canonical_state = state.slice();
        }
    }
    return canonical_state;
}


function children(state)
{
    var seen = {};
    var result = [];
    for (var i = 0; i < 9; i++){
        if (state[i] == 0){
            var child = make_move(state, i);
            var key = child.toString();
            // Prune out transpositions.
            if (!(key in seen)){
                seen[key] = true;
                result.push(child);
            }
        }
    }
    return result;
}


function score(state)
{
    var s = 0;
    for (var i = 0; i < 9; i++){
        s += state[i];
    }
    return s;
}


// Solving related


function expand(node, node_pool)
{
    var child_states = children(node.state);
    if (child_states.length){
        for (var i = 0; i < child_states.length; i++){
            var key = child_states[i].toString()
            if (key in node_pool){
                var child_node = node_pool[key];
            }
            else{
                var child_node = {
                    state: child_states[i],
                    low: -Infinity,
                    high: Infinity,
                    children: [],
                    parents: []
                }
                node_pool[key] = child_node;
                expand(child_node, node_pool);
            }
            node.children.push(child_node);
            child_node.parents.push(node);
        }
    }
    else {
        node.low = node.high = score(node.state);
    }
}


function update_values(node)
{
    var new_low = -Infinity;
    var new_high = -Infinity;
    for (var i = 0; i < node.children.length; i++){
        var child = node.children[i];
        if (-child.high > new_low){
            new_low = -child.high;
        }
        if (-child.low > new_high){
            new_high = -child.low;
        }
    }
    var changed = new_low != node.low || new_high != node.high;
    node.low = new_low;
    node.high = new_high;
    if (changed){
        for (var i = 0; i < node.parents.length; i++){
            update_values(node.parents[i]);
        }
    }
}


function get_root()
{
    var root_state = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    var root_node = {
        state: root_state,
        low: -Infinity,
        high: Infinity,
        children: [],
        parents: []
    };
    var node_pool = {};
    node_pool[root_state.toString()] = root_node;

    expand(root_node, node_pool);

    for (var key in node_pool){
        var node = node_pool[key];
        if (node.low == node.high){
            for (var i = 0; i < node.parents.length; i++){
                update_values(node.parents[i]);
            }
        }
    }

    return root_node;
}


var root = get_root();


// Rendering related.


function render(ctx, node, depth)
{
    if (depth > 0){
        var r = Math.random();
        var new_children = [];
        var has_strong_principal = false;
        for (var i = 0; i < node.children.length; i++){
            var child = node.children[i];
            if (depth % 2){
                if (-child.low == node.high && -child.high == node.high){
                    has_strong_principal = true;
                    break;
                }
            }
            else{
                if (-child.high == node.low && -child.low == node.low){
                    has_strong_principal = true;
                    break;
                }
            }
        }
        for (var i = 0; i < node.children.length; i++){
            var child = node.children[i];
            var is_principal;
            if (depth % 2){
                is_principal = -child.low == node.high;
                if (has_strong_principal){
                    is_principal = is_principal && -child.high == node.high;
                }
            }
            else{
                is_principal = -child.high == node.low;
                if (has_strong_principal){
                    is_principal = is_principal && -child.low == node.low;
                }
            }
            if (!("x" in child) && is_principal){
                var angle = 2 * Math.PI * (r + (i + Math.random() - 0.5) / node.children.length);
                child.x = node.x + Math.cos(angle) * node.scale * 20;
                child.y = node.y + Math.sin(angle) * node.scale * 20;
                // Gravitate towards center.
                child.x = (child.x - root.x) * 0.95 + root.x;
                child.y = (child.y - root.y) * 0.95 + root.y;
                child.scale = node.scale * 0.99;
                new_children.push(child);
            }
            ctx.globalAlpha = 0.5 * node.scale * 0.2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(child.x, child.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
        for (var i = 0; i < new_children.length; i++){
            var child = new_children[i];
            render(ctx, child, depth - 1);
        }
    }
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.scale, 0, 2 * Math.PI);
    ctx.fill();
}


function clear_coords(node)
{
    if ("x" in node){
        delete node.x;
        delete node.y;
        delete node.scale;
        for (var i = 0; i < node.children.length; i++){
            clear_coords(node.children[i]);
        }
    }
}


function draw_high()
{
    clear_coords(root);
    draw(true);
}


function draw_low()
{
    clear_coords(root);
    draw(false);
}


function draw(high_path)
{
    var canvas = document.getElementById("canvas");
    canvas.width = canvas.width;
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#FF0000";
    ctx.globalAlpha = 1.0;
    root.x = 0.5 * canvas.width;
    root.y = 0.5 * canvas.height;
    root.scale = 5;
    var depth;
    if (high_path){
        depth = 1001;
    }
    else {
        depth = 1000;
    }
    render(ctx, root, depth);
}
