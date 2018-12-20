'use strict';
function create(opts) {

    for (var x = 0; x < opts.x; x++) {
        for (var y = 0; y < opts.y; y++) {
            var d                   = document.createElement('div');
            d.style.position        = opts.position;
            d.style.backgroundColor = opts.color;
            d.style.width           = opts.size + 'px';
            d.style.height          = opts.size + 'px';
            d.style.left            = x + (opts.margin * x) + 'px';
            d.style.top             = y + (opts.margin * y) + 'px';
            if (opts.borderRadius) d.style.borderRadius = '50%';
            d.id = 'x' + x + '-y' + y;
            opts.el.appendChild(d);
        }
    }
}
export default create;