ng_positions = {
    3: [524 + 5, 280],
    5: [550 - 10, 345 + 7],
    7: [456 - 30, 306 + 60],
    9: [413, 252 - 5],
    11: [482 - 10, 370 + 10],
    13: [400, 300],
    15: [474 - 10, 217 - 20],
    17: [555 + 15, 202 - 10],
    19: [649 + 30, 236],
    21: [619, 301],
    23: [665, 367],
    25: [646, 469 - 10],
    27: [586, 427],
    29: [557, 529],
    31: [506, 462],
    33: [445 + 10, 519],
    35: [360, 486],
    37: [398, 420],
    39: [304, 390],
    41: [361, 332 - 20],
    43: [313, 259],
    45: [362 - 5, 187 - 20],
    47: [416, 124],
    49: [498 + 20, 125],
    51: [575, 88],
    53: [634, 145],
    55: [718, 164],
    57: [749 + 15, 247],
    59: [764, 333],
    61: [734 - 10, 452]
};

$.each(ng_positions, function(state, position){
    ng_positions[state] = [position[0] - 200, position[1] - 30];
});


function child_states(state){
    var result = [];
    if (state < 6){
        return result;
    }
    for (var i=2; i < state; i++){
        if (state % i == 0){
            result.push(state / i);
        }
    }
    result.push(state + 2);
    result.push(state + 4);
    result.sort();
    return result;
}

function make_children(node, node_pool){
    if (node.children.length){
        return;
    }
    var cs = child_states(node.state)
    if (cs.length){
        $(cs).each(function(_, child_state) {
            var child_node;
            if (child_state in node_pool){
                child_node = node_pool[child_state];
            }
            else {
                var x = Math.random() * 420 + 40;
                var y = Math.random() * 420 + 40;
                if (child_state in ng_positions){
                    x = ng_positions[child_state][0];
                    y = ng_positions[child_state][1];
                }
                child_node = {
                    state: child_state,
                    low: -Infinity,
                    high: Infinity,
                    is_low_final: false,
                    is_high_final: false,
                    children: [],
                    parents: [],
                    x: x,
                    y: y,
                };
                node_pool[child_state] = child_node;
            }
            node.children.push(child_node);
            child_node.parents.push(node);
        });
    }
    else {
        node.low = node.high = -node.state;
        node.is_low_final = node.is_high_final = true;
    }
}

function update_values(node){
    var new_low = -Infinity;
    var new_high = -Infinity;
    $(node.children).each(function(_, child){
        if (-child.high > new_low){
            new_low = -child.high;
        }
        if (-child.low > new_high){
            new_high = -child.low;
        }
    });
    var changed = new_low != node.low || new_high != node.high;
    node.low = new_low;
    node.high = new_high;
    if (changed){
        $(node.parents).each(function(_, parent){
            update_values(parent);
        });
    }
}

function _low_leaks(node, result){
    if (node.children.length){
        node.is_low_final = true;
        $(node.children).each(function(_, child){
            if (-child.low > node.low && !child.is_high_final){
                _high_leaks(child, result);
            }
        });
    }
    else {
        result[node.state] = node;
    }
}

function _high_leaks(node, result){
    if (node.children.length){
        node.is_high_final = true;
        $(node.children).each(function(_, child){
            if (-child.low == node.high && child.is_low_final){
                return;
            }
        });
        $(node.children).each(function(_, child){
            if (-child.low == node.high && !child.is_low_final){
                _low_leaks(child, result);
            }
        });
    }
    else {
        result[node.state] = node;
    }
}

function update_low_finality(node){
    if (node.children.length){
        var new_low_final = true;
        if (node.low != node.high){
            $(node.children).each(function(_, child){
                if (-child.low > node.low && !child.is_high_final){
                    new_low_final = false;
                }
            });
        }
        var changed = new_low_final != node.is_low_final;
        node.is_low_final = new_low_final;
        if (changed){
            $(node.parents).each(function(_, parent){
                update_high_finality(parent);
            });
        }
    }
}

function update_high_finality(node){
    if (node.children.length){
        var new_high_final = false;
        if (node.low == node.high){
            new_high_final = true;
        }
        else {
            $(node.children).each(function(_, child){
                if (-child.low == node.high && child.is_low_final){
                    new_high_final = true;
                }
            });
        }
        var changed = new_high_final != node.is_high_final;
        node.is_high_final = new_high_final;
        if (changed){
            $(node.parents).each(function(_, parent){
                update_low_finality(parent);
            });
        }
    }
}

ng_node_pool = {};

ng_root = {
    state: 13,
    low: -Infinity,
    high: Infinity,
    is_low_final: false,
    is_high_final: false,
    children: [],
    parents: [],
    x: ng_positions[13][0],
    y: ng_positions[13][1],
};

ng_node_pool[ng_root.state] = ng_root;

function ng_expand(){
    var leaks = {};
    if (!ng_root.is_low_final){
        _low_leaks(ng_root, leaks);
    }
    else if (!ng_root.is_high_final){
        _high_leaks(ng_root, leaks);
    }
    else {
        return false;
    }
    var chosen_state = Infinity;
    var chosen_node;
    $.each(leaks, function(state, node){
        state = parseFloat(state);
        if (state < chosen_state){
            chosen_state = state;
            chosen_node = node;
        }
    });
    make_children(chosen_node, ng_node_pool);
    ng_update();
    return true;
}

function ng_update(){
    $.each(ng_node_pool, function(_, node){
        if (!node.children.length){
            $(node.parents).each(function(_, parent){
                update_values(parent);
            });
        }
    });

    $.each(ng_node_pool, function(_, node){
        if (node.children.length){
            node.is_low_final = true;
            node.is_high_final = true;
        }
    });

    $.each(ng_node_pool, function(_, node){
        if (!node.children.length){
            $(node.parents).each(function(_, parent){
                update_low_finality(parent);
                update_high_finality(parent);
            });
        }
    });
}

// while(ng_expand()){}

/*
ng_root.x = 400;
ng_root.y = 300;
nodes = [];
for (var state in ng_node_pool){
    if (state != ng_root.state){
        var node = ng_node_pool[state];
        node.x = Math.random() * 720 + 40;
        node.y = Math.random() * 520 + 40;
        nodes.push(node);
    }
}

for (var i=0; i < 2000; i++){
    $(nodes).each(function(_, node){
        node.x += Math.random() * 0.002 - 0.001;
        node.y += Math.random() * 0.002 - 0.001;
        $(node.parents).each(function(_, parent){
            node.x += (parent.x - node.x) * 0.01;
            node.y += (parent.y - node.y) * 0.01;
        });
        $(nodes).each(function(_, other){
            if (other.state != node.state){
                var x = node.x - other.x;
                var y = node.y - other.y;
                var d = x * x + y * y;
                var d = 0.0000000003 * d * d * d;
                node.x += x / d;
                node.y += y / d;
            }
        });
    });
}

ng_positions = {}
$.each(ng_node_pool, function(state, node){
    ng_positions[state] = [node.x, node.y];
});
*/

/*
$.each(ng_node_pool, function(state, node){
    xy = ng_positions[state];
    node.x = xy[0];
    node.y = xy[1];
});
*/
