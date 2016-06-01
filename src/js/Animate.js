

(function(){

let tween = {
	linear(t, b, c, d) {
		return c * t / d + b;
	},

	easeIn(t, b, c, d) {
		return c * ( t /= d ) * t + b;
	}
};

let getDefaultView = (dom, p) => {
	return parseFloat(document.defaultView.getComputedStyle(dom)[p]);
};

let getStartPos = function(dom, prop) {

	if (getStartPos.reslut) {
		return getStartPos.reslut[prop];
	}

	return (function () {
	
		let top = 0,
				left = 0,
				wid = dom.offsetWidth,
				height = dom.offsetHeight;

		while (dom !== document.body && getDefaultView(dom, 'position') !== 'static') {
			top += dom.offsetTop;
			left += dom.offsetLeft;
			dom = dom.parentNode;
		}

		let Wid = dom.clientWidth,
				Height = dom.clientHeight,
				rest = {
					left,
					top,
					bottom: Height - top - height,
					right: Wid - left - wid
				};

		getStartPos.reslut = rest;

		return rest[prop];
	})();
};

let getStartV = {
	left: getStartPos,
	right: getStartPos,
	top: getStartPos,
	bottom: getStartPos,
	addProp(prop, fn) {
		this[prop] = fn;
	}
};

let parseStr = (str) => {
	str = String(str);

	let 
	reslut = {},
	number = str.match(/\d+/),
	string = str.match(/[a-zA-Z]+/);

	reslut.number = number && parseInt(number.join(''));
	reslut.string = string && string.join('');
	return reslut;
};

class Animate {
	constructor(dom) {
		this.dom = dom;
		this.startTime = 0;
		this.easing = null;
		this.duration = null;
		this.formation = [];
		this.actions = [];
	}

	next() {
		let parms = this.formation.shift();

		if (parms) {
			this.start(parms);
		}
	}

	add(action = {}, duration, easing = 'linear', cb) {
		this.formation.push({action, duration, easing, cb});

		if (!this.moving) {
			this.next();
		}
	}

	start(parms) {
		let action = parms.action;

		this.startTime = +new Date;
		this.actions = [];
		for (let p in action) {
			let startPos,
					target = parseStr(action[p]);

			if (getStartV[p]) {
				startPos = getStartV[p](this.dom, p);
			} else {
				startPos = getDefaultView(this.dom, p);
			}

			this.actions.push({
				'propertName': p,
				'endPos': target.number,
				'startPos': startPos,
				'unit': target.string
			});
		}

		this.duration = parms.duration;
		this.easing = tween[parms.easing];
		this.moving = true;

		let move = () => {
			if (this.step() === false) {
				this.moving = false;
				parms.cb && parms.cb();
				this.next();
				return 
			}

			requestAnimationFrame(move);
		};

		requestAnimationFrame(move);
	}

	step() {
		let t = +new Date;

		if (t >= this.startTime + this.duration) {

			this.actions.forEach( (item) => {
				this.update(item.propertName, item.endPos, item.unit);
			});
			return false;
		}

		this.actions.forEach( (item) => {
			let pos = this.easing(t - this.startTime, item.startPos, item.endPos - item.startPos, this.duration);

			this.update(item.propertName, pos, item.unit);
		});

	}

	update(propertName, pos, unit) {
		this.dom.style[propertName] = pos + unit;
	}
};

try {
	module.exports =  {Animate};
} catch (e) {
	window.Animate = Animate;
}

})();