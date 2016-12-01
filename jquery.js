(function(global) {
	var init,
		document = global.document;

	var jQuery = function(selector) {
		return new jQuery.fn.init(selector);
	};

	jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		length: 0,
		get: function(index) {
			index = index - 0;
			index = index < 0 ? index + this.length : index;
			return this[index];
		},
		eq: function(index) {
			return jQuery(this.get(index));
		},
		first: function() {
			return this.eq(0);
		},
		last: function() {
			return this.eq(-1);
		}
	};
	init = jQuery.fn.init = function(selector) {
		// handle: null undefined '' false
		if (!selector) return this;
		// handle: string
		else if (jQuery.isString(selector)) {
			// handle: html string '<p>123</p>'
			if (jQuery.isHTML(selector)) {
				//  以伪数组对象形式存储 dom元素
				Array.prototype.push.apply(this, jQuery.parseHTML(selector));
			}
			// handle: selector
			else {
				// 根据选择器获取dom元素
				var nodelist = document.querySelectorAll(selector);
				// 将结果伪数组对象 变成 真数组
				// var ret = Array.prototype.slice.call(nodelist);
				// 借调数组对象的slice方法将数组中的所有元素 以伪数组形式存储在this上
				Array.prototype.push.apply(this, nodelist);
			}
		}
		// handle: dom node
		else if (jQuery.isDOM(selector)) {
			this[0] = selector;
			this.length = 1;
		}
		// handle: dom array(伪数组对象)
		else if (jQuery.isArrayLike(selector)) {
			Array.prototype.push.apply(this, selector);
		}
		// handle: function
		else if (jQuery.isFunction(selector)) {
			if (jQuery.isReady) {
				selector();
			} else {
				if (document.addEventListener) {
					document.addEventListener('DOMContentLoaded', function() {
						selector();
						jQuery.isReady = true;
					});
				} else {
					document.attachEvent('onreadystatechange', function() {
						if (document.readyState === 'complete') {
							selector();
							jQuery.isReady = true;
						}
					});
				}
			}
		}
	};
	init.prototype = jQuery.fn;

	jQuery.extend = jQuery.fn.extend = function(source, target) {
		var k;

		target = target || this;

		for (k in source) {
			target[k] = source[k];
		}
	};

	// 添加工具类方法
	jQuery.extend({
		isReady: false,
		parseHTML: function(html) {
			var div = document.createElement('div'),
				ret = [];
			div.innerHTML = html;

			for (var elem = div.firstChild; elem; elem = elem.nextSibling) {
				if (elem.nodeType === 1) ret.push(elem);
			}

			return ret;
		},
		each: function(obj, callback) {
			var i = 0,
				l = obj.length;
			// 遍历数组元素
			for (; i < l; i++) {
				// 执行用户指定回调函数
				// 将当前遍历到的元素以及索引传入回调函数
				if (callback.call(obj[i], obj[i], i) === false) break;
			}
		}
	});
	// 类型判断方法
	jQuery.extend({
		// 判断是否为字符串类型
		isString: function(obj) {
			// 如果为null或undefined，返回false
			// 如果typeof值为string，返回true否则返回false。
			return typeof obj === 'string';
		},
		isHTML: function(obj) {
			return !!obj && obj.charAt(0) === '<' &&
				obj.charAt(obj.length - 1) === '>' &&
				obj.length >= 3;
		},
		isDOM: function(obj) {
			return !!obj && !!obj.nodeType;
		},
		isFunction: function(obj) {
			return typeof obj === 'function';
		},
		isGlobal: function(obj) {
			return !!obj && obj.window === obj;
		},
		isArrayLike: function(obj) { // {length: 0} {2:p,length: 3}
			var _type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase(),
				length = !!obj && 'length' in obj && obj.length;
			// 过滤 window对象和函数对象
			if (jQuery.isFunction(obj) || jQuery.isGlobal(obj)) return false;
			return _type === 'array' || length === 0 ||
				typeof length === 'number' && length > 0 && (length - 1) in obj;
		}
	});

	// css样式模块
	jQuery.fn.extend({
		// 提供给jQuery对象调用的
		// 遍历this
		each: function(callback) {
			jQuery.each(this, callback);
			// 实现链式编程
			// 返回方法的调用者
			return this;
		}
	});
	jQuery.fn.extend({
		hasClass: function(className) {
			// 默认结果false
			var ret = false;
			this.each(function(v) {
				if ((' ' + v.className + ' ')
					.indexOf(' ' + className + ' ') !== -1) {
					ret = true;
					return false;
				}
			});

			return ret;
		},
		css: function(name, value) {
			// 只传入一个参数
			if (value == undefined) {
				// 如果name类型为对象，同时设置多个样式
				if (typeof name === 'object') {
					// 遍历this上的每一个dom元素
					this.each(function(v) {
						// 枚举name上的每个属性值
						for (var k in name) {
							// 给当前遍历到的dom元素设置样式
							v.style[k] = name[k];
						}
					});
				} else { // 如果name不为对象
					if (!this[0]) return null;
					return global.getComputedStyle ?
						global.getComputedStyle(this[0])[name] :
						this[0].currentStyle[name];

				}
			} else { // 如果传入两个参数
				this.each(function(v) {
					v.style[name] = value;
				});
			}
			// 实现链式编程
			return this;
		},
		addClass: function(className) {
			// 遍历this上的每一个dom元素，并实现链式编程
			return this.each(function(v) {
				// 判断当前dom元素v是否具有className
				// 如果不具有，给其添加指定的样式类
				if (!jQuery(v).hasClass(className)) {
					v.className += ' ' + className;
				}
			});
		},
		removeClass: function(className) {
			// 遍历this上的每一个dom元素，并实现链式编程
			return this.each(function(v) {
				// 删除当前dom元素的样式类className
				v.className = (' ' + v.className + ' ').
				replace(' ' + className + ' ', ' ');
			});
		}
	});

	// 属性模块
	jQuery.propFix = {
		'for': 'htmlFor',
		'class': 'className'
	};
	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[this.toLowerCase()] = this;
	});
	console.log(jQuery.propFix);
	jQuery.fn.extend({
		attr: function(name, value) {
			// 只传入一个参数
			if (value == undefined) {
				// 如果类型为 对象，表示设置多个属性
				if (typeof name === 'object') {
					// 遍历jQuery上的每一个dom元素，并设置属性节点值
					this.each(function(v) {
						// 枚举name对象上每一个属性
						for (var k in name) {
							v.setAttribute(k, name[k]);
						}
					});
				} else { // 如果类型为 字符串，获取属性节点值
					if (!this[0]) return null;
					return this[0].getAttribute(name);
				}
			} else { // 传入两个参数，表示设置单个属性节点值
				this.each(function(v) {
					v.setAttribute(name, value);
				});
			}
			// 实现链式编程
			return this;
		},
		html: function(html) {
			// 如果没有给html传入值，表示获取
			if (html == undefined) {
				// 如果jQuery对象没有任何dom元素，就返回一个期望值 即空字符串
				// 如果有的话，就返回第一个dom元素的innerHTML属性值
				return this[0] ? this[0].innerHTML : '';
			} else { // 如果给html传值。给jQuery对象上每一个dom元素设置innerHTML属性
				return this.each(function(v) {
					v.innerHTML = html;
				});
			}
		},
		text: function(text) {
			// 如果没有传值，表示获取文本值
			if (text == undefined) {
				// 定义结果变量，存储每个dom元素的文本
				var ret = '';
				// 遍历每一个dom元素
				this.each(function(v) {
					// 如果支持textContent，使用其获取文本，累加到ret上
					ret += 'textContent' in document ?
						v.textContent :
						v.innerText.replace(/\r\n/g, '');
				});
				// 返回所有文本
				return ret;
			} else { // 如果传值了，表示为每个dom设置文本
				return this.each(function(v) {
					// 如果支持textContent，就使用该属性为当前dom元素设置文本节点值
					// 否则，使用innerText设置文本节点值。
					if ('textContent' in document) {
						v.textContent = text;
					} else {
						v.innerText = text;
					}
				});
			}
		},
		val: function(value) {
			// 如果没有传值，表示获取第一个dom元素的value属性值
			// 如果jQuery对象上没有任何dom元素，返回空字符串
			if (value == undefined) {
				return this[0] ? this[0].value : '';
			} else { // 否则，为每一个dom元素设置value属性值
				return this.each(function() {
					this.value = value;
				});
			}
		},
		prop: function(name, value) {
			// 如果没有给value传值
			var prop;
			if (value == undefined) {
				// 并且name的类型为 对象，表示给每一个dom对象添加多个属性
				if (typeof name === 'object') {
					this.each(function() {
						for (var k in name) {
							// 首先从propFix对象上获取属性名字
							// 如果有，就使用新的属性名字
							// 如果没有，就使用原来的属性名字
							prop = jQuery.propFix[k] ? jQuery.propFix[k] : k;
							this[prop] = name[k];
						}
					});
				} else { // 如果name的类型 为字符串，表示获取第一个dom对象的指定属性值
					prop = jQuery.propFix[name] ? jQuery.propFix[name] : name;
					return this.length > 0 ? this[0][prop] : null;
				}
			} else { // 如果传入两个参数，表示给每一个dom对象添加单个属性
				// 遍历jQuery上的每一个dom对象，添加属性
				prop = jQuery.propFix[name] ? jQuery.propFix[name] : name;
				this.each(function() {
					this[prop] = value;
				});
			}
			// 实现链式编程
			return this;
		}
	});

	// dom操作模块
	jQuery.extend({
		unique: function(arr) {
			// 存储去重后的结果
			var ret = [];
			// 遍历原数组arr
			jQuery.each(arr, function() {
				// 判断ret是否存在当前遍历到的元素
				// 如果不存在将其添加到ret中
				if (ret.indexOf(this) === -1) ret.push(this);
			});
			// 将ret返回
			return ret;
		}
	});
	jQuery.fn.extend({
		appendTo: function(target) {
			var node,
				ret = [];
			// 统一target类型 为jQuery对象（为了方便操作）
			target = jQuery(target);
			// 遍历this上的每一个dom元素
			this.each(function(v) {
				// 在遍历目标dom元素
				target.each(function(t, i) {
					// 如果当前dom元素为 目标上的第一个.不拷贝节点
					// 否则拷贝节点
					node = i === 0 ? v : v.cloneNode(true);
					// 将被追加的节点,添加到ret内
					ret.push(node);
					// 将节点追加到指定的目标dom元素上.
					t.appendChild(node);
				});
			});
			// 将每一个添加的dom元素,转换成jQuery对象返回,实现链式编程
			// 原因:在添加样式时,如果不这样做的话,只会给没克隆的节点添加样式.
			return jQuery(ret);
		},
		append: function(source) {
			source = jQuery(source);
			source.appendTo(this);
			return this;
		},
		prependTo: function(target) {
			var node,
				firstChild,
				self = this,
				ret = [];

			target = jQuery(target);
			// 遍历target上的每一个目标dom元素
			target.each(function(elem, i) {
				// 缓存当前目标dom元素的第一个子节点
				firstChild = elem.firstChild;
				// 在遍历this上的每一个dom元素
				self.each(function(dom) {
					// 判断是否目标上第一个dom元素
					// 如果是，不需要克隆节点
					// 否则需要深克节点
					// 将得到的节点赋值给node
					node = i === 0 ? dom : dom.cloneNode(true);
					// 将上面得到的节点添加到ret中
					ret.push(node);
					// 使用insertBefor给当前目标元素，在firstChild添加node节点
					elem.insertBefore(node, firstChild);
				});
			});

			return jQuery(ret);
		},
		prepend: function(source) {
			source = jQuery(source);
			source.prependTo(this);
			return this;
		},
		next: function() {
			// 存储所用dom的下一个兄弟元素
			var ret = [];
			// 遍历this上的所有dom元素
			this.each(function() {
				// 在遍历当前dom元素下面所有的兄弟元素
				for (var node = this.nextSibling; node; node = node.nextSibling) {
					// 如果当前兄弟节点,为元素节点
					// 即为结果,将其添加ret内,并结束循环
					if (node.nodeType === 1) {
						ret.push(node);
						break;
					}
				}
			});
			// 将ret转换成jQuery对象,返回
			return jQuery(ret);
		},
		nextAll: function() {
			var ret = [],
				node;
			this.each(function() {
				for (node = this.nextSibling; node; node = node.nextSibling) {
					if (node.nodeType === 1) ret.push(node);
				}
			});

			return jQuery(jQuery.unique(ret));
		},
		before: function(source) {
			var node;
			source = jQuery(source);
			this.each(function(dom, i) {
				source.each(function(elem) {
					node = i === 0 ? elem : elem.cloneNode(true);
					// 获取dom的父节点，调用insertBefore方法在dom前添加新的子节点node
					dom.parentNode.insertBefore(node, dom);
				});
			});
			return this;
		},
		after: function(source) {
			var node,
				nextSibling;
			source = jQuery(source);
			this.each(function(dom, i) {
				nextSibling = dom.nextSibling;
				source.each(function(elem) {
					node = i === 0 ? elem : elem.cloneNode(true);
					// 获取dom的父节点，调用insertBefore方法在dom前添加新的子节点node
					dom.parentNode.insertBefore(node, nextSibling);
				});
			});
			return this;
		},
		remove: function() {
			return this.each(function() {
				this.parentNode.removeChild(this);
			});
		},
		prev: function() {
			var ret = [],
				node;

			this.each(function() {
				for (node = this.previousSibling; node; node = node.previousSibling) {
					if (node.nodeType === 1) {
						ret.push(node);
						break;
					}
				}
			});

			return jQuery(ret);
		},
		prevAll: function() {
			var ret = [],
				node;

			this.each(function() {
				for (node = this.previousSibling; node; node = node.previousSibling) {
					if (node.nodeType === 1) {
						ret.push(node);
					}
				}
			});

			return jQuery(jQuery.unique(ret));
		},
		empty: function() {
			return this.each(function() {
				this.innerHTML = '';
			});
		}
	});

	// 兼容数组对象的indexOf方法
	(function() {
		// 如果浏览器不支持indexOf方法
		// 那么就给数组对象的原型添加indexOf方法
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(val) {
				// 遍历this
				for (var i = 0, l = this.length; i < l; i++) {
					// 如果遍历到的当前元素和val相同，返回其索引值
					if (this[i] == val) return i;
				}
				// 表示具有指定val元素，返回 -1 
				return -1;
			};
		}
	}());

	// 提前返回
	var addEvent = function() {
		// 如果符合W3C标准，使用addEvnetListener绑定事件
		if (global.addEventListener) {
			return function(elem, type, callback, useCapture) {
				elem.addEventListener(type, callback, useCapture || false);
			};
		} else { // 否则就使用IE标准的 attachEvent绑定事件
			return function(elem, type, callback) {
				elem.attachEvent('on' + type, callback);
			};
		}
	}();
	var removeEvent = function() {
		if (global.removeEventListener) {
			return function(elem, type, callback) {
				elem.removeEventListener(type, callback);
			};
		} else {
			return function(elem, type, callback) {
				elem.detachEvent('on' + type, callback);
			};
		}
	}();

	// 事件模块
	jQuery.fn.extend({
		on: function(type, callback, capture) {
			return this.each(function() {
				addEvent(this, type, callback, capture);
			});
		},
		off: function(type, callback) {
			return this.each(function() {
				removeEvent(this, type, callback);
			});
		}
	});
	jQuery.each(['click', 'dblclick', 'keypress', 'keyup', 'keydown', 'mouseover', 'mouseout',
		'mouseenter', 'mouseleave', 'mousemove', 'mouseup', 'mousedown'
	], function(type) {
		jQuery.fn[type] = function(callback, capture) {
			return this.on(type, callback, capture);
		};
	});

	// 动画模块
	var easing = {
		linear: function(x, t, b, c, d) {
			return (c - b) * t / d;
		},
		minusspeed: function(x, t, b, c, d) {
			return 2 * (c - b) * t / d - (c - b) * t * t / (d * d);
		},
		easeInQuad: function(x, t, b, c, d) {
			return c * (t /= d) * t + b;
		},
		easeOutQuad: function(x, t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
		},
		easeInOutQuad: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
		},
		easeInCubic: function(x, t, b, c, d) {
			return c * (t /= d) * t * t + b;
		},
		easeOutCubic: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
		},
		easeInOutCubic: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
		},
		easeInQuart: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
		},
		easeOutQuart: function(x, t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
		},
		easeInOutQuart: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
		},
		easeInQuint: function(x, t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
		},
		easeOutQuint: function(x, t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
		},
		easeInOutQuint: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
		},
		easeInSine: function(x, t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
		},
		easeOutSine: function(x, t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
		},
		easeInOutSine: function(x, t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
		},
		easeInExpo: function(x, t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
		},
		easeOutExpo: function(x, t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
		},
		easeInOutExpo: function(x, t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
		},
		easeInCirc: function(x, t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
		},
		easeOutCirc: function(x, t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
		},
		easeInOutCirc: function(x, t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
		},
		easeInElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		},
		easeOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		},
		easeInOutElastic: function(x, t, b, c, d) {
			var s = 1.70158;
			var p = 0;
			var a = c;
			if (t == 0) return b;
			if ((t /= d / 2) == 2) return b + c;
			if (!p) p = d * (.3 * 1.5);
			if (a < Math.abs(c)) {
				a = c;
				var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
		},
		easeInBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
		},
		easeOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
		},
		easeInOutBack: function(x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
		},
		easeOutBounce: function(x, t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
				return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if (t < (2.5 / 2.75)) {
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
		}
	};
	// 获取所有动画属性的起始值
	var kv = {
		'left': 'offsetLeft',
		'top': 'offsetTop',
		'width': 'offsetWidth',
		'height': 'offsetHeight'
	};

	function getLocation(elem, target) {
		var obj = {};
		for (var k in target) {
			obj[k] = elem[kv[k]];
		}
		return obj;
	}

	function getDistance(location, target) {
		var obj = {};
		for (var k in target) {
			obj[k] = parseFloat(target[k]) - location[k];
		}
		return obj;
	}

	function getTween(time, location, target, duration, easingName) {
		var obj = {};
		for (var k in target) {
			obj[k] = easing[easingName](null, time, location[k], target[k], duration);
		}

		return obj;
	}

	function setStyles(elem, location, tween) {
		var k;
		for (k in location) {
			elem.style[k] = location[k] + tween[k] + 'px';
		}
	}
	var animate = function(elem, target, duration, easingName) {
		var timer, // 定时器id
			tween, // 单位时间间隔的位移{left: 800, top:400}
			location, // 起始位置{left: 8,top: 8}
			distance, // 动画总距离{left: 992, top: 792}
			startTime, // 动画开始时间
			currentTime, // 动画当前时间
			time; // 当前动画经过总时间间隔

		location = getLocation(elem, target);
		distance = getDistance(location, target);
		startTime = +new Date; // 转换毫秒值
		// 用来计算动画当前位移，并制定动画元素的位置
		var render = function() {
			currentTime = +new Date;
			time = currentTime - startTime;
			// 如果当前动画经过总时间间隔大于或等于 指定总时间
			// 停止动画,并设置动画元素到达终点
			if (time >= duration) {
				// console.log(time);
				// 1 设置动画元素到达终点
				tween = distance;
				// 2 停止动画，即清楚定时器
				global.clearInterval(timer);
				// 3 删除动画元素的timerId属性
				delete elem.timerId;
			} else { // 否则, 根据匀减速运动公式来求time时间间隔内的位移
				// 指定动画元素的位置
				// 注意： 要加上 起始位置
				tween = getTween(time, location, target, duration, easingName);
			}
			// 设置动画属性值
			setStyles(elem, location, tween);
		};
		// 启动定时器 开始动画
		timer = global.setInterval(render, 1000 / 60);
		// 把定时器id存储在动画元素上（以自定义属性）
		elem.timerId = timer;
	};

	jQuery.fn.extend({
		animate: function(target, duration, easingName) {
			easingName = easingName || 'linear';
			return this.each(function() {
				if (!('timerId' in this)) {
					animate(this, target, duration, easingName);
				}
			});
		},
		stop: function() {
			return this.each(function() {
				if ('timerId' in this) {
					global.clearInterval(this.timerId);
					delete this.timerId;
				}
			});
		}
	});

	// Ajax模块
	jQuery.extend({
		ajaxSetting: {
			url: '',
			type: 'GET',
			dataType: 'text',
			contentType: 'application/x-www-form-urlencoded',
			jsonp: 'callback',
			jsonpCallback: '',
			data: null,
			async: true,
			success: null,
			fail: null,
			timeout: 0
		},
		ajax: function(config) {
			// 过滤无效参数
			if (!config || !config.url) {
				console.warn('参数异常');
				return;
			}

			if (config.dataType.toLowerCase() === 'jsonp') {
				jsonp(config);
			} else {
				ajax(config);
			}
		}
	});

	function jsonp(config) {
		var scriptElem,
			headElem,
			context = {},
			callbackName;
		// 过滤无效参数
		if (!config || !config.url) {
			console.warn('参数异常');
			return;
		}

		jQuery.extend(jQuery.ajaxSetting, context);
		jQuery.extend(config, context);

		// 1: 创建请求对象
		scriptElem = document.createElement('script');

		// 2: 将上述创建的script标签添加到页面的head标签下
		headElem = document.getElementsByTagName('head')[0];
		headElem.appendChild(scriptElem);

		// 3: 格式化数据
		context.url += '?' + formatData(context.data);

		// 4: 创建全局回调函数名字
		callbackName = context.jsonpCallback ? context.jsonpCallback :
			'jsonp_' + (+new Date);

		// 把全局回调函数名字 发送给服务器
		context.url += '&' + context.jsonp + '=' + callbackName;

		window[callbackName] = function(data) {
			// 请求成功。
			// 杀驴
			// 删除动态创建的script标签
			headElem.removeChild(scriptElem);
			// 删除全局回调函数
			delete window[callbackName];
			// 清除超时的延迟函数
			window.clearTimeout(scriptElem.timer);

			// 执行用户指定的成功回调函数
			context.success && context.success(data, context, xhr);
		};
		// 5: 设置超时时间
		if (context.timeout) {
			scriptElem.timer = window.setTimeout(function() {
				// 请求失败。
				// 杀驴
				// 删除动态创建的script标签
				headElem.removeChild(scriptElem);
				// 删除全局回调函数
				delete window[callbackName];

				// 执行用户指定的失败回调函数
				context.fail && context.fail({
					"message": "请求超时"
				});
			}, context.timeout);
		}

		// 6：发送请求
		console.log(context.url);
		scriptElem.src = context.url;
	}

	function createRequest() {
		return window.XMLHttpRequest ? new window.XMLHttpRequest() :
			new ActiveXObject('Microsoft.XMLHTTP');
	}

	function formatData(data) {
		var ret = [];
		for (var k in data) {
			ret.push(window.encodeURIComponent(k) + '=' + window.encodeURIComponent(data[k]));
		}
		// 如果不想从服务器缓存中读取数据
		ret.push(('_=' + Math.random()).replace('.', ''));
		return ret.join('&');
	}

	function ajax(config) {
		var context = {},
			xhr,
			postData = '';
		// 过滤无效参数
		if (!config || !config.url) {
			console.warn("参数异常");
			return;
		}
		// debugger;
		// 获取默认配置信息
		jQuery.extend(jQuery.ajaxSetting, context);
		// 用户的配置覆盖默认配置
		jQuery.extend(config, context);
		// 1: 创建请求对象
		xhr = createRequest();
		// 2：格式化数据
		if (context.data) {
			postData = formatData(context.data);
		}
		// 3：与服务器建立连接
		if (context.type.toUpperCase() === 'GET') {
			xhr.open('GET', context.url + '?' + postData, context.async);
			postData = null;
		} else {
			// 模拟表单提交，设置请求头信息
			xhr.setRequestHeader('Content-Type', context.contentType);
			xhr.open('POST', context.url, context.async);
		}

		// 4：监听请求状态
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
					// 获取到请求回来的数据
					var text = xhr.responseText;
					// 如果指定的数据格式为 json，那就将其转换为json对象
					text = context.dataType.toLowerCase() === 'json' ?
						JSON.parse(text) : text;

					context.success && context.success(text);
				} else {
					context.fail && context.fail({
						"errorCode": xhr.status,
						"message": "请求超时."
					});
				}
			}
		};
		// 5: 发送请求
		xhr.send(postData);
	}

	global.$ = global.jQuery = jQuery;
}(window));