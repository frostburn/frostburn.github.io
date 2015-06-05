$(document).ready(function(){
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

    render_graph(c, draw);

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

    render_graph(a, draw);

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
    render_graph(a, draw);

    var _draw = SVG('multi_valued_loop_single_1').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = -1;
    b.low = 1;
    b.high = 1;
    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('multi_valued_loop_single_2').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = 2;
    a.high = 2;
    b.low = -2;
    b.high = -2;
    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('multi_valued_loop_single_3').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = 0;
    a.high = 0;
    b.low = 0;
    b.high = 0;
    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('multi_valued_loop_low').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = Infinity;
    b.low = -2;
    b.high = Infinity;
    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('multi_valued_loop_final').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -1;
    a.high = 2;
    b.low = -2;
    b.high = 1;
    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('self_loop_mystery').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var two = {
        x: 50,
        y: 50,
        low: 2,
        high: 2,
    }

    var a = {
        x: 120,
        y: 50,
        low: '?',
        high: '?',
        children: [two],
        controls: {1: [220, -10, 220, 100]},
    }
    a.children.push(a);

    render_graph(a, draw);

    var _draw = SVG('self_loop_single_1').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -2;
    a.high = -2;

    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('self_loop_single_2').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = 2;
    a.high = 2;

    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('self_loop_final').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    a.low = -2;
    a.high = 2;

    clear_render(a);
    render_graph(a, draw);

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

    render_graph(a, draw);
});
