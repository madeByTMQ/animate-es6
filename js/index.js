webpackJsonp([0,1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _Animate = __webpack_require__(1);

	var wAnimate = new _Animate.Animate(document.getElementById('testW'));

	wAnimate.add({ 'width': 600, 'height': 600, 'top': 80 }, 1000, 'linear', function () {
		console.log('animate done!');
	});
	wAnimate.add({ 'height': 100, 'left': 200, 'opacity': 0 }, 2000, 'easeIn');

	__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"css/style.scss\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var tween = {
		linear: function linear(t, b, c, d) {
			return c * t / d + b;
		},
		easeIn: function easeIn(t, b, c, d) {
			return c * (t /= d) * t + b;
		}
	};

	var getDefaultView = function getDefaultView(dom, p) {
		return parseFloat(document.defaultView.getComputedStyle(dom)[p]);
	};

	var getStartPos = function getStartPos(dom, prop) {

		if (getStartPos.reslut) {
			return getStartPos.reslut[prop];
		}

		return function () {

			var top = 0,
			    left = 0,
			    wid = dom.offsetWidth,
			    height = dom.offsetHeight;

			while (dom !== document.body && getDefaultView(dom, 'position') !== 'static') {
				top += dom.offsetTop;
				left += dom.offsetLeft;
				dom = dom.parentNode;
			}

			var Wid = dom.clientWidth,
			    Height = dom.clientHeight,
			    rest = {
				left: left,
				top: top,
				bottom: Height - top - height,
				right: Wid - left - wid
			};

			getStartPos.reslut = rest;

			return rest[prop];
		}();
	};

	var getStartV = {
		left: getStartPos,
		right: getStartPos,
		top: getStartPos,
		bottom: getStartPos,
		addProp: function addProp(prop, fn) {
			console.log(this);
		}
	};

	var Animate = function () {
		function Animate(dom) {
			_classCallCheck(this, Animate);

			this.dom = dom;
			this.startTime = 0;
			this.unit = 'px';
			this.easing = null;
			this.duration = null;
			this.formation = [];
			this.actions = [];
		}

		_createClass(Animate, [{
			key: 'next',
			value: function next() {
				var parms = this.formation.shift();

				if (parms) {
					this.start(parms);
				}
			}
		}, {
			key: 'add',
			value: function add() {
				var action = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
				var duration = arguments[1];
				var easing = arguments.length <= 2 || arguments[2] === undefined ? 'linear' : arguments[2];
				var cb = arguments[3];

				this.formation.push({ action: action, duration: duration, easing: easing, cb: cb });

				if (!this.moving) {
					this.next();
				}
			}
		}, {
			key: 'start',
			value: function start(parms) {
				var _this = this;

				var action = parms.action;

				this.startTime = +new Date();
				this.actions = [];
				for (var p in action) {
					var startPos = void 0;

					if (getStartV[p]) {
						startPos = getStartV[p](this.dom, p);
					} else {
						startPos = getDefaultView(this.dom, p);
					}

					this.actions.push({
						'propertName': p,
						'endPos': action[p],
						'startPos': startPos
					});
				}

				this.duration = parms.duration;
				this.easing = tween[parms.easing];
				this.moving = true;

				var move = function move() {
					if (_this.step() === false) {
						_this.moving = false;
						parms.cb && parms.cb();
						_this.next();
						return;
					}

					requestAnimationFrame(move);
				};

				requestAnimationFrame(move);
			}
		}, {
			key: 'step',
			value: function step() {
				var _this2 = this;

				var t = +new Date();

				if (t >= this.startTime + this.duration) {

					this.actions.forEach(function (item) {
						_this2.update(item.propertName, item.endPos);
					});
					return false;
				}

				this.actions.forEach(function (item) {
					var pos = _this2.easing(t - _this2.startTime, item.startPos, item.endPos - item.startPos, _this2.duration);

					_this2.update(item.propertName, pos);
				});
			}
		}, {
			key: 'update',
			value: function update(propertName, pos) {
				this.dom.style[propertName] = pos + this.unit;
			}
		}]);

		return Animate;
	}();

	;

	exports.Animate = Animate;

/***/ }
]);