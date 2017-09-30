/*
 * Water ripple effect.
 * Original code (Java) by Neil Wallis
 * Code snipplet adapted to Javascript by Sergey Chikuyonok
 * Code adapted to this application by Willian Hira
 */

window.onload = function() {
	var canvas = document.getElementById('portalCanvas'),
		/** @type {CanvasRenderingContext2D} */
		ctx = canvas.getContext('2d'),
		width = $(window).width(),
		height = $(window).height(),
		half_width = width >> 1,
		half_height = height >> 1,
		size = width * (height + 2) * 2,
		delay = 30,
		oldind = width,
		newind = width * (height + 3),
		riprad = 3,
		ripplemap = [],
		last_map = [],
		ripple,
		texture;

	canvas.width = width;
	canvas.height = (height-10);

	with (ctx) {

// Create gradient

      grd = ctx.createRadialGradient(width/2, height/1.5, 0.000, width/2, height/2, 300);

      // Add colors

      grd.addColorStop(0.000, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.050, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.100, 'rgba(73, 230, 29, 1.000)');
      grd.addColorStop(0.150, 'rgba(227, 255, 150, 1.000)');

      grd.addColorStop(0.150, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.200, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.250, 'rgba(73, 230, 29, 1.000)');

      grd.addColorStop(0.300, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.350, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.400, 'rgba(73, 230, 29, 1.000)');
      grd.addColorStop(0.450, 'rgba(227, 255, 150, 1.000)');

      grd.addColorStop(0.450, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.500, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.550, 'rgba(73, 230, 29, 1.000)');

      grd.addColorStop(0.650, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.700, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.750, 'rgba(73, 230, 29, 1.000)');
      grd.addColorStop(0.800, 'rgba(227, 255, 150, 1.000)');

      grd.addColorStop(0.800, 'rgba(55, 151, 28, 1.000)');
      grd.addColorStop(0.850, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.900, 'rgba(73, 230, 29, 1.000)');

      grd.addColorStop(0.950, 'rgba(151, 246, 47, 1.000)');
      grd.addColorStop(0.950, 'rgba(227, 255, 150, 1.000)');

      grd.addColorStop(1.000, 'rgba(0, 0, 0, 1.000)');

      // Fill with gradient

      fillStyle = grd;
      setTransform(0.5, 0, 0, 1, width/4, 0);
      fillRect(0, 0, width, height);

	}

	texture = ctx.getImageData(0, 0, width, height);
	ripple = ctx.getImageData(0, 0, width, height);

	for (var i = 0; i < size; i++) {
		last_map[i] = ripplemap[i] = 0;
	}

	/**
	 * Main loop
	 */
	function run() {
		newframe();
		ctx.putImageData(ripple, 0, 0);
	}

	/**
	 * Disturb water at specified point
	 */
	function disturb(dx, dy) {
		dx <<= 0;
		dy <<= 0;

		for (var j = dy - riprad; j < dy + riprad; j++) {
			for (var k = dx - riprad; k < dx + riprad; k++) {
				ripplemap[oldind + (j * width) + k] += 128;
			}
		}
	}

	/**
	 * Generates new ripples
	 */
	function newframe() {
		var a, b, data, cur_pixel, new_pixel, old_data;

		var t = oldind; oldind = newind; newind = t;
		var i = 0;

		// create local copies of variables to decrease
		// scope lookup time in Firefox
		var _width = width,
			_height = height,
			_ripplemap = ripplemap,
			_last_map = last_map,
			_rd = ripple.data,
			_td = texture.data,
			_half_width = half_width,
			_half_height = half_height;

		for (var y = 0; y < _height; y++) {
			for (var x = 0; x < _width; x++) {
				var _newind = newind + i, _mapind = oldind + i;
				data = (
					_ripplemap[_mapind - _width] +
					_ripplemap[_mapind + _width] +
					_ripplemap[_mapind - 1] +
					_ripplemap[_mapind + 1]) >> 1;

				data -= _ripplemap[_newind];
				data -= data >> 6;

				_ripplemap[_newind] = data;

				//where data=0 then still, where data>0 then wave
				data = 1024 - data;

				old_data = _last_map[i];
				_last_map[i] = data;

				if (old_data != data) {
					//offsets
					a = (((x - _half_width) * data / 1024) << 0) + _half_width;
					b = (((y - _half_height) * data / 1024) << 0) + _half_height;

					//bounds check
					if (a >= _width) a = _width - 1;
					if (a < 0) a = 0;
					if (b >= _height) b = _height - 1;
					if (b < 0) b = 0;

					new_pixel = (a + (b * _width)) * 4;
					cur_pixel = i * 4;

					_rd[cur_pixel] = _td[new_pixel];
					_rd[cur_pixel + 1] = _td[new_pixel + 1];
					_rd[cur_pixel + 2] = _td[new_pixel + 2];
				}

				++i;
			}
		}
	}

	canvas.onmousemove = function(/* Event */ evt) {
		disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
	};

	canvas.onclick = function(/* Event */ evt) {
		disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
	};

	setInterval(run, delay);

	// generate random ripples
    var rnd = Math.random;
    setInterval(function() {
        disturb(rnd() * width, rnd() * height);
    }, 100);

};
