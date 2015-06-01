$(document).ready(function(){
    var _draw = SVG('full_tree').size(600, 300);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var root = {
        children: [
            {children: [3, 4, 8]},
            {children: [1, 7, 5]},
            {children: [9, 2, 6]}
        ]
    };

    root = actualize(root);

    root.x = 200;
    root.y = 50;
    $(root.children).each(function(x, child){
        negamax(child);
        child.x = 100 + 100 * x;
        child.y = 110;
        $(child.children).each(function(xx, grandchild){
            grandchild.x = child.x - 32 + 32 * xx;
            grandchild.y = 170;
        });
    });


    render_graph(root, draw);

    var _draw = SVG('lower_bound_tree').size(600, 300);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    disable(root.children[1]);
    disable(root.children[2]);
    negamax(root);

    clear_render(root);
    render_graph(root, draw);

    var _draw = SVG('upper_bound_tree').size(600, 300);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    root.children[0].children[1].disabled = true;
    root.children[0].children[2].disabled = true;
    root.children[1].disabled = false;
    root.children[1].children[0].disabled = false;
    root.children[2].disabled = false;
    root.children[2].children[1].disabled = false;
    $(root.children).each(function(_, child){
        negamax(child);
    });

    clear_render(root);
    render_graph(root, draw);

    var _draw = SVG('minimal_tree').size(600, 300);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    root.children[0].children[1].disabled = false;
    root.children[0].children[2].disabled = false;
    negamax(root.children[0]);

    clear_render(root);
    render_graph(root, draw);

    var _draw = SVG('loop_finality_problem').size(600, 150);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var one = {
        x: 50,
        y: 50,
        low: 1,
        high: 1,
        is_low_final: true,
        is_high_final: true,
    };

    var two = {
        x: 300,
        y: 50,
        low: 2,
        high: 2,
        is_low_final: true,
        is_high_final: true,
    };

    var a = {
        state: 'A',
        x: 120,
        y: 50,
        low: -1,
        high: 2,
        children: [one],
        controls: {1: [170, 0]},
    };

    var b = {
        state: 'B',
        x: 230,
        y: 50,
        low: -2,
        high: 1,
        children: [two, a],
        controls: {1: [180, 100]},
    };
    a.children.push(b);

    render_graph(a, draw);

    var _draw = SVG('half_final_loop').size(600, 250);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    one.low = -1;
    one.high = -1;

    var a = $.extend({}, a);
    var b = $.extend({}, b);
    a.is_low_final = false;
    a.is_high_final = true;
    b.is_low_final = true;
    b.is_high_final = false;
    a.parents = [b];
    b.children = [two, a];
    b.parents = [a];
    var zero = {
        x: 70,
        y: 130,
        low: 0,
        high: 0,
        is_low_final: true,
        is_high_final: true,
        disabled: true,
    }
    var mystery = {
        x: 250,
        y: 130,
        low: '?',
        high: '?',
        disabled: true,
    }
    var c = {
        state: 'C',
        x: 150,
        y: 130,
        is_low_final: false,
        is_high_final: false,
        children: [two, zero, mystery],
        parents: [a],
    }

    a.children = [one, b, c];
    negamax(c);

    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('final_loop').size(600, 250);
    var draw = _draw.group();
    draw.scale(1.5, 1.5);

    var a = $.extend({}, a);
    var b = $.extend({}, b);
    var c = $.extend({}, c);
    a.is_low_final = true;
    b.is_high_final = true;
    a.children = [one, b, c];
    a.parents = [b];
    b.children = [two, a];
    b.parents = [a];
    c.children = [two, zero, mystery];
    c.parents = [a];
    zero.disabled = false;

    negamax(c);

    clear_render(a);
    render_graph(a, draw);

    var _draw = SVG('number_game');
    _draw.height(520);
    $('#number_game_info').height($('#number_game').height() - 60);
    var draw = _draw.group();
    draw.scale(1.0, 1.0);

    render_graph(ng_root, draw);

    $('#number_game_expand').click(function(e){
        e.preventDefault();
        var content = $('#number_game_info').find('.active');
        content.addClass('hidden');
        content.removeClass('active');
        content = content.next();
        content.removeClass('hidden');
        content.addClass('active');
        if (!ng_expand()){
            $(this).prop("disabled", true);
        }
        clear_render(ng_root);
        draw.clear();
        render_graph(ng_root, draw);
    });
});
