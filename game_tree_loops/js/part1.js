$(document).ready(function(){
    function render_graph(root){
        var arrowhead = draw.marker(30, 30, function(add) {
            add.path('M 0 0 L -15 5 L -10 0 L -15 -5 Z').move(10, 10).fill('#111');
        });
        if (root.rendered){
            return;
        }
        var label;
        var low_label = root.low === -Infinity ? '-∞' : root.low.toString();
        var high_label = root.high === Infinity ? '∞' : root.high.toString();
        if (root.low == root.high){
            label = low_label;
        }
        else {
            label = low_label + ", " + high_label;
        }
        draw.ellipse(30, 30).fill('#111').center(root.x, root.y);
        draw.text(label).font({size: 10, anchor: 'middle'}).fill('#eee').move(root.x - 1, root.y - 6);

        root.rendered = true;
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
            render_graph(child);
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

    var _draw = SVG('simple_tree').size(300, 260);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var one = {
        x: 50,
        y: 150,
        low: 1,
        high: 1,
    };

    var two = {
        x: 100,
        y: 150,
        low: 2,
        high: 2,
    };

    var three = {
        x: 150,
        y: 150,
        low: 3,
        high: 3,
    };

    var a = {
        x: 75,
        y: 80,
        low: -1,
        high: -1,
        children: [one, two],
    };

    var b = {
        x: 150,
        y: 80,
        low: -3,
        high: -3,
        children: [three],
    };

    var c = {
        x: 100,
        y: 20,
        low: 3,
        high: 3,
        children: [a, b],
    };

    render_graph(c);

    var _draw = SVG('simple_loop').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var one = {
        x: 50,
        y: 50,
        low: -1,
        high: -1,
    };

    var two = {
        x: 300,
        y: 50,
        low: -2,
        high: -2,
    };

    var a = {
        x: 120,
        y: 50,
        low: 1,
        high: 1,
        children: [one],
        controls: {1: [170, 0]},
    };

    var b = {
        x: 230,
        y: 50,
        low: 2,
        high: 2,
        children: [two, a],
        controls: {1: [180, 100]},
    };
    a.children.push(b);

    render_graph(a);

    var _draw = SVG('multi_valued_loop_mystery').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    one.low = 1;
    one.high = 1;
    two.low = 2;
    two.high = 2;
    a.low = '?';
    a.high = '?';
    b.low = '?';
    b.high = '?';
    clear_render(a);
    render_graph(a);

    var _draw = SVG('multi_valued_loop_single_1').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = -1;
    b.low = 1;
    b.high = 1;
    clear_render(a);
    render_graph(a);

    var _draw = SVG('multi_valued_loop_single_2').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = 2;
    a.high = 2;
    b.low = -2;
    b.high = -2;
    clear_render(a);
    render_graph(a);

    var _draw = SVG('multi_valued_loop_single_3').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = 0;
    a.high = 0;
    b.low = 0;
    b.high = 0;
    clear_render(a);
    render_graph(a);

    var _draw = SVG('multi_valued_loop_low').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = Infinity;
    b.low = -2;
    b.high = Infinity;
    clear_render(a);
    render_graph(a);

    var _draw = SVG('multi_valued_loop_final').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = 2;
    b.low = -2;
    b.high = 1;
    clear_render(a);
    render_graph(a);

    var _draw = SVG('three_loop').size(600, 400);
    var draw = _draw.group();
    draw.translate(0, -25);
    draw.scale(1.5, 1.5);

    var one = {
        x: 50,
        y: 250,
        low: 1,
        high: 1,
    };

    var two = {
        x: 200,
        y: 50,
        low: -2,
        high: -2,
    };

    var three = {
        x: 350,
        y: 250,
        low: 3,
        high: 3,
    };

    var a = {
        x: 110,
        y: 200,
        low: -1,
        high: 3,
        children: [one],
        controls: {2: [200, 300]},
    };

    var b = {
        x: 200,
        y: 120,
        low: 2,
        high: 3,
        children: [two],
    };
    a.children.push(b);

    var c = {
        x: 290,
        y: 200,
        low: -3,
        high: 1,
        children: [three, a],
    };
    a.children.push(c);
    b.children.push(c);

    render_graph(a);
});
