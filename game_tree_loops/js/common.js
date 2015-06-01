function actualize(root, parent){
    if (typeof(root) === 'number'){
        return {
            low: root,
            high: root,
            parents: [parent],
        }
    }
    else if (!root.actualized){
        root.actualized = true;
        var children = [];
        $(root.children).each(function(_, child){
            children.push(actualize(child, root));
        });
        root.children = children;
        root.low = -Infinity;
        root.high = Infinity;
        root.parents = [];
    }
    if (parent){
        root.parents.push(parent);
    }
    return root;
}

function negamax(node){
    if (node.children){
        var low = -Infinity;
        var high = -Infinity;
        $(node.children).each(function(_, child){
            if (!child.disabled && -child.high > low){
                low = -child.high;
            }
            if (-child.low > high){
                high = -child.low;
            }
            if (child.disabled){
                high = Infinity;
            }
        });
        var changed = low != node.low || high != node.high;
        node.low = low;
        node.high = high;
        if (changed){
            $(node.parents).each(function(_, parent){
                negamax(parent);
            });
        }
    }
}

function disable(root){
    if (!root.disabled){
        root.disabled = true;
        $(root.children).each(function(_, child){
            disable(child);
        });
    }
}

function render_graph(root, draw){
    var arrowhead = draw.marker(30, 30, function(add) {
        add.path('M 0 0 L -15 5 L -10 0 L -15 -5 Z').move(10, 10).fill('#111');
    });
    if (root.rendered){
        return;
    }
    var label;
    var fill;
    var low_label = root.low === -Infinity ? '-∞' : root.low.toString();
    var high_label = root.high === Infinity ? '∞' : root.high.toString();
    if (root.low == root.high){
        label = low_label;
    }
    else {
        label = low_label + ", " + high_label;
    }
    if (root.disabled){
        label = "?";
        fill = '#999';
    }
    else{
        fill = '#111';
    }

    draw.ellipse(30, 30).fill(fill).center(root.x, root.y);
    var t = draw.text(label).font({size: 10, anchor: 'middle'}).fill('#eee').move(root.x - 1, root.y - 6);
    if (root.state){
        var h = draw.ellipse(35, 35).fill('rgba(0, 0, 0, 0)').center(root.x, root.y);
        var showState = function(){
            t.text(root.state.toString());
            t.font({size: 15});
            t.move(root.x, root.y - 9);
        }
        var hideState = function(){
            if (root.show_state){
                return;
            }
            t.text(label);
            t.font({size: 10});
            t.move(root.x -1, root.y - 6);
        }
        h.mouseover(showState);
        h.mouseout(hideState);
        h.click(function(e){
            e.preventDefault();
            if (root.show_state){
                root.show_state = false;
                hideState();
            }
            else {
                root.show_state = true;
                showState();
            }
        });
        if (root.show_state){
            showState();
        }
    }
    if (!root.disabled){
        var color;
        if ('is_low_final' in root){
            color = root.is_low_final ? '#2e1' : '#e21';
            draw.path('M ' + root.x + ' ' + (root.y - 15) + ' a 15 15 0 0 0 0 30').fill('none').stroke({width: 2, color: color});
        }
        if ('is_high_final' in root){
            color = root.is_high_final ? '#2e1' : '#e21';
            draw.path('M ' + root.x + ' ' + (root.y + 15) + ' a 15 15 0 0 0 0 -30').fill('none').stroke({width: 2, color: color});
        }
    }

    root.rendered = true;
    if (root.disabled){
        return;
    }
    $(root.children).each(function(i, child){
        var cx;
        var cy;
        if (root.controls && root.controls[i]){
            cx = root.controls[i][0];
            cy = root.controls[i][1];
        }
        else {
            cx = (3 * root.x + child.x) / 4;
            cy = (3 * root.y + child.y) / 4;
        }
        var x = cx - child.x;
        var y = cy - child.y;
        var theta = Math.atan2(y, x);
        x = child.x + Math.cos(theta) * 25;
        y = child.y + Math.sin(theta) * 25;
        var data = 'M ' + root.x + ' ' + root.y + ' Q ' + cx + ' ' + cy + ' ' + x + ' ' + y;
        draw.path(data).fill('none').stroke({width: 1}).marker('end', arrowhead).back();
        render_graph(child, draw);
    });
}

function clear_render(root){
    if (root.rendered){
        delete root.rendered;
        $(root.children).each(function(i, child){
            clear_render(child);
        });
    }
}
