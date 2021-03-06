/**
 * @fileoverview QZFL 主框架逻辑，<br/>QZFL 最后的 L 有两个意思，其中一个意思是 Library 功能库，说明这是一个前台的框架库; 同时 L 也是 Liberation 解放的意思，这是希望通过 QZFL 能把大家在JS开发工作中解放出来。
 * @version 1.$Rev: 1478 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-28 20:22:49 +0800 (星期五, 28 八月 2009) $
 */

if (typeof(QZFL) == "undefined" || !QZFL) {
	/**
	 * QZFL全局对象
	 * 
	 * @namespace QZFL 全局对象。 QZFL 是由空间平台开发组，开发的一套js框架库。 Qzone Front-end Library:
	 *            Liberation
	 * @type {Object}
	 */
	var QZFL;

	/**
	 * QZFL 2.0 的选择器缩写。
	 * 
	 * @example
	 *  $e("div")
	 * @see QZFL.element.get
	 * @return QZFL.ElementHandler
	 */
	var $e;

	if (typeof(QZONE) == "object") {
		QZFL = QZONE;
	} else {
		window.QZONE = QZFL = {};
	}

	QZFL.version = "2.0.5.4";
	QZFL._qzfl = true;
}

/**
 * 定义一个通用空函数
 */
QZFL.emptyFn = function() {
};

/**
 * 客户浏览器类型判断
 * 
 * @namespace QZFL 浏览器判断引擎，给程序提供浏览器判断的接口
 */
QZFL.userAgent = (function() {
	var t, vie, vff, vopera, vsf, vawk, wintype, winver, mactype, vair, vchrome, isBeta = false, // in
	// test
	// scorr
	// added
	discerned = false, _ua = navigator.userAgent, mainRE = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel|Minefield).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/, osRE = /(Windows.*?;)|(Mac OS X.*?;)/, winRE = /Windows.+?(\d+\.\d+)/, airRE = /AdobeAIR/, chromeRE = /Chrome.(\d+\.\d+)/, safariRE = /Version\/(\d+(?:\.\d+)?)/,

	agent = mainRE.exec(_ua), os = osRE.exec(_ua);

	if (agent) {
		vie = agent[1] ? parseFloat(agent[1], 10) : NaN;
		vff = agent[2] ? parseFloat(agent[2], 10) : NaN;
		vopera = agent[3] ? parseFloat(agent[3], 10) : NaN;
		vawk = agent[4] ? parseFloat(agent[4], 10) : NaN;
		vair = vsf = vchrome = NaN;

		// webkit 判断逻辑
		if (vawk) {
			if (t = airRE.exec(_ua)) {
				vair = 1;
			} else if (t = safariRE.exec(_ua)) {
				if (t.length > 1) {
					vsf = parseFloat(t[1], 10);
				} else {
					vsf = 1.0;
				}
			} else if (t = chromeRE.exec(_ua)) {
				if (t.length > 1) {
					vchrome = parseFloat(t[1], 10);
				} else {
					vchrome = 1.0;
				}
			}
		}

	} else {
		/**
		 * 根据userAgent判断浏览器类型失败，使用浏览器特性进行版本判断 以后需要根据浏览器版本更新进行特别维护
		 * 
		 * @ignore
		 */
		vie = vff = vopera = vsf = vawk = vair = vchrome = NaN;
		/**
		 * 判断是否为ie浏览器，忽略ie6以下版本
		 * 
		 * @ignore
		 */
		if (typeof ActiveXObject == "function") {
			vie = (/Trident\/4\.0/i.test(navigator.appVersion)) ? 8 : 8 - (typeof XDomainRequest == "object" ? 0 : 1) - (typeof XMLHttpRequest == "object" ? 0 : 1);
		} else if (/AppleWebKit\/\d+\.\d+/i.test(navigator.appVersion)) {
			vawk = parseFloat(navigator.appVersion.replace(/^[\s\S]*?AppleWebKit.(\d+\.\d+)[\s\S]*$/i, "$1"));
			if (typeof openDatabase == "function") {
				vsf = parseFloat(navigator.appVersion.replace(/^[\s\S]*?Version.(\d+\.\d+)[\s\S]*$/i, "$1"));
			}
			if (typeof MessageEvent == "function") {
				vchrome = parseFloat(navigator.appVersion.replace(/^[\s\S]*?chrome.(\d+\.\d+)[\s\S]*$/i, "$1"));
			}
			if (/AdobeAIR/i.test(navigator.appVersion)) {
				vair = 1;
			}
		} else if (typeof document.getBoxObjectFor == "function") {
			vff = parseFloat(navigator.userAgent.replace(/^[\s\S]*?Firefox\/(\d+\.\d+)[\s\S]*$/i, "$1"));
		} else if (typeof opera == "object") {
			vopera = parseFloat(navigator.appVersion.replace(/^(\d+\.\d+)[\s\S]*$/i, "$1"));
		} else {
			/**
			 * 根据浏览器特型判断失败，取当前普及率最高的浏览器版本
			 * 
			 * @ignore
			 */
			vie = 6;
		}

	}

	if (vie) {// in test
		if (vie > 7 && window.navigator && window.navigator.appMinorVersion && window.navigator.appMinorVersion.toLowerCase().indexOf("beta") > -1) {
			isBeta = true;
		}
	}

	if (os) {
		wintype = !!os[1];
		mactype = !!os[2];

		if (wintype) {
			if (t = winRE.exec(_ua)) {
				if (t.length > 0) {
					winver = parseFloat(t[1], 10);
				}
			}
		}
	} else {
		wintype = mactype = false;
		winver = NaN;
	}

	/**
	 * 调整浏览器行为
	 * 
	 * @ignore
	 */
	function adjustBehaviors() {
		if (!adjustBehaviors.adjusted && vie && vie < 7) {
			try {
				document.execCommand('BackgroundImageCache', false, true);
			} catch (ignored) {}
			adjustBehaviors.adjusted = true;
		}
	}

	return {
		/**
		 * 是否beta中的浏览器
		 * 
		 * @type boolean
		 */
		beta : isBeta,
		/**
		 * 取firefox版本号
		 * 
		 * @type Number
		 */
		firefox : vff,

		/**
		 * 取IE版本号
		 * 
		 * @type Number
		 */
		ie : vie,
		/**
		 * 取opera版本号
		 * 
		 * @type Number
		 */
		opera : vopera,
		/**
		 * 是否是AIR的浏览器
		 * 
		 * @type Number
		 */
		air : vair,
		/**
		 * 取safariAIR总版本号
		 * 
		 * @type Number
		 */
		safari : vsf,
		/**
		 * 取safari友好版本号
		 * 
		 * @deprecated
		 * @type Number
		 * @ignore
		 */
		safariV : vsf,
		/**
		 * 取safari友好版本号
		 * 
		 * @type Number
		 */
		webkit : vawk,
		/**
		 * 取Windows版本
		 * 
		 * @type String
		 */
		windows : winver ? winver : wintype,
		/**
		 * 取Mac版本
		 * 
		 * @type String
		 */
		macs : mactype,
		/**
		 * 取chrome版本
		 * 
		 * @type String
		 */
		chrome : vchrome,
		/**
		 * 微调浏览器行为<br/> 1. 对IE6进行背景缓存优化
		 * 
		 * @static
		 */
		adjustBehaviors : adjustBehaviors
	};
})();

/**
 * object 处理
 * 
 * @namespace QZFL 对Javascript Object的接口封装
 */
QZFL.object = {
	/**
	 * 把命名空间的方法映射到全局。不推荐常使用，避免变量名冲突
	 * 
	 * @param {Object} object 对象
	 * @param {Object} [scope] 目标空间
	 * @param {String} [tf] 只映射指定类型的键
	 *            @example
	 *            QZFL.object.map(QZFL.lang)
	 */
	map : function(object, scope, tf) {
		scope = scope || window;

		QZFL.object.each(object, function(value, key) {
			if (typeof(tf) == "string") {
				if (typeof(value == tf)) {
					scope[key] = value;
				}
			} else {
				scope[key] = value;
			}
		});
	},

	/**
	 * 命名空间功能扩展
	 * 
	 * @param {Object} namespace 需要被扩展的命名空间
	 * @param {Object} extendModule 扩展模块
	 *            @example
	 *            QZFL.object.extend(QZFL.dialog,{fn1:function(){}})
	 */
	extend : function(object, extendModule) {
		var _t = QZFL.object.getType(object);
		if (_t != "object" && _t != "function") {
			return ;
		}
		
		QZFL.object.each(extendModule, function(value, key) {
			object[key] = value;
		});

		//extendModule = null;
	},

	/**
	 * 批量执行对象
	 * 
	 * @param {object} object 对象
	 * @param {function} fn 回调函数
	 * @return {Boolean} 是否执行完成
	 *         @example
	 *         QZFL.object.each([1,2,3],function(){alert(this)})
	 */
	each : function(object, fn) {
		if (typeof object != "object" || typeof fn != "function") {
			return false;
		}

		var i = 0, k, _fn = fn;
		// args = args || [];

		if (Object.prototype.toString.call(object) === "[object Array]") {
			// 如果存在js 1.5 的forEach则直接使用forEach
			if (!!object.forEach) {
				object.forEach(fn);
			} else {
				var len = object.length
				while (i < len) {
					_fn(object[i], i, object);
					++i;
				}
			}
		} else {
			for (k in object) {
				_fn(object[k], k, object);
			}
		}
		return true;
	},

	/**
	 * 获取对象类型
	 * 
	 * @param {object} object
	 * @return {String} 返回对象类型字符串
	 *         @example
	 *         QZFL.object.getType([1,2,3])
	 */
	getType : function(object) {
		var _t;
		return ((_t = typeof(object)) == "object" ? object == null && "null" || Object.prototype.toString.call(object).slice(8, -1) : _t).toLowerCase();
	}
};

/**
 * qzfl 控制台，用于显示调试信息以及进行一些简单的脚本调试等操作
 * 
 * @type Object
 * @namespace QZFL 控制台接口，用来显示程序输出的log信息。
 */
QZFL.console = {
	/**
	 * 在console里显示信息
	 * 
	 * @param {String} msg 信息
	 * @param {Number} type 信息类型, 可以参考 QZFL.console.TYPE <br/> TYPE:{<br/>
	 *            &nbsp;&nbsp;&nbsp; DEBUG:0,<br/> &nbsp;&nbsp;&nbsp; ERROR:1,<br/>
	 *            &nbsp;&nbsp;&nbsp; WARNING:2,<br/> &nbsp;&nbsp;&nbsp; INFO:3,<br/>
	 *            &nbsp;&nbsp;&nbsp; PROFILE:4<br/> }<br/>
	 *            @example
	 *            QZFL.console.print("这里是提示信息",QZFL.console.TYPE.ERROR)
	 */
	print : function(msg, type) {
		if (window.console) {
			console.log((type == 4 ? (new Date() + ":") : "") + msg);
		}
	}
}

/**
 * 数据监控和上报系统
 * 
 * @ignore
 * @type QZFL.report
 */
QZFL.report = {
	/**
	 * 数据分析上报接口
	 * 
	 * @param {string} source 数据来源
	 * @param {number} type 数据返回结果,<br/> <br/>1 加载完成 <br/>2 加载失败 <br/>3 数据异常
	 *            无法解释/截断 <br/>4 速度超时 <br/>5 访问无权限 <br/> 对应的转义符是 %status%
	 * @param {string} url 请求的数据路径
	 * @param {number} time 响应时间
	 * @ignore
	 */
	receive : QZFL.emptyFn,

	/**
	 * 添加监控规则,
	 * 
	 * @param {String} url 需要监控的url
	 * @param {String} reportUrl 出现异常后上报的地址 上报地址有几个变量替换 <br/>%status% 数据状态
	 *            <br/>%percent% 统计百分比 <br/>%url% 监听的url地址,自动encode
	 *            <br/>%fullUrl% 监听的完整的url地址，包括这个地址请求时所带 <br/>%source% js处理来源
	 *            <br/>%time% 请求花掉的时间 <br/>%scale% 比例,通常是指 1:n 其中的 n 就是 %scale%
	 *            <br/>
	 *            @example
	 *            QZFL.report.addRule("http://imgcache.qq.com/data2.js","http://imgcache.qq.com/ok?flag1=3234&flag2=%status%&1=%percent%&flag4=123456");
	 * @ignore
	 */
	addRule : QZFL.emptyFn
};

/**
 * QZFL调试引擎接口
 * @type Object
 * @namespace QZFL 调试引擎接口，为调试提供接入的可能。
 */
QZFL.runTime = {
	isDebugMode: false,
	error:function(){},
	warn:function(){}
}

//初始化一些核心库
QZFL.object.each(["widget", "string", "util"], function(value) {
	QZFL[value] = {};
});

// 兼容 QZFL 1.5 逻辑
QZFL.namespace = QZFL.object;

// 命名空间 QZFL.userAgent 的缩写

/**
 * QZFL UserAgent 接口缩写
 * @type QZFL.userAgent
 * @see QZFL.userAgent
 */
var ua = window.ua || QZFL.userAgent;
/**
 * @fileoverview QZFL全局配置文件
 * @version 1.$Rev: 1455 $
 * @author scorpionxu,QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-18 21:16:59 +0800 (星期二, 18 八月 2009) $
 */

/**
 * 配置表
 * 
 * @namespace QZFL配置，用来存储QZFL一些组件需要的参数
 * @type Object
 */
QZFL.config = {
	/**
	 * 调试等级
	 */
	debugLevel : 0,
	/**
	 * 默认与后台交互的编码
	 * 
	 * @type String
	 * @memberOf QZFL.config
	 */
	defaultDataCharacterSet : "GB2312",

	/**
	 * dataCenter中cookie存储的默认域名
	 * 
	 * @type String
	 * @memberOf QZFL.config
	 */
	DCCookieDomain : "qzone.qq.com",

	/**
	 * 系统默认一级域名
	 * 
	 * @type String
	 * @memberOf QZFL.config
	 */
	domainPrefix : "qq.com",

	/**
	 * XHR proxy的gbencoder dictionary路径(需要复写)
	 * 
	 * @type String
	 * @memberOf QZFL.config
	 */
	gbEncoderPath : "http://imgcache.qq.com/qzone/v5/toolpages/",

	/**
	 * FormSender的helper page(需要复写)
	 * 
	 * @type String
	 * @memberOf QZFL.config
	 */
	FSHelperPage : "http://imgcache.qq.com/qzone/v5/toolpages/fp_gbk.html",

	/**
	 * 默认flash ShareObject地址
	 * @type String
	 * @memberOf QZFL.config
	 */
	defaultShareObject : "http://imgcache.qq.com/qzone/v5/toolpages/getset.swf"
};

/**
 * @fileoverview QZFL样式处理,提供多浏览器兼容的样式表处理
 * @version 1.$Rev: 1455 $
 * @author scorpionxu,QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-18 21:16:59 +0800 (星期二, 18 八月 2009) $
 */
/**
 * 备注: 直接通过样式表id号获取样式 取得样式表的寄主 IE 是 owningElement Safari 是 ownerNode Opera 否
 * ownerNode Firefox 否 ownerNode
 */
/**
 * 样式表处理类
 * 
 * @namespace QZFL css 对象，给浏览器提供基本的样式处理接口
 */
QZFL.css = {
	/**
	 * 收集className的规则
	 * 
	 * @param {string} className 样式名称
	 * @private
	 * @ignore
	 */
	getClassRegEx : function(className) {
		var re = QZFL.css.classNameCache[className];
		if (!re) {
			re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
			QZFL.css.classNameCache[className] = re;
		}
		return re;
	},

	/**
	 * 把16进制的颜色转换成10进制颜色 
	 * @param {String} color 十六进制颜色
	 * @example QZFL.css.convertHexColor("#ff00ff");
	 * @return 返回数组形式的10进制颜色
	 */
	convertHexColor : function(color) {
		color = /^#/.test(color) ? color.substr(1) : color;

		var reColor = new RegExp("\\w{2}", "ig");
		color = color.match(reColor);

		if (!color || color.length < 3) {
			return [0, 0, 0]
		}

		var r = parseInt(color[0], 16);
		var g = parseInt(color[1], 16);
		var b = parseInt(color[2], 16);
		return [r, g, b];
	},

	/**
	 * 缓存当前页面的样式表,备用
	 * 
	 * @ignore
	 */
	styleSheets : {},

	/**
	 * 通过id号获取样式表
	 * @param {string|number} id 样式表的编号
	 * @example QZFL.css.getStyleSheetById("div_id");
	 * @return 返回样式表
	 */
	getStyleSheetById : function(id) {
		try {
			return QZFL.dom.get(id).sheet || document.styleSheets[id];
		} catch (e) {
			return null
		}
	},

	/**
	 * 获取stylesheet的样式规则
	 * @param {string|number} id 样式表的编号
	 * @example QZFL.css.getRulesBySheet("css_id");
	 * @return 返回样式表规则
	 */
	getRulesBySheet : function(sheetId) {
		var ss = QZFL.css.getStyleSheetById(sheetId);
		if (ss) {
			try { //有可能firefox无法获取到 cssRules... 可能出现NS_ERROR_DOM_SECURITY_ERR的错误。如果出错就返回null
				return ss.cssRules || ss.rules;
			}catch(e){return null}
		} else {
			return null
		}
	},

	/**
	 * 根据选择器获得样式规则
	 * @param {string} sheetId id 样式表的编号
	 * @param {string} selector 选择器名称
	 * @example QZFL.css.getRuleBySelector("css_id","#");
	 * @return 返回样式表规则
	 */
	getRuleBySelector : function(sheetId, selector) {
		var _ss = this.getStyleSheetById(sheetId);
		if (!_ss.cacheSelector) {
			_ss.cacheSelector = {}
		};

		if (_ss) {
			var _rs = _ss.cssRules || _ss.rules;
			var re = new RegExp('^' + selector + '$', "i");
			var _cs = _ss.cacheSelector[selector];
			if (_cs && re.test(_rs[_cs].selectorText)) {
				return _rs[_cs];
			} else {
				for (var i = 0; i < _rs.length; i++) {
					if (re.test(_rs[i].selectorText)) {
						_ss.cacheSelector[selector] = i;
						return _rs[i];
					}
				}
				return null;
			}
		} else {
			return null;
		}
	},

	/**
	 * 插入外链样式表
	 * @param {string} url 外部css地址
	 * @param {string} id link元素id
	 * @example QZFL.css.insertCSSLink("/css/style.css","linkin");
	 * @return 返回样式表对象
	 */
	insertCSSLink : function(url, id){
		var dom = document,
			cssLink=dom.createElement("link");

		if(id){ cssLink.id=id; }
		cssLink.rel="stylesheet";
		cssLink.rev="stylesheet";
		cssLink.type="text/css";
		cssLink.media="screen";
		cssLink.href=url;
		dom.getElementsByTagName("head")[0].appendChild(cssLink);
		return cssLink.sheet||cssLink;
	},

	/**
	 * 插入样式
	 * @param {string} sheetId 样式表的编号
	 * @example QZFL.css.insertStyleSheet("cssid");
	 * @return 返回样式表对象
	 */
	insertStyleSheet : function(sheetId) {
		var ss = document.createElement("style");
		ss.id = sheetId;
		document.getElementsByTagName("head")[0].appendChild(ss);
		return ss.sheet || ss;
	},

	/**
	 * 删除一份样式表，包含内部style和外部css
	 * @param {string|number} id 样式表的编号
	 * @example QZFL.css.removeStyleSheet("styleid");
	 */
	removeStyleSheet : function(id) {
		var _ss = this.getStyleSheetById(id);
		if (_ss) {
			var own = _ss.owningElement || _ss.ownerNode;
			QZFL.dom.removeElement(own);
		}
	},

	/**
	 * 是否有指定的样式类名称
	 * @param {Object} elem 指定的HTML元素
	 * @param {String} cname 指定的类名称
	 * @example QZFL.css.hasClassName($("div_id"),"cname");
	 * @return Boolean
	 */
	hasClassName : function(elem, cname) {
		return (elem && cname) ? new RegExp('\\b' + cname + '\\b').test(elem.className) : false;
	},

	/**
	 * 交换两种样式类名
	 * @param {Object} elements 指定的HTML元素
	 * @param {String} class1 指定的类名称
	 * @param {String} class2 指定的类名称
	 * @example QZFL.css.swapClassName($("div_id"),"classone","classtwo");
	 */
	swapClassName : function(elements, class1, class2) {
		function _swap(el, c1, c2) {
			if (QZFL.css.hasClassName(el, c1)) {
				el.className = el.className.replace(c1, c2);
			} else if (QZFL.css.hasClassName(el, c2)) {
				el.className = el.className.replace(c2, c1);
			}
		}
		if (elements.constructor != Array) {
			elements = [elements];
		}
		for (var i = 0, len = elements.length; i < len; i++) {
			_swap(elements[i], class1, class2);
		}
	},

	/**
	 * 替换两种样式类名
	 * @param {Object} elements 指定的HTML元素
	 * @param {String} sourceClass 指定的类名称
	 * @param {String} targetClass 指定的类名称
	 * @example QZFL.css.replaceClassName($("ele"),"sourceClass","targetClass");
	 */
	replaceClassName : function(elements, sourceClass, targetClass) {
		function _replace(el, c1, c2) {
			if (QZFL.css.hasClassName(el, c1)) {
				el.className = el.className.replace(c1, c2);
			}
		}
		if (elements.constructor != Array) {
			elements = [elements];
		}
		for (var i = 0, len = elements.length; i < len; i++) {
			_replace(elements[i], sourceClass, targetClass);
		}
	},

	/**
	 * 增加一个样式类名
	 * @param {Object} elem 指定的HTML元素
	 * @param {Object} cname 指定的类名称
	 * @example QZFL.css.addClassName($("ele"),"cname");
	 * @return Boolean
	 */
	addClassName : function(elem, cname) {
		if (elem && cname) {
			if (elem.className) {
				if (QZFL.css.hasClassName(elem, cname)) {
					return false;
				} else {
					elem.className += ' ' + cname;
					return true;
				}
			} else {
				elem.className = cname;
				return true;
			}
		} else {
			return false;
		}
	},

	/**
	 * 除去一个样式类名
	 * @param {Object} elem 指定的HTML元素
	 * @param {String} cname 指定的类名称
	 * @example QZFL.css.removeClassName($("ele"),"cname");
	 * @return Boolean
	 */
	removeClassName : function(elem, cname) {
		if (elem && cname && elem.className) {
			var old = elem.className;
			elem.className = (elem.className.replace(new RegExp('\\b' + cname + '\\b'), ''));
			return elem.className != old;
		} else {
			return false;
		}
	},

	/**
	 * 切换样式类名
	 * @param {Object} elem 指定的HTML元素
	 * @param {Object} cname 指定的类名称
	 * @example QZFL.css.toggleClassName($("ele"),"cname");
	 */
	toggleClassName : function(elem, cname) {
		var r = QZFL.css;
		if (r.hasClassName(elem, cname)) {
			r.removeClassName(elem, cname);
		} else {
			r.addClassName(elem, cname);
		}
	}

}

// 收集样式正则信息
QZFL.css.classNameCache = {};

/**
 * @fileoverview QZFL dom 对象，包含对浏览器dom的一些操作
 * @version 1.$Rev: 1513 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2009-10-10 14:47:08 +0800 (星期六, 10 十月 2009) $
 */

/**
 * dom 对象处理
 * 
 * @namespace QZFL dom 接口封装对象。对浏览器常用的dom对象接口进行浏览器兼容封装
 */
QZFL.dom = {
	/**
	 * 根据id获取dom对象
	 * 
	 * @param {string} id 对象ID号
	 *            @example
	 *            QZFL.dom.getById("div_id");
	 * @return Object
	 */
	getById : function(id) {
		return document.getElementById(id);
	},

	/**
	 * 根据name获取dom集合，有些标签例如li、span无法通过getElementsByName拿到，加上tagName指明就可以 &lt;li
	 * name="n1"&gt;node1&lt;/li&gt;&lt;span name="n1"&gt;node2&lt;/span&gt;
	 * ie只能获取到li，非ie下两者都可以
	 * 
	 * @param {string} name 名称
	 * @param {string} tagName 标签名称,
	 *            @example
	 *            QZFL.dom.getByName("div_name");
	 * @return Array
	 */
	getByName : function(name, tagName) {
		if (!tagName)
			return document.getElementsByName(name);

		var arr = [];
		var e = document.getElementsByTagName(tagName);
		for (var i = 0; i < e.length; ++i) {
			if (!!e[i].getAttribute("name") && (e[i].getAttribute("name").toLowerCase() == name.toLowerCase())) {
				arr.push(e[i]);
			}
		}

		return arr;
	},

	/**
	 * 获得对象
	 * 
	 * @param {String|HTMLElement} e 包括id号，或则Html Element对象
	 *            @example
	 *            QZFL.dom.get("div_id");
	 * @return Object
	 */
	get : function(e) {
		if (e && ((e.tagName || e.item) || e.nodeType == 9)) {
			return e;
		}

		return this.getById(e);
	},

	/**
	 * 获得对象
	 * 
	 * @param {String|HTMLNode} e 包括id号，或则HTML Node对象
	 *            @example
	 *            QZFL.dom.getNode("div_id");
	 * @return Object
	 */
	getNode : function(e) {
		if (e && (e.nodeType || e.item)) {
			return e;
		}
		if (typeof e === 'string') {
			return this.getById(e);
		}
		return null;
	},
	/**
	 * 删除对象
	 * 
	 * @param {String|HTMLElement} el HTML元素的id或者HTML元素
	 *            @example
	 *            QZFL.dom.removeElement("div_id");QZFL.dom.removeElement(QZFL.dom.get("div_id2"))
	 */
	removeElement : function(el) {
		if (typeof(el) == "string") {
			el = QZFL.dom.getById(el);
		}
		if (!el) {
			return;
		}
		if (el.removeNode) {
			el.removeNode(true);
		} else {
			if (el.childNodes.length > 0) {
				for (var ii = el.childNodes.length - 1; ii >= 0; ii--) {
					QZFL.dom.removeElement(el.childNodes[ii]);
				}
			}
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
		}
		el = null;
		return null;
	},

	/**
	 * 通过className来递归查询dom
	 * 
	 * @param {String|HTMLElement} el 对象id或则dom
	 * @param {String} className css类名
	 * @see QZFL.dom.searchElementByClassName
	 * @deprecated 不建议使用了，请使用 {@link QZFl.element} 对象
	 *             @example
	 *             QZFL.dom.searchElementByClassName();
	 */
	searchElementByClassName : function(el, className) {
		el = this.get(el);
		if (!el) {
			return null
		}

		var re = QZFL.css.getClassRegEx(className);
		while (el) {
			if (re.test(el.className)) {
				return el;
			}
			el = el.parentNode;
		}
		return null;
	},
	/**
	 * 通过className来递归子节点查询dom
	 * 
	 * @param {String} className
	 * @param {String} 结果的node tagname，没有就为‘×’，表示所有的节点均满足。
	 * @param {String|HTMLElement} root 对象id，dom。
	 * @deprecated 不建议使用了，请使用 {@link QZFl.element} 对象
	 *             @example
	 *             var nodes=QZFL.dom.getElementsByClassName("css_class_name");
	 * @return Array
	 */
	getElementsByClassName : function(className, tag, root) {
		/**
		 * @default '*'
		 */
		var tag = tag || '*';
		root = (root) ? this.get(root) : null || document;
		if (!root) {
			return [];
		}

		var nodes = [], elements = root.getElementsByTagName(tag), re = QZFL.css.getClassRegEx(className);

		for (var i = 0, len = elements.length; i < len; ++i) {
			if (re.test(elements[i].className)) {
				nodes[nodes.length] = elements[i];
			}
		}
		return nodes;
	},
	/**
	 * 判断指定的节点是否是第二个节点的祖先
	 * 
	 * @param {HTMLElement} node1 对象，父节点
	 * @param {HTMLElement} node2 对象，子孙节点
	 *            @example
	 *            QZFL.dom.isAncestor(QZFL.dom.get("div1"),QZFL.dom.get("div2"))
	 * @return Boolean
	 */
	isAncestor : function(node1, node2) {
		if (!node1 || !node2) {
			return false;
		}
		if (node1.contains && node2.nodeType && !QZFL.userAgent.webkit) {
			return node1.contains(node2) && node1 != node2;// ie
			// 的contains如果元素相等也为true
		} // W3C DOM Level 3
		if (node1.compareDocumentPosition && node2.nodeType) {
			return !!(node1.compareDocumentPosition(node2) & 16);
		} else if (node2.nodeType) {
			return !!this.getAncestorBy(node2, function(el) {
				return el == node1;
			});
		}
		return false;
	},
	/**
	 * 根据函数得到特定的父节点
	 * 
	 * @param {HTMLElement} node 对象
	 * @param {String} method 创建对象的TagName
	 *            @example
	 *            var node=QZFL.dom.getAncestorBy($("div_id"),"div");
	 * @return Object
	 */
	getAncestorBy : function(node, method) {
		while (node = node.parentNode) {
			if (node && node.nodeType == 1 && (!method || method(node))) {
				return node;
			}
		}
		return null;
	},
	/**
	 * 得到第一个子节点（element），firefox会得到到文本节点等。这里统一得到element。
	 * 
	 * @param {HTMLElement} node 对象
	 *            @example
	 *            var element=QZFL.dom.getFirstChild(QZFL.dom.get("el_id"));
	 * @return HTMLElement
	 */
	getFirstChild : function(node) {
		node = this.getNode(node);
		if (!node) {
			return null;
		}
		var child = !!node.firstChild && node.firstChild.nodeType == 1 ? node.firstChild : null;
		return child || this.getNextSibling(node.firstChild);
	},
	/**
	 * 得到下一个兄弟节点（element），firefox会得到到文本节点等。这里统一得到element。
	 * 
	 * @param {HTMLElement} node 对象
	 *            @example
	 *            QZFL.dom.getNextSibling(QZFL.dom.get("el_id"));
	 * @return HTMLElement
	 */
	getNextSibling : function(node) {
		node = this.getNode(node);
		if (!node) {
			return null;
		}
		while (node) {
			node = node.nextSibling;
			if (!!node && node.nodeType == 1) {
				return node;
			}
		}
		return null;
	},
	/**
	 * 得到上一个兄弟节点（element），firefox会得到到文本节点等。这里统一得到element。
	 * 
	 * @param {HTMLElement} node 对象
	 *            @example
	 *            QZFL.dom.getPreviousSibling(QZFL.dom.get("el_id"));
	 * @return HTMLElement
	 */
	getPreviousSibling : function(node) {
		node = this.getNode(node);
		if (!node) {
			return null;
		}
		while (node) {
			node = node.previousSibling;
			if (!!node && node.nodeType == 1) {
				return node;
			}
		}
		return null;
	},

	/**
	 * 交换两个节点
	 * 
	 * @param {HTMLElement} node1 node对象
	 * @param {HTMLElement} node2 node对象
	 *            @example
	 *            QZFL.dom.swapNode(QZFL.dom.get("el_one"),QZFL.dom.get("el_two"))
	 */
	swapNode : function(node1, node2) {
		// for ie
		if (node1.swapNode) {
			node1.swapNode(node2);
		} else {
			var prt = node2.parentNode;
			var next = node2.nextSibling;

			if (next == node1) {
				prt.insertBefore(node1, node2);
			} else if (node2 == node1.nextSibling) {
				prt.insertBefore(node2, node1);
			} else {
				node1.parentNode.replaceChild(node2, node1);
				prt.insertBefore(node1, next);
			}
		}
	},
	/**
	 * 定点创建Dom对象
	 * 
	 * @param {String} tagName 创建对象的TagName
	 * @param {String|HTMLElement} el 容器对象id或则dom
	 * @param {Boolean} insertFirst 是否插入容器的第一个位置
	 * @param {Object} attributes 对象属性列表，例如 {id:"newDom1",style:"color:#000"}
	 *            @example
	 *            QZFL.dom.createElementIn("div",document.body,false,{id:"newDom1",style:"color:#000"})
	 * @return 返回创建好的dom
	 */
	createElementIn : function(tagName, el, insertFirst, attributes) {
		/**
		 * @default "div"
		 */
		var tagName = tagName || "div";
		
		/**
		 * @default document.body
		 */
		var el = this.get(el) || document.body;

		var _doc = el.ownerDocument;
		var _e = _doc.createElement(tagName);

		// 设置Element属性
		if (attributes) {
			for (var k in attributes) {
				if (/class/.test(k)) {
					_e.className = attributes[k];
				} else if (/style/.test(k)) {
					_e.style.cssText = attributes[k];
				} else {
					_e[k] = attributes[k];
				}
			}
		}

		if (insertFirst) {
			el.insertBefore(_e, el.firstChild);
		} else {
			el.appendChild(_e);
		}
		return _e;
	},

	/**
	 * 获取对象渲染后的样式规则
	 * 
	 * @param {String|HTMLElement} el 对象id或则dom
	 * @param {String} property 样式规则
	 *            @example
	 *            var width=QZFL.dom.getStyle("div_id","width");//width=163px;
	 * @return 样式值
	 */
	getStyle : function(el, property) {
		el = this.get(el);

		if (!el || el.nodeType == 9) {
			return null;
		}
		
		var w3cMode = document.defaultView && document.defaultView.getComputedStyle;
		var computed = !w3cMode ? null : document.defaultView.getComputedStyle(el, '');
		var value = "";
		switch (property) {
			case "float" :
				property = w3cMode ? "cssFloat" : "styleFloat";
				break;
			case "opacity" :
				if (!w3cMode) { // IE Mode
					var val = 100;
					try {
						val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
					} catch (e) {
						try {
							val = el.filters('alpha').opacity;
						} catch (e) {}
					}
					return val / 100;
				}else{
					return parseFloat((computed || el.style)[property]);
				}
				break;
			case "backgroundPositionX" : // 只有ie和webkit浏览器支持
				// background-position-x
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[0];
				}
				break;
			case "backgroundPositionY" : // 只有ie和webkit浏览器支持
				// background-position-y
				if (w3cMode) {
					property = "backgroundPosition";
					return ((computed || el.style)[property]).split(" ")[1];
				}
				break;
		}

		if (w3cMode) {
			return (computed || el.style)[property];
		} else {
			return (el.currentStyle[property] || el.style[property]);
		}
	},

	/**
	 * 设置样式规则
	 * 
	 * @param {String|HTMLElement} el 对象id或则dom
	 * @param {String} property 样式规则
	 *            @example
	 *            QZFL.dom.setStyle("div_id","width","200px");
	 * @return 成功返回 true
	 */
	setStyle : function(el, property, value) {
		el = this.get(el);
		if (!el || el.nodeType == 9) {
			return false;
		}
		var w3cMode = document.defaultView && document.defaultView.getComputedStyle;

		switch (property) {
			case "float" :
				property = w3cMode ? "cssFloat" : "styleFloat";
			case "opacity" :
				if (!w3cMode) { // for ie only
					if (value >= 1) {
						el.style.filter = "";
						return;
					}
					el.style.filter = 'alpha(opacity=' + (value * 100) + ')';
					return true;
				} else {
					el.style[property] = value;
					return true;
				}
				break;
			case "backgroundPositionX" : // 只有ie和webkit浏览器支持
				// background-position-x
				if (w3cMode) {
					var _y = QZFL.dom.getStyle(el, "backgroundPositionY");
					// alert(value + " " + (_y || "top"))
					el.style["backgroundPosition"] = value + " " + (_y || "top");
				} else {
					el.style[property] = value;
				}
				break;
			case "backgroundPositionY" : // 只有ie和webkit浏览器支持
				// background-position-y
				if (w3cMode) {
					var _x = QZFL.dom.getStyle(el, "backgroundPositionX");
					// alert((_x || "left") + " " + value)
					el.style["backgroundPosition"] = (_x || "left") + " " + value;
				} else {
					el.style[property] = value;
				}
				break;
			default :
				if (typeof el.style[property] == "undefined") {
					return false
				}
				el.style[property] = value;
				return true;
		}
	},

	/**
	 * 建立有name属性的element
	 * 
	 * @param {String} type node的tagName
	 * @param {String} name name属性值
	 * @param {object} doc document
	 *            @example
	 *            QZFL.dom.createNamedElement("div","div_name",QZFL.dom.get("doc"));
	 * @return {Object} 结果element
	 */
	createNamedElement : function(type, name, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document,
			element;

		try {
			element = _doc.createElement('<' + type + ' name="' + name + '">');
		} catch (ignore) {}
		if (!element || !element.name) {
			element = _doc.createElement(type);
			element.name = name;
		}
		return element;
	},

	/**
	 * 获取对象坐标
	 * 
	 * @param {HTMLElement} el
	 *            @example
	 *            var position=QZFL.dom.getPosition(QZFL.dom.get("div_id"));
	 * @return object 返回位置对象 {"top","left","width","height"};
	 */
	getPosition : function(el) {
		var xy = QZFL.dom.getXY(el), size = QZFL.dom.getSize(el);

		return {
			"top" : xy[1],
			"left" : xy[0],
			"width" : size[0],
			"height" : size[1]
		};
	},
	/**
	 * 设置对象坐标
	 * 
	 * @param {HTMLElement} el
	 * @param {object} pos
	 *            @example
	 *            QZFL.dom.setPosition(QZFL.dom.get("div_id"),{"100px","100px","400px","300px"});
	 */
	setPosition : function(el, pos) {
		QZFL.dom.setXY(el, pos['left'], pos['top']);
		QZFL.dom.setSize(el, pos['width'], pos['height']);
	},
	/**
	 * 获取对象坐标
	 * 
	 * @param {HTMLElement} el
	 * @param {Document} doc 所需检查的页面document引用
	 * @return Array [top,left]
	 * @type Array
	 *       @example
	 *       var xy=QZFL.dom.getXY(QZFL.dom.get("div_id"));
	 * @return Array
	 */
	getXY : function(el, doc) {
		var _t = 0, _l = 0,
			_doc = doc || document;
		if (el) {
			// 这里只检查document不够严谨, 在el被侵染置换(jQuery做了这么恶心的事情)
			// 的情况下, el.getBoundingClientRect() 调用回挂掉
			if (_doc.documentElement.getBoundingClientRect && el.getBoundingClientRect) { // 顶IE的这个属性，获取对象到可视范围的距离。
				// 现在firefox3，chrome2，opera9.63都支持这个属性。
				var box = el.getBoundingClientRect(),
					oDoc = el.ownerDocument,
					_fix = QZFL.userAgent.ie ? 2 : 0; // 修正ie和firefox之间的2像素差异

				_t = box.top - _fix + QZFL.dom.getScrollTop(oDoc);
				_l = box.left - _fix + QZFL.dom.getScrollLeft(oDoc);
			} else {// 这里只有safari执行。
				while (el.offsetParent) {
					_t += el.offsetTop;
					_l += el.offsetLeft;
					el = el.offsetParent;
				}
			}
		}
		return [_l, _t];
	},

	/**
	 * 获取对象尺寸
	 * 
	 * @param {HTMLElement} el
	 * @return Array [width,height]
	 * @type Array
	 *       @example
	 *       var size=QZFL.dom.getSize(QZFL.dom.get("div_id"));
	 * @return Array
	 */
	getSize : function(el) {
		var _fix = [0,0];
		if (el) {
			//修正 border 和 padding 对 getSize的影响
			QZFL.object.each(["Left", "Right", "Top", "Bottom"], function(v){ 
				_fix[v == "Left" || v == "Right"?0:1] += (parseInt(QZFL.dom.getStyle(el, "border" + v + "Width"), 10) || 0) + (parseInt(QZFL.dom.getStyle(el, "padding" + v), 10) || 0);
			});
		
			var _w = el.offsetWidth - _fix[0];
			var _h = el.offsetHeight - _fix[1];
			return [_w, _h];
		}
		return [-1, -1];
	},

	/**
	 * 设置dom坐标
	 * 
	 * @param {HTMLElement} el
	 * @param {string|number} x 横坐标
	 * @param {string|number} y 纵坐标
	 *            @example
	 *            QZFL.dom.setXY(QZFL.dom.get("div_id"),400,200);
	 */
	setXY : function(el, x, y) {
		el = this.get(el);
		/**
		 * @default 0
		 */
		var _ml = parseInt(this.getStyle(el, "marginLeft")) || 0;
		/**
		 * @default 0
		 */
		var _mt = parseInt(this.getStyle(el, "marginTop")) || 0;

		this.setStyle(el, "left", parseInt(x) - _ml + "px");
		this.setStyle(el, "top", parseInt(y) - _mt + "px");
	},

	/**
	 * 获取对象scrollLeft的值
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollLeft(document);
	 * @return Number
	 */
	getScrollLeft : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollLeft, _doc.body.scrollLeft);
	},

	/**
	 * 获取对象的scrollTop的值
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollTop(document);
	 * @return Number
	 */
	getScrollTop : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollTop, _doc.body.scrollTop);
	},

	/**
	 * 获取对象scrollHeight的值
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollHeight(document);
	 * @return Number
	 */
	getScrollHeight : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollHeight, _doc.body.scrollHeight);
	},

	/**
	 * 获取对象的scrollWidth的值
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getScrollWidht(document);
	 * @return Number
	 */
	getScrollWidth : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return Math.max(_doc.documentElement.scrollWidth, _doc.body.scrollWidth);
	},

	/**
	 * 设置对象scrollLeft的值
	 * 
	 * @param {number} value scroll left的修改值
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.setScrollLeft(200,document);
	 */
	setScrollLeft : function(value, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollLeft = value;
	},

	/**
	 * 设置对象的scrollTop的值
	 * 
	 * @param {number} value scroll top的修改值
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.setScrollTop(200,document);
	 */
	setScrollTop : function(value, doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		_doc[_doc.compatMode == "CSS1Compat" && !QZFL.userAgent.webkit ? "documentElement" : "body"].scrollTop = value;
	},

	/**
	 * 获取对象的可视区域高度
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getClientHeight();
	 */
	getClientHeight : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight : _doc.body.clientHeight;
	},

	/**
	 * 获取对象的可视区域宽度
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getClientWidth();
	 */
	getClientWidth : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
	},
	/**
	 * 设置dom尺寸
	 * 
	 * @param {HTMLElement} el
	 * @param {string|number} width 宽度
	 * @param {string|number} height 高度
	 *            @example
	 *            QZFL.dom.setSize();
	 */
	setSize : function(el, width, height) {
		el = this.get(el);

		var _wFix = /\d+([a-z%]+)/i.exec(width);
		_wFix = _wFix ? _wFix[1] : "";
		var _hFix = /\d+([a-z%]+)/i.exec(height);
		_hFix = _hFix ? _hFix[1] : "";

		this.setStyle(el, "width", (typeof width != "number" || width < 0 || /auto/i.test(width)) ? "auto" : (parseInt(width) + (_wFix || "px")));
		this.setStyle(el, "height", (typeof height != "number" || height < 0 || /auto/i.test(height)) ? "auto" : (parseInt(height) + (_hFix || "px")));
	},

	/**
	 * 获取document的window对象
	 * 
	 * @param {Document} doc 所需检查的页面document引用
	 * @example QZFL.dom.getDocumentWindow();
	 * @return {Window} 返回window对象
	 */
	getDocumentWindow : function(doc) {
		/**
		 * @default document
		 */
		var _doc = doc || document;
		return _doc.parentWindow || _doc.defaultView;
	},

	/**
	 * 按Tagname获取指定命名空间的节点
	 * 
	 * @param {Element/Document} node 所需遍历的根节点
	 * @param {string} ns 命名空间名
	 * @param {string} tgn 标签名
	 * @return QZFL.dom.getElementsByTagNameNS(document,"ns","div");
	 * @return Array
	 */
	getElementsByTagNameNS : function(node, ns, tgn) {
		var res = [];
		if (node) {
			if (node.getElementsByTagNameNS) {
				return node.getElementsByTagName(ns + ":" + tgn);
			} else if (node.getElementsByTagName) {
				var n = document.namespaces;
				if (n.length > 0) {
					var l = node.getElementsByTagName(tgn);
					for (var i = 0, len = l.length; i < len; ++i) {
						if (l[i].scopeName == ns) {
							res.push(l[i]);
						}
					}
				}
			}
		}
		return res;
	},

	/**
	 * 将集合型转为数组
	 * 
	 * @param {Object} coll 集合型
	 *            @example
	 *            QZFL.dom.collection2Array(coll);
	 * @return Array
	 * @ignore
	 * @deprecated
	 */
	collection2Array : function(coll) {
		if (isArray(coll)) {
			return coll;
		} else {
			var r = [];
			for (var i = 0, len = coll.length; i < len; ++i) {
				r.push(coll[i]);
			}
		}
		return r;
	},

	/**
	 * 向上寻找一个tagName相符的节点
	 * 
	 * @param {Object} a
	 * @param {string} tn
	 *            @example
	 *            QZFL.dom.getElementByTagNameBubble(QZFL.dom.get("div_id"),"div");
	 * @return {object} result|null
	 */
	getElementByTagNameBubble : function(a, tn) {
		if (!isNode(a)) {
			return null;
		}

		tn += "";

		var maxLv = 31;
		while (a && a.tagName && (a.tagName.toLowerCase() != tn.toLowerCase())) {
			if (a == document.body || (--maxLv) < 0) {
				return null;
			}
			a = a.parentNode;
		}

		return a;
	}
};

// 一些方法名的简写
var _CN = QZFL.dom.createNamedElement, $ = QZFL.dom.getById, removeNode = QZFL.dom.removeElement;

/**
 * @fileoverview QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 * @version 1.$Rev: 1512 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2009-10-10 14:33:45 +0800 (星期六, 10 十月 2009) $
 */

/**
 * 事件驱动对象，包含许多事件驱动以及绑定等方法,关键
 * 
 * @namespace QZFL 事件驱动器，给浏览器提供基本的事件驱动接口
 */
QZFL.event = {
	/**
	 * 按键代码映射
	 * 
	 * @namespace QZFL.event.KEYS 里面包含了对按键的映射
	 * @type Object
	 */
	KEYS : {
		/**
		 * 退格键
		 */
		BACKSPACE : 8,
		/**
		 * tab
		 */
		TAB : 9,
		RETURN : 13,
		ESC : 27,
		SPACE : 32,
		LEFT : 37,
		UP : 38,
		RIGHT : 39,
		DOWN : 40,
		DELETE : 46
	},

	/**
	 * 扩展类型，这类事件在绑定的时候允许传参数，并且用来特殊处理一些特别的事件绑定
	 * 
	 * @ignore
	 */
	extendType : /(click|mousedown|mouseover|mouseout|mouseup|mousemove|scroll|contextmenu|resize)/i,
	
	/**
	 * 全局事件树
	 * @ignore
	 */
	_eventListDictionary : {},
	
	/**
	 * @ignore
	 */
	_fnSeqUID : 0,
	
	/**
	 * @ignore
	 */
	_objSeqUID : 0,

	/**
	 * 事件绑定
	 * 
	 * @param {DocumentElement} obj 需要添加事件的页面对象
	 * @param {String} eventType 需要添加的事件
	 * @param {Function} fn 事件需要绑定到的处理函数
	 * @param {Array} argArray 参数数组
	 * @type Boolean
	 * @version 1.1 memory leak optimise by scorr
	 * @author zishunchen
	 * @return 是否绑定成功(true为成功，false为失败)
	 * @example QZFL.event.addEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	addEvent : function(obj, eventType, fn, argArray) {
		var cfn = fn,
			res = false, l;

		if (!obj) {
			return res;
		}
		if (!obj.eventsListUID) {
			obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
		}
		
		if (!(l = QZFL.event._eventListDictionary[obj.eventsListUID])) {
			l = QZFL.event._eventListDictionary[obj.eventsListUID] = {};
		}

		if (!fn.__elUID) {
			fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
		}

		if (!l[eventType]) {
			l[eventType] = {};
		}
		
		if(typeof(l[eventType][fn.__elUID])=='function'){
			return false;
		}
		
		if (QZFL.event.extendType.test(eventType)) {
    	/**
   		 * @default []
   		 */
			var argArray = argArray || [];
			/**
			 * 处理子过程
			 * 
			 * @ignore
			 * @param {Object} e
			 */
			cfn = function(e) {
				return fn.apply(null, ([QZFL.event.getEvent(e)]).concat(argArray));
			};
		}
		if (obj.addEventListener) {
			obj.addEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.attachEvent) {
			res = obj.attachEvent("on" + eventType, cfn);
		} else {
			res = false;
		}
		if (res) {
			l[eventType][fn.__elUID] = cfn;
		}
		return res;
	},

	/**
	 * 方法取消绑定
	 * 
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @param {Function} fn 需要取消绑定的函数
	 * @return 是否成功取消(true为成功，false为失败)
	 * @type Boolean
	 * @version 1.1 memory leak optimise by scorr
	 * @author zishunchen
	 * @example QZFL.event.removeEvent(QZFL.dom.get('demo'),'click',hello);
	 */
	removeEvent : function(obj, eventType, fn) {
		var cfn = fn, res = false, l;

		if (!obj) {
			return res;
		}
		if (!cfn) {
			return QZFL.event.purgeEvent(obj, eventType);
		}
		if (!obj.eventsListUID) {
			obj.eventsListUID = "e" + (++QZFL.event._objSeqUID);
		}
		
		if (!(l = QZFL.event._eventListDictionary[obj.eventsListUID])) {
			l = QZFL.event._eventListDictionary[obj.eventsListUID] = {};
		}

		if (!fn.__elUID) {
			fn.__elUID = "e" + (++QZFL.event._fnSeqUID) + obj.eventsListUID;
		}

		if (!l[eventType]) {
			l[eventType] = {};
		}
		
		if (QZFL.event.extendType.test(eventType)
				&&
			l[eventType]
				&&
			l[eventType][fn.__elUID]) {
				cfn = l[eventType][fn.__elUID];
		}

		if (obj.removeEventListener) {
			obj.removeEventListener(eventType, cfn, false);
			res = true;
		} else if (obj.detachEvent) {
			obj.detachEvent("on" + eventType, cfn);
			res = true;
		} else {
			//rt.error("Error.!.");
			return false;
		}
		if (res && l[eventType]) {
			delete l[eventType][fn.__elUID];
		}
		return res;
	},

	/**
	 * 取消全部某类型的方法绑定
	 * 
	 * @param {DocumentElement} obj 需要取消事件绑定的页面对象
	 * @param {String} eventType 需要取消绑定的事件
	 * @example QZFL.event.purgeEvent(QZFL.dom.get('demo'),'click');
	 * @return {Boolean} 是否成功取消(true为成功，false为失败)
	 */
	purgeEvent : function(obj, type) {
		var l;
		if (obj.eventsListUID && (l=QZFL.event._eventListDictionary[obj.eventsListUID]) && l[type]) {
			for (var k in l[type]) {
				if (obj.removeEventListener) {
					obj.removeEventListener(type, l[type][k],
							false);
				} else if (obj.detachEvent) {
					obj.detachEvent('on' + type, l[type][k]);
				}
			}
		}
		if (obj['on' + type]) {
			obj['on' + type] = null;
		}
		if (l) {
			l[type] = null;
			delete l[type];
		}
		return true;
	},

	/**
	 * 根据不同浏览器获取对应的Event对象
	 * 
	 * @param {Event} evt
	 * @return 修正过的Event对象, 同时返回一个修正button的自定义属性;
	 * @type Event
	 * @example QZFL.event.getEvent();
	 * @return Event
	 */
	getEvent : function(evt) {
    	/**
   		 * @default window.event
   		 */
		var evt = evt || window.event;

		/* 修正Mozilla的event事件 */
		if (!evt && !QZFL.userAgent.ie) {
			//var c = arguments.caller;
			var c = this.getEvent.caller,
				cnt = 1;
		//	alert(arguments);
			while (c) {
				evt = c.arguments[0];
				if (evt && Event == evt.constructor) {
					break;
				}else if(cnt > 32){
					break;
				}
				c = c.caller;
				cnt++;
			}
		}
		return evt;
	},

	/**
	 * 获得鼠标按键
	 * 
	 * @param {Object} evt
	 * @example QZFL.event.getButton(evt);
	 * @return {number} 鼠标按键 -1=无法获取event 0=左键 1= 中键 2= 右键
	 */
	getButton : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (!e) {
			return -1
		}

		if (QZFL.userAgent.ie) {
			return e.button - Math.ceil(e.button / 2);
		} else {
			return e.button;
		}
	},

	/**
	 * 返回事件触发的对象
	 * 
	 * @param {Object} evt
	 * @example QZFL.event.getTarget(evt);
	 * @return {object}
	 */
	getTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
			return e.target || e.srcElement;
		} else {
			return null;
		}
	},

	/**
	 * 返回获得焦点的对象
	 * 
	 * @param {Object} evt
	 * @example QZFL.event.getCurrentTarget();
	 * @return {object}
	 */
	getCurrentTarget : function(evt) {
		var e = QZFL.event.getEvent(evt);
		if (e) {
    	/**
   		 * @default document.activeElement
   		 */			
			return  e.currentTarget || document.activeElement;
		} else {
			return null;
		}
	},

	/**
	 * 禁止事件冒泡传播
	 * 
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.cancelBubble();
	 */
	cancelBubble : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.stopPropagation) {
			evt.stopPropagation();
		} else {
			if (!evt.cancelBubble) {
				evt.cancelBubble = true;
			}
		}
	},

	/**
	 * 取消浏览器的默认事件
	 * 
	 * @param {Event} evt 事件，非必要参数
	 * @example QZFL.event.preventDefault();
	 */
	preventDefault : function(evt) {
		evt = QZFL.event.getEvent(evt);
		if (!evt) {
			return false
		}
		if (evt.preventDefault) {
			evt.preventDefault();
		} else {
			evt.returnValue = false;
		}
	},

	/**
	 * 获取事件触发时的鼠标位置x
	 * 
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseX : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageX || (evt.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
	},

	/**
	 * 获取事件触发时的鼠标位置y
	 * 
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.mouseX();
	 */
	mouseY : function(evt) {
		evt = QZFL.event.getEvent(evt);
		return evt.pageY || (evt.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
	},

	/**
	 * 获取事件RelatedTarget
	 * @param {Object} evt 事件对象引用
	 * @example QZFL.event.getRelatedTarget();
	 */
	getRelatedTarget: function(ev) {
		ev = QZFL.event.getEvent(ev);
		var t = ev.relatedTarget;
		if (!t) {
			if (ev.type == "mouseout") {
				t = ev.toElement;
			} else if (ev.type == "mouseover") {
				t = ev.fromElement;
			} else {

			}
		}
		return t;
	},
	/**
	 * 将方法绑定在对象上，能够保护this指针不会“漂移”
	 * 
	 * @param {Object} obj 母体对象
	 * @param {Object} method 目标方法
	 * @example var e = QZFL.event.bind(objA,funB);
	 */
	bind : function(obj, method) {
		var args = Array.prototype.slice.call(arguments, 2);
		return function() {
			var _obj = obj || this;
			var _args = args.concat(Array.prototype.slice.call(arguments, 0));
			if (typeof(method) == "string") {
				if (_obj[method]) {
					return _obj[method].apply(_obj, _args);
				}
			} else {
				return method.apply(_obj, _args);
			}
		}
	}
};

/**
 * 方法同 QZFL.event.addEvent
 * 
 * @see QZFL.event.addEvent
 */
QZFL.event.on = QZFL.event.addEvent;
window.addEvent = QZFL.event.addEvent;
window.removeEvent = QZFL.event.removeEvent;
window.getEvent = QZFL.event.getEvent;

/**
 * @fileoverview QZFL Selector 支持。需要对不支持querySelector的浏览器增加selector的支持
 * @version 1.$Rev: 1455 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-18 21:16:59 +0800 (星期二, 18 八月 2009) $
 */

// benchmark
// http://mootools.net/slickspeed/

/**
 * QZFL Selector 选择器，给Elements对象提供选择器支持
 * @namespace QZFL Selector 选择器，给Elements对象提供选择器支持
 * @type Object
 */
QZFL.selector = {
	/**
	 * 检索selector
	 * @param {string} selector
	 * @param {element} context
	 * @example QZFL.selector.query("div");
	 * @return {Object} Sizzle 对象
	 */
	query:function(selector,/*@default document*/context){
		context = context || document;
		var _s = QZFL.selector.engine(selector, context);
		return _s;
	}
};

/*
 * ! Sizzle CSS Selector Engine - v1.0 Copyright 2009, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses. More information:
 * http://sizzlejs.com/
 */
;
(function() {
	var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g, done = 0, toString = Object.prototype.toString, hasDuplicate = false;

	var Sizzle = function(selector, context, results, seed) {
		results = results || [];
		var origContext = context = context || document;

		if (context.nodeType !== 1 && context.nodeType !== 9) {
			return [];
		}

		if (!selector || typeof selector !== "string") {
			return results;
		}

		var parts = [], m, set, checkSet, check, mode, extra, prune = true, contextXML = isXML(context);

		// Reset the position of the chunker regexp (start from head)
		chunker.lastIndex = 0;

		while ((m = chunker.exec(selector)) !== null) {
			parts.push(m[1]);

			if (m[2]) {
				extra = RegExp.rightContext;
				break;
			}
		}

		if (parts.length > 1 && origPOS.exec(selector)) {
			if (parts.length === 2 && Expr.relative[parts[0]]) {
				set = posProcess(parts[0] + parts[1], context);
			} else {
				set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

				while (parts.length) {
					selector = parts.shift();

					if (Expr.relative[selector])
						selector += parts.shift();

					set = posProcess(selector, set);
				}
			}
		} else {
			// Take a shortcut and set the context if the root selector is an ID
			// (but not if it'll be faster if the inner selector is an ID)
			if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {
				var ret = Sizzle.find(parts.shift(), context, contextXML);
				context = ret.expr ? Sizzle.filter(ret.expr, ret.set)[0] : ret.set[0];
			}

			if (context) {
				var ret = seed ? {
					expr : parts.pop(),
					set : makeArray(seed)
				} : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);
				set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

				if (parts.length > 0) {
					checkSet = makeArray(set);
				} else {
					prune = false;
				}

				while (parts.length) {
					var cur = parts.pop(), pop = cur;

					if (!Expr.relative[cur]) {
						cur = "";
					} else {
						pop = parts.pop();
					}

					if (pop == null) {
						pop = context;
					}

					Expr.relative[cur](checkSet, pop, contextXML);
				}
			} else {
				checkSet = parts = [];
			}
		}

		if (!checkSet) {
			checkSet = set;
		}

		if (!checkSet) {
			throw "Syntax error, unrecognized expression: " + (cur || selector);
		}

		if (toString.call(checkSet) === "[object Array]") {
			if (!prune) {
				results.push.apply(results, checkSet);
			} else if (context && context.nodeType === 1) {
				for (var i = 0; checkSet[i] != null; i++) {
					if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i]))) {
						results.push(set[i]);
					}
				}
			} else {
				for (var i = 0; checkSet[i] != null; i++) {
					if (checkSet[i] && checkSet[i].nodeType === 1) {
						results.push(set[i]);
					}
				}
			}
		} else {
			makeArray(checkSet, results);
		}

		if (extra) {
			Sizzle(extra, origContext, results, seed);
			Sizzle.uniqueSort(results);
		}

		return results;
	};

	Sizzle.uniqueSort = function(results) {
		if (sortOrder) {
			hasDuplicate = false;
			results.sort(sortOrder);

			if (hasDuplicate) {
				for (var i = 1; i < results.length; i++) {
					if (results[i] === results[i - 1]) {
						results.splice(i--, 1);
					}
				}
			}
		}
	};

	Sizzle.matches = function(expr, set) {
		return Sizzle(expr, null, null, set);
	};

	Sizzle.find = function(expr, context, isXML) {
		var set, match;

		if (!expr) {
			return [];
		}

		for (var i = 0, l = Expr.order.length; i < l; i++) {
			var type = Expr.order[i], match;

			if ((match = Expr.match[type].exec(expr))) {
				var left = RegExp.leftContext;

				if (left.substr(left.length - 1) !== "\\") {
					match[1] = (match[1] || "").replace(/\\/g, "");
					set = Expr.find[type](match, context, isXML);
					if (set != null) {
						expr = expr.replace(Expr.match[type], "");
						break;
					}
				}
			}
		}

		if (!set) {
			set = context.getElementsByTagName("*");
		}

		return {
			set : set,
			expr : expr
		};
	};

	Sizzle.filter = function(expr, set, inplace, not) {
		var old = expr, result = [], curLoop = set, match, anyFound, isXMLFilter = set && set[0] && isXML(set[0]);

		while (expr && set.length) {
			for (var type in Expr.filter) {
				if ((match = Expr.match[type].exec(expr)) != null) {
					var filter = Expr.filter[type], found, item;
					anyFound = false;

					if (curLoop == result) {
						result = [];
					}

					if (Expr.preFilter[type]) {
						match = Expr.preFilter[type](match, curLoop, inplace, result, not, isXMLFilter);

						if (!match) {
							anyFound = found = true;
						} else if (match === true) {
							continue;
						}
					}

					if (match) {
						for (var i = 0; (item = curLoop[i]) != null; i++) {
							if (item) {
								found = filter(item, match, i, curLoop);
								var pass = not ^ !!found;

								if (inplace && found != null) {
									if (pass) {
										anyFound = true;
									} else {
										curLoop[i] = false;
									}
								} else if (pass) {
									result.push(item);
									anyFound = true;
								}
							}
						}
					}

					if (found !== undefined) {
						if (!inplace) {
							curLoop = result;
						}

						expr = expr.replace(Expr.match[type], "");

						if (!anyFound) {
							return [];
						}

						break;
					}
				}
			}

			// Improper expression
			if (expr == old) {
				if (anyFound == null) {
					throw "Syntax error, unrecognized expression: " + expr;
				} else {
					break;
				}
			}

			old = expr;
		}

		return curLoop;
	};

	/**
	 * @deprecated
	 * @private
	 */
	var Expr = Sizzle.selectors = {
		order : ["ID", "NAME", "TAG"],
		match : {
			ID : /#((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
			CLASS : /\.((?:[\w\u00c0-\uFFFF_-]|\\.)+)/,
			NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF_-]|\\.)+)['"]*\]/,
			ATTR : /\[\s*((?:[\w\u00c0-\uFFFF_-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
			TAG : /^((?:[\w\u00c0-\uFFFF\*_-]|\\.)+)/,
			CHILD : /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
			POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
			PSEUDO : /:((?:[\w\u00c0-\uFFFF_-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
		},
		attrMap : {
			"class" : "className",
			"for" : "htmlFor"
		},
		attrHandle : {
			href : function(elem) {
				return elem.getAttribute("href");
			}
		},
		relative : {
			"+" : function(checkSet, part, isXML) {
				var isPartStr = typeof part === "string", isTag = isPartStr && !/\W/.test(part), isPartStrNotTag = isPartStr && !isTag;

				if (isTag && !isXML) {
					part = part.toUpperCase();
				}

				for (var i = 0, l = checkSet.length, elem; i < l; i++) {
					if ((elem = checkSet[i])) {
						while ((elem = elem.previousSibling) && elem.nodeType !== 1) {}

						checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ? elem || false : elem === part;
					}
				}

				if (isPartStrNotTag) {
					Sizzle.filter(part, checkSet, true);
				}
			},
			">" : function(checkSet, part, isXML) {
				var isPartStr = typeof part === "string";

				if (isPartStr && !/\W/.test(part)) {
					part = isXML ? part : part.toUpperCase();

					for (var i = 0, l = checkSet.length; i < l; i++) {
						var elem = checkSet[i];
						if (elem) {
							var parent = elem.parentNode;
							checkSet[i] = parent.nodeName === part ? parent : false;
						}
					}
				} else {
					for (var i = 0, l = checkSet.length; i < l; i++) {
						var elem = checkSet[i];
						if (elem) {
							checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
						}
					}

					if (isPartStr) {
						Sizzle.filter(part, checkSet, true);
					}
				}
			},
			"" : function(checkSet, part, isXML) {
				var doneName = done++, checkFn = dirCheck;

				if (!/\W/.test(part)) {
					var nodeCheck = part = isXML ? part : part.toUpperCase();
					checkFn = dirNodeCheck;
				}

				checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
			},
			"~" : function(checkSet, part, isXML) {
				var doneName = done++, checkFn = dirCheck;

				if (typeof part === "string" && !/\W/.test(part)) {
					var nodeCheck = part = isXML ? part : part.toUpperCase();
					checkFn = dirNodeCheck;
				}

				checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
			}
		},
		find : {
			ID : function(match, context, isXML) {
				if (typeof context.getElementById !== "undefined" && !isXML) {
					var m = context.getElementById(match[1]);
					return m ? [m] : [];
				}
			},
			NAME : function(match, context, isXML) {
				if (typeof context.getElementsByName !== "undefined") {
					var ret = [], results = context.getElementsByName(match[1]);

					for (var i = 0, l = results.length; i < l; i++) {
						if (results[i].getAttribute("name") === match[1]) {
							ret.push(results[i]);
						}
					}

					return ret.length === 0 ? null : ret;
				}
			},
			TAG : function(match, context) {
				return context.getElementsByTagName(match[1]);
			}
		},
		preFilter : {
			CLASS : function(match, curLoop, inplace, result, not, isXML) {
				match = " " + match[1].replace(/\\/g, "") + " ";

				if (isXML) {
					return match;
				}

				for (var i = 0, elem; (elem = curLoop[i]) != null; i++) {
					if (elem) {
						if (not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0)) {
							if (!inplace)
								result.push(elem);
						} else if (inplace) {
							curLoop[i] = false;
						}
					}
				}

				return false;
			},
			ID : function(match) {
				return match[1].replace(/\\/g, "");
			},
			TAG : function(match, curLoop) {
				for (var i = 0; curLoop[i] === false; i++) {}
				return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
			},
			CHILD : function(match) {
				if (match[1] == "nth") {
					// parse equations like 'even', 'odd', '5', '2n', '3n+2',
					// '4n-1', '-n+6'
					var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

					// calculate the numbers (first)n+(last) including if they
					// are negative
					match[2] = (test[1] + (test[2] || 1)) - 0;
					match[3] = test[3] - 0;
				}

				// TODO: Move to normal caching system
				match[0] = done++;

				return match;
			},
			ATTR : function(match, curLoop, inplace, result, not, isXML) {
				var name = match[1].replace(/\\/g, "");

				if (!isXML && Expr.attrMap[name]) {
					match[1] = Expr.attrMap[name];
				}

				if (match[2] === "~=") {
					match[4] = " " + match[4] + " ";
				}

				return match;
			},
			PSEUDO : function(match, curLoop, inplace, result, not) {
				if (match[1] === "not") {
					// If we're dealing with a complex expression, or a simple
					// one
					if (chunker.exec(match[3]).length > 1 || /^\w/.test(match[3])) {
						match[3] = Sizzle(match[3], null, null, curLoop);
					} else {
						var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
						if (!inplace) {
							result.push.apply(result, ret);
						}
						return false;
					}
				} else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
					return true;
				}

				return match;
			},
			POS : function(match) {
				match.unshift(true);
				return match;
			}
		},
		filters : {
			enabled : function(elem) {
				return elem.disabled === false && elem.type !== "hidden";
			},
			disabled : function(elem) {
			
				return elem.disabled === true;
			},
			checked : function(elem) {
				debugger;
				return elem.checked === true;
			},
			selected : function(elem) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				elem.parentNode.selectedIndex;
				return elem.selected === true;
			},
			parent : function(elem) {
				return !!elem.firstChild;
			},
			empty : function(elem) {
				return !elem.firstChild;
			},
			has : function(elem, i, match) {
				return !!Sizzle(match[3], elem).length;
			},
			header : function(elem) {
				return /h\d/i.test(elem.nodeName);
			},
			text : function(elem) {
				return "text" === elem.type;
			},
			radio : function(elem) {
				return "radio" === elem.type;
			},
			checkbox : function(elem) {
				return "checkbox" === elem.type;
			},
			file : function(elem) {
				return "file" === elem.type;
			},
			password : function(elem) {
				return "password" === elem.type;
			},
			submit : function(elem) {
				return "submit" === elem.type;
			},
			image : function(elem) {
				return "image" === elem.type;
			},
			reset : function(elem) {
				return "reset" === elem.type;
			},
			button : function(elem) {
				return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
			},
			input : function(elem) {
				return /input|select|textarea|button/i.test(elem.nodeName);
			}
		},
		setFilters : {
			first : function(elem, i) {
				return i === 0;
			},
			last : function(elem, i, match, array) {
				return i === array.length - 1;
			},
			even : function(elem, i) {
				return i % 2 === 0;
			},
			odd : function(elem, i) {
				return i % 2 === 1;
			},
			lt : function(elem, i, match) {
				return i < match[3] - 0;
			},
			gt : function(elem, i, match) {
				return i > match[3] - 0;
			},
			nth : function(elem, i, match) {
				return match[3] - 0 == i;
			},
			eq : function(elem, i, match) {
				return match[3] - 0 == i;
			}
		},
		filter : {
			PSEUDO : function(elem, match, i, array) {
				var name = match[1], filter = Expr.filters[name];

				if (filter) {
					return filter(elem, i, match, array);
				} else if (name === "contains") {
					return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
				} else if (name === "not") {
					var not = match[3];

					for (i = 0, l = not.length; i < l; i++) {
						if (not[i] === elem) {
							return false;
						}
					}

					return true;
				}
			},
			CHILD : function(elem, match) {
				var type = match[1], node = elem;
				switch (type) {
					case 'only' :
					case 'first' :
						while ((node = node.previousSibling)) {
							if (node.nodeType === 1)
								return false;
						}
						if (type == 'first')
							return true;
						node = elem;
					case 'last' :
						while ((node = node.nextSibling)) {
							if (node.nodeType === 1)
								return false;
						}
						return true;
					case 'nth' :
						var first = match[2], last = match[3];

						if (first == 1 && last == 0) {
							return true;
						}

						var doneName = match[0], parent = elem.parentNode;

						if (parent && (parent.sizcache !== doneName || !elem.nodeIndex)) {
							var count = 0;
							for (node = parent.firstChild; node; node = node.nextSibling) {
								if (node.nodeType === 1) {
									node.nodeIndex = ++count;
								}
							}
							parent.sizcache = doneName;
						}

						var diff = elem.nodeIndex - last;
						if (first == 0) {
							return diff == 0;
						} else {
							return (diff % first == 0 && diff / first >= 0);
						}
				}
			},
			ID : function(elem, match) {
				return elem.nodeType === 1 && elem.getAttribute("id") === match;
			},
			TAG : function(elem, match) {
				return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
			},
			CLASS : function(elem, match) {
				return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
			},
			ATTR : function(elem, match) {
				var name = match[1], result = Expr.attrHandle[name] ? Expr.attrHandle[name](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];

				return result == null ? type === "!=" : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value != check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
			},
			POS : function(elem, match, i, array) {
				var name = match[2], filter = Expr.setFilters[name];

				if (filter) {
					return filter(elem, i, match, array);
				}
			}
		}
	};

	var origPOS = Expr.match.POS;

	for (var type in Expr.match) {
		Expr.match[type] = new RegExp(Expr.match[type].source + /(?![^\[]*\])(?![^\(]*\))/.source);
	}

	var makeArray = function(array, results) {
		array = Array.prototype.slice.call(array);

		if (results) {
			results.push.apply(results, array);
			return results;
		}

		return array;
	};

	// Perform a simple check to determine if the browser is capable of
	// converting a NodeList to an array using builtin methods.
	try {
		Array.prototype.slice.call(document.documentElement.childNodes);

		// Provide a fallback method if it does not work
	} catch (e) {
		makeArray = function(array, results) {
			var ret = results || [];

			if (toString.call(array) === "[object Array]") {
				Array.prototype.push.apply(ret, array);
			} else {
				if (typeof array.length === "number") {
					for (var i = 0, l = array.length; i < l; i++) {
						ret.push(array[i]);
					}
				} else {
					for (var i = 0; array[i]; i++) {
						ret.push(array[i]);
					}
				}
			}

			return ret;
		};
	}

	var sortOrder;

	if (document.documentElement.compareDocumentPosition) {
		sortOrder = function(a, b) {
			var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
			if (ret === 0) {
				hasDuplicate = true;
			}
			return ret;
		};
	} else if ("sourceIndex" in document.documentElement) {
		sortOrder = function(a, b) {
			var ret = a.sourceIndex - b.sourceIndex;
			if (ret === 0) {
				hasDuplicate = true;
			}
			return ret;
		};
	} else if (document.createRange) {
		sortOrder = function(a, b) {
			var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
			aRange.selectNode(a);
			aRange.collapse(true);
			bRange.selectNode(b);
			bRange.collapse(true);
			var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
			if (ret === 0) {
				hasDuplicate = true;
			}
			return ret;
		};
	}

	// Check to see if the browser returns elements by name when
	// querying by getElementById (and provide a workaround)
	(function() {
		// We're going to inject a fake input element with a specified name
		var form = document.createElement("div"), id = "script" + (new Date).getTime();
		form.innerHTML = "<a name='" + id + "'/>";

		// Inject it into the root element, check its status, and remove it
		// quickly
		var root = document.documentElement;
		root.insertBefore(form, root.firstChild);

		// The workaround has to do additional checks after a getElementById
		// Which slows things down for other browsers (hence the branching)
		if (!!document.getElementById(id)) {
			Expr.find.ID = function(match, context, isXML) {
				if (typeof context.getElementById !== "undefined" && !isXML) {
					var m = context.getElementById(match[1]);
					return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
				}
			};

			Expr.filter.ID = function(elem, match) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return elem.nodeType === 1 && node && node.nodeValue === match;
			};
		}

		root.removeChild(form);
		root = form = null; // release memory in IE
	})();

	(function() {
		// Check to see if the browser returns only elements
		// when doing getElementsByTagName("*")

		// Create a fake element
		var div = document.createElement("div");
		div.appendChild(document.createComment(""));

		// Make sure no comments are found
		if (div.getElementsByTagName("*").length > 0) {
			Expr.find.TAG = function(match, context) {
				var results = context.getElementsByTagName(match[1]);

				// Filter out possible comments
				if (match[1] === "*") {
					var tmp = [];

					for (var i = 0; results[i]; i++) {
						if (results[i].nodeType === 1) {
							tmp.push(results[i]);
						}
					}

					results = tmp;
				}

				return results;
			};
		}

		// Check to see if an attribute returns normalized href attributes
		div.innerHTML = "<a href='#'></a>";
		if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {
			Expr.attrHandle.href = function(elem) {
				return elem.getAttribute("href", 2);
			};
		}

		div = null; // release memory in IE
	})();

	if (document.querySelectorAll)
		(function() {
			var oldSizzle = Sizzle, div = document.createElement("div");
			div.innerHTML = "<p class='TEST'></p>";

			// Safari can't handle uppercase or unicode characters when
			// in quirks mode.
			if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
				return;
			}

			Sizzle = function(query, context, extra, seed) {
				context = context || document;

				// Only use querySelectorAll on non-XML documents
				// (ID selectors don't work in non-HTML documents)
				if (!seed && context.nodeType === 9 && !isXML(context)) {
					try {
						return makeArray(context.querySelectorAll(query), extra);
					} catch (e) {}
				}

				return oldSizzle(query, context, extra, seed);
			};

			for (var prop in oldSizzle) {
				Sizzle[prop] = oldSizzle[prop];
			}

			div = null; // release memory in IE
		})();

	if (document.getElementsByClassName && document.documentElement.getElementsByClassName)
		(function() {
			var div = document.createElement("div");
			div.innerHTML = "<div class='test e'></div><div class='test'></div>";

			// Opera can't find a second classname (in 9.6)
			if (div.getElementsByClassName("e").length === 0)
				return;

			// Safari caches class attributes, doesn't catch changes (in 3.2)
			div.lastChild.className = "e";

			if (div.getElementsByClassName("e").length === 1)
				return;

			Expr.order.splice(1, 0, "CLASS");
			Expr.find.CLASS = function(match, context, isXML) {
				if (typeof context.getElementsByClassName !== "undefined" && !isXML) {
					return context.getElementsByClassName(match[1]);
				}
			};

			div = null; // release memory in IE
		})();

	function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
		var sibDir = dir == "previousSibling" && !isXML;
		for (var i = 0, l = checkSet.length; i < l; i++) {
			var elem = checkSet[i];
			if (elem) {
				if (sibDir && elem.nodeType === 1) {
					elem.sizcache = doneName;
					elem.sizset = i;
				}
				elem = elem[dir];
				var match = false;

				while (elem) {
					if (elem.sizcache === doneName) {
						match = checkSet[elem.sizset];
						break;
					}

					if (elem.nodeType === 1 && !isXML) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if (elem.nodeName === cur) {
						match = elem;
						break;
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
		var sibDir = dir == "previousSibling" && !isXML;
		for (var i = 0, l = checkSet.length; i < l; i++) {
			var elem = checkSet[i];
			if (elem) {
				if (sibDir && elem.nodeType === 1) {
					elem.sizcache = doneName;
					elem.sizset = i;
				}
				elem = elem[dir];
				var match = false;

				while (elem) {
					if (elem.sizcache === doneName) {
						match = checkSet[elem.sizset];
						break;
					}

					if (elem.nodeType === 1) {
						if (!isXML) {
							elem.sizcache = doneName;
							elem.sizset = i;
						}
						if (typeof cur !== "string") {
							if (elem === cur) {
								match = true;
								break;
							}

						} else if (Sizzle.filter(cur, [elem]).length > 0) {
							match = elem;
							break;
						}
					}

					elem = elem[dir];
				}

				checkSet[i] = match;
			}
		}
	}

	var contains = document.compareDocumentPosition ? function(a, b) {
		return a.compareDocumentPosition(b) & 16;
	} : function(a, b) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

	var isXML = function(elem) {
		return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" || !!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
	};

	var posProcess = function(selector, context) {
		var tmpSet = [], later = "", match, root = context.nodeType ? [context] : context;

		// Position selectors must be done after the filter
		// And so must :not(positional) so we move all PSEUDOs to the end
		while ((match = Expr.match.PSEUDO.exec(selector))) {
			later += match[0];
			selector = selector.replace(Expr.match.PSEUDO, "");
		}

		selector = Expr.relative[selector] ? selector + "*" : selector;

		for (var i = 0, l = root.length; i < l; i++) {
			Sizzle(selector, root[i], tmpSet);
		}

		return Sizzle.filter(later, tmpSet);
	};

	// EXPOSE FOR QZFL
	QZFL.selector.engine = Sizzle;
})();
/**
 * @fileoverview QZFL Element对象
 * @version 1.$Rev: 1469 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-26 17:36:37 +0800 (星期三, 26 八月 2009) $
 */

;
(function() {
	/**
	 * @type QZFL.ElementHandler
	 */
	var _el = null;

	/**
	 * QZFL Element对象.
	 * 
	 * @namespace QZFL element 对象的前端控制器
	 * @requires QZFL.selector
	 * @type Object
	 */
	QZFL.element = {
		/**
		 * 获取 element 对象
		 * 
		 * @param {string} selector selector查询语句
		 *            @example
		 *            QZFL.element.get("div")
		 * @param {element} context element查询位置
		 * @see QZFL.ElementHandler
		 * @return QZFL.ElementHandler
		 */
		get : function(selector, context) {

			if (selector.nodeType) {
				selector = [selector];
			}
			return new _el(selector, context);
		},

		/**
		 * 扩展 QZFL elements Handler 对象接口
		 * 
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extend({show:function(){}})
		 */
		extend : function(object) {
			QZFL.namespace.extend(_el, object);
		},

		/**
		 * 扩展 QZFL elements Handler 构造函数接口
		 * 
		 * @param {object} object 扩展接口
		 *            @example
		 *            QZFL.element.extendFn({show:function(){}})
		 */
		extendFn : function(object) {
			QZFL.namespace.extend(_el.prototype, object);
		},

		/**
		 * 返回 QZFL Elements 对象的版本
		 * 
		 * @return {string}
		 */
		getVersion : function() {
			return _el.version;
		}
	}

	/**
	 * QZFL Element 控制器,通常不要请自传入非string参数
	 * 
	 * @param {string|elements} selector selector查询语句,或则一组elements对象
	 * @param {element} context element查询位置
	 * @class QZFL Element 控制器,通常不要请自传入非string参数
	 * @constructor
	 */
	QZFL.ElementHandler = function(selector, context) {
		/**
		 * 查询到的对象数组
		 * 
		 * @type array
		 */
		this.elements = null;

		/**
		 * 用来做一个标示区分
		 * 
		 * @ignore
		 */
		this._isElementHandler = true;

		this._init(selector, context);

	}
	
	_el = QZFL.ElementHandler;

	_el.prototype = /** @lends QZFL.ElementHandler.prototype */
	{
		/**
		 * 初始化 elementHandler对象
		 * 
		 * @private
		 */
		_init : function(selector, context) {
			if (typeof(selector) == "string") {
				this.elements = QZFL.selector.query(selector, context);
			} else {
				this.elements = selector;
			}
		},

		/**
		 * 查找 elements 对象
		 * 
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").findElements("li");
		 * @return {Array} elements 数组
		 */
		findElements : function(selector) {
			var _pushstack = [];
			this.each(function(el) {
				var _s = QZFL.selector.query(selector, el);

				if (_s.length > 0) {
					_pushstack = _pushstack.concat(_s);
				}
			});
			return _pushstack;
		},

		/**
		 * 查找 elements ,并且创建QZFL Elements 对象.
		 * 
		 * @param {string} selector selector查询语法
		 *            @example
		 *            $e("div").find("li");
		 * @return {QZFL.ElementHandler}
		 */
		find : function(selector) {
			return QZFL.element.get(this.findElements(selector));
		},

		/**
		 * 循环执行elements对象
		 * 
		 * @param {function} fn 批量执行的操作
		 *            @example
		 *            $e("div").each(function(n){alert("hello!" + n)});
		 */
		each : function(fn) {
			QZFL.object.each(this.elements, fn);
		},

		/**
		 * 和其他 Element Handler 或 elements Array 合并
		 * 
		 * @param {QZFL.ElementHandler|Array} elements Element Handler对象或则
		 *            Element 数组集合
		 *            @example
		 *            $e("div").concat($e("p"))
		 * @return {QZFL.ElementHandler}
		 */
		concat : function(elements) {
			return QZFL.element.get(this.elements.concat(!!elements._isElementHandler ? elements.elements : elements));
		},
		
		/**
		 * 通过 index 获取其中一个 Element Handler
		 * 
		 * @param {number} index 索引
		 * @return {QZFL.ElementHandler}
		 */
		get : function(index) {
			return QZFL.element.get(this.elements[index]);
		}
	}

	// QZFL.ElementHandler.prototype._init.prototype =
	// QZFL.ElementHandler.prototype;

	// 导出接口
	window.$e = QZFL.element.get;

})();


// 扩展 QZFL Element 接口
QZFL.element.extend(/** @lends QZFL.ElementHandler */
{
	/**
	 * QZFL Element 版本
	 * 
	 * @type String

	 */
	version : "1.0"
});

// Extend Events
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * 绑定事件
	 * 
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").bind("click",function(){});
	 */
	bind : function(evtType, fn) {
		this.each(function(el) {
			QZFL.event.addEvent(el, evtType, fn);
		});
	},

	/**
	 * 取消事件绑定
	 * 
	 * @param {string} evtType 事件类型
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").unBind("click",function(){});
	 */
	unBind : function(evtType, fn) {
		this.each(function(el) {
			QZFL.event.removeEvent(el, evtType, fn);
		});
	},

	/**
	 * 绑定单击事件
	 * 
	 * @param {function} fn 触发函数
	 *            @example
	 *            $e("div.head").onClick(function(){});
	 */
	onClick : function(fn) {
		this.bind("click", fn);
	},

	/**
	 * @param {} fn
	 */
	onHover : function(fn) {
		// TODO
	}
});

// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * 设置 dom 的html代码
	 * 
	 * @param {string} value
	 */
	setHtml : function(value) {
		this.setAttr("innerHTML", value);
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getHtml : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? _e.innerHTML : null;
	},
	
	/**
	 * @param {string} value
	 */
	setVal : function(value) {
		if (QZFL.object.getType(value) == "array") {
			var _v = "\x00" + value.join("\x00") + "\x00";
			this.each(function(el) {
				if (/radio|checkbox/.test(el.type)) {
					el.checked = el.nodeType && ("\x00" + _v.indexOf(el.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + el.name.toString() + "\x00") > -1);
				} else if (el.tagName == "SELECT") {
					//el.selectedIndex = -1;
					QZFL.object.each(el.options, function(e) {
						e.selected = e.nodeType == 1 && ("\x00" + _v.indexOf(e.value.toString() + "\x00") > -1 || _v.indexOf("\x00" + e.text.toString() + "\x00") > -1);
					});
				} else {
					el.value = value;
				}
			})

		} else {
			this.setAttr("value", value);
		}
	},
	
	/**
	 * @param {} index
	 * @return {}
	 */
	getVal : function(/* @default 0 */index) {
		var _e = this.elements[index || 0],_v;
		
		if (_e) {
			if (_e.tagName == "SELECT"){
				_v = [];
				if (_e.selectedIndex<0) {
					return null;
				}
				
				//如果是单选框
				if (_e.type == "select-one") {
					_v.push(_e.value);
				}else{
					QZFL.object.each(_e.options,function(e){
						if (e.nodeType == 1 && e.selected) {
							_v.push(e.value);
						}
					});
				}
			}else{
				_v = _e.value;
			}
		} else {
			return null
		}
		return _v;
	},
	
	/**
	 * @param {} className
	 */
	addClass : function(className) {
		this.each(function(el) {
			QZFL.css.addClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	removeClass : function(className) {
		this.each(function(el) {
			QZFL.css.removeClassName(el, className);
		})
	},

	/**
	 * @param {} className
	 */
	toggleClass : function(className) {
		this.each(function(el) {
			QZFL.css.toggleClassName(el, className);
		})
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getSize : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getSize(_e) : null;
	},

	/**
	 * @param {} index
	 * @return {}
	 */
	getXY : function(/* @default 0 */index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getXY(_e) : null;
	},

	/**
	 * @param {} width
	 * @param {} height
	 */
	setSize : function(width, height) {
		this.each(function(el) {
			QZFL.dom.setSize(el, width, height);
		})
	},

	/**
	 * @param {} X
	 * @param {} Y
	 */
	setXY : function(X, Y) {
		this.each(function(el) {
			QZFL.dom.setXY(el, X, Y);
		})
	},

	/**
	 * 
	 */
	hide : function() {
		this.each(function(el) {
			QZFL.dom.setStyle(el, "display", "none");
		})
	},

	/**
	 * 
	 */
	show : function() {
		this.each(function(el) {
			QZFL.dom.setStyle(el, "display", "");
		})
	},

	/**
	 * @param {} key
	 * @return {}
	 */
	getStyle : function(key, index) {
		var _e = this.elements[index || 0];
		return !!_e ? QZFL.dom.getStyle(_e, key) : null;
	},

	/**
	 * @param {} key
	 * @param {} value
	 */
	setStyle : function(key, value) {
		this.each(function(el) {
			QZFL.dom.setStyle(el, key, value);
		})
	},
	/**
	 * 设置dom的属性
	 * 
	 * @param {string} key 属性名称
	 * @param {string} value 属性
	 */
	setAttr : function(key, value) {
		key = (key=="class"?"className":key);
		
		this.each(function(el) {
			el[key] = value;
		});
	},

	/**
	 * 获取dom对象的属性
	 */
	getAttr : function(key, index) {
		key = (key=="class"?"className":key);
		var _e = this.elements[index || 0];
		return !!_e ? (_e[key] || _e.getAttribute(key)) : null;
	}
});

// Extend Element relation
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	/**
	 * @return {}
	 */
	getPrev : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getPreviousSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getNext : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = QZFL.dom.getNextSibling(el);
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getChildren : function() {
		var _arr = [];
		this.each(function(el) {
			var node = QZFL.dom.getFirstChild(el);
			while (node) {
				if (!!node && node.nodeType == 1) {
					_arr.push(node);
				}
				node = node.nextSibling;
			}
		});

		return QZFL.element.get(_arr);
	},

	/**
	 * @return {}
	 */
	getParent : function() {
		var _arr = [];
		this.each(function(el) {
			var _e = el.parentNode;
			//if (_e) {
				_arr.push(_e);
			//}
		});

		return QZFL.element.get(_arr);
	}
});

// Extend
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{

	/**
	 * @param {} tagName
	 * @param {} attributes
	 * @return {}
	 */
	create : function(tagName, attributes) {
		var _arr = [];
		this.each(function(el) {
			_arr.push(QZFL.dom.createElementIn(tagName, el, false, attributes));
		});
		return QZFL.element.get(_arr);
	},

	/**
	 * @param {} el
	 */
	appendTo : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el);
		this.each(function(element) {
			el.appendChild(element)
		});
	},

	/**
	 * @param {} el
	 */
	insertAfter : function(el) {
		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _ns = el.nextSibling, _p = el.parentNode;
		this.each(function(element) {
			_p[!_ns ? "appendChild" : "insertBefore"](element, _ns);
		});

	},

	/**
	 * @param {} el
	 */
	insertBefore : function(el) {

		var el = (el.elements && el.elements[0]) || QZFL.dom.get(el), _p = el.parentNode;
		this.each(function(element) {
			_p.insertBefore(element, el)
		});
	},

	/**
	 * 
	 */
	remove : function() {
		this.each(function(el) {
			QZFL.dom.removeElement(el);
		})
	}
});

/**
 * @fileoverview QZFL 函数队列系统，可以把一系列函数作为队列并且按顺序执行。在执行过程中函数出现的错误不会影响到下一个队列进程
 * @version 1.$Rev: 1484 $
 * @author QzoneWebGroup, ($LastChangedBy: yunishi $)
 * @lastUpdate $Date: 2009-09-03 20:05:31 +0800 (星期四, 03 九月 2009) $
 */

/**
 * 函数队列引擎
 * 
 * @param {string} key 队列名称
 * @param {array} queue 队列函数数组
 * @example QZFL.queue("test",[function(){alert(d)},function(){alert(2)}]);
 * QZFL.queue.run("test");
 * 
 * @namespace QZFL 队列引擎，给函数提供批量的队列执行方法
 * @return {Queue} 返回队列系统构造对象
 */
QZFL.queue = (function(){
	var _o = QZFL.object;
	var _queue = {};
	
	var _Queue = function(key,queue){
		if (this instanceof arguments.callee) {
			this._qz_queuekey = key;
			return this;
		}
		
		if (_o.getType(queue = queue || []) == "array"){
			_queue[key] = queue;
		}
		
		return new _Queue(key);
	};
	
	var _extend = /**@lends QZFL.queue*/{
		/**
		 * 往一个队列里插入一个新的函数
		 *
	 	 * @param {string|function} key 队列名称 当作为构造函数时则只需要直接传
		 * @param {function} fn 可执行的函数
		 * @example QZFL.queue("test");
		 * QZFL.queue.push("test",function(){alert("ok")});
		 * // 或者
		 * QZFL.queue("test").push(function(){alert("ok")});
		 */
		push : function(key,fn){
			fn = this._qz_queuekey?key:fn;
			_queue[this._qz_queuekey || key].push(fn);
		},
			
		/**
		 * 从队列里去除第一个函数，并且执行一次
		 * 
		 * @param {string} key 队列名称
		 * @example	QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.shift("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).shift();
		 * @return 返回第一个队列函数执行的结果
		 */
		shift : function(key) {
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				return QZFL.queue._exec(_q.shift());
			}
		},
		
		/**
		 * 返回队列长度
	 	 * @param {string} key 队列名称
	 	 * 
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.getLen("test");
		 *      // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).getLen();
		 * 
		 * @return 返回第一个队列函数执行的结果
		 */
		getLen: function(key){
			return _queue[this._qz_queuekey || key].length;
		},
			
		/**
		 * 执行队列
		 *
	 	 * @param {string} key 队列名称
		 * @example QZFL.queue("test",[function(){alert("ok")}]);
		 * QZFL.queue.run("test");
		 * // 或者
		 * QZFL.queue("test",[function(){alert("ok")}]).run();
		 */
		run : function(key){
			var _q = _queue[this._qz_queuekey || key];
			if (_q) {
				_o.each(_q,QZFL.queue._exec);
			}
		},
	
		/**
		 * 分时执行队列
		 *
	 	 * @param {string} key 队列名称
		 * @param {object} conf 可选参数 默认值为{'run': 100, 'wait': 50};每次运行100ms,暂停50ms再继续运行队列,直至队列为空
		 * @example QZFL.queue("test",[function(){alert("1")},function(){alert("2")},function(){alert("3")}]);
		 * QZFL.queue.timedChunk("test", {'runTime': 1000, 'waitTime': 40, 'onRunEnd': function(){alert('allRuned');}, 'onWait': function(){alert('wait');}});
		 * 
		 */
		timedChunk : function(key, conf){
			var _q = _queue[this._qz_queuekey || key], _conf;
			if (_q) {
				//合并用户传入的参数和默认参数
				_conf = QZFL.lang.propertieCopy(conf, QZFL.queue._tcCof, null, true);
				setTimeout(function(){
					var _start = +new Date();
					do {
						QZFL.queue.shift();
					} while (QZFL.queue.getLen(key) > 0 && (+new Date() - _start < _conf.runTime));

					if (QZFL.queue.getLen(key) > 0){
						setTimeout(arguments.callee, _conf.waitTime);
						_conf.onWait();
					} else {
						_conf.onRunEnd();
					}
				}, 0);
			}
		},
		
		/**
		 * 分时执行队列的默认参数
		 * 
		 */
		_tcCof : {
				'runTime': 50, //每次队列运行时间
				'waitTime': 25, //暂停时间
				'onRunEnd': QZFL.emptyFn,//队列全部运行完毕触发的事件（只触发一次）
				'onWait': QZFL.emptyFn//每次暂停时触发的事件（触发多次，有可能为零次）
		},
		
		/**
		 * 
		 */
		_exec : function(value,key,source){
			if (!value || _o.getType(value) != "function"){
				if (_o.getType(key) == "number") {
					source[key] = null;
				}
				return false;
			}
			
			try {
				return value();
			}catch(e){
				QZFL.console.print("QZFL Queue Got An Error: [" + e.name + "]  " + e.message,1)
			}
		}
	};
	
	_o.extend(_Queue.prototype,_extend);
	_o.extend(_Queue,_extend);
	
	return _Queue;
})();
/**
 * @fileoverview QZFL String 组件
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-05 16:26:13 +0800 (Wed, 05 Aug 2009) $
 */

/**
 * @namespace QZFL String 封装接口。
 * @type 
 */
QZFL.string = {};
/**
 * @fileoverview QZFL 通用接口核心库
 * @version 1.$Rev: 1392 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-08-05 16:26:13 +0800 (Wed, 05 Aug 2009) $
 */

/**
 * 通用扩展接口
 * 
 * @namespace 通用扩展接口
 */
QZFL.util = {
	/**
	 * 使用一个uri串制作一个类似location的对象
	 * 
	 * @param {String} s 所需字符串
	 * 
	 * @return QZFL.util.URI
	 * @see QZFL.util.URI
	 */
	buildUri : function(s) {
		return QZFL.util.URI(s);
	},
	
	/**
	 * 使用一个uri串制作一个类似location的对象
	 * 
	 * @param {String} s 所需字符串
	 * @class URI 引擎，可以把一个uri字符串转换成类似location的对象
	 * @constructor
	 */
	URI : function(s) {
		if (!QZFL.object.getType(s) == "string") {
			return null;
		}

		// 获取相对路径
		if (s.indexOf("://") < 1) {
				s = location.protocol + "//" + location.host + (s.indexOf("/") == 0 ? "" : location.pathname.substr(0, location.pathname.lastIndexOf("/") + 1)) + s;
		}

		var depart = s.split("://");
		if (QZFL.object.getType(depart) == "array" && depart.length > 1 && (/^[a-zA-Z]+$/).test(depart[0])) {
			this.protocol = depart[0].toLowerCase();
			var h = depart[1].split("/");
			if (QZFL.object.getType(h) == "array") {
				this.host = h[0];
				this.pathname = "/" + h.slice(1).join("/").replace(/(\?|\#).+/i, ""); // 修正pathname的返回错误
				this.href = s;
				var se = depart[1].lastIndexOf("?"), ha = depart[1].lastIndexOf("#");
				this.search = (se >= 0) ? depart[1].substring(se) : "";
				this.hash = (ha >= 0) ? depart[1].substring(ha) : "";
				if (this.search.length > 0 && this.hash.length > 0) {
					if (ha < se) {
						this.search = "";
					} else {
						this.search = depart[1].substring(se, ha);
					}
				}
				return this;
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}
/**
 * @fileoverview QZFL 通用接口扩展
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */
;
(function() {
	QZFL.object.extend(QZFL.util,
/**
 * @lends QZFL.util
 */
	{
		/**
		 * 复制到剪贴板，目前只支持IE 已经将上个版本jolt增加的剪贴板控制去除
		 * 认为在这里逻辑过多,建议设计统一的widget组件交付各个应用使用
		 * 
		 * @param {String} text 要复制的文本
		 * @return {Boolean} 写入剪贴板是否成功
		 * @example
		 * 			QZFL.util.copyToClip(text);
		 */
		copyToClip : function(text) {
			if (ua.ie) {
				return clipboardData.setData("Text", text);
			} else {
				var o = QZFL.shareObject.getValidSO();
				return o ? o.setClipboard(text) : false;
			}
		},

		/**
		 * 在页面上执行一段js语句文本
		 * 
		 * @param {String} js 一段js语句文本
		 * @example
		 * 			QZFL.util.evalGlobal(js);
		 */
		evalGlobal : function(js) {
			var obj = document.createElement('script');
			obj.type = 'text/javascript';
			obj.id = "__evalGlobal_" + QZFL.util.evalGlobal._counter;
			try {
				obj.innerHTML = js;
			} catch (e) {
				obj.text = js;
			}
			document.body.appendChild(obj);
			QZFL.util.evalGlobal._counter++;
			setTimeout('removeNode($("' + obj.id + '"));', 50);
		},

		/**
		 * 在页面上执行一段css语句文本,专供safari使用
		 * 
		 * @ignore
		 * @param {Object} st 一段style语句
		 * @example
		 * 			QZFL.util.runStyleGlobal(st);
		 */
		runStyleGlobal : function(st) {
			if (ua.safari) {
				var obj = document.createElement('style');
				obj.type = 'text/css';
				obj.id = "__runStyle_" + QZFL.util.runStyleGlobal._counter;
				try {
					obj.textContent = st;
				} catch (e) {
					alert(e.message);
				}
				var h = document.getElementsByTagName("head")[0];
				if (h) {
					h.appendChild(obj);
					QZFL.util.runStyleGlobal._counter++;
				}
			} else {
				rt.warn("plz use runStyleGlobal() in Safari!");
			}
		},

		/**
		 * http参数表系列化工具
		 * 
		 * @param {Object} o 用来表示参数列表的hashTable
		 * @return {String} 结果串
		 * @example
		 * 			QZFL.util.genHttpParamString(o);
		 */
		genHttpParamString : function(o) {
			if (QZFL.lang.isHashMap(o)) {
				var r = new QZFL.string.StringBuilder();
				try {
					for (var i in o) {
						r.append(i + "=" + QZFL.string.customEncode(o[i], "URICPT"));
					}
				} catch (ignore) {
					return '';
				}
				return r.toString("&");

			} else if (typeof(o) == 'string') {
				return o;
			} else {
				return '';
			}
		},

		/**
		 * 将一个http参数序列变为hash表
		 * 
		 * @param {String} s 源字符串
		 * @return {Object} 结果
		 * @example
		 * 			QZFL.util.splitHttpParamString(s);
		 */
		splitHttpParamString : function(s) {
			return QZFL.util.commonDictionarySplit(s, "&");
		},

		/**
		 * 将一个参数序列变为hash表
		 * 
		 * @param {String} s 源字符串
		 * @param {String} esp 项分隔符
		 * @param {String} vq 值封套
		 * @return {Object} 结果
		 * @example
		 * 			QZFL.util.commonDictionarySplit(s,esp,vq);
		 */
		commonDictionarySplit : function(s, esp, vq) {
			if (typeof(esp) == 'undefined') {
				esp = "&";
			}
			if (typeof(vq) == 'undefined') {
				vq = "";
			}
			var re_vq = new RegExp("^" + vq + "|" + vq + "$", "g");
			if (isString(s)) {
				var l = s.split(vq + esp), tmp, res = {};
				for (var i = 0, len = l.length; i < len; i++) {
					tmp = l[i].split("=");
					if (tmp.length > 1) {
						res[tmp[0]] = (tmp.slice(1).join("=")).replace(re_vq, "");
					} else {
						res[l[i]] = true;
					}
				}
				return res;
			} else {
				return {};
			}
		}
	});

	QZFL.util.evalGlobal._counter = 0;
	QZFL.util.runStyleGlobal._counter = 0;
})();

/**
 * @fileoverview 增强脚本语言处理能力
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */
 
 /**
 * 环境变量系统
 * 
 * @namespace QZFL.lang
 */
QZFL.lang = {
	/**
	 * 是否字符串
	 * 
	 * @param {Object} o 目标
	 * @example 
	 * 			QZFL.lang.isString(obj);
	 * @return {Boolean} 结果
	 */
	isString : function(o) {
		return QZFL.object.getType(o) == "string";
	},
	/**
	 * 是否数组对象
	 * 
	 * @param {Object} o 目标
	 * @example 
	 *          QZFL.lang.isArray(obj);
	 * @return {Boolean} 结果
	 */
	isArray : function(o) {
		return QZFL.object.getType(o) == "array";
	},
	/**
	 * 是否哈希表结构
	 * 
	 * @param {Object} o 目标
	 * @example
	 * 			QZFL.lang.isHashMap(obj);
	 * @return {Boolean} 结果
	 */
	isHashMap : function(o) {
		return QZFL.object.getType(o) == "object";
	},
	/**
	 * 是否DOM节点
	 * 
	 * @param {Object} o 目标
	 * @example
	 * 			QZFL.lang.isNode(obj);
	 * @return {Boolean} 结果
	 */
	isNode : function(o) {
		if (typeof(Node) == 'undefined') {
			Node = null;
		}
		try {
			if (!o || !((Node != undefined && o instanceof Node) || o.nodeName)) {
				return false;
			}
		} catch (ignored) {
			return false;
		}
		return true;
	},
	/**
	 * 是否Element
	 * 
	 * @param {Object} o 目标
	 * @example
	 * 			QZFL.lang.isElement(obj);
	 * @return {Boolean} 结果
	 */
	isElement : function(o) {
		 return o && o.nodeType == 1;
	},
	/**
	 * 是否是有效的xml数据
	 * 
	 * @param {object} o xmldom
	 * @example
	 * 			QZFL.lang.isValidXMLdom(obj);
	 * @return {Boolean} 结果
	 */
	isValidXMLdom : function(o) {
		if (!o) {
			return false;
		}

		if (!o.xml) {
			return false;
		}

		if (o.xml == "") {
			return false;
		}

		if (!(/^<\?xml/.test(o.xml))) {
			return false;
		}

		return true;
	},
	/**
	 * 将arguments对象转化为真数组
	 * 
	 * @param {Object} refArgs 对一个arguments对象的引用
	 * @param {Number} start 起始偏移量
	 * @example
	 * 			QZFL.lang.arg2arr(obj,1);//从第二个参数开始转化
	 * @return {Array} 结果数组
	 */
	arg2arr : function(refArgs, start) {
		if (typeof start == 'undefined') {
			start = 0;
		}
		return Array.prototype.slice.apply(refArgs, [start, refArgs.length]);
	},

	/**
	 * 以window为根,获取指定命名描述的值
	 * 
	 * @param {string} ns 描述,如: QZFL.foo.bar
	 * @param {boolean} [setup=false] 不存在则创建
	 * @example
	 * 			QZFL.lang.getObjByNameSpace("QZFL.foo.bar",true);
	 * @return {All} 获取到得值
	 */
	getObjByNameSpace : function(ns, setup) {
		if (typeof(ns) != 'string') {
			return ns;
		}
		var l = ns.split("."),
			r = window;

		try {
			for (var i = 0, len = l.length; i < len; ++i) {
				if(typeof(r[l[i]]) == 'undefined'){
					if(setup){
						r[l[i]] = {};
					}else{
						return void(0);
					}
				}
				r = r[l[i]];
			}
			return r;
		} catch (ignore) {
			return void(0);
		}
	},

	/**
	 * JSON数据深度复制
	 * 
	 * @param {All} obj 需要复制的JSON数据根部
	 * @param {String} preventName 需要过滤的字段
	 * @example
	 * 			QZFL.lang.objectClone(re,"msg");
	 * @return {All} 复制出的新JSON数据
	 */
	objectClone : function(obj, preventName) {
		if ((typeof obj) == 'object') {
			var res = (QZFL.lang.isArray(obj)) ? [] : {};
			for (var i in obj) {
				if (i != preventName)
					res[i] = objectClone(obj[i], preventName);
			}
			return res;
		} else if ((typeof obj) == 'function') {
			return (new obj()).constructor;
		}
		return obj;
	},


	/**
	 * JS Object convert to String
	 * @param {All} obj
	 * @example 
	 * 			QZFL.lang.obj2str(obj);
	 * @return {String} result
	 */
	obj2str : function(obj) {
		var t, sw;
		if ((typeof obj) == 'object') {
			if(obj === null){ return 'null'; }

			sw = QZFL.lang.isArray(obj);
			t = [];
			for (var i in obj) {
				t.push((sw ? "" : ("\"" + QZFL.string.escString(i) + "\":")) + obj2str(obj[i]));
			}
			t = t.join();
			return sw ? ("["+t+"]") : ("{"+t+"}");
		} else if ((typeof obj) == 'function') {
			return '';
		} else if ((typeof obj) == 'undefined') {
			return 'undefined';
		} else if ((typeof obj) == 'number') {
			return obj.toString();
		}
		return !obj ? "\"\"" : ("\"" + QZFL.string.escString(obj) + "\"");
	},

	/**
	 * 对象成员复制(浅表复制)
	 * 
	 * @param {Object} s 复制的目标对象
	 * @param {Object} b 复制的源对象
	 * @param {Object} [propertiSet] 所需要的属性名称集合
	 * @param {boolean} [notOverWrite=false] 不复写
	 * @example 
	 * 			QZFL.lang.propertieCopy(objt,objs,parray,false);
	 * @return {Object} 目标对象
	 */
	propertieCopy : function(s, b, propertiSet, notOverWrite) {
		// 如果propertiSet == null 或者 != Object，则使用b。
		var l = (!propertiSet || typeof(propertiSet) != 'object') ? b : propertiSet;
		
		s = s || {};
		
		for (var p in l) {
			if (!notOverWrite || !(p in s)) {
				s[p] = l[p];
			}
		}

		return s;
	},

	/**
	 * 顺序执行一系列方法，得到第一个成功执行的结果
	 * 
	 * @param {Functions} arguments... 可变参数，一系列函数执行
	 * @example
	 * 			QZFL.lang.tryThese(functionOne,functionTwo);
	 * @return {Object/undefined} 执行结果
	 */
	tryThese : function() {
		var res;
		for (var ii = 0, len = arguments.length; ii < len; ii++) {
			try {
				res = arguments[ii]();
				return res;
			} catch (ignore) {
			}
		}
		return res;
	},

	/**
	 * 将两个执行过程连接起来，注意，连接后不可再分开，且执行过程用Boolean型数据标识是否成功执行
	 * 
	 * @param {Function} u 要先执行的过程
	 * @param {Function} v 后执行的过程
	 * @example
	 * 			QZFL.lang.chain(functionOne,functionTwo);
	 * @return {Function} 连接后的执行过程
	 */
	chain : function(u, v) {
		var calls = [];
		for (var ii = 0, len = arguments.length; ii < len; ii++) {
			calls.push(arguments[ii]);
		}
		return (function() {
			for (var ii = 0, len = calls.length; ii < len; ii++) {
				if (calls[ii] && calls[ii].apply(null, arguments) === false) {
					return false;
				}
			}
			return true;
		});
	},

	/**
	 * 去除数组中重复的元素
	 * 
	 * @param {Array} arr
	 * @example 
	 * 			QZFL.lang.uniqueArray(arr);
	 * @return {Array} arr 去除重复元素的数组
	 */
	uniqueArray : function(arr) {
		var flag = {};

		var index = 0;
		while (index < arr.length) {
			if (flag[arr[index]] == typeof(arr[index])) {
				arr.splice(index, 1);
				continue;
			}

			flag[arr[index].toString()] = typeof(arr[index]);
			++index;
		}

		return arr;
	}
};
/**
 * @ignore
 */
QZFL.namespace.map(QZFL.lang);

/**
 * @fileoverview 封闭静态类ENV,管理环境变量
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 环境变量系统
 * 
 * @namespace QZFL.enviroment
 */
QZFL.enviroment = (function() {
	var _p = {},
		hookPool = {};

	/**
	 * 获取指定的环境变量
	 * 
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {All} 存储在环境变量中的数据
	 * @example
	 * 			QZFL.enviroment.envGet(kname);
	 */
	function envGet(kname) {
		return _p[kname];
	}

	/**
	 * 删除指定的环境变量
	 * 
	 * @ignore
	 * @param {String} kname 指定的环境变量名称
	 * @return {Boolean} 是否删除成功
	 * @example
	 * 			QZFL.enviroment.envDel(kname);
	 */
	function envDel(kname) {
		delete _p[kname];
		return true;
	}

	/**
	 * 以指定名称设置环境变量
	 * 
	 * @ignore
	 * @param {String} kname 名称
	 * @param {All} value 值
	 * @return {Boolean} 是否成功
	 * @example
	 * 			QZFL.enviroment.envSet(kname,value);
	 */
	function envSet(kname, value) {
		if (typeof value == 'undefined') {
			if (typeof kname == 'undefined') {
				return false;
			} else if (!(_p[kname] === undefined)) {
				//QZFL.runTime.warn("Do you want to set env var {0:q} to 'undefined'", kname);
				return false;
			}
		} else {
			_p[kname] = value;
			return true;
		}
	}

	return {
		/**
		 * 获取指定的环境变量
		 * 
		 * @param {String} kname 指定的环境变量名称
		 * @return {All} 存储在环境变量中的数据
		 * @memberOf QZFL.enviroment
		 */
		get : envGet,
		/**
		 * 以指定名称设置环境变量
		 * 
		 * @param {String} kname 名称
		 * @param {All} value 值
		 * @return {Boolean} 是否成功
		 * @memberOf QZFL.enviroment
		 */
		set : envSet,
		/**
		 * 删除指定的环境变量
		 * 
		 * @param {String} kname 指定的环境变量名称
		 * @return {Boolean} 是否删除成功
		 * @memberOf QZFL.enviroment
		 */
		del : envDel,
		/**
		 * 事件钩子存放根
		 * 
		 * @type {Object}
		 * @memberOf QZFL.enviroment
		 */
		hookPool : hookPool
	};
})();

/**
 * 命名空间QZFL.enviroment的全局缩写
 */
var ENV = QZFL.enviroment;

/**
 * 页面级别事件处理
 * 
 * @namespace QZFL.pageEvents
 * @example
 * 		QZFL.pageEvents.pageBaseInit();
 *		QZFL.pageEvents.onloadRegister(init);
 */
QZFL.pageEvents = (function() {
	/**
	 * 将queryString解析到环境变量
	 * 
	 * @ignore
	 */
	function _ihp() {
		var qs = location.search.substring(1),
			qh = location.hash.substring(1),
			s, h, n;

		ENV.set("_queryString", qs);
		ENV.set("_queryHash", qh);
		ENV.set("queryString", s = QZFL.util.splitHttpParamString(qs));
		ENV.set("queryHash", h = QZFL.util.splitHttpParamString(qh));

		//为QZFL设置调试级别
		if(s && s.DEBUG){
			n = parseInt(s.DEBUG, 10);
			if (!isNaN(n)) {
				QZFL.config.debugLevel = n;
			}
		}
		
	}

	/**
	 * 页面启动器
	 * 
	 * @ignore
	 */
	function _bootStrap() {
		if (document.addEventListener) {
			if (ua.safari) {
				var interval = setInterval(function() {
					if ((/loaded|complete/).test(document.readyState)) {
						_onloadHook();
						clearInterval(interval);
					}
				}, 50);
			} else {
				document.addEventListener("DOMContentLoaded", _onloadHook, true);
			}
		} else {
			var src = 'javascript:void(0)';
			if (window.location.protocol == 'https:') {
				src = '//:';
			}
			document.write('<script onreadystatechange="if(this.readyState==\'complete\'){this.parentNode.removeChild(this);QZFL.pageEvents._onloadHook();}" defer="defer" src="' + src + '"><\/script\>');
		}

		window.onload = QZFL.lang.chain(window.onload, function() {
			_onloadHook();
			_runHooks('onafterloadhooks');
		});
		/**
		 * 页面的onbeforeunload侦听
		 * 
		 * @ignore
		 */
		window.onbeforeunload = function() {
			return _runHooks('onbeforeunloadhooks');
		};
		window.onunload = QZFL.lang.chain(window.onunload, function() {
			_runHooks('onunloadhooks');
		});
	}

	/**
	 * 执行所有page onload方法,并且置标志
	 */
	function _onloadHook() {
		_runHooks('onloadhooks');
		QZFL.enviroment.loaded = true;
	}

	/**
	 * 执行一个挂钩方法
	 * 
	 * @param {Function} handler 指定的挂钩方法
	 */
	function _runHook(handler) {
		try {
			handler();
		} catch (ex) {
			//rt.error('Uncaught exception in hook (run after page load): {0}', ex);
		}
	}

	/**
	 * 执行所有指定名称的挂钩程序
	 * 
	 * @param {Object} hooks 挂钩名称
	 */
	function _runHooks(hooks) {
		var isbeforeunload = (hooks == 'onbeforeunloadhooks'),
			warn = null,
			hc = window.ENV.hookPool;

		do {
			var h = hc[hooks];
			if (!isbeforeunload) {
				hc[hooks] = null;
			}
			if (!h) {
				break;
			}
			for (var ii = 0; ii < h.length; ii++) {
				if (isbeforeunload) {
					warn = warn || h[ii]();
				} else {
					h[ii]();
				}
			}
			if (isbeforeunload) {
				break;
			}
		} while (hc[hooks]);

		if (isbeforeunload) {
			if (warn) {
				return warn;
			} else {
				QZFL.enviroment.loaded = false;
			}
		}
	}

	/**
	 * 增加事件挂钩
	 * 
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 */
	function _addHook(hooks, handler) {
		var c = window.ENV.hookPool;
		(c[hooks] ? c[hooks] : (c[hooks] = [])).push(handler);
	}

	/**
	 * 插入事件挂钩
	 * 
	 * @param {Object} hooks 挂钩名称
	 * @param {Function} handler 目标方法
	 * @param {Number} position 目标位置
	 */
	function _insertHook(hooks, handler, position) {
		var c = window.ENV.hookPool;
		if (typeof(position) == 'number' && position >= 0 && c[hooks]) {
			c[hooks].splice(position, 0, handler);
		} else {
			return false;
		}
	}

	/**
	 * 页面onload方法注册
	 * 
	 * @param {Function} handler 需要注册的页面onload方法引用
	 */
	function _lr(handler) {
		QZFL.enviroment.loaded ? _runHook(handler) : _addHook('onloadhooks', handler);
	}

	/**
	 * 页面onbeforeunload方法注册
	 * 
	 * @param {Function} handler 需要注册的页面onbeforeunload方法引用
	 */
	function _bulr(handler) {
		_addHook('onbeforeunloadhooks', handler);
	}

	/**
	 * 页面onunload方法注册
	 * 
	 * @param {Function} handler 需要注册的页面onunload方法引用
	 */
	function _ulr(handler) {
		_addHook('onunloadhooks', handler);
	}

	/**
	 * 页面初始化过程
	 */
	function pinit() {
		_bootStrap();
		_ihp();
		ua.adjustBehaviors();

		/**
		 * 错误输出
		 */
		var _dt = $("__DEBUG_out");
		if (_dt) {
			ENV.set("dout", _dt);
		}

		/**
		 * alert方法重定义
		 */
		var __dalert;
		if (!ENV.get("alertConverted")) {
			__dalert = alert;
			eval('var alert=function(msg){if(msg!=undefined){__dalert(msg);return msg;}}');// sds
			// 这里以后可以考虑更复杂的重定向
			ENV.set("alertConverted", true);
		}

		var t = ENV.get("queryHash");
		if(t && t.DEBUG){
			QZFL.config.debugLevel = 2;
		}

	}

	return {
		onloadRegister : _lr,
		onbeforeunloadRegister : _bulr,
		onunloadRegister : _ulr,
		initHttpParams : _ihp,
		bootstrapEventHandlers : _bootStrap,
		_onloadHook : _onloadHook,
		insertHooktoHooksQueue : _insertHook,
		pageBaseInit : pinit
	};
})();

/**
 * @fileoverview QZFL String 组件
 * @version 1.$Rev: 1517 $
 * @author QzoneWebGroup, ($LastChangedBy: rizenguo $)
 * @lastUpdate $Date: 2009-10-13 10:53:29 +0800 (星期二, 13 十月 2009) $
 */

(function() {
	QZFL.object.extend(QZFL.string, /**@lends QZFL.string*/{

		RegExps : {
			trim : /^\s*|\s*$/g,
			ltrim : /^\s*/g,
			rtrim : /\s*$/g,
			nl2br : /\n/g,
			s2nb : /[\x20]{2}/g,
			URIencode : /[\x09\x0A\x0D\x20\x21-\x29\x2B\x2C\x2F\x3A-\x3F\x5B-\x5E\x60\x7B-\x7E]/g,
			escHTML : {
				re_amp : /&/g,
				re_lt : /</g,
				re_gt : />/g,
				re_apos : /\x27/g,
				re_quot : /\x22/g
			},

			escString : {
				bsls : /\\/g,
				nl : /\n/g,
				rt : /\r/g,
				tab : /\t/g
			},

			restXHTML : {
				re_amp : /&amp;/g,
				re_lt : /&lt;/g,
				re_gt : /&gt;/g,
				re_apos : /&(?:apos|#0?39);/g,
				re_quot : /&quot;/g
			},

			write : /\{(\d{1,2})(?:\:([xodQqb]))?\}/g,
			isURL : /^(?:ht|f)tp(?:s)?\:\/\/(?:[\w\-\.]+)\.\w+/i,
			cut : /[\x00-\xFF]/,

			getRealLen : {
				r0 : /[^\x00-\xFF]/g,
				r1 : /[\x00-\xFF]/g
			}
		},

		/**
		 * 通用替换
		 * 
		 * @ignore
		 * @param {String} s 需要进行替换的字符串
		 * @param {String/RegExp} p 要替换的模式的 RegExp 对象
		 * @param {String} r 一个字符串值。规定了替换文本或生成替换文本的函数。
		 * @example 
		 * 			QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
		 * @return {String} 处理结果
		 */
		commonReplace : function(s, p, r) {
			return s.replace(p, r);
		},

		/**
		 * 通用系列替换
		 * 
		 * @ignore
		 * @param {String} s 需要进行替换的字符串
		 * @param {Object} l RegExp对象hashMap
		 * @example 
		 * 			QZFL.string.listReplace(str,regHashmap);
		 * @return {String} 处理结果
		 */
		listReplace : function(s, l) {
			if (isHashMap(l)) {
				for (var i in l) {
					s = (QZFL.string.commonReplace(s, l[i], i) || s);
				}
				return s;
			} else {
				return s;
			}
		},

		/**
		 * 字符串前后去空格
		 * 
		 * @param {String} str 目标字符串
		 * @example 	
		 * 			QZFL.string.trim(str);
		 * @return {String} 处理结果
		 */
		trim : function(str) {
			return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.trim, '');
		},

		/**
		 * 字符串前去空格
		 * 
		 * @param {String} str 目标字符串
		 * @example 
		 * 			QZFL.string.ltrim(str);
		 * @return {String} 处理结果
		 */
		ltrim : function(str) {
			return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.ltrim, '');
		},

		/**
		 * 字符串后去空格
		 * 
		 * @param {String} str 目标字符串
		 * @example 
		 * 			QZFL.string.rtrim(str);
		 * @return {String} 处理结果
		 */
		rtrim : function(str) {
			return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.rtrim, '');
		},

		/**
		 * 制造html中换行符
		 * 
		 * @param {String} str 目标字符串
		 * @example 
		 * 			QZFL.string.nl2br(str);
		 * @return {String} 结果
		 */
		nl2br : function(str) {
			return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.nl2br, '<br />');
		},

		/**
		 * 制造html中空格符，爽替换
		 * 
		 * @param {String} str 目标字符串
		 * @example
		 * 			QZFL.string.s2nb(str);
		 * @return {String} 结果
		 */
		s2nb : function(str) {
			return QZFL.string.commonReplace(str + "", QZFL.string.RegExps.s2nb, '&nbsp;&nbsp;');
		},

		/**
		 * 对非汉字做URIencode
		 * 
		 * @param {String} str 目标字符串
		 * @example 
		 * 			QZFL.string.URIencode(str);
		 * @return {String} 结果
		 */
		URIencode : function(str) {
			var cc, ccc;
			return (str + "").replace(QZFL.string.RegExps.URIencode, function(a) {
				if (a == "\x20") {
					return "+";
				} else if (a == "\x0D") {
					return "";
				}
				cc = a.charCodeAt(0);
				ccc = cc.toString(16);
				return "%" + ((cc < 16) ? ("0" + ccc) : ccc);
			});
		},

		/**
		 * htmlEscape
		 * 
		 * @param {String} str 目标串
		 * @example 
		 * 			QZFL.string.escHTML(str);
		 * @return {String} 结果
		 */
		escHTML : function(str) {
			var t = QZFL.string.RegExps.escHTML;
			return QZFL.string.listReplace((str + ""), { 
			/*
			 * '&' must be
			 * escape first
			 */
				'&amp;' : t.re_amp,
				'&lt;' : t.re_lt,
				'&gt;' : t.re_gt,
				'&#039;' : t.re_apos,
				'&quot;' : t.re_quot
			});
		},

		/**
		 * CstringEscape
		 * 
		 * @param {String} str 目标串
		 * @return {String} 结果
		 */
		escString : function(str) {
			var t = QZFL.string.RegExps.escString;
			return QZFL.string.listReplace((str + ""), { /*
															 * '\' must be
															 * escape first
															 */
				'\\\\' : t.bsls,
				'\\n' : t.nl,
				'' : t.rt,
				'\\t' : t.tab,
				'\\\'' : t.re_apos,
				'\\"' : t.re_quot
			});
		},

		/**
		 * htmlEscape还原
		 * 
		 * @param {String} str 目标串
		 * @return {String} 结果
		 */
		restHTML : function(str) {
			if (!QZFL.string.restHTML.__utilDiv) {
				/**
				 * 工具DIV
				 * 
				 * @ignore
				 */
				QZFL.string.restHTML.__utilDiv = document.createElement("div");
			}
			var t = QZFL.string.restHTML.__utilDiv;
			t.innerHTML = (str + "");
			if (typeof(t.innerText) != 'undefined') {
				return t.innerText;
			} else if (typeof(t.textContent) != 'undefined') {
				return t.textContent;
			} else if (typeof(t.text) != 'undefined') {
				return t.text;
			} else {
				return '';
			}
		},

		/**
		 * xhtmlEscape还原
		 * 
		 * @param {String} str 目标串
		 * @return {String} 结果
		 */
		restXHTML : function(str) {
			var t = QZFL.string.RegExps.restXHTML;
			return QZFL.string.listReplace((str + ""), { /*
															 * '&' must be
															 * escape last
															 */
				'<' : t.re_lt,
				'>' : t.re_gt,
				'\x27' : t.re_apos,
				'\x22' : t.re_quot,
				'&' : t.re_amp
			});
		},

		/**
		 * 字符串格式输出工具
		 * 
		 * @param {String} 输出模式
		 * @param {Arguments} Arguments... 可变参数，表示模式中占位符处实际要替换的值
		 * @return {String} 结果字符串
		 */
		write : function(strFormat, someArgs) {
			if (arguments.length < 1 || !isString(strFormat)) {
				// rt.warn('No patern to write()');
				return '';
			}
			var rArr = arg2arr(arguments), result = rArr.shift(), tmp;

			return result.replace(QZFL.string.RegExps.write, function(a, b, c) {
				b = parseInt(b, 10);
				if (b < 0 || (typeof rArr[b] == 'undefined')) {
					// rt.warn('write() wrong patern:{0:Q}', strFormat);
					return '(n/a)';
				} else {
					if (!c) {
						return rArr[b];
					} else {
						switch (c) {
							case 'x' :
								return '0x' + rArr[b].toString(16);
							case 'o' :
								return 'o' + rArr[b].toString(8);
							case 'd' :
								return rArr[b].toString(10);
							case 'Q' :
								return '\x22' + rArr[b].toString(16) + '\x22';
							case 'q' :
								return '`' + rArr[b].toString(16) + '\x27';
							case 'b' :
								return '<' + !!rArr[b] + '>';
						}
					}
				}
			});
		},

		/**
		 * 是否是一个可接受的URL串
		 * 
		 * @param {String} s 目标串
		 * @return {Boolean} 结果
		 */
		isURL : function(s) {
			return QZFL.string.RegExps.isURL.test(s);
		},

		/**
		 * 按指定编码重编字符串
		 * 
		 * @param {String} s 源字符串
		 * @param {String} type 类型说明字
		 * @return {String} 结果字符串
		 */
		customEncode : function(s, type) {
			var r;
			if (typeof type == 'undefined') {
				type = '';
			}
			switch (type.toUpperCase()) {
				case "URICPT" :
					r = encodeURIComponent(s);
					break;
				default :
					r = encodeURIComponent(s);
			}
			return r;
		},

		/**
		 * 包装的escape函数
		 * 
		 * @param {String} s 源字符串
		 * @return {String} 结果串
		 */
		escapeURI : function(s) {
			if (!isString(s)) {
				return '';
			}
			if (window.encodeURIComponent) {
				return encodeURIComponent(s);
			}
			if (window.escape) {
				return escape(s);
			}
		},

		/**
		 * 尝试解析一段文本为XML节点
		 * 
		 * @param {Object} text 待解析的文本
		 * @return {Object/null} 返回结果,失败是null,成功是documentElement
		 */
		parseXML : function(text) {
			if (window.ActiveXObject) {
				var doc = QZFL.lang.tryThese(function() {
					return new ActiveXObject('MSXML2.DOMDocument.6.0');
				}, function() {
					return new ActiveXObject('MSXML2.DOMDocument.5.0');
				}, function() {
					return new ActiveXObject('MSXML2.DOMDocument.4.0');
				}, function() {
					return new ActiveXObject('MSXML2.DOMDocument.3.0');
				}, function() {
					return new ActiveXObject('MSXML2.DOMDocument');
				}, function() {
					return new ActiveXObject('Microsoft.XMLDOM');
				});

				doc.async = "false";
				doc.loadXML(text);
				if (doc.parseError.reason) {
					// rt.error(doc.parseError.reason);
					return null;
				}
			} else {
				var parser = new DOMParser();
				var doc = parser.parseFromString(text, "text/xml");
				if (doc.documentElement.nodeName == 'parsererror') {
					// rt.error(doc.documentElement.textContent);
					return null;
				}
			}
			var x = doc.documentElement;
			return x;
		},

		/**
		 * 用指定字符补足需要的数字位数
		 * 
		 * @param {String} s 源字符串
		 * @param {Number} l 长度
		 * @param {String} [ss="0"] 指定字符
		 * @param {Boolean} [isBack=false] 补足的方向: true 后方; false 前方;
		 * @return {String} 返回的结果串
		 */
		fillLength : function(s, l, ss, isBack) {
			if (typeof(s) != 'string') {
				s = s.toString();
			}
			if (s.length < l) {
				var res = (1 << (l - s.length)).toString(2).substring(1);
				if (typeof(ss) != 'undefined' && !!ss) {
					res = res.replace("0", ss.toString()).substring(1);
				}
				return isBack ? (s + res) : (res + s);
			} else {
				return s;
			}
		},

		/**
		 * 用制定长度切割给定字符串
		 * 
		 * @param {String} s 源字符串
		 * @param {Number} bl 期望长度(字节长度)
		 * @param {String} tails 增加在最后的修饰串,比如"..."
		 * @return {String} 结果串
		 */
		cut : function(s, bl, tails) {
			if (typeof(s) != 'string')
				return '';
			if (typeof(tails) == 'undefined')
				tails = "";
			if (QZFL.string.getRealLen(s) <= bl) {
				return s;
			}
			var res = [], tmp;
			for (var i = 0, cnt = 0, len = s.length; i < len && cnt < bl; ++i) {
				res.push(tmp = s.charAt(i));
				if (QZFL.string.RegExps.cut.test(tmp)) {
					cnt++;
				} else {
					cnt += 2;
				}
			}
			return res.join("") + tails;
		},

		/**
		 * 计算字符串的真实长度
		 * 
		 * @param {String} s 源字符串
		 * @param {Boolean} [isUTF8=false] 标示是否是utf-8计算
		 * @return {Number} 结果长度
		 */
		getRealLen : function(s, isUTF8) {
			if (typeof(s) != 'string') {
				return 0;
			}

			if (!isUTF8) {
				return s.replace(QZFL.string.RegExps.getRealLen.r0, "**").length;
			} else {
				var cc = s.replace(QZFL.string.RegExps.getRealLen.r1, "");
				return (s.length - cc.length) + (encodeURI(cc).length / 3);
			}
		}
	})
})();

/**
 * 格式化输出时间
 * 
 * @param {Number/Object} s 毫秒数绝对是间,Date对象
 * @param {String} [format] 格式说明串 {y} {Y} {M}.......
 * @param {Date} [t0] 相对时间基准对象
 * @return {String} 格式输出
 */
QZFL.string.timeFormatString = function(s, format, t0) {
	var n, _s = QZFL.string.timeFormatString;

	// 初始化时间转换的一些必备参数
	if (!_s._init) {
		_s._dL = ["_ds", "_dm", "_dh", "_dd", "_dM", "_dy"];
		_s.re = /\{([_yYMdhms]{1,2})(\:[\d\w\s]|)\}/g;

		// 换算时间之间秒数
		QZFL.object.each([1000, 60, 60, 24, 30, 12], function(value, key) {
			_s[_s._dL[key]] = !_s._dL[key - 1] ? value : _s[_s._dL[key - 1]] * value;
		});
		_s._init = true;
	}

	if (typeof(s) == 'number') {
		n = new Date();
		n.setTime(s);
		s = n;
	}
	if (typeof(s) == 'object') {
		try {
			s.getTime();
		} catch (err) {
			// rt.error("需要输入时间对象");
			return "";
		}
		if (typeof(format) != 'string') {
			return s.toString();
		} else {
			return format.replace(_s.re, function(a, b, c) {
				var tmp = _s._fnSplit[b];
				return (typeof(tmp) == "function") ? tmp(s, c, _s, t0) : a;
			});
		}
	}
}

// QZFL.string.timeFormatString._ds = 1000;
// QZFL.string.timeFormatString._dm = QZFL.string.timeFormatString._ds * 60;
// QZFL.string.timeFormatString._dh = QZFL.string.timeFormatString._dm * 60;
// QZFL.string.timeFormatString._dd = QZFL.string.timeFormatString._dh * 24;
// QZFL.string.timeFormatString._dM = QZFL.string.timeFormatString._dd * 30;
// QZFL.string.timeFormatString._dy = QZFL.string.timeFormatString._dM * 12;

QZFL.string.timeFormatString._fnSplit = {
	'y' : function(s, c) {
		var tmp = s.getYear().toString();
		return QZFL.string.fillLength(tmp.substring(tmp.length - 2), 2);
	},
	'_y' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._dy;
		return Math.floor(tmp);
	},
	'Y' : function(s, c) {
		return QZFL.string.fillLength(s.getFullYear(), 2);
	},
	'M' : function(s, c) {
		return QZFL.string.fillLength(s.getMonth() + 1, 2, c);
	},
	'_M' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._dM;
		return Math.floor(tmp);
	},
	'd' : function(s, c) {
		return QZFL.string.fillLength(s.getDate(), 2, c);
	},
	'_d' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._dd;
		return Math.floor(tmp);
	},
	'h' : function(s, c) {
		return QZFL.string.fillLength(s.getHours(), 2, c);
	},
	'_h' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._dh;
		return Math.floor(tmp);
	},
	'm' : function(s, c) {
		return QZFL.string.fillLength(s.getMinutes(), 2);
	},
	'_m' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._dm;
		return Math.floor(tmp);
	},
	's' : function(s, c) {
		return QZFL.string.fillLength(s.getSeconds(), 2);
	},
	'_s' : function(s, c, _s, t0) {
		var tmp = Math.abs(s - t0) / _s._ds;
		return Math.floor(tmp);
	}
};

/**
 * 字符串连加器
 * 
 * @class StringBuilder
 * @constructor
 */
QZFL.string.StringBuilder = function() {
	this._strList = arg2arr(arguments);
};

QZFL.string.StringBuilder.prototype = {

	/**
	 * 增加一段字符串
	 * 
	 * @param {String} str 需要加入的字符串
	 */
	append : function(str) {
		if (isString(str)) {
			this._strList.push(str.toString());
		}
	},

	/**
	 * 在最前追加一段字符串
	 * 
	 * @param {String} str 需要加入的字符串
	 */
	insertFirst : function(str) {
		if (isString(str)) {
			this._strList.unshift(str.toString());
		}
	},

	/**
	 * 增加一系列字符串
	 * 
	 * @param {Array} arr 需要加入的字符串数组
	 */
	appendArray : function(arr) {
		if (isArray(arr)) {
			this._strList = this._strList.concat(arr);
		}
	},
	/**
	 * 序列化方法实现
	 * 
	 * @param {String} spliter 用来分割字符组的符号
	 * @return {String} 字符串连加器结果
	 */
	toString : function(spliter) {
		return this._strList.join(!spliter ? '' : spliter);
	},
	/**
	 * 清空
	 */
	clear : function() {
		this._strList.splice(0, this._strList.length);
	}
};

/**
 * @fileoverview Qzone TWEEN类，主要负责参数计算以实现动画效果
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 * @requires QZFL.css
 * @requires QZFL.transitions
 */

/**
 * Qzone TWEEN类，一般用于动画表现效果奇怪了
 * @namespace QZFL.Tween
 * @param {HTMLElement} el html
 * @param {string} property 对象的属性名
 * @param {function} func 算子函数
 * @param {string|number} startValue 初始值
 * @param {string|number} finishValue 结束值
 * @param {number} duration 动画存活时间, 秒单位
 * @constructor
 * @example
 * 			var tw = new QZFL.Tween(QZFL.dom.get("bar"),"width",null,"1px","300px",1);
 * 			tw.start();
 */
QZFL.Tween = function(el, property, func, startValue, finishValue, duration) {
	this._func = func || QZFL.transitions.simple;
	this._obj = QZFL.dom.get(el);

	// 判断是否是颜色值
	this.isColor = /^#/.test(startValue);

	this._prop = property;

	var reSuffix = /\d+([a-z%]+)/i.exec(startValue);

	this._suffix = reSuffix ? reSuffix[1] : "";

	this._startValue = this.isColor ? 0 : parseFloat(startValue);
	this._finishValue = this.isColor ? 100 : parseFloat(finishValue);

	// 颜色过渡处理
	if (this.isColor) {
		// 把16进制的颜色转换成10进制
		this._startColor = QZFL.css.convertHexColor(startValue);
		this._finishColor = QZFL.css.convertHexColor(finishValue);
	}

	this._duration = duration || 10;

	this._timeCount = 0;
	this._startTime = 0;

	this._changeValue = this._finishValue - this._startValue;
	this.currentValue = 0;

	/**
	 * 是否正在播放
	 */
	this.isPlayed = false;

	/**
	 * 是否循环
	 */
	this.isLoop = false;

	/**
	 * 动画开始
	 * 
	 * @event 动画开始
	 */
	this.onMotionStart = QZFL.emptyFn;

	/**
	 * 动画执行中
	 * 
	 * @param {object} obj 对象
	 * @param {string} prop 对象属性
	 * @param {string|number} value 结算结果
	 * @event 动画执行中
	 */
	this.onMotionChange = QZFL.emptyFn;

	/**
	 * 动画停止播放
	 * 
	 * @event 动画停止播放
	 */
	this.onMotionStop = QZFL.emptyFn;
};

/**
 * 开始播放Tween类动画
 * 
 * @param {bool} loop 是否循环
 * @return 空
 */
QZFL.Tween.prototype.start = function(loop) {
	this._reloadTimer();
	this.isPlayed = true;
	this._runTime();
	this.isLoop = loop ? true : false;
	this.onMotionStart.apply(this);
	return "d"
};

/**
 * 暂停动画
 */
QZFL.Tween.prototype.pause = function() {
	this.isPlayed = false;
};

/**
 * 停止动画
 */
QZFL.Tween.prototype.stop = function() {
	this.isPlayed = false;
	this._playTime(this._duration + 0.1);
};

/**
 * 初始化开始时间
 */
QZFL.Tween.prototype._reloadTimer = function() {
	this._startTime = new Date().getTime() - this._timeCount * 1000;
};

/**
 * 通过时间计算动画
 * 
 * @param {time} time 时间参数
 */
QZFL.Tween.prototype._playTime = function(time) {
	var _isEnd = false;
	if (time > this._duration) {
		time = this._duration;
		_isEnd = true;
	}

	// 计算属性值
	var pValue = this._func(time, this._startValue, this._changeValue, this._duration);

	// 判断是否需要取整
	this.currentValue = /(opacity)/i.test(this._prop) ? pValue : Math.round(pValue);

	// 是否需要处理颜色
	if (this.isColor) {
		this.currentValue = this.getColor(this._startColor, this._finishColor, pValue);
	}

	var _try2setCSS = QZFL.dom.setStyle(this._obj, this._prop, this.currentValue + this._suffix);
	if (!_try2setCSS) {
		this._obj[this._prop] = this.currentValue + this._suffix;
	}

	this.onMotionChange.apply(this, [this._obj, this._prop, this.currentValue]);

	// 判断是否播放结束
	if (_isEnd) {
		this.isPlayed = false;
		// 循环播放
		if (this.isLoop) {
			this.isPlayed = true;
			this._reloadTimer();
		}
		this.onMotionStop.apply(this);

		// 播放完成强迫IE回收内存
		if (window.CollectGarbage)
			CollectGarbage();
	}
};

/**
 * 开始计时
 */
QZFL.Tween.prototype._runTime = function() {
	var o = this;
	if (o.isPlayed) {
		o._playTime((new Date().getTime() - this._startTime) / 1000);
		setTimeout(function() {
			o._runTime.apply(o, [])
		}, 0);
	}
};

/**
 * 获得动画播放百分比
 * 
 * @return 返回百分比数值
 */
QZFL.Tween.prototype.getPercent = function() {
	return (this.currentValue - this._startValue) / this._changeValue * 100;
};

/**
 * 交换初始值和结束值
 */
QZFL.Tween.prototype.swapValue = function() {
	if (this.isColor) {
		var tempValue = this._startColor.join(",");
		this._startColor = this._finishColor;
		this._finishColor = tempValue.split(",");
	} else {
		var tempValue = this._startValue;
		this._startValue = this._finishValue;
		this._finishValue = tempValue;
		this._changeValue = this._finishValue - this._startValue;
	}
};

/**
 * 根据百分比计算颜色过渡值
 * 
 * @param {array|string} startColor 初始颜色值10进制 RGB 格式
 * @param {array|string} finishColor 目标颜色值10进制 RGB 格式
 * @param {number} percent 百分比
 * @return 返回16进制颜色
 */
QZFL.Tween.prototype.getColor = function(startColor, finishColor, percent) {
	var _sc = startColor;
	var _fc = finishColor;
	var _color = [];

	if (percent > 100) {
		percent = 100;
	}
	if (percent < 0) {
		percent = 0;
	}

	for (var i = 0; i < 3; i++) {
		_color[i] = Math.floor(_sc[i] * 1 + (percent / 100) * (_fc[i] - _sc[i])).toString(16);
		if (_color[i].length < 2) {
			_color[i] = "0" + _color[i];
		}
	}

	return "#" + _color.join("");
};

/**
 * 给tween类提供更多的动画算法
 * 
 * @namespace QZFL.transitions
 */
QZFL.transitions = {
	/**
	 * 简单算子，作为默认算子
	 */
	simple : function(time, startValue, changeValue, duration) {
		return changeValue * time / duration + startValue;
	},

	/**
	 * 有规律地渐进效果
	 */
	regularEaseIn : function(t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	/**
	 * 有规律地渐出效果
	 */
	regularEaseOut : function(t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	/**
	 * 有规律地渐进渐出效果
	 */
	regularEaseInOut : function(t, b, c, d) {
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t + b;
		}
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	}
}

/**
 * @fileoverview 扩展QZFL.transitions类
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

QZFL.object.extend(QZFL.transitions,
/**
 * 扩展的接口,扩展动画的几种效果
 * @lends QZFL.transitions
 * @example 
 * 		var trans=QZFL.transitions.backEaseIn;
 */
{
	backEaseIn : function(t, b, c, d) {
		var s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},

	backEaseOut : function(t, b, c, d, a, p) {
		var s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},

	backEaseInOut : function(t, b, c, d, a, p) {
		var s = 1.70158;
		if ((t /= d / 2) < 1) {
			return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		}
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},

	bounceEaseOut : function(t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		}
	},

	bounceEaseIn : function(t, b, c, d) {
		return c - QZFL.transitions.bounceEaseOut(d - t, 0, c, d) + b;
	},

	bounceEaseInOut : function(t, b, c, d) {
		if (t < d / 2) {
			return QZFL.transitions.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
		} else
			return QZFL.transitions.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	},

	strongEaseIn : function(t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},

	strongEaseOut : function(t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},

	strongEaseInOut : function(t, b, c, d) {
		if ((t /= d / 2) < 1) {
			return c / 2 * t * t * t * t * t + b;
		}
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},

	elasticEaseIn : function(t, b, c, d, a, p) {
		if (t == 0)
			return b;
		if ((t /= d) == 1)
			return b + c;
		if (!p)
			p = d * 0.3;
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},

	elasticEaseOut : function(t, b, c, d, a, p) {
		if (t == 0)
			return b;
		if ((t /= d) == 1)
			return b + c;
		if (!p)
			p = d * 0.3;
		if (!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	},

	elasticEaseInOut : function(t, b, c, d, a, p) {
		if (t == 0) {
			return b;
		}

		if ((t /= d / 2) == 2) {
			return b + c;
		}

		if (!p) {
			var p = d * (0.3 * 1.5);
		}

		if (!a || a < Math.abs(c)) {
			var a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		if (t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	}
});
/**
 * @fileoverview 把tween类的接口封装到QZFL Elements
 * @version 1.$Rev: 1485 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2009-09-07 09:49:03 +0800 (星期一, 07 九月 2009) $
 */
;(function() {
	/**
	 * resize和move的算法
	 */
	var _easeAnimate = function(_t, a1, a2, ease) {
		var _s = QZFL.dom["get" + _t](this), _reset = typeof a1 != "number" && typeof a2 != "number";

		if (_t == "Size" && _reset) {
			QZFL.dom["set" + _t](this, a1, a2);
			var _s1 = QZFL.dom["get" + _t](this);
			a1 = _s1[0];
			a2 = _s1[1];
		}

		var _v1 = _s[0] - a1;
		var _v2 = _s[1] - a2;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);

		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2];
			QZFL.dom["set" + _t](this, typeof a1 != "number" ? _s[0] : (_s[0] - _p / 100 * _v1), typeof a2 != "number" ? _s[1] : (_s[1] - _p / 100 * _v2));
		});

		// reset size to auto
		if (_t == "Size" && _reset) {
			n.onMotionStop = QZFL.event.bind(this, function() {

				QZFL.dom["set" + _t](this);

			});
		}

		n.start();
	};

	var _easeShowAnimate = function(_t, ease) {
		var n = new QZFL.Tween(this, "opacity", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, (_t ? 0 : 1), (_t ? 1 : 0), 0.5);
		n[_t ? "onMotionStart" : "onMotionStop"] = QZFL.event.bind(this, function() {
			this.style.display = _t ? "" : "none";
			QZFL.dom.setStyle(this, "opacity", 1);
		})
		n.start();
	};

	var _easeScroll = function(top, left, ease) {
		if (this.nodeType == 9) {
			var _stl = [
						QZFL.dom.getScrollTop(this),
						QZFL.dom.getScrollLeft(this)];
		} else {
			var _stl = [this.scrollTop, this.scrollLeft];
		}

		var _st = _stl[0] - top;
		var _sl = _stl[1] - left;

		var n = new QZFL.Tween(this, "_p", QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, 0, 100, 0.5);
		n.onMotionChange = QZFL.event.bind(this, function() {
			var _p = arguments[2], _t = (_stl[0] - _p / 100 * _st), _l = (_stl[1] - _p / 100 * _sl);

			if (this.nodeType == 9) {
				QZFL.dom.setScrollTop(_t, this);
				QZFL.dom.setScrollLeft(_l, this);
			} else {
				this.scrollTop = _t;
				this.scrollLeft = _l;
			}
		});
		n.start();
	};

	QZFL.element.extendFn({
		effectShow : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [true, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", null, null, ease])
				});
			}
		},

		effectHide : function(effect, ease) {
			this.each(function(el) {
				_easeShowAnimate.apply(el, [false, ease])
			});
			if (effect == "resize") {
				this.each(function(el) {
					_easeAnimate.apply(el, ["Size", 0, 0, ease])
				});
			}
		},

		effectResize : function(width, height, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["Size", width, height, ease])
			});
		},

		effectMove : function(x, y, ease) {
			this.each(function(el) {
				_easeAnimate.apply(el, ["XY", x, y, ease])
			});
		},

		effectScroll : function(top, left, ease) {
			this.each(function(el) {
				_easeScroll.apply(el, [top, left, ease])
			});
		}
		// ,
		//
		// effectNotify : function(ease) {
		// this.each(function() {
		// var _c = QZFL.dom.getStyle(this,"backgroundColor");
		// var n = new QZFL.Tween(this, "backgroundColor",
		// QZFL.transitions[ease] || QZFL.transitions.regularEaseOut, "#ffffff",
		// "#ffff00", 0.8);
		//				
		// n.onMotionStop = QZFL.event.bind(this,function(){
		// var o = this;
		// setTimeout(function(){
		// var n = new QZFL.Tween(o, "backgroundColor", QZFL.transitions[ease]
		// || QZFL.transitions.regularEaseOut, "#ffff00", "#ffffff", 1);
		// n.onMotionStop = function(){
		// o.style.backgroundColor = "transparent";
		// }
		// n.start();
		// },1000)
		// });
		// n.start();
		// });
		// }
	})
})();
/**
 * @fileoverview QZFL AJAX类
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * XMLHttpRequest通信器类
 * 
 * @class QZFL.XHR
 * @constructor
 * @namespace QZFL.XHR
 * @param {String} actionURI 请求地址
 * @param {String} [cname] 对象实体的索引名，默认是"_xhrInstence_n"，n为序号
 * @param {String} [method] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data] hashTable形式的字典
 * @param {Boolean} [isAsync] 是否异步，除非指明同步false,否则全部为异步true
 */
QZFL.XHR = function(actionURL, cname, method, data, isAsync, nocache) {
	/*if (!QZFL.string.isURL(actionURL)) {
		rt.error("error actionURL -> {0:Q} in QZFL.XHR construct!", actionURL);
		return null;
	}*/
	if (!cname) {
		cname = "_xhrInstence_" + (QZFL.XHR.counter + 1);
	}
	/**
	 * 辅助原型
	 * 
	 * @type {QZFL.XHR}
	 */
	var prot;
	if (QZFL.XHR.instance[cname] instanceof QZFL.XHR) {
		prot = QZFL.XHR.instance[cname];
	} else {
		prot = (QZFL.XHR.instance[cname] = this);
		QZFL.XHR.counter++;
	}
	prot._name = cname;
	prot._nc = !!nocache;
	prot._method = (QZFL.object.getType(method) != "string" || method.toUpperCase() != "GET")
			? "POST"
			: (method = "GET");
	prot._isAsync = (!(isAsync === false)) ? true : isAsync;
	prot._uri = actionURL;
	prot._data = (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == 'string') ? data : {};
	prot._sender = null;
	prot._isHeaderSetted = false;
	prot._xmlQueue = QZFL.queue("xhr" + cname,[function() {
		return new XMLHttpRequest();
	}, function() {
		return new ActiveXObject("Msxml2.XMLHTTP");
	}, function() {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}]);
	
	// 对外的接口
	/**
	 * 当成功回调时,跨域请求和同域请求返回的数据不一样
	 * 
	 * @event
	 * @memberOf QZFL.XHR
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 当错误回调时,跨域请求和同域请求返回的数据不一样
	 * 
	 * @event
	 * @memberOf QZFL.XHR
	 */
	this.onError = QZFL.emptyFn;

	/**
	 * 使用的编码
	 * 
	 * @memberOf QZFL.XHR
	 * @type string
	 */
	this.charset = "gb2312";

	/**
	 * 参数化proxy的路径
	 * @type string
	 */
	this.proxyPath = "";
	


	return prot;
}

QZFL.XHR.instance = {};
QZFL.XHR.counter = 0;
QZFL.XHR._errCodeMap = {
	400 : {
		msg : 'Bad Request'
	},
	401 : {
		msg : 'Unauthorized'
	},
	403 : {
		msg : 'Forbidden'
	},
	404 : {
		msg : 'Not Found'
	},
	999 : {
		msg : 'Proxy page error'
	},
	1000 : {
		msg : 'Bad Response'
	},
	1001 : {
		msg : 'No Network'
	},
	1002 : {
		msg : 'No Data'
	},
	1003 : {
		msg : 'Eval Error'
	}
};

/**
 * 跨域发送请求
 * 
 * @private
 * @return {Boolean} 是否成功
 */
QZFL.XHR.xsend = function(o, uri) {
	if (!(o instanceof QZFL.XHR)) {
		return false;
	}

	if (ua.firefox && ua.firefox < 3) {
		//QZFL.runTime.error("can't surport xsite in firefox!");
		return false;
	}
	
	function clear(obj) {
		try {
			obj._sender = obj._sender.callback = obj._sender.errorCallback = obj._sender.onreadystatechange = null;
		} catch (ignore) {
		}

		if (ua.safari || ua.opera) {
			setTimeout('removeNode($("_xsend_frm_' + obj._name + '"))', 50);
		} else {
			removeNode($("_xsend_frm_" + obj._name));
		}
	}

	if (o._sender === null || o._sender === void(0)) {
		var sender = document.createElement("iframe");
		sender.id = "_xsend_frm_" + o._name;
		sender.style.width = sender.style.height = sender.style.borderWidth = "0";
		document.body.appendChild(sender);
		sender.callback = QZFL.event.bind(o, function(data) {
					o.onSuccess(data);
					clear(o);
				});
		sender.errorCallback = QZFL.event.bind(o, function(num) {
					o.onError(QZFL.XHR._errCodeMap[num]);
					clear(o);
				});

		o._sender = sender;
	}
	// 获取proxy页面中js库的位置
	var tmp = QZFL.config.gbEncoderPath;
	o.GBEncoderPath = tmp ? tmp : "";

	o._sender.src = uri.protocol + "://" + uri.host + (this.proxyPath
			? this.proxyPath
			: "/xhr_proxy_gbk.html");
	return true;
}


QZFL.XHR.genHttpParamString = function(o){
	var r = [];

	for (var i in o) {
		r.push(i + "=" + encodeURIComponent(o[i]));
	}

	return r.join("&");
};


/**
 * 发送请求
 * 
 * @return {Boolean} 是否成功
 */
QZFL.XHR.prototype.send = function() {
	if (this._method == 'POST' && this._data == null) {
		//QZFL.runTime.warn("QZFL.XHR -> {0:q}, can't send data 'null'!", this._name);
		return false;
	}
	
	var u = new QZFL.util.URI(this._uri);
	if (u == null) {
		//QZFL.runTime.warn("QZFL.XHR -> {0:q}, bad url", this._name);
		return false;
	}
	
	this._uri = u.href;
	
	if(QZFL.object.getType(this._data)=="object"){
		this._data = QZFL.XHR.genHttpParamString(this._data);
	}
	
	var d = this._data;
	if(this._method == 'GET' && !!d && QZFL.object.getType(d) == "string"){
		this._uri += (this._uri.indexOf("?")<0?"?":"&") + d;
		d = null;
	}
	
	//判断是否需要跨域请求数据
	if (u.host != location.host) {
		return QZFL.XHR.xsend(this, u);
	}
	
	if (this._sender === null || this._sender === void(0)) {
		
		var sender = (function (){
			if (!this._xmlQueue.getLen()) {
				return null;
			}
			
			var _xhr = this._xmlQueue.shift();
			if (_xhr) {
				return _xhr;
			}else{
				return arguments.callee.call(this);
			}
		}).call(this);
		
		if (!sender) {
			//QZFL.runTime.error("QZFL.XHR -> {0:q}, create xhr object faild!", this._name);
			return false;
		}
		this._sender = sender;
	}

	try {
		this._sender.open(this._method, this._uri, this._isAsync);
	} catch (err) {
		//QZFL.runTime.error("exception when opening connection to {0:q}:{1}", this._uri,err);
		return false;
	}
	
	if (this._method == 'POST' && !this._isHeaderSetted) {
		this._sender.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		this._isHeaderSetted = true;
	}
	
	if (this._nc) {
		this._sender.setRequestHeader('If-Modified-Since', 'Thu, 1 Jan 1970 00:00:00 GMT');
		this._sender.setRequestHeader('Cache-Control', 'no-cache');
	}

	this._sender.onreadystatechange = QZFL.event.bind(this, function() {
		try {
			if (this._sender.readyState == 4) {
				if (this._sender.status >= 200 && this._sender.status < 300) {
					this.onSuccess({
						text : this._sender.responseText,
						xmlDom : this._sender.responseXML
					});
				} else {
					if (ua.safari && (QZFL.object.getType(this._sender.status) == 'undefined')) {
						this.onError(QZFL.XHR._errCodeMap[1002]);
					} else {
						this.onError(QZFL.XHR._errCodeMap[this._sender.status]);
					}
				}
				delete this._sender;
				this._sender = null;
			}
		} catch (err) {
			//QZFL.runTime.error("unknow exception in QZFL.XHR.prototype.send()");
		}
	});

	this._sender.send(d);
	return true;
};

/**
 * QZFL.XHR对象自毁方法，用法 ins=ins.destroy();
 * 
 * @return {Object} null用来复写引用本身
 */
QZFL.XHR.prototype.destroy = function() {
	var n = this._name;
	delete QZFL.XHR.instance[n]._sender;
	QZFL.XHR.instance[n]._sender = null;
	delete QZFL.XHR.instance[n];
	QZFL.XHR.counter--;
	return null;
};

/**
 * @fileoverview QZFL cookie数据处理
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * cookie类,cookie类可以让开发很轻松得控制cookie，我们可以随意增加修改和删除cookie，也可以轻易设置cookie的path, domain, expire等信息
 * 
 * @namespace QZFL.cookie
 */
QZFL.cookie = {
	/**
	 * 设置一个cookie,还有一点需要注意的，在qq.com下是无法获取qzone.qq.com的cookie，反正qzone.qq.com下能获取到qq.com的所有cookie.
	 * 简单得说，子域可以获取根域下的cookie, 但是根域无法获取子域下的cookie.
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} domain 所在域名
	 * @param {String} path 所在路径
	 * @param {Number} hour 存活时间，单位:小时
	 * @return {Boolean} 是否成功
	 * @example 
	 *  QZFL.cookie.set('value1',QZFL.dom.get('t1').value,"qzone.qq.com","/v5",24); //设置cookie 
	 */
	set : function(name, value, domain, path, hour) {
		if (hour) {
			var today = new Date();
			var expire = new Date();
			expire.setTime(today.getTime() + 3600000 * hour);
		}
		document.cookie = name + "=" + value + "; " + (hour ? ("expires=" + expire.toGMTString() + "; ") : "") + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
		return true;
	},

	/**
	 * 获取指定名称的cookie值
	 * 
	 * @param {String} name cookie名称
	 * @return {String} 获取到的cookie值
	 * @example 
	 * 		QZFL.cookie.get('value1'); //获取cookie 
	 */
	get : function(name) {
		var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)");
		// var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*?)(?:;|$)");
		var m = document.cookie.match(r);
		return (!m ? "" : m[1]);
		// document.cookie.match(new
		// RegExp("(?:^|;+|\\s+)speedMode=([^;]*?)(?:;|$)"))
	},

	/**
	 * 删除指定cookie,复写为过期
	 * 
	 * @param {String} name cookie名称
	 * @param {String} domain 所在域
	 * @param {String} path 所在路径
	 * @example 
	 * 		QZFL.cookie.del('value1'); //删除cookie 
	 */
	del : function(name, domain, path) {
		document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? ("path=" + path + "; ") : "path=/; ") + (domain ? ("domain=" + domain + ";") : ("domain=" + QZFL.config.domainPrefix + ";"));
	}
};

/**
 * @fileoverview 用于调试空间的错误信息
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 错误调试类
 * 
 * @namespace QZFL.debug
 */
QZFL.debug = {
	/**
	 * 错误对象
	 */
	errorLogs : [],

	/**
	 * 启用Qzone调试模式，错误会记录到对象中
	 */
	startDebug : function() {
		/**
		 * 为窗口加入错误处理
		 * 
		 * @ignore
		 * @param {Object} e
		 */
		window.onerror = function(msg,url,line) {
			var urls = (url || "").replace(/\\/g,"/").split("/");
			QZFL.console.print(msg + "<br/>" + urls[urls.length - 1] + " (line:" + line + ")",1);
			QZFL.debug.errorLogs.push(msg);
			return false;
		}
	},

	/**
	 * 停止Qzone调试模式
	 */
	stopDebug : function() {
		/**
		 * 为窗口加入错误处理
		 * 
		 * @ignore
		 */
		window.onerror = null;
	},

	/**
	 * 清除所有错误信息
	 */
	clearErrorLog : function() {
		this.errorLogs = [];
	},

	showLog : function() {
		var o = ENV.get("debug_out");
		if (!!o) {
			o.innerHTML = QZFL.string.nl2br(QZFL.string.escHTML(this.errorLogs.join("\n")));
		}
	},

	getLogString : function() {
		return (this.errorLogs.join("\n"));
	}
};

/**
 * runtime处理工具静态类
 * 
 * @namespace runtime处理工具静态类
 */
QZFL.runTime = (function() {
	/**
	 * 是否debug环境
	 * 
	 * @return {Boolean} 是否呢
	 */
	function isDebugMode() {
		return (QZFL.config.debugLevel > 1);
	}

	/**
	 * log记录器
	 * 
	 * @ignore
	 * @param {String} msg 信息记录器
	 */
	function log(msg, type) {
		var info;
		if (isDebugMode()) {
			info = msg + '\n=STACK=\n' + stack();
		} else {
			if (type == 'error') {
				info = msg;
			} else if (type == 'warn') {
				// TBD
			}
		}
		QZFL.debug.errorLogs.push(info);
	}

	/**
	 * 警告信息记录
	 * 
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function warn(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'warn');
	}

	/**
	 * 错误信息记录
	 * 
	 * @param {String} sf 信息模式
	 * @param {All} args 填充参数
	 */
	function error(sf, args) {
		log(QZFL.string.write.apply(QZFL.string, arguments), 'error');
	}

	/**
	 * 获取当前的运行堆栈信息
	 * 
	 * @param {Error} e 可选，当时的异常对象
	 * @param {Arguments} a 可选，当时的参数表
	 * @return {String} 堆栈信息
	 */
	function stack(e, a) {
		function genTrace(ee, aa) {
			if (ee.stack) {
				return ee.stack;
			} else if (ee.message.indexOf("\nBacktrace:\n") >= 0) {
				var cnt = 0;
				return ee.message.split("\nBacktrace:\n")[1].replace(/\s*\n\s*/g, function() {
					cnt++;
					return (cnt % 2 == 0) ? "\n" : " @ ";
				});
			} else {
				var entry = (aa.callee == stack) ? aa.callee.caller : aa.callee;
				var eas = entry.arguments;
				var r = [];
				for (var i = 0, len = eas.length; i < len; i++) {
					r.push((typeof eas[i] == 'undefined') ? ("<u>") : ((eas[i] === null) ? ("<n>") : (eas[i])));
				}
				var fnp = /function\s+([^\s\(]+)\(/;
				var fname = fnp.test(entry.toString()) ? (fnp.exec(entry.toString())[1]) : ("<ANON>");
				return (fname + "(" + r.join() + ");").replace(/\n/g, "");
			}
		}

		var res;

		if ((e instanceof Error) && (typeof arguments == 'object') && (!!arguments.callee)) {
			res = genTrace(e, a);
		} else {
			try {
				({}).sds();
			} catch (err) {
				res = genTrace(err, arguments);
			}
		}

		return res.replace(/\n/g, " <= ");
	}

	return {
		/**
		 * 获取当前的运行堆栈信息
		 * 
		 * @param {Error} e 可选，当时的异常对象
		 * @param {Arguments} a 可选，当时的参数表
		 * @return {String} 堆栈信息
		 */
		stack : stack,
		/**
		 * 警告信息记录
		 * 
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		warn : warn,
		/**
		 * 错误信息记录
		 * 
		 * @param {String} sf 信息模式
		 * @param {All} args 填充参数
		 */
		error : error,
		
		/**
		 * 是否调试模式
		 */
		isDebugMode : isDebugMode
	};

})();
/**
 * @fileoverview QZFL Javascript Loader
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * Js Loader，js脚本异步加载
 * 
 * @constructor
 * @example
 * 		var t=new QZFL.JsLoader(); 
 *		t.onload = function(){};
 *		t.load("/qzone/v5/tips_diamond.js", null, {"charset":"utf-8"});
 */
QZFL.JsLoader = function(isDebug) {
	this.loaded = false;
	
	this.debug = isDebug || (QZFL.config.debugLevel > 1);

	/**
	 * 当js下载完成时
	 * 
	 * @event
	 */
	this.onload = QZFL.emptyFn;

	/**
	 * 网络问题下载未完成时
	 * 
	 * @event
	 */
	this.onerror = QZFL.emptyFn;

}

QZFL.JsLoader.scriptId = 1;

/**
 * 动态加载JS
 * 
 * @param {string} src javascript文件地址
 * @param {Object} doc document
 * @param {string} [opt] 当为字符串时，指定charset
 * @param {object} [opt] 当为对象表时，指定<script>标签的各种属性
 * 
 */
QZFL.JsLoader.prototype.load = function(src, doc, opt) {
	
	var sId = QZFL.JsLoader.scriptId++,
		opts;
	

	if (typeof(opt) == "string") {
		opts = {
			charset: opt
		};
	} else if(typeof(opt) == "object"){
		opts = opt;
	} else {
		opts = {};
	}

	//TO DO  一个防重加载优化
	var o = this;
	(function(){
		o._load2.apply(o, [sId, src, doc, opts]);
		o = null;
	})();
}

/**
 * 异步加载js脚本
 * 
 * @param {Object} sId
 * @param {Object} src
 * @param {Object} doc
 * @param {Object} opts
 * @ignore
 * @private
 */
QZFL.JsLoader.prototype._load2 = function(sId, src, doc, opts) {
	var _doc = doc || document;

	if (!opts.charset) {
		opts.charset = "gb2312";
	}

	var _ie = QZFL.userAgent.ie,
		_js = _doc.createElement("script");
	

	// 处理加载成功的回调
	QZFL.event.addEvent(_js, (_ie ? "readystatechange" : "load"),
			(function(o) {
				return (function() {
					if (!_js) {
						return;
					}
					
					//ie的处理逻辑
					if(_ie && !(/*_js.readyState=="complete" || */_js.readyState=="loaded")){
						return;
					}

					o.onload();

					if (!o.debug) {
						QZFL.dom.removeElement(_js);
					}

					_js = null;

				});
			})(this));

	if(!_ie){
		QZFL.event.addEvent(_js, "error",
			(function(o){
				return (function() {
						o.onerror();
						
						if (!o.debug) {
							QZFL.dom.removeElement(_js);
						}
						
						_js = null;
					});
			})(this)
		);
	}

	_js.id = "js_" + sId;

	var tmp;
	for(var k in opts){
		tmp = opts[k];
		if (typeof(tmp) == "string" && k.toLowerCase() != "src") {
			_js.setAttribute(k, tmp);
		}
	}

	_doc.getElementsByTagName("head")[0].appendChild(_js);
	_js.src = src;
	opts = null;
};

/**
 * JsLoader的简写,避免被分析出来
 * @deprecated 不建议使用,只做兼容
 * @ignore
 */
QZFL["js"+"Loader"]=QZFL.JsLoader;

/**
 * @fileoverview QZFL Form Submit Class
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * FormSender通信器类,建议写操作使用
 * 
 * @param {String} actionURL 请求地址
 * @param {String} [method] 发送方式，除非指明get，否则全部为post
 * @param {Object} [data] hashTable形式的字典
 * @param {String} [charset="gb2312"] 于后台数据交互的字符集
 * @constructor
 * @namespace QZFL.FormSender
 * 
 * cgi返回模板: <html><head><meta http-equiv="Content-Type" content="text/html;
 * charset=gb2312" /></head> <body><script type="text/javascript">
 * document.domain="qq.com"; frameElement.callback({JSON:"Data"}); </script></body></html>
 * @example
 * 		var fs = new QZFL.FormSender(APPLY_ENTRY_RIGHT,"post",{"hUin": getParameter("uin"),"vUin":checkLogin(),"msg":$("msg-area").value, "rd": Math.random()}, "utf-8");
 *		fs.onSuccess = function(re) {};
 *		fs.onError = function() {};
 *		fs.send();
 * 
 */
QZFL.FormSender = function(actionURL, method, data, charset) {
/*	if (!QZFL.string.isURL(actionURL)) {
		rt.error("error actionURL -> {0:Q} in QZFL.FormSender construct!",
				actionURL);
		return null;
	}*/

	/**
	 * form的名称，默认为 _fpInstence_ + 计数
	 * 
	 * @type string
	 */
	this.name = "_fpInstence_" + QZFL.FormSender.counter;
	QZFL.FormSender.instance[this.name] = this;
	QZFL.FormSender.counter++;

	/**
	 * 数据发送方式
	 * 
	 * @type string
	 */
	this.method = method || "POST";

	/**
	 * 数据请求地址
	 * 
	 * @type string
	 */
	this.uri = actionURL;

	/**
	 * 数据参数表
	 * 
	 * @type object
	 */
	this.data = (typeof(data) == "object" || typeof(data) == 'string') ? data : null;
	this.proxyURL = (typeof(charset) == 'string' && charset.toUpperCase() == "UTF-8")
			? QZFL.config.FSHelperPage.replace(/_gbk/, "_utf8")
			: QZFL.config.FSHelperPage;

	this._sender = null;

	/**
	 * 服务器正确响应时的处理
	 * 
	 * @event
	 */
	this.onSuccess = QZFL.emptyFn;

	/**
	 * 服务器无响应或预定的不正常响应处理
	 * 
	 * @event
	 */
	this.onError = QZFL.emptyFn;
};

QZFL.FormSender.instance = {};
QZFL.FormSender.counter = 0;

QZFL.FormSender._errCodeMap = {
	999 : {
		msg : 'Connection or Server error'
	}
};
/**
 * 发送请求
 * 
 * @return {Boolean} 是否成功
 */
QZFL.FormSender.prototype.send = function() {
	if (this.method == 'POST' && this.data == null) {
	//	rt.warn("QZFL.FormSender -> {0:q}, can't send data 'null'!", this.name);
		return false;
	}

	function clear(o) {
		o._sender = o._sender.callback = o._sender.errorCallback = o._sender.onreadystatechange = null;
		if (ua.safari || ua.opera) {
			setTimeout('removeNode($("_fp_frm_' + o.name + '"))', 50);
		} else {
			removeNode($("_fp_frm_" + o.name));
		}
	}

	if (this._sender === null || this._sender === void(0)) {
		var sender = document.createElement("iframe");
		sender.id = "_fp_frm_" + this.name;
		sender.style.width = sender.style.height = sender.style.borderWidth = "0";
		sender.style.display = "none";
		document.body.appendChild(sender);

		sender.callback = QZFL.event.bind(this, function(o) {
					clearInterval(interval);
					clear(this);
					this.onSuccess(o);
				});
		sender.errorCallback = QZFL.event.bind(this, function(o) {
					clearInterval(interval);
					clear(this);
					this.onError(o);
				});

		if (typeof sender.onreadystatechange != 'undefined') {
			sender.onreadystatechange = QZFL.event.bind(this, function() {
				if (this._sender.readyState == 'complete' && this._sender.submited) {
					clear(this);
					this.onError(QZFL.FormSender._errCodeMap[999]);
				}
			});
		}
		// else if (ua.safari()) {
		// var interval = setInterval(QZFL.event.bind(this, function(){
		// if (this._sender.submited &&
		// (/loaded|complete/).test(this._sender.contentWindow.document.readyState))
		// {
		// clear(this);
		// this._err(QZFL.FormSender._errCodeMap[999]);
		// clearInterval(interval);
		// }
		// }), 100);
		// }
		else {// if (ua.firefox() || ua.opera()) {
			var interval = setInterval(QZFL.event.bind(this, function() {
						try {
							var _t = this._sender.contentWindow.location.href;
							if (_t.indexOf(this.uri) == 0) {
								clear(this);
								this.onError(QZFL.FormSender._errCodeMap[999]);
								clearInterval(interval);
							}
						} catch (err) {
							clear(this);
							this.onError(QZFL.FormSender._errCodeMap[999]);
							clearInterval(interval);
						}
					}), 100);
		}

		this._sender = sender;
	}

	this._sender.src = this.proxyURL;
	return true;
};

/**
 * QZFL.FormSender对象自毁方法，用法 ins=ins.destroy();
 * 
 * @return {Object} null用来复写引用本身
 */
QZFL.FormSender.prototype.destroy = function() {
	var n = this.name;
	delete QZFL.FormSender.instance[n]._sender;
	QZFL.FormSender.instance[n]._sender = null;
	delete QZFL.FormSender.instance[n];
	QZFL.FormSender.counter--;
	return null;
};
/**
 * @fileoverview QZFL JSON类
 * @version 1.$Rev: 1522 $
 * @author QzoneWebGroup, ($LastChangedBy: scorpionxu $)
 * @lastUpdate $Date: 2009-10-14 15:18:07 +0800 (星期三, 14 十月 2009) $
 */

/**
 * JSONGetter通信器类,建议使用进行读操作的时候使用
 * 
 * @param {String} actionURI 请求地址
 * @param {String} cname 可选，对象实体的索引名，默认是"_jsonInstence_n"，n为序号
 * @param {Object} data 可选，hashTable形式的字典
 * @param {String} charset 所拉取数据的字符集
 * @param {Boolean} [junctionMode=false] 使用插入script标签的方式拉取
 * @constructor
 * @example
 * 		var _loader = new QZFL.JSONGetter(GET_QUESTIONS_URL, void (0), {"uin": getParameter("uin"), "rd": Math.random()}, "utf-8");
 *		_loader.onSuccess = function(re){};
 *		_loader.send("_Callback");
 *		_loader.onError = function(){};
 */
QZFL.JSONGetter = function(actionURL, cname, data, charset, junctionMode) {
	/*if (!QZFL.string.isURL(actionURL)) {
		QZFL.console.print("error actionURL -> {0:Q} in QZFL.JSONGetter construct!", actionURL);
		return null;
	}*/ //这个检查意义不大
	if (QZFL.object.getType(cname) != "string") {
		cname = "_jsonInstence_" + (QZFL.JSONGetter.counter + 1);
	}
	
	var prot = QZFL.JSONGetter.instance[cname];
	if (prot instanceof QZFL.JSONGetter) {
		//ignore
	} else {
		QZFL.JSONGetter.instance[cname] = prot = this;
		QZFL.JSONGetter.counter++;
	
		prot._name = cname;
		prot._uri = actionURL;
		prot._data = (data && (QZFL.object.getType(data) == "object" || QZFL.object.getType(data) == "string")) ? data : null;
		prot._sender = null;
		prot._charset = (QZFL.object.getType(charset) != 'string') ? QZFL.config.defaultDataCharacterSet : charset;
		prot._jMode = !!junctionMode;
		prot._timer = null;
		
		/**
		 * 回调成功执行
		 * 
		 * @event
		 */
		this.onSuccess = QZFL.emptyFn;

		/**
		 * 解释失败
		 * 
		 * @event
		 */
		this.onError = QZFL.emptyFn;
		
		/**
		 * 当数据超时的时候
		 * 
		 * @event
		 */
		this.onTimeout = QZFL.emptyFn;
		
		/**
		 * 超时设置,默认5秒钟
		 */
		this.timeout = 5000;
		
		/**
		 * 抛出清理接口
		 */
		this.clear = QZFL.emptyFn;
	}

	return prot;
};

QZFL.JSONGetter.instance = {};
QZFL.JSONGetter.counter = 0;

QZFL.JSONGetter._errCodeMap = {
	999 : {
		msg : 'Connection or Server error.'
	},
	998 : {
		msg : 'Connection to Server timeout.'
	}
};

QZFL.JSONGetter.genHttpParamString = function(o){
	var r = [];

	for (var i in o) {
		r.push(i + "=" + encodeURIComponent(o[i]));
	}

	return r.join("&");
};

/**
 * 添加一个成功回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnSuccess = function(f){
	if(typeof(f) == "function"){
		if(this._squeue && this._squeue.push){

		}else{
			this._squeue = [];
		}
		this._squeue.push(f);
	}
};


QZFL.JSONGetter._runFnQueue = function(q, resultArgs, th){
	var f;
	if(q && q.length){
		while(q.length > 0){
			f = q.shift();
			if(typeof(f) == "function"){
				f.apply(th ? th : null, resultArgs);
			}
		}
	}
};


/**
 * 添加一个失败回调函数
 * @param {Function} f
 */
QZFL.JSONGetter.prototype.addOnError = function(f){
	if(typeof(f) == "function"){
		if(this._equeue && this._equeue.push){

		}else{
			this._equeue = [];
		}
		this._equeue.push(f);
	}
};

QZFL.JSONGetter.prototype.send = function(callbackFnName) {
	if(this._waiting){ //已经在请求中那么就不再发请求了
		return;
	}

	var cfn = (QZFL.object.getType(callbackFnName) != 'string') ? "callback" : callbackFnName,
		clear,
		da = this._uri, // + (typeof(this._data)=="object" ? ("?" + QZFL.JSONGetter.genHttpParamString(this._data)) : (!!this._data?("?"+this._data):"")),
		_s = new Date(); //设置开始请求的时间
		
	if(this._data){
		if(QZFL.object.getType(this._data)=="object"){
			da += ((da.indexOf("?")<0?"?":"&") + QZFL.JSONGetter.genHttpParamString(this._data));
		}else{
			da += ((da.indexOf("?")<0?"?":"&") + this._data);
		}
	}
	
	//传说中的jMode... 欲知详情，请咨询哓哓同学
	if(this._jMode){
		window[cfn] = this.onSuccess;
		var _sd = new QZFL.JsLoader();
		_sd.onerror = this.onError;
		_sd.load(da,void(0),this._charset);
		return;
	}

	//设置超时点
	this._timer = setTimeout(
		(function(th){
			return function(){
					QZFL.console.print("jsonGetter timeout", 3);
					QZFL.report.receive("QZFL.JSONGetter", 4, th._uri, (new Date()) - _s);
					th.onTimeout();
				};
			})(this),
		this.timeout
	);
	
	if (ua.ie) { // IE8之前的方案.确定要平稳迁移么
		if (ua.ie >= 8 && ( ua.beta || ua.windows > 6 )) {
			var _hf = new ActiveXObject("htmlfile");
			//回调后清理
				this.clear = clear = function(o){
					clearTimeout(o._timer);
					if (o._sender) {
						o._sender.close();
						o._sender.parentWindow[cfn] = o._sender.parentWindow["errorCallback"] = null;
						o._sender = null;
					}
				};

			this._sender = _hf;

			//成功回调
			var _cb = (function(th){
					return (function() {
					
						setTimeout(
						  (function(_o, _a){return (function(){
						  	_o.onSuccess.apply(_o, _a);
							QZFL.JSONGetter._runFnQueue(th._squeue, _a, th);
							th._waiting = false;
							clear(_o);
						  })})(th, arguments), 0);
						
						//成功返回数据
						QZFL.report.receive("QZFL.JSONGetter",1,th._uri,(new Date()) - _s);
					});
				})(this);

			//失败回调
			var _ecb = (function(th){
					return (function(){
						var _eo = QZFL.JSONGetter._errCodeMap[999];
						th.onError(_eo);
						QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
						th._waiting = false;
						//成功返回数据，加载失败的情况
						QZFL.report.receive("QZFL.JSONGetter", 2, th._uri, (new Date()) - _s);
						clear(th);
					});
				})(this);


			_hf.open();
			_hf.parentWindow[cfn] = function(o) {// 修正ie8
				_cb(o);
			};

			_hf.parentWindow["errorCallback"] = _ecb;
			
			this._waiting = true;
			_hf.write("<script src=\"" + da + "\" charset=\"" + this._charset + "\"><\/script><script defer>setTimeout(\"try{errorCallback();}catch(ign){}\",0)<\/script>");
			
		} else {
			var df = document.createDocumentFragment(), sender = df.createElement("script");
			
			sender.charset = this._charset;
			
			this._senderDoc = df;
			this._sender = sender;
			
			//回调后清理
			this.clear = clear = function(o){
				clearTimeout(o._timer);
				if (o._sender) {
					o._sender.onreadystatechange = null;
				}
				o._senderDoc = o._sender = null;
			};
			
			//成功回调
			df[cfn] = (function(th){
					return (function(){
						th.onSuccess.apply(th, arguments);
						QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
						th._waiting = false;
						//成功返回数据
						QZFL.report.receive("QZFL.JSONGetter", 1, th._uri, (new Date()) - _s);
						clear(th);
					});
				})(this);
			
			//用来模拟ie在加载失败的情况
			sender.onreadystatechange = (function(th){
					return (function(){
						if (th._sender && th._sender.readyState == "loaded") {
							try {
								var _eo = QZFL.JSONGetter._errCodeMap[999];
								th.onError(_eo);
								QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
								th._waiting = false;
								//成功返回数据，加载失败的情况
								QZFL.report.receive("QZFL.JSONGetter", 2, th._uri, (new Date()) - _s);
								clear(th);
							} 
							catch (ignore) {}
						}
					});
				})(this);
				
			this._waiting = true;
			
			this._sender.src = da;
			df.appendChild(sender);
		}
	} else {

		//回调后清理
		this.clear = clear = function(o) {
			//QZFL.console.print(o._timer);
			clearTimeout(o._timer);
			if (o._sender) {
				o._sender.src = "about:blank";
				o._sender = o._sender.callback = o._sender.errorCallback = null;
			}
			
			if (ua.safari || ua.opera) {
				setTimeout('removeNode($("_JSON_frm_' + o._name + '"))', 50);
			} else {
				removeNode($("_JSON_frm_" + o._name));
			}
		};
		
		//成功回调
		var _cb = (function(th){
				return (function() {
					th.onSuccess.apply(th, arguments);
					QZFL.JSONGetter._runFnQueue(th._squeue, arguments, th);
					th._waiting = false;
					clear(th);
					//成功返回数据
					QZFL.report.receive("QZFL.JSONGetter",1,th._uri,(new Date()) - _s);
				});
			})(this);
		
		//失败回调
		var _ecb = (function(th){
				return (function() {
					var _eo = QZFL.JSONGetter._errCodeMap[999];
					this.onError(_eo);
					QZFL.JSONGetter._runFnQueue(th._equeue, [_eo], th);
					th._waiting = false;
					//成功返回数据，加载失败的情况
					QZFL.report.receive("QZFL.JSONGetter",2,th._uri,(new Date()) - _s);
					clear(th);
				});
			})(this);
		
		//开始加载脚本数据
		var frm = document.createElement("iframe");
		frm.id = "_JSON_frm_" + this._name;
		frm.style.width = frm.style.height = frm.style.borderWidth = "0";
		this._sender = frm;

		//如果document.domain等于location.host一样则不进行host的修改，否则opera获取数据有问题
		var _dm = (document.domain == location.host)?'':'document.domain="' + document.domain + '";',
			dout = '<html><head><meta http-equiv="Content-type" content="text/html; charset=' + this._charset + '"/></head><body><script>'+_dm+';function ' + cfn + '(){frameElement.callback.apply(null, arguments);}<\/script><script charset="' + this._charset + '" src="' + da + '"><\/script><script>setTimeout(frameElement.errorCallback,50);<\/script></body></html>';

		frm.callback = _cb;
		frm.errorCallback = _ecb;

		this._waiting = true;

		if (ua.opera || ua.firefox < 3) {
		    frm.src = "javascript:'" + dout + "'";
		    document.body.appendChild(frm);
		} else {
		    document.body.appendChild(frm);
		    frm.contentWindow.document.open('text/html');
		    frm.contentWindow.document.write(dout);
		    frm.contentWindow.document.close();
		}
	}
};

/**
 * QZFL.JSONGetter对象自毁方法，用法 ins=ins.destroy();
 * 
 * @return {Object} null用来复写引用本身
 */
QZFL.JSONGetter.prototype.destroy = function() {
	var n = this._name;
	//this.clear(this);
	delete QZFL.JSONGetter.instance[n]._sender;
	QZFL.JSONGetter.instance[n]._sender = null;
	delete QZFL.JSONGetter.instance[n];
	QZFL.JSONGetter.counter--;
	return null;
};
/**
 * @fileoverview QZFL 多媒体类
 * @version 1.$Rev: 1523 $
 * @author QzoneWebGroup, ($LastChangedBy: zishunchen $)
 * @lastUpdate $Date: 2009-10-15 14:21:50 +0800 (星期四, 15 十月 2009) $
 */
/**
 * 增强对flash, wmp等多媒体控件的处理
 * 
 * @namespace QZFL.media
 */
QZFL.media = {
	_tempImageList : [],
	
	_flashVersion : null,
	/**
	 * 按比例调节图的大小
	 * @example
	 * 			<img src="b.gif" onload="QZFL.media.adjustImageSize(200,150,'http://www.true.com/true.jpg')" />
	 * @param {Number} w 期望宽度上限
	 * @param {Number} h 期望高度上限
	 * @param {String} trueSrc 真正地图片源
	 * @param {Function} callback 图片大小调整完成后的回调
	 */
	adjustImageSize : function(w, h, trueSrc, callback) {
		var ele = QZFL.event.getTarget();
		// 恶劣的兼容 begin
		if (ua.firefox < 3 && ele === document) {
			ele = QZFL.event.getEvent().currentTarget;
		}
		// 恶劣的兼容 end
		ele.onload = null;

		var offset, _c = QZFL.media._tempImageList;
		_c[offset = _c.length] = new Image();

		_c[offset].onload = (function(mainImg, tempImg, ew, eh) {
			return function() {
				tempImg.onload = null; // IE6 gif animation 302 bug!

				var ow = tempImg.width,
					oh = tempImg.height;
				if (ow / oh > ew / eh) {
					if (ow > ew) {
						mainImg.width = ew;
					}
				} else {
					if (oh > eh) {
						mainImg.height = eh;
					}
				}
				mainImg.src = tempImg.src;
				_c[offset] = null;
				delete _c[offset];
				if (typeof(callback) == 'function') {
					callback(mainImg, w, h, tempImg, ow, oh);
				}
			};
		})(ele, _c[offset], w, h);
		
		_c[offset].onerror = function(){
			_c[offset] = null;
			delete _c[offset];
		};

		_c[offset].src = trueSrc;
	},

	/**
	 * 生成flash的描述HTML
	 * 
	 * @param {Object} flashArguments 以hashTable描述的flash参数集合,flashUrl请用"src"
	 * @param {QZFL.media.SWFVersion} requiredVersion
	 *            所需要的flashPlayer的版本，QZFL.media.SWFVersion的实例
	 * @param {String} flashPlayerCID flash在IE中使用的classID,可选
	 * @return {String} 生成的HTML代码
	 * @example
	 * 			var swf_html = QZONE.media.getFlashHtml({
	 *									"src" :"your flash url",
	 *									"width" : "100%",
	 *									"height" : "100%",
	 *									"allowScriptAccess" : "always",
	 *									"id" : "avatar",
	 *									"name" : "avatar",
	 *									"wmode" : "opaque"
	 *						});
	 */
	getFlashHtml : function(flashArguments, requiredVersion, flashPlayerCID) {
		var _attrs = new QZFL.string.StringBuilder(),
			_params = new QZFL.string.StringBuilder();

		if (typeof(flashPlayerCID) == 'undefined') {
			flashPlayerCID = 'D27CDB6E-AE6D-11cf-96B8-444553540000';
		}
			
		for (var k in flashArguments) {
			switch (k) {
				case "movie" :
					continue;
					break;
				case "id" :
				case "name" :
				case "width" :
				case "height" :
				case "style" :
					_attrs.append(k + "='" + flashArguments[k] + "' ");
					break;
				default :
					_params.append("<param name='" + ((k == "src")
							? "movie"
							: k) + "' value='" + 
							//当为SRC的时候会检测版本，并且在必要的时候修改地址，参看QZFL.media._changeFlashSrc方法
							(
								//(k == "src")?
								//QZFL.media._changeFlashSrc(flashArguments[k], _ver, _needVer) :
								flashArguments[k]
							) 
							+ "' />");
					_attrs.append(k + "='" + flashArguments[k] + "' ");
			}
		}
		
		if (requiredVersion && (requiredVersion instanceof QZFL.media.SWFVersion)) {
			var _ver = QZFL.media.getFlashVersion().major;
			var _needVer = requiredVersion.major;
			
			//当没有安装并且应用没有刻意指定的时候，走Codebase路线
			_attrs.append("codeBase='http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=" + requiredVersion + "' ");
			
//			不再判断 Flash 9.0.16.0 的bug
//			if (requiredVersion.major == 9 && requiredVersion.rev == 16) {
//				(function() {
//					__flash_unloadHandler = QZFL.emptyFn;
//					__flash_savedUnloadHandler = QZFL.emptyFn;
//				})();
//			}
		} 
		//else {
		//	requiredVersion = new QZFL.media.SWFVersion(8, 0);
		//}
		
		//当没有安装并且应用没有刻意指定的时候，走Codebase路线
		//if(_ver == 0 || (_ver < requiredVersion.major && _needVer == -1)){
		//	_attrs.append("codeBase='http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab#version=" + requiredVersion + "' ");
		//}
		
		if (ua.ie) {
			return "<object classid='clsid:" + flashPlayerCID + "' " + _attrs + ">" + _params + "</object>";
		} else {
			return "<embed " + _attrs + " pluginspage='http://www.macromedia.com/go/getflashplayer' type='application/x-shockwave-flash'></embed>";
		}
	},

	/*
	 * 生成Windows Media Player的HTML描述
	 * @example
	 * 			var wmphtml=QZFL.media.getWMMHtml({id:'qzfl_media',name:'qzfl_wmp',width:'300px',height:'200px',src:'#',style:''});
	 */
	getWMMHtml : function(wmpArguments, cid) {
		var params = new QZFL.string.StringBuilder();
		var objArgm = new QZFL.string.StringBuilder();
		if (typeof(cid) == 'undefined') {
			cid = "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6";
		}

		for (var k in wmpArguments) {
			switch (k) {
				case "id" :
				case "width" :
				case "height" :
				case "style" :
					objArgm.append(k + '="' + wmpArguments[k] + '" ');
					break;
				case "src" :
					objArgm.append(k + '="' + wmpArguments[k] + '" ');
					break;
				default :
					objArgm.append(k + '="' + wmpArguments[k] + '" ');
					params
							.append('<param name="' + k + '" value="' + wmpArguments[k] + '" />');
			}
		}
		if (wmpArguments["src"]) {
			params
					.append('<param name="URL" value="' + wmpArguments["src"] + '" />');
		}

		if (ua.ie) {
			return '<object classid="' + cid + '" ' + objArgm + '>' + params + '</object>';
		} else {
			return '<embed ' + objArgm + '></embed>';
		}
	}
}

/**
 * flash版本号显示器
 * 
 * @param {Number} arguments...
 *            可变参数，一系列数字，前4个是flash的四段版本号，也可以单数组传入，也可以只使用一个整数表示主版本号
 * @constructor
 */
QZFL.media.SWFVersion = function() {
	var a;
	if (arguments.length > 1) {
		a = arg2arr(arguments);
	} else if (arguments.length == 1) {
		if (typeof(arguments[0]) == "object") {
			a = arguments[0];
		} else if (typeof arguments[0] == 'number') {
			a = [arguments[0]];
		} else {
			a = [];
		}
	} else {
		a = [];
	}

	this.major = parseInt(a[0], 10) || 0;
	this.minor = parseInt(a[1], 10) || 0;
	this.rev = parseInt(a[2], 10) || 0;
	this.add = parseInt(a[3], 10) || 0;
}

/**
 * flash版本显示器序列化方法
 * 
 * @param {Object} spliter 版本号显示，数字分隔符
 * @return {String} 一个描述flashPlayer版本号的字符串
 */
QZFL.media.SWFVersion.prototype.toString = function(spliter) {
	return ([this.major, this.minor, this.rev, this.add])
			.join((typeof spliter == 'undefined') ? "," : spliter);
};
/**
 * flash版本显示器序列化方法
 * 
 * @return {String} 一个描述flashPlayer版本号的数字
 */
QZFL.media.SWFVersion.prototype.toNumber = function() {
	var se = 0.001;
	return this.major + this.minor * se + this.rev * se * se + this.add * se * se * se;
};

/**
 * 获取当前浏览器上安装的flashPlayer的版本，未安装返回的实例toNumber()方法等于0
 * 
 * @return {Object} 返回QZFL.media.SWFVersion的实例 {major,minor,rev,add}
 * @example
 * 			QZFL.media.getFlashVersion();
 */
QZFL.media.getFlashVersion = function() {
	if (!QZFL.media._flashVersion) {
		var resv = 0;
		if (navigator.plugins && navigator.mimeTypes.length) {
			var x = navigator.plugins['Shockwave Flash'];
			if (x && x.description) {
				resv = x.description.replace(/(?:[a-z]|[A-Z]|\s)+/, "")
						.replace(/(?:\s+r|\s+b[0-9]+)/, ".").split(".");
			}
		} else {
			try {
				for (var i = (resv = 6), axo = new Object(); axo != null; ++i) {
					axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
					resv = i;
				}
			} catch (e) {
				if (resv == 6) {
					resv = 0;
				}//6都没有就当没安装吧
				resv = Math.max(resv - 1, 0);
			}
			try {
				resv = new QZFL.media.SWFVersion(axo.GetVariable("$version")
						.split(" ")[1].split(","));
			} catch (ignore) {
			}
		}
		if (!(resv instanceof QZFL.media.SWFVersion)) {
			resv = new QZFL.media.SWFVersion(resv);
		}

		if (resv.major < 3) {
			resv.major = 0;
		}
		QZFL.media._flashVersion = resv;
	}
	return QZFL.media._flashVersion;
};

//edit by youyeelu
QZFL.media._changeFlashSrc = function(src, installVer, needVer) {
	//当用户安装了flash player，但是没有达到应用要求的版本的时候，走快速安装路线
	if( installVer >= 6 && needVer > installVer){
		src = "http://imgcache.qq.com/qzone/flashinstall.swf";
	}
	return src;
}

//抛出 insertFlash 方法
var insertFlash = QZFL.media.getFlashHtml;


/**
 * @fileoverview QZFL ShareObject 存储类
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * Qzone 用于基本存储客户端基本信息
 * 
 * @namespace QZFL.shareObject
 */
QZFL.shareObject = {};

/**
 * 初始化shareObject
 * 
 * @param {String} [path] 要拉起的shareObject swf地址
 * @example
 * 			QZFL.shareObject.create();
 */
QZFL.shareObject.create = function(path) {
	if (typeof(path) == 'undefined') {
		path = QZFL.config.defaultShareObject;
	}
	var t = new QZFL.shareObject.DataBase(path);
};

QZFL.shareObject.instance = {};
QZFL.shareObject.refCount = 0;

/**
 * 获取一个可用的SO
 * 
 * @return {Object} ShareObject实例
 * @example
 * 			var so=QZFL.shareObject.getValidSo();//获取一个可用的ShareObject
 */
QZFL.shareObject.getValidSO = function() {
	var cnt = QZFL.shareObject.refCount + 1;
	for (var i = 1; i < cnt; ++i) {
		if (QZFL.shareObject.instance["so_" + i] && QZFL.shareObject.instance["so_" + i]._ready) {
			return QZFL.shareObject.instance["so_" + i];
		}
	}
	return null;
};

/**
 * 获取数据的静态方法
 * @param {String} s 键名
 * @return {All} 存储的值
 * @example
 * 			QZFL.shareObject.get(key);//读取
 */
QZFL.shareObject.get = function(s){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.get(s);
	else return void(0);
};



/**
 * 存入数据的静态方法
 * @param {String} k 键名
 * @param {All} v 值
 * @return {Boolean} 是否成功
 * @example
 * 			QZFL.shareObject.set(key,value);//存入
 */
QZFL.shareObject.set =	function(k, v){
	var o = QZFL.shareObject.getValidSO();
	if(o) return o.set(k, v);
	else return false;
};


/**
 * flash客户端存储器构造器，只会在页面创建一个实例
 * 
 * @constructor
 */
QZFL.shareObject.DataBase = function(soUrl) {
	/* 限制数目 */
	if (QZFL.shareObject.refCount > 0) {
		return QZFL.shareObject.instance["so_1"];
	}
	
	//TODO 暂时去掉对SO的判断
	//var fv = QZFL.media.getFlashVersion();
	//if (fv.toNumber() < 8) {
	//	rt.error("flash player version is too low to build a shareObject!");
	//	return null;
	//}
	
	this._ready = false;

	QZFL.shareObject.refCount++;
	var c = document.createElement("div");
	c.style.marginTop = "-1px";
	document.body.appendChild(c);
	c.innerHTML = QZFL.media.getFlashHtml({
		src : soUrl,
		id : "__so" + QZFL.shareObject.refCount,
		width : 0,
		height : 0,
		allowscriptaccess : "always"
	});
	this.ele = $("__so" + QZFL.shareObject.refCount);

	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount] = this;
};

/**
 * 以指定键名，存储一个字符串描述的数据
 * 
 * @param {String} key 存储的键名
 * @param {String} value 存储的值，必须是字符串类型
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.set = function(key, value) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, value);
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 删除一个已经存储的键
 * 
 * @param {String} key 存储的键名
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.del = function(key) {
	if (this._ready) {
		this.ele.set("seed", Math.random());
		this.ele.set(key, void(0));
		this.ele.flush();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取指定键名的数据
 * 
 * @param {String} key 指定的键名
 * @return {String/Object} 得到的值，null表示不存在
 */
QZFL.shareObject.DataBase.prototype.get = function(key) {
	return (this._ready) ? (this.ele.get(key)) : null;
};
/**
 * 清除所有数据，慎用！
 * 
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.clear = function() {
	if (this._ready) {
		this.ele.clear();
		return true;
	} else {
		return false;
	}
};
/**
 * 获取数据长度
 * 
 * @return {Number} -1表示失败
 */
QZFL.shareObject.DataBase.prototype.getDataSize = function() {
	if (this._ready) {
		return this.ele.getSize();
	} else {
		return -1;
	}
};
/**
 * 发起连接
 * 
 * @param {String} url
 * @param {String} succFnName
 * @param {String} errFnName
 * @param {Object} data
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.load = function(url, succFnName,
		errFnName, data) {
	if (this._ready) {
		this.ele.load(url, succFnName, errFnName, data);
		return true;
	} else {
		return false;
	}
};
/**
 * @ignore
 */
QZFL.shareObject.DataBase.prototype.setReady = function() {
	this._ready = true;
};

/**
 * Flash初始化方法
 * 
 * @return {String} flash内部使用
 */
function getShareObjectPrefix() {
	QZFL.shareObject.instance["so_" + QZFL.shareObject.refCount].setReady();
	// return location.host.match(/\w+/)[0];
	return location.host.split(".")[0]
}

/**
 * 复制到剪贴板
 * 
 * @param {String} value 要复制的值
 * @return {Boolean} 是否成功
 */
QZFL.shareObject.DataBase.prototype.setClipboard = function(value) {
	if (this._ready && isString(value)) {
		this.ele.setClipboard(value);
		return true;
	} else {
		return false;
	}
};
/**
 * @fileoverview QZFL 拖拽类
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 拖拽管理器，负责对dom对象进行拖拽的绑定。
 * 
 * @namespace QZFL.dragdrop
 */
QZFL.dragdrop = {
	/**
	 * 拖拽池，用来记录已经注册拖拽的对象
	 */
	dragdropPool : {},

	/**
	 * 拖拽对象临时ID.
	 * 
	 * @ignore
	 */
	dragTempId : 0,

	/**
	 * 自动滚屏的感知范围
	 */
	_scrollRange : 0,

	/**
	 * 阿鬼的样式
	 */
	dragGhostStyle : "cursor:move;position:absolute;border:1px solid #06c;background:#6cf;z-index:1000;color:#003;overflow:hidden",

	/**
	 * 注册拖拽对象, 注册后，返回 QZFL.dragdrop.eventController 拖放驱动对象
	 * 
	 * @param {HTMLElement} handle 推拽的对象的handler
	 * @param {HTMLElement} target 需要推拽的对象
	 * @param {Object} options 参数 {range,rangeElement,x,y,ghost,ghostStyle} <br/><br/>
	 *            range [top,left,bottom,right]
	 *            指定一个封闭的拖放区域,参数可以不比全设置留空或设置为非数字如null[top,left,bottom,right]
	 *            是number<br/> rangeElement [element,[top,left,bottom,right],isStatic]
	 *            制定拖放区域的对象，限制物体只能在这个区域内拖放。 [top,left,bottom,right]
	 *            是boolean,rangeElement和target必须是同一个坐标系，而且target必须在rangeElement内
	 *            。isStatic {boolean} 是指 rangeElement 没有使用独立的坐标系(默认值是flase)。
	 *            <br/>
	 *            x,y 刻度偏移量（暂时未支持）<br/> ghost 如果拖放的对象是浮动的，是否拖放出现影子 ghostSize
	 *            鬼影的尺寸，当设置了尺寸，初始位置就以鼠标位置定位了，注意。 ignoreTagName 忽略的tagName.
	 *            一般用来忽略一些 控件等 例如 object embed autoScroll 是否自动滚屏 cursor 鼠标 <br/>
	 *            ghostStyle 设置ghost层次的样式
	 *            <br/><br/>
	 * @return 返回 QZFL.dragdrop.eventController 驱动对象
	 * @type QZFL.dragdrop.eventController
	 * @example
	 * 			QZFL.dragdrop.registerDragdropHandler(this.titleElement,this.mainElement,{range:[0,0,'',''],x:50,y:160});
	 */
	registerDragdropHandler : function(handler, target, options) {
		var _e = QZFL.event;
		var _hDom = QZFL.dom.get(handler);
		var _tDom = QZFL.dom.get(target);
		options = options || {
			range : [null, null, null, null],
			ghost : 0
		};

		if (!_hDom) {
			return null
		}

		// 拖放目标对象
		var targetObject = _tDom || _hDom;

		if (!_hDom.id) {
			_hDom.id = "dragdrop_" + this.dragTempId;
			QZFL.dragdrop.dragTempId++;
		}

		_hDom.style.cursor = options.cursor || "move";
		this.dragdropPool[_hDom.id] = new this.eventController();
		_e.on(_hDom, "mousedown", _e.bind(this, this.startDrag), [_hDom.id, targetObject, options]);

		return this.dragdropPool[_hDom.id];
	},

	/**
	 * 取消注册拖拽对象
	 * 
	 * @param {HTMLElement} handle 推拽的对象的handler
	 */
	unRegisterDragdropHandler : function(handler) {
		var _hDom = QZFL.dom.get(handler);
		var _e = QZFL.event;
		if (!_hDom) {
			return null
		}

		_hDom.style.cursor = "default";
		delete this.dragdropPool[_hDom.id];
		_e.removeEvent(_hDom, "mousedown");
	},
	
//TODO dragdrop support iphone
//iphone event
//touchstart: Happens every time a finger is placed on the screen
//touchend: Happens every time a finger is removed from the screen
//touchmove: Happens as a finger already placed on the screen is moved across the screen
//touchcancel: The system can cancel events, but I’m not sure how this can happen. I thought it might happen when you receive something like an SMS during a drag, but I tested that with no success

	/**
	 * 开始拖放
	 * 
	 * @param {event} e 事件，如果直接截获到的 event element 对象有noDrag=true属性则不进行拖拽
	 * @param {string} handlerId handler 的编号
	 * @param {Object} target 拖放对象
	 * @param {Object} options 参数
	 */
	startDrag : function(e, handlerId, target, options) {
		var _d = QZFL.dom;
		var _e = QZFL.event;

		if (_e.getButton() != 0 || _e.getTarget().noDrag) {// 只有是鼠标左键才能触发拖拽
			return;
		}

		if (options.ignoreTagName == _e.getTarget().tagName || _e.getTarget().noDragdrop) {// 需要忽略拖放的对象tarName,一般用来忽略一些
			// 控件等
			// 或则dom上面有noDragdrop变量
			return;
		}

		var size = _d.getSize(target);
		var stylePosition = _d.getStyle(target, "position");
		var isAbsolute = stylePosition == "absolute" || stylePosition == "fixed";
		var ghost = null, hasGhost = false;
		var xy = null;

		// 如果有区域对象
		if (options.rangeElement) {
			var _re = options.rangeElement;
			var _el = QZFL.dom.get(_re[0]);
			var _elSize = QZFL.dom.getSize(_el);
			var _r = _re[1];
			if (!_re[2]){
				options.range = [_r[0] ? 0 : null, _r[1] ? 0 : null, _r[2] ? _elSize[1] : null, _r[3] ? _elSize[0] : null];
			}else{
				var _elXY = QZFL.dom.getXY(_el);
				options.range = [_r[0] ? _elXY[1] : null, _r[1] ? _elXY[0] : null, _r[2] ? _elXY[1] + _elSize[1] : null, _r[3] ? _elXY[0] + _elSize[0] : null];
			}
		}

		// 非绝对定位的对象使用鬼影层，又见阿鬼。。。
		if (!isAbsolute || options.ghost) {
			// 如果是 absolute 的对象 则获取其left 和 top
			xy = isAbsolute ? [parseInt(target.style.left), parseInt(target.style.top)] : _d.getXY(target);

			// 如果是 absolute 对象，则在对象的father对象上创建ghost
			ghost = _d.createElementIn("div", isAbsolute ? target.parentNode : document.body, false, {
				style : options.ghostStyle || this.dragGhostStyle
			});

			ghost.id = "dragGhost";

			_d.setStyle(ghost, "opacity", "0.8");

			// 延迟设置透明
			setTimeout(function() {
				_d.setStyle(target, "opacity", "0.5");
			}, 0);

			if (options.ghostSize) {
				_d.setSize(ghost, options.ghostSize[0], options.ghostSize[1]);
				xy = [e.clientX + QZFL.dom.getScrollLeft() - 30, e.clientY + QZFL.dom.getScrollTop() - 20];
			} else {
				_d.setSize(ghost, size[0] - 2, size[1] - 2); // 2是border宽度
			}

			_d.setXY(ghost, xy[0], xy[1]);

			hasGhost = true;
		} else {
			xy = [parseInt(_d.getStyle(target, "left")), parseInt(_d.getStyle(target, "top"))];
		}

		var dragTarget = ghost || target;

		// 缓存当前模块的信息
		this.currentDragCache = {
			size : size,
			xy : xy,
			mXY : xy,
			dragTarget : dragTarget,
			target : target,
			x : e.clientX - parseInt(xy[0]),
			y : e.clientY - parseInt(xy[1]),
			ghost : ghost,
			hasGhost : hasGhost,
			isAbsolute : isAbsolute,
			options : options,
			scrollRangeTop : QZFL.dragdrop._scrollRange,
			scrollRangeBottom : QZFL.dom.getClientHeight() - QZFL.dragdrop._scrollRange,
			maxScrollRange : Math.max(QZFL.dom.getScrollHeight() - QZFL.dom.getClientHeight(), 0)
		}

		// 拖拽事件绑定
		_e.on(document, "mousemove", _e.bind(this, this.doDrag), [handlerId, this.currentDragCache, options]);
		_e.on(document, "mouseup", _e.bind(this, this.endDrag), [handlerId, this.currentDragCache, options]);

		// event
		this.dragdropPool[handlerId].onStartDrag.apply(null, [e, handlerId, this.currentDragCache, options]);

		_e.preventDefault();
		// _e.cancelBubble();

	},

	/**
	 * 拖放过程
	 * 
	 * @param {event} e 事件
	 * @param {string} handlerId handler 的编号
	 * @param {Object} dragCache 拖放对象cache
	 * @param {Object} options 参数
	 */
	doDrag : function(e, handlerId, dragCache, options) {
		var pos = {};

		// 如果没有区域限制，则开启滚屏感知功能
		if (options.autoScroll) {
			if (e.clientY < dragCache.scrollRangeTop) {
				// document.title = "scroll Top";
				if (!QZFL.dragdrop._scrollTop) {
					QZFL.dragdrop._stopScroll();
					QZFL.dragdrop._scrollTimer = setTimeout(function() {
						QZFL.dragdrop._doScroll(true, dragCache)
					}, 200);
				}
			} else if (e.clientY > dragCache.scrollRangeBottom) {
				// document.title = "scroll Bottom";
				if (!QZFL.dragdrop._scrollBottom) {
					QZFL.dragdrop._stopScroll();
					QZFL.dragdrop._scrollTimer = setTimeout(function() {
						QZFL.dragdrop._doScroll(false, dragCache)
					}, 200);
				}
			} else {
				// document.title = "no scroll";
				QZFL.dragdrop._stopScroll();
			}
		}

		var mX = e.clientX - dragCache.x;
		var mY = e.clientY - dragCache.y;

		// 如果是拖放参考层
		// if (!dragCache.hasGhost) {
		var xy = this._countXY(mX, mY, dragCache.size, options);
		mX = xy.x;
		mY = xy.y;
		// }

		QZFL.dom.setXY(dragCache.dragTarget, mX, mY);

		dragCache.mXY = [mX, mY];
		// document.title = mX; // 调试代码？
		this.dragdropPool[handlerId].onDoDrag.apply(null, [e, handlerId, dragCache, options]);
		if (QZFL.userAgent.ie) {
			document.body.setCapture();
		} else if (window.captureEvents) {
			window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}

		QZFL.event.preventDefault();
	},

	/**
	 * 结束拖放
	 * 
	 * @param {event} e 事件
	 * @param {string} handlerId handler 的编号
	 * @param {Object} dragCache 拖放对象cache
	 * @param {Object} options 参数
	 */
	endDrag : function(e, handlerId, dragCache, options) {
		var _d = QZFL.dom;

		if (dragCache.hasGhost) {
			QZFL.dom.removeElement(dragCache.dragTarget);

			var _t = dragCache.target;
			setTimeout(function() {
				QZFL.dom.setStyle(_t, "opacity", "1");
				_t = null;
			}, 0);

			// 对象是浮动层
			if (dragCache.isAbsolute) {
				var x = parseInt(_d.getStyle(dragCache.target, "left")) + (dragCache.mXY[0] - dragCache.xy[0]);
				var y = parseInt(_d.getStyle(dragCache.target, "top")) + (dragCache.mXY[1] - dragCache.xy[1]);

				// 坐标算子
				var xy = this._countXY(x, y, dragCache.size, options);
				QZFL.dom.setXY(dragCache.target, xy.x, xy.y);
			}
		}

		QZFL.event.removeEvent(document, "mousemove");
		QZFL.event.removeEvent(document, "mouseup");
		this.dragdropPool[handlerId].onEndDrag.apply(null, [e, handlerId, dragCache, options]);
		dragCache = null;
		QZFL.dragdrop._stopScroll();
		if (QZFL.userAgent.ie) {
			document.body.releaseCapture();
		}else if (window.releaseEvents){
			window.releaseEvents(Event.MOUSEMOVE|Event.MOUSEUP);
		}
	},

	/**
	 * 开始滚屏
	 */
	_doScroll : function(isUp, dc) {
		step = isUp ? -15 : 15;
		var _st = QZFL.dom.getScrollTop();
		if (isUp && _st + step < 0) {
			step = 0;
		}

		if (!isUp && _st + step > dc.maxScrollRange) {
			step = 0;
		}

		QZFL.dom.setScrollTop(_st + step);
		dc.y = dc.y - step;
		QZFL.dragdrop._scrollTop = isUp;
		QZFL.dragdrop._scrollBottom = !isUp;
		QZFL.dragdrop._scrollTimer = setTimeout(function() {
			QZFL.dragdrop._doScroll(isUp, dc)
		}, 16);
	},

	/**
	 * 停止滚动屏幕
	 */
	_stopScroll : function() {
		QZFL.dragdrop._scrollTop = QZFL.dragdrop._scrollBottom = false;
		clearTimeout(QZFL.dragdrop._scrollTimer);
	},

	/**
	 * 计算坐标
	 */
	_countXY : function(x, y, size, options) {
		var pos = {
			x : x,
			y : y
		};
		
		// 计算横坐标刻度
		if (options.x) {		
			pos["x"] = parseInt(pos["x"]/options.x,10) * options.x + (pos["x"] % options.x<options.x/2?0:options.x);
		}
		
		// 计算纵坐标刻度
		if (options.y) {
			pos["y"] = parseInt(pos["y"]/options.y,10) * options.y + (pos["y"] % options.y<options.y/2?0:options.y);
		}

		// 计算拖拽范围
		if (options.range) {
			var _r = options.range;
			var i = 0, j = 0;
			while (i < _r.length && j < 2) {
				// 非数字返回
				if (typeof _r[i] != "number") {
					i++;
					continue;
				};

				// 判断对象是否靠边
				var k = i % 2 ? "x" : "y";
				var v = pos[k];
				pos[k] = i < 2 ? Math.max(pos[k], _r[i]) : Math.min(pos[k], _r[i] - size[(i + 1) % 2]);
				if (pos[k] != v) {
					j++;
				};
				i++;
			}
		}
		return pos;
	}
};

/**
 * 拖放事件驱动
 * 
 * @constructor QZFL.dragdrop.eventController
 */
QZFL.dragdrop.eventController = function() {
	/**
	 * 当开始拖放时
	 * 
	 * @event
	 */
	this.onStartDrag = QZFL.emptyFn
	/**
	 * 当物体开始拖放中
	 * 
	 * @event
	 */
	this.onDoDrag = QZFL.emptyFn
	/**
	 * 当拖放结束时
	 * 
	 * @event
	 */
	this.onEndDrag = QZFL.emptyFn
};

// Extend Dom
QZFL.element.extendFn(
/** @lends QZFL.ElementHandler.prototype */
{
	dragdrop:function(target, options){
		var _arr = [];
		this.each(function(){
			_arr.push(QZFL.dragdrop.registerDragdropHandler(this,target, options));
		});
		return _arr;
	},
	unDragdrop:function(target, options){
		this.each(function(){
			_arr.push(QZFL.dragdrop.unRegisterDragdropHandler(this));
		});
	}
});
/*
 * Copyright (c) 2008, Tencent Inc. All rights reserved.
 */
/**
 * @fileoverview 信息提示类
 * @author QzoneWebGroup
 * @version 1.0
 */
/**
 * dom 对象处理
 * 
 * @namespace QZFL.widget.msgbox
 */
QZFL.widget.msgbox = {
	_timer : null,
	/**
	 * 使用动画类
	 * 
	 * @type Boolean
	 */
	useTween : false, // 由于msgbox使用频率比较高，默认去掉动画
	/**
	 * 显示信息
	 * 
	 * @param {string} msgHtml 信息文字
	 * @param {Object} type 信息提示类型 0~3
	 * @param {Object} timeout 提示信息超时关闭，0为手动关闭
	 * @param {number} [topPosition] 提示框的高度位置
	 */
	show : function(msgHtml, type, timeout, topPosition) {
		var _mBox = QZFL.dom.get("q_Msgbox") || QZFL.dom.createElementIn("div", document.body, false, {
			style : "height:0px;"
		});
		_mBox.id = "q_Msgbox";
		QZFL.dom.setStyle(_mBox, "display", "");

		var tipsId = type < 2 ? "mode_tipss" : "mode_tips";
		var _html = '<div id="__typeId__" style="display:none;z-index:10000"><span class="tipsl"></span><span class="tipsm"><a href="#" class="close"></a>__html__</span><span class="__typeIcon__"></span></div>';
		_mBox.innerHTML = _html.replace(/__typeId__/, tipsId).replace(/__typeIcon__/, type % 2 ? "tipsrn" : "tipsr").replace(/__html__/, msgHtml);

		var _tips = QZFL.dom.get(tipsId);

		var _fc = _mBox.firstChild;
		if (QZFL.userAgent.ie && QZFL.userAgent.ie < 7) {// IE6 以下浏览器进行坐标居中计算
			if (typeof(topPosition) != 'number') {
				QZFL.dom.setStyle(_fc, "top", (QZFL.dom.getClientHeight() / 2 + QZFL.dom.getScrollTop() - 40) + "px");
			}
		} else {
			QZFL.dom.setStyle(_fc, "position", "fixed");
		}
		if (typeof(topPosition) == 'number') {
			QZFL.dom.setStyle(_fc, "top", topPosition + "px");
		}

		clearTimeout(QZFL.widget.msgbox._timer);
		if (QZFL.widget.msgbox.useTween && QZFL.Tween) { // 是否播放动画
			var tween = new QZFL.Tween(_tips, "opacity", QZFL.transitions.regularEaseIn, 0, 1, 0.25);
			/**
			 * @ignore
			 */
			tween.onMotionStart = function() {
				_tips.style.display = "";
				if (timeout) {
					QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout);
				}
			}
			/**
			 * @ignore
			 */
			tween.onMotionStop = function() {
				tween = null;
			}

			tween.start();
		} else {
			_tips.style.display = "";
			if (timeout) {
				QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox.hide, timeout);
			}
		}
	},
	/**
	 * 隐藏提示框
	 * 
	 * @param {Object} timeout 延时多久开始关闭
	 */
	hide : function(timeout) {
		if (timeout) {
			clearTimeout(QZFL.widget.msgbox._timer);
			QZFL.widget.msgbox._timer = setTimeout(QZFL.widget.msgbox._hide, timeout);
		} else {
			QZFL.widget.msgbox._hide();
		}
	},

	_hide : function() {
		var _mBox = QZFL.dom.get("q_Msgbox");
		clearTimeout(QZFL.widget.msgbox._timer);
		if (_mBox) {
			var _tips = _mBox.firstChild;
			if (QZFL.widget.msgbox.useTween && QZFL.Tween) { // 是否播放动画
				var tween = new QZFL.Tween(_tips, "opacity", QZFL.transitions.regularEaseOut, 1, 0, 0.75);
				/**
				 * @ignore
				 */
				tween.onMotionStop = function() {
					QZFL.dom.setStyle(_mBox, "display", "none");
					tween = null;
				}

				tween.start();
			} else {
				QZFL.dom.setStyle(_mBox, "display", "none");
			}
		}
	}
}

/**
 * @fileoverview QZ对话框类,需要QZFL.dragdrop类支持
 * @version 1.$Rev: 1518 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-10-13 15:50:02 +0800 (星期二, 13 十月 2009) $
 */

/**
 * QZFL的对话框类,需要QZFL.dragdrop类支持
 * 
 * @namespace QZFL.dialog
 */
QZFL.dialog = {
	items : [],
	lastFocus : null,
	/**
	 * 使用动画类
	 * 
	 * @type Boolean
	 */
	tween : true,
	/**
	 * 创建一个新的对话框
	 * 建议使用新的接口
	 * @param {string} title 标题
	 * @param {string} content 内容
	 * @param {object} config 配置{"width":300,"height":300,"tween":true,"noborder":false}
	 * @example
	 *    QZFL.dialog.create("This is title","This is HTML here.",{"width":300,"height":300,"tween":true,"noborder":false});//建议写法
	 */
	 //老的接口，但保持兼容
	 //@param {string} title 标题
	 //@param {string} content 内容
	 //@param {number} width 宽度
	 //@param {number} height 高度
	 //@param {boolean} [useTween=false] 是否使用动画效果
	 //@param {boolean} [noBorder=false] 是否有边框
	 //@return {QZFL.DialogHandler} 对话框构造对象
	 //@example 
	 //QZFL.dialog.create("This is title","This is HTML here.",400,500,false,false);//不建议写法，但保持兼容
	 //create : function(title, content, width, height, useTween, noBorder) {
	create : function(title, content, config) {
		//变量初始化
		var width=300,height=400,tween=false,noborder=false;
		//根据传入参数判断兼容性
		if((config!=null)&&(typeof(config)=="object")){
			width=config.width || 300;
			height=config.height || 400;
			tween=config.tween || false;
			noborder=config.noborder || false;
		}else{
			width=arguments[2] || 300;
			height=arguments[3] || 400;
			tween=arguments[4] || false;
			noborder=arguments[5] || false;
		}
		var _i = this.items;
		_i.push(new QZFL.DialogHandler(_i.length, noborder, tween));
		var dialog = _i[_i.length - 1];

		dialog.init(width, height);

		dialog.fillTitle(title || "无标题");
		dialog.fillContent(content || "");

		return dialog;
	},

	/**
	 * 创建无边框的dialog视图 contributed by scorr
	 * 
	 * @param {string} content 内容
	 * @param {number} [width=300] 宽度
	 * @param {number} [height=200] 高度
	 * @example QZFL.dialog.createBorderNone("HTML here",500,400);//注意大小写
	 */
	createBorderNone : function(content, width, height) {
		var _i = this.items;
		var dialog;
		_i.push(dialog = (new QZFL.DialogHandler(_i.length, true)));
		dialog.init(width || 300, height || 200, true);
		dialog.fillContent(content || "");

		return dialog;
	}
};

/**
 * 对话框替身类
 * 
 * @param {number} id 对话框编号
 * @param {boolean} [isNoBorder=false] 无边框模式
 * @param {boolean} [noTween=true] 是否使用动画效果
 * @constructor
 * @class
 * @type QZFL.DialogHandler
 */
QZFL.DialogHandler = function(id, isNoBorder, useTween) {
	/**
	 * @private
	 */
	this._id = id;

	/**
	 * @private
	 */
	this._isIE6 = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7);

	/**
	 * 对话框ID
	 * 
	 * @type String
	 */
	this.id = "dialog_" + id;

	this.mainId = "dialog_main_" + id;

	/**
	 * 对话框顶部ID
	 * 
	 * @type String
	 */
	this.headId = "dialog_head_" + id;

	/**
	 * 对话框标题ID
	 * 
	 * @type String
	 */
	this.titleId = "dialog_title_" + id;

	/**
	 * 关闭按钮ID
	 * 
	 * @type String
	 */
	this.closeId = "dialog_button_" + id;

	/**
	 * 内容框ID
	 */
	this.contentId = "dialog_content_" + id;

	/**
	 * 给ie6提供遮挡select的容器
	 */
	this.frameId = "dialog_frame_" + id;

	/**
	 * 使用动画类
	 * 
	 * @type Boolean
	 */
	this.useTween = (typeof(useTween) != "boolean") ? QZFL.dialog.tween : useTween;

	/**
	 * 对话框层次
	 */
	this.zIndex = 6000 + this._id;

	/**
	 * 图标样式
	 */
	this.iconClass = "none";

	/**
	 * 当对话框关闭后
	 * 
	 * @event
	 */
	this.onBeforeUnload = function() {
		return true;
	};

	/**
	 * 当对话框关闭后
	 * 
	 * @event
	 */
	this.onUnload = QZFL.emptyFn;

	/**
	 * 对话框是否是focus状态
	 */
	this.isFocus = false;

	var _t = [
				'<div id="',
				this.mainId,
				'" class="',
				(isNoBorder ? "" : "layer_global_main"),
				'">',
				'<div id=',
				this.headId,
				' class="',
				(isNoBorder ? "none" : "layer_global_title"),
				'">',
				'<h3><img src="/ac/b.gif" alt="icon" class="',
				this.iconClass,
				'"/><span id=',
				this.titleId,
				' ></span></h3>',
				'<button id="',
				this.closeId,
				'" title="关闭"><span class="none">&#9587;</span></button>',
				'</div>',
				'<div id="',
				this.contentId,
				'" class="',
				(isNoBorder ? "" : "layer_global_cont"),
				'"></div>',
				'</div>'];
	if (this._isIE6) {
		_t.push('<iframe id="' + this.frameId + '" style="position:absolute;width:100%;height:100%;top:0px;left:0px;z-index:-1;"></iframe>');
	}

	/**
	 * 对话框模板
	 */
	this.temlate = _t.join("");
};

/**
 * 初始化对话框
 * 
 * @param {number} width
 * @param {number} height
 * @param {boolean} [isNoneBerder=false] 是无边框么
 */
QZFL.DialogHandler.prototype.init = function(width, height, isNoneBerder) {

	//创建最外层div容器
	this.dialog = document.createElement("div");
	this.dialog.id = this.id;

	var _l = (QZFL.dom.getClientWidth() - width) / 2 + QZFL.dom.getScrollLeft();
	var _t = Math.max((QZFL.dom.getClientHeight() - height) / 2 + QZFL.dom.getScrollTop(), 0);

	with (this.dialog) {
		if (!isNoneBerder) {
			className = "layer_global";
		}
		style.position = "absolute";
		style.left = _l + "px";
		style.top = _t + "px";
		style.zIndex = this.zIndex;
		innerHTML = this.temlate;
	}

	document.body.appendChild(this.dialog);

	this.dialogClose = QZFL.dom.get(this.closeId);

	var o = this;
	//焦点事件
	QZFL.event.addEvent(this.dialog, "mousedown", QZFL.event.bind(o, o.focus));

	//关闭事件
	QZFL.event.addEvent(this.dialogClose, "click", function() {
		var t = QZFL.dialog.items[o._id];
		if (t) {
			t.unload();
		}
	})

 	//绑定拖拽
	if (QZFL.dragdrop) {
		QZFL.dragdrop.registerDragdropHandler(QZFL.dom.get(this.headId), QZFL.dom.get(this.id), {
			range : [0, null, null, null],
			ghost : 0
		});
	}

	  
	this.focus();
	this.setSize(width, height);//设置大小
	
	if (this.useTween && QZFL.Tween) {//设置动画
		QZFL.dom.setStyle(this.dialog, "opacity", 0);

		/**
		 * @ignore
		 */
		var tween1 = new QZFL.Tween(this.dialog, "top", QZFL.transitions.regularEaseIn, _t - 30 + "px", _t + "px", 0.3);

		/**
		 * @ignore
		 */
		tween1.onMotionChange = function() {
			QZFL.dom.setStyle(o.dialog, "opacity", this.getPercent() / 100);
		}

		/**
		 * @ignore
		 */
		tween1.onMotionStop = function() {
			QZFL.dom.setStyle(o.dialog, "opacity", 1);
			tween1 = null;
		}
		tween1.start();
	} else {
		// this.setSize(width,height);
	}
};

/**
 * 激活窗体
 */
QZFL.DialogHandler.prototype.focus = function() {
	if (this.isFocus) {
		return;
	}

	this.dialog.style.zIndex = this.zIndex + 3000;

	if (QZFL.dialog.lastFocus) {
		QZFL.dialog.lastFocus.blur();
	};

	this.isFocus = true;
	QZFL.dialog.lastFocus = this;
};

/**
 * 窗体失去焦点
 */
QZFL.DialogHandler.prototype.blur = function() {
	this.isFocus = false;
	this.dialog.style.zIndex = this.zIndex;
};

/**
 * 获得对话框的zindex
 * 
 * @return number
 */
QZFL.DialogHandler.prototype.getZIndex = function() {
	return this.dialog.style.zIndex;
};

/**
 * 填充对话框标题
 * 
 * @param {string} title 对话框标题html
 */
QZFL.DialogHandler.prototype.fillTitle = function(title) {
	var _t = QZFL.dom.get(this.titleId);
	_t.innerHTML = title;
};

/**
 * 填充对话框内容
 * 
 * @param {string} html 对话框内容html
 */
QZFL.DialogHandler.prototype.fillContent = function(html) {
	var _c = QZFL.dom.get(this.contentId);
	_c.innerHTML = html;
};

/**
 * 显示对话框
 * 
 * @param {number} width 对话框宽度
 * @param {number} height 对话框高度
 */
QZFL.DialogHandler.prototype.setSize = function(width, height) {
	//同步dialog外层div的长宽
	var _m = QZFL.dom.get(this.id);
	_m.style.width=width+"px";

	
	//当为div时
	var _c = QZFL.dom.get(this.contentId);
	height = height - 28 < 0 ? 50 : height - 28;//减去title的高度
	_c.style[QZFL.userAgent.ie < 7 ? "height" : "minHeight"] = height + "px";
	
	//遮挡器设定大小
	if (this._isIE6) {
		var _s = QZFL.dom.getSize(QZFL.dom.get(this.id)),//同步内部iframe与外层容器div的大小
			_f = QZFL.dom.get(this.frameId);
		QZFL.dom.setSize(_f, _s[0], _s[1]);
	}
};

/**
 * 卸载对话框
 */
QZFL.DialogHandler.prototype.unload = function() {
	if (!this.onBeforeUnload()) {
		return;
	};
	var o = this;
	if (this.useTween && QZFL.Tween) {
		/**
		 * 效果辅助tween
		 * 
		 * @ignore
		 */
		var tween1 = new QZFL.Tween(this.dialog, "opacity", QZFL.transitions.regularEaseIn, 1, 0, 0.2);

		/**
		 * @ignore
		 */
		tween1.onMotionStop = function() {
			o._unload();
			tween1 = null;
		};

		tween1.start();
	} else {
		this._unload();
	};
};

/**
 * 卸载对话框，忽略
 * @ignore
 * @private
 */
QZFL.DialogHandler.prototype._unload = function() {
	this.onUnload();
	if (QZFL.dragdrop) {
		QZFL.dragdrop.unRegisterDragdropHandler(QZFL.dom.get(this.headId));
	}
	
	if(QZFL.userAgent.ie && QZFL.userAgent.ie < 7){
		this.dialog.innerHTML = ""; // 避免ie6出现focus链条断掉的问题。
	}
	
	QZFL.dom.removeElement(this.dialog);
	delete QZFL.dialog.items[this._id];
};

/**
 * @fileoverview confirm信息提示类
 * @version 1.$Rev: 1521 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-10-14 10:50:15 +0800 (星期三, 14 十月 2009) $
 * @requires QZFL.dialog
 * @requires QZFL.maskLayout
 */

/**
 * confirm信息提示类,建议使用新的接口，如果在QZONE里建议只用QZONE.FP.confirm();具体接口请参见FrontPage接口文档。
 * 
 * @param {string} title 对话框标题
 * @param {string} content 内容
 * @param {number} config 参数配置,说明{"type":"type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001","icontype":"confirm支持的提示类型,succ代表成功,warn代表提示,error代表错误,help代表问号","hastitle":false}
 * @constructor QZFL.widget.Confirm
 * @example
 * 			var _c = new QZONE.widget.Confirm(title, content, {"type":3,"icontype":"succ","hastitle":false});
 * 			_c.show();
 */
//@param {string} title 对话框标题
//@param {string} content 内容
//@param {number} type 类型，类型占3位 111 001(1) ＝ 确定 010 (2)＝ 否定 100(4) ＝ 取消，默认为001
//QZFL.widget.Confirm = function(title, content, type, btnText) {
QZFL.widget.Confirm = function(title, content, config) {
	/**
	 * 按钮层次id
	 * 
	 * @ignore
	 */
	this.buttonLayout = "confirm_button_" + QZFL.widget.Confirm.count;

	/**
	 * confirm 框标题
	 */
	this.title = title || "这里是标题";
	
	/**
	 * confirm 是否要有标题
	 */
	this.hasTitle = true;
	
	/**
	 * confirm 框内容
	 * 这里需要写死高度48px么？？
	 * 
	 */	
	this.content = '<div class="mode_choose_new_index" style="height:48px;padding:18px">' + (content || "这里是内容") + '</div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:right !important"></div>';
	
	//改造接口
	var isNewInterface = false;
	if((config!=null)&&(typeof(config)=="object")){
		var iconHash={"warn":"icon_hint_warn","error":"icon_hint_error","succ":"icon_hint_succeed","help":"icon_hint_help"}
		isNewInterface = true;
		this.hasTitle = (typeof(config.hastitle)=='undefined') ? true : config.hastitle;

		//如果是没有标题的则显示没有标题的content
		if(!this.hasTitle){
			this.content = '<div style="background-color:white;height:160px;width:350px;border:2px #6B97C1 solid"><div style="height:89px;padding:18px;"><img style="position:absolute; top:40px; left:40px;" class="'+iconHash[config.icontype]+'" alt="" src="http://imgcache.qq.com/ac/b.gif"/><h1 style="font-size: 14px; position: absolute; top: 40px; left: 76px;">' + (content || "test") + '</h1></div><div id="' + this.buttonLayout + '" class="global_tip_button tx_r" style="text-align:right !important"></div></div>';
		}
	}
	
	this.type = (isNewInterface ? config.type : config) || 1;

	/**
	 * 提示框的按钮文字
	 * tips[0] = "是"
	 * tips[1] = "否"
	 * tips[2] = "取消"
	 */
	this.tips = (isNewInterface ? config.tips : arguments[3]) ?
		[
			arguments[3][0] ? arguments[3][0] : "是",
			arguments[3][1] ? arguments[3][1] : "否",
			arguments[3][2] ? arguments[3][2] : "取消"
		]
			:
		["是", "否", "取消"];

	/**
	 * 是否显示mask 需要 QZFL.maskLayout 类支持
	 */
	this.showMask = true;

	/**
	 * 当用户点击确认或则是按钮后
	 * 
	 * @event
	 */
	this.onConfirm = QZFL.emptyFn;

	/**
	 * 当用户点击否按钮后
	 * 
	 * @event
	 */
	this.onNo = QZFL.emptyFn;

	/**
	 * 当用户点击取消按钮后
	 * 
	 * @event
	 */
	this.onCancel = QZFL.emptyFn;

	QZFL.widget.Confirm.count++;
};

/**
 * @ignore
 */
QZFL.widget.Confirm.count = 0;

/**
 * 确认框类型
 * 
 * @namespace
 */
QZFL.widget.Confirm.TYPE = {
	OK : 1,
	NO : 2,
	OK_NO : 3,
	CANCEL : 4,
	OK_CANCEL : 5,
	NO_CANCEL : 5,
	OK_NO_CANCEL : 7
};

/**
 * 显示 confirm 框
 */
QZFL.widget.Confirm.prototype.show = function() {
	var _lastTween = QZFL.dialog.tween;
	QZFL.dialog.tween = false;
	if(!this.hasTitle){
		this.dialog = QZFL.dialog.createBorderNone(this.content, "352", "160");
	}else{
		this.dialog = QZFL.dialog.create(this.title, this.content, "300", "140");
	}

	if (this.type & 1) {
		var _d = this._createButton(this.onConfirm, 0, "bt_tip_hit");
		_d.focus();
	}

	if (this.type & 2) {
		this._createButton(this.onNo, 1, "bt_tip_normal");
	}

	if (this.type & 4) {
		this._createButton(this.onCancel, 2, "bt_tip_normal");
	}

	this.dialog.onUnload = QZFL.event.bind(this, function() {
				this.hide();
				if (this.type == 1) {
					this.onConfirm();
				} else {
					this.onCancel();
				}
			});

	this._keyEvent = QZFL.event.bind(this, this.keyPress);
	QZFL.event.addEvent(document, "keydown", this._keyEvent);
	QZFL.dialog.tween = _lastTween;

	if (QZFL.maskLayout && this.showMask) {
		setTimeout(QZFL.event.bind(this, function() {
							var _z = this.dialog.getZIndex();
							this.maskId = QZFL.maskLayout.create(_z - 1);
						}), 0);
	}
};

/**
 * 按键检测
 * 
 * @ignore
 */
QZFL.widget.Confirm.prototype.keyPress = function(e) {
	e = QZFL.event.getEvent(e);
	if (e.keyCode == 27) {
		this.hide();
	}
};

/**
 * 创建按钮
 */
QZFL.widget.Confirm.prototype._createButton = function(e, tipsId,style) {
	var el = QZFL.dom.get(this.buttonLayout),
		_d = QZFL.dom.createElementIn("button", el, false);
	_d.className =style;

	_d.innerHTML = this.tips[tipsId];

	QZFL.event.addEvent(_d, "click", QZFL.event.bind(this, function() {
						e();
						this.hide();
					}));

	return _d;
};

/**
 * 隐藏 confirm 框
 */
QZFL.widget.Confirm.prototype.hide = function() {
	this.dialog.onUnload = QZFL.emptyFn;
	this.dialog.unload();
	this.dialog = null;
	QZFL.event.removeEvent(document, "keydown", this._keyEvent);
	this._keyEvent = null;
	if (this.maskId) {
		QZFL.maskLayout.remove(this.maskId);
	}
};
/**
 * @fileoverview 数据中心 字典方式索引的数据中心 //to do
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 数据中心
 * 
 * @namespace QZFL.dataCenter
 */
QZFL.dataCenter = (function() {
	var keyPool = {},
		dataPool = [];

	function _mSave(k, v) {
		dataPool[k] = v;
		return true;
	}

	function _sSave(k, v) {
		var o = QZFL.shareObject.getValidSO();
		if (o) {
			return o.set("_dc_so_" + k, v);
		} else {
			//rt.error("DataCenter.save: Can't find usable shareObject!");
			return false;
		}
	}

	function _cSave(k, v) {
		var d = QZFL.config.DCCookieDomain;
		if (d) {
			return o.set("_dc_co_" + k, v, d, "/", 120);
		} else {
			//rt.error("DataCenter.save: Can't find cookie domain!");
			return false;
		}
	}

	/**
	 * 内部实体
	 * 
	 * @ignore
	 */
	function getData(key) {
		var t = keyPool[key];
		var res, tmp;

		if (typeof(t) == 'undefined') {
			return t;
		} else {
			t = t[t.length - 1];
			switch (t[1]) {
				case "memory" :
					res = dataPool[t[0]];
					break;
				case "soflash" : {
					tmp = QZFL.shareObject.getValidSO();
					if (tmp) {
						res = tmp.get("_dc_so_" + t[0]);
					} else
						tmp = null;
					break;
				}
				case "cookie" : {
					tmp = QZFL.cookie;
					if (tmp) {
						res = tmp.get("_dc_co_" + t[0]);
					} else
						tmp = null;
					break;
				}
				default :
					res = dataPool[t[0]];
			}
		}
		return res;
	}
	/**
	 * @内部实体
	 * @ignore
	 */
	function deleteData(key) {
		var t = keyPool[key];
		var res, tmp;
		if (typeof(t) == 'undefined') {
			return false;
		} else {
			t = t[t.length - 1];
			switch (t[1]) {
				case "memory" :
					delete dataPool[t[0]];
					break;
				case "soflash" : {
					tmp = QZFL.shareObject.getValidSO();
					if (tmp) {
						res = tmp.del("_dc_so_" + key);
					}
					break;
				}
				case "cookie" : {
					tmp = QZFL.cookie;
					if (tmp) {
						res = tmp.del("_dc_co_" + QZFL.config.DCCookieDomain, "/");
					}
					break;
				}
				default :
					delete dataPool[t[0]];
			}
		}
		delete keyPool[key];
		return true;
	}
	/**
	 * 内部实体
	 * 
	 * @ignore
	 */
	function saveData(key, value, level) {
		if (arguments.length < 2 || typeof(arguments[0]) != 'string') {
			throw (new Error("必须提供键值对:\nkeyName{String}:value{String/Object}"));
			return false;
		}
		var mapLink = dataPool.length;
		if (typeof(keyPool[key]) == 'undefined') {
			keyPool[key] = [];
		}

		keyPool[key].push([mapLink, level]);
		switch (level) {
			case "memory" :
				return _mSave(mapLink, value);
			case "soflash" :
				return _sSave(mapLink, value);
			case "cookie" :
				return _cSave(mapLink, value);
			default :
				return _mSave(mapLink, value);
		}
		return false;
	}

	return {
		/**
		 * 存储数据
		 * 
		 * @function
		 * @memberOf QZFL.dataCenter
		 * @param {String} key
		 * @param {String} value
		 * @param {String} level 数据存储器制定, memory(默认):内存变量, soflash:flash
		 *            shareObject
		 * @return {Boolean} 是否成功
		 */
		save : saveData,
		/**
		 * 获取数据
		 * 
		 * @function
		 * @deprecated 命名不对称！不建议使用
		 * @see load
		 * @memberOf QZFL.dataCenter
		 * @param {String} key
		 * @return {String} 值
		 */
		get : getData,
		/**
		 * 获取数据
		 * 
		 * @function
		 * @memberOf QZFL.dataCenter
		 * @param {String} key
		 * @return {String} 值
		 */
		load : getData,
		/**
		 * 删除数据
		 * 
		 * @function
		 * @memberOf QZFL.dataCenter
		 * @param {String} key
		 * @return {Boolean} 是否成功
		 */
		del : deleteData
	};
})();

/**
 * @fileoverview QZFL对话框类,需要QZFL.dragdrop类支持
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 屏幕遮蔽器，蒙板层
 * 
 * @namespace QZFL.maskLayout
 */
QZFL.maskLayout = {
	count : 0,
	items : {},
	/**
	 * 显示一个遮盖层
	 * 
	 * @return {Number} 返回mask id
	 * @example
	 * 			var _mId = QZFL.maskLayout.create(zindex);
	 */
	create : function(zindex, _doc) {
		this.count++;
		zindex = zindex || 5000;
		_doc = _doc || document;

		var _m = QZFL.dom.createElementIn("div", _doc.body, false, {
					className : "qz_mask_layout"
				});

		// IE7 fixed优化
		var _h = (QZFL.userAgent.ie && QZFL.userAgent.ie < 7)
				? Math.max(_doc.documentElement.scrollHeight,
						_doc.body.scrollHeight)
				: QZFL.dom.getClientHeight(_doc);

		_m.style.zIndex = zindex;
		_m.style.height = _h + "px";
		_m.unselectable = "on";

		this.items[this.count] = _m;
		return this.count;
	},

	/**
	 * 隐藏
	 * 
	 * @param {Number} countId mask ID
	 * @example
	 * 			 QZFL.maskLayout.remove(_mId);//移出蒙板层
	 */
	remove : function(countId) {
		QZFL.dom.removeElement(this.items[countId]);
		delete this.items[countId];
	}
};
/**
 * @fileoverview fixed层效果，主要正对IE6做兼容
 * @version 1.$Rev: 1504 $
 * @author QzoneWebGroup, ($LastChangedBy: joltwang $)
 * @lastUpdate $Date: 2009-09-21 09:20:55 +0800 (星期一, 21 九月 2009) $
 */

/**
 * 页面上下区域的水印层生成器
 * 
 * @namespace QZFL.fixLayout
 */
QZFL.fixLayout = {
	_fixLayout : null,
	_isIE6 : (QZFL.userAgent.ie && QZFL.userAgent.ie < 7),

	_layoutDiv : {},
	_layoutCount : 0,

	/**
	 * 初始化fixed层
	 * 
	 * @ignore
	 */
	_init : function() {
		this._fixLayout = QZFL.dom.get("fixLayout") || QZFL.dom.createElementIn("div", document.body, false, {
			id : "fixLayout",
			style : "width:100%;"
		});
		this._isInit = true;
		// document.body.onscroll = this._onscroll;
		if (this._isIE6) {
			// // document.documentElement.onscroll = QZFL.event.bind(this,
			// this._onscroll);
			QZFL.event.addEvent(document.compatMode == "CSS1Compat" ? window : document.body, "scroll", QZFL.event.bind(this, this._onscroll));
		}
	},

	/**
	 * 创建一个自动修正的层, 不建议创建太多
	 * 
	 * @param {String} html html内容
	 * @param {Boolean} isBottom=false 所在位置，是否处于底部,默认为创建顶部的容器
	 * @param {String} layerId 浮动层的dom id
	 * @param {bool} noFixed 不修正浮动层的位置 for ie6 only argument
	 * @param {Object} options 其他参数
	 * @return {Number} 返回这个层的id编号
	 * @example
	 * 			QZONE.fixLayout.create(html, true, "_returnTop_layout", false, {style : "right:0;z-index:5000" + (QZONE.userAgent.ie ? ";width:100%" : "")});
	 */
	create : function(html, isBottom, layerId, noFixed, options) {
		if (!this._isInit) { // 如果没有初始化，则自动初始化
			this._init();
		}
		options = options || {}
		var tmp = {
			style : (isBottom ? "bottom:0;" : "top:0;") + (options.style || "left:0;width:100%;z-index:10000")
		}, _c;
		
		if (layerId) {
			tmp.id = layerId;
		}
		this._layoutCount++;
		_c = this._layoutDiv[this._layoutCount] = QZFL.dom.createElementIn("div", this._fixLayout, false, tmp);
		_c.style.position = this._isIE6 ? "absolute" : "fixed";
		_c.isTop = !isBottom;
		_c.innerHTML = html;
		_c.noFixed = noFixed ? 1 : 0;
		return this._layoutCount;
	},

	/**
	 * 把固定层固定到顶部
	 * 
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveTop : function(layoutId) {
		if (!this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = QZFL.dom.getScrollTop() + "px";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "0";
				style.bottom = "";
				isTop = true;
			}
		}
	},

	/**
	 * 把固定层固定到底部
	 * 
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 */
	moveBottom : function(layoutId) {
		if (this._layoutDiv[layoutId].isTop) {
			with (this._layoutDiv[layoutId]) {
				if (this._isIE6 && !this._layoutDiv[layoutId].noFixed) {
					style.marginTop = "auto";
					style.marginBottom = "0";
					style.marginBottom = "auto";
				}
				style.top = "";
				style.bottom = "0";
				isTop = false;
			}
		}
	},

	/**
	 * 往固定层里填充html内容html
	 * 
	 * @param {number} layoutId 层编号 - 由create的时候返回的编号
	 * @param {string} html html内容
	 */
	fillHtml : function(layoutId, html) {
		this._layoutDiv[layoutId].innerHTML = html;
	},

	/**
	 * 监听滚动条，for ie6
	 * 
	 * @ignore
	 */
	_onscroll : function() {
		clearTimeout(this._timer);
		this._timer = setTimeout(this._doScroll, 500);

		if (this._doHide) {
			return
		}

		this._doHide = true;

		var o = this;
		/**
		 * 辅助效果tween
		 * 
		 * @ignore
		 */
		var _c = new QZFL.Tween(this._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.2);

		/**
		 * @ignore
		 */
		_c.onMotionChange = function() {
			var o = QZFL.fixLayout;
			for (var k in o._layoutDiv) {
				if (o._layoutDiv[k].noFixed) {
					continue;
				}
				QZFL.dom.setStyle(o._layoutDiv[k], "opacity", 1 - this.getPercent() / 100);
			}
		}

		/**
		 * @ignore
		 */
		_c.onMotionStop = function() {
			o = null;
		}

		_c.start();
	},

	/**
	 * 执行滚动条滚动后的脚本 for ie6
	 * 
	 * @ignore
	 */
	_doScroll : function() {
		var o = QZFL.fixLayout;

		for (var k in o._layoutDiv) {
			if (o._layoutDiv[k].noFixed) {
				continue;
			}
			var _item = o._layoutDiv[k];
			if (_item.isTop) {
				o._layoutDiv[k].style.marginTop = QZFL.dom.getScrollTop() + "px";
			} else {
				// ie6的bottom 有bug...
				// 必须要重新设置一下，然后在还原marginBottom即可还原。崩溃了,想死的心都有了
				o._layoutDiv[k].style.marginBottom = "0";
				o._layoutDiv[k].style.marginBottom = "auto";
			}
		}

		/**
		 * 辅助效果tween
		 * 
		 * @ignore
		 */
		var _c = new QZFL.Tween(QZFL.fixLayout._fixLayout, "_null", QZFL.transitions.regularEaseOut, 0, 100, 0.3);

		/**
		 * 辅助效果tween
		 * 
		 * @ignore
		 */
		_c.onMotionChange = function() {
			for (var k in o._layoutDiv) {
				if (o._layoutDiv[k].noFixed) {
					continue;
				}
				QZFL.dom.setStyle(o._layoutDiv[k], "opacity", this.getPercent() / 100);
			}
		}

		/**
		 * 辅助效果tween
		 * 
		 * @ignore
		 */
		_c.onMotionStop = function() {
			o = null;
		}

		_c.start();
		o._doHide = false;
	}
};

/**
 * @fileoverview 气泡提示框
 * @version 1.$Rev: 1349 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2009-07-22 18:07:39 +0800 (星期三, 22 七月 2009) $
 */

/**
 * 气泡 widget
 * 
 * @namespace
 */
QZFL.widget.bubble = {
	_bubble : {
		total : 0
	},

	/**
	 * 是否使用动画特效
	 */
	useTween : true,

	/**
	 * 气泡提示接口
	 * 
	 * @param {Element} target 对象
	 * @param {String} title 气泡标题
	 * @param {String} msg 气泡内容
	 * @param {Object} options 气泡参数 {timeout,className,id,styleText,call}
	 * @return 返回新建的气泡编号
	 */
	show : function(target, title, msg, options) {
		options = options || {
			timeout : 3000
		};
		var id = options.id || "bubble_" + this._bubble.total;

		if (this._bubble[id]) {
			return id;
		}

		title = title || "";
		msg = msg || "";

		this._bubble.total++;

		setTimeout(function() {
					QZFL.widget.bubble._delayShow(id, target, title, msg,
							options)
				}, 0);
		return id;
	},

	/*
	 * 延迟显示 @ignore
	 */
	_delayShow : function(id, target, title, msg, options) {
		var _me = QZFL.widget.bubble;
		var _arrowMargin = 30;

		var _doc = target.ownerDocument;
		var _frameElement = QZFL.dom.getDocumentWindow(_doc).frameElement;
		var _position = QZFL.dom.getPosition(target);

		var _realTop = _position.top;

		var _closeId = "bubbleClose_" + id;
		var _bubbleMainId = "bubbleMain_" + id;

		// 创建气泡 ---
		var strHtml = '<div id="' + _bubbleMainId + '" class="client_tip">__closeButton__<p>__title__</p><p>__msg__</p></div></div>';
		var strCloseHtml = '<p class="client_tip_close"><button id="' + _closeId + '" class="bt_close" title="关闭"><span class="none">关闭</span></button></p><div class="client_tip_main">';

		// 缓存frame name到哈希表
		_me._bubble[id] = {
			frameName : (_frameElement ? _frameElement.id : null)
		};

		var bubbleDiv = _doc.createElement("div");
		bubbleDiv.id = id;
		bubbleDiv.className = "global_client_tip";
		bubbleDiv.style.cssText = "position:absolute;width:180px;top:0;left:0;visibility:hidden;z-index:11000;" + (options.styleText || "");

		if (options.parentNode) {
			options.parentNode.appendChild(bubbleDiv);
			options.parentNode = null;
		} else {
			_doc.body.appendChild(bubbleDiv);
		}

		bubbleDiv.innerHTML = strHtml.replace(/__title__/, title).replace(
				/__msg__/, msg).replace(/__closeButton__/, strCloseHtml);

		QZFL.css.addClassName(bubbleDiv, options.className || "");
		// 气泡外框创建完成 ---

		// 获取气泡的基本信息
		var _bubbleSize = QZFL.dom.getSize(bubbleDiv);
		_bubbleSize[1] = _bubbleSize[1] + 8;// 这个8像素是箭头高度;

		var _viewWidth = QZFL.dom.getClientWidth(_doc);

		var _isInLeft = _position.left + _bubbleSize[0] < QZFL.dom
				.getClientWidth(_doc); // 气泡是否居左
		var _isInTop = _position.top - _bubbleSize[1] > QZFL.dom
				.getScrollTop(_doc); // 气泡是否居上

		// 创建箭头
		var tipsArrow = _doc.createElement("div");
		tipsArrow.className = _isInTop ? "client_tip_down" : "client_tip_up";
		tipsArrow.style.cssText = "position:relative"

		if (_isInTop) {
			bubbleDiv.appendChild(tipsArrow);
		} else {
			bubbleDiv.insertBefore(tipsArrow, bubbleDiv.firstChild);
		};

		// 计算箭头的位置
		var arrowLeft = (!_isInLeft
				? (_bubbleSize[0] - _arrowMargin - 14)
				: (_position.width > _arrowMargin * 2
						? _arrowMargin
						: (_position.width / 2)));
		tipsArrow.style.marginLeft = arrowLeft + "px";

		// 箭头距离定点距离
		var _distanceX = _isInLeft
				? (arrowLeft + 7)
				: _bubbleSize[0] - (_arrowMargin + 7); // 这7像素是箭头 14px 的一半
		var _distanceY = _bubbleSize[1];

		// 根据箭头的定点计算气泡的坐标
		var _x = _isInLeft && _position.width > _distanceX
				? _position.left
				: (_position.left - _distanceX + parseInt(_position.width * 0.4));
		var _y = _isInTop
				? (_position.top - _distanceY)
				: (_position.top + _position.height);

		// 设置位置
		QZFL.dom.setXY(bubbleDiv, _x, _y);
		QZFL.dom.setStyle(bubbleDiv, "visibility", "");

		// 动画效果
		if (this.useTween && QZFL.Tween) {
			var _bm = _doc.getElementById(_bubbleMainId);
			var _bmSize = QZFL.dom.getSize(_bm);
			QZFL.dom.setStyle(_bm, "overflow", "hidden");

			var _t = new QZFL.Tween(_bm, "height",
					QZFL.transitions.regularEaseOut, "0px", _bmSize[1] + "px",
					.3);
			_t.start();
		}

		// 方法绑定
		var closeButton = _doc.getElementById(_closeId);
		QZFL.event.addEvent(closeButton, "click", QZFL.event.bind(this,
						function() {
							if (options.call) {
								options.call();
							}
							this.hide(id);
						}));

		if (options.timeout) {
			this._bubble["_killBubbleTimer" + id] = setTimeout(function() {
						QZFL.widget.bubble.hide(id)
					}, options.timeout);
		}
	},

	/**
	 * 隐藏气泡
	 * 
	 * @param {Number} id 气泡编号
	 */
	hide : function(id) {
		var bubble = this._bubble[id];
		var o = this;
		clearTimeout(this._bubble["_killBubbleTimer" + id]);

		if (bubble) {
			var _frame = frames[bubble.frameName];
			var e = _frame ? _frame.document.getElementById(id) : QZFL.dom
					.get(id);
			if (!e) { // 如果对象不存在
				this._delBubble(id);
				return;
			}

			if (this.useTween && QZFL.Tween) {
				var _bmSize = QZFL.dom.getSize(e);
				QZFL.dom.setStyle(e, "overflow", "hidden");
				
				var _t = new QZFL.Tween(e, "height",
						QZFL.transitions.regularEaseOut, _bmSize[1] + "px",
						"1px", .3);
						
				/**
				 * @ignore
				 */
				_t.onMotionStop = function() {
					QZFL.dom.removeElement(e);
					o._delBubble(id);
					o = null;
				}
				_t.start();
			} else {
				QZFL.dom.removeElement(e);
				this._delBubble(id);
			}
		}
	},

	/*
	 * 删除气泡缓存数据 @ignore
	 */
	_delBubble : function(id) {
		delete this._bubble["_killBubbleTimer" + id];
		delete this._bubble[id];
	},

	/**
	 * 隐藏所有气泡
	 */
	hideAll : function() {
		for (var k in this._bubble) {
			if (k != "total" && !(/keepBubble/.test(k))) {
				hideBubble(k);
			}
		}
		if (g_MDoc.bubble) {
			g_MDoc.bubble.total = 0;
		}
	}
}

/**
 * 隐藏气泡
 * 
 * @param {String} bubbleId 气泡编号
 */
function hideBubble(bubbleId) {
	if (!g_MDoc.bubble) {
		return;
	}
	var bubble = g_MDoc.bubble[bubbleId];
	clearTimeout(g_MDoc.bubble["_killBubbleTimer" + bubbleId]);
	if (bubble) {
		try {
			var _frame = frames[bubble.frameName];
			var e = _frame
					? _frame.document.getElementById(bubbleId)
					: $(bubbleId);
			removeElement(e);
			delete g_MDoc.bubble["_killBubbleTimer" + bubbleId];
			delete g_MDoc.bubble[bubbleId];
		} catch (err) {
		}
	}
}

/**
 * 隐藏所有气泡
 */
function hideAllBubble() {
	for (var k in g_MDoc.bubble) {
		if (k != "total" && !(/keepBubble/.test(k))) {
			hideBubble(k);
		}
	}
	if (g_MDoc.bubble) {
		g_MDoc.bubble.total = 0;
	}
}
/*
 * QZFL.event.addEvent(document.body,"scroll",function(){alert(1)});
 * QZFL.event.addEvent(document.body,"scroll",function(){alert(2)});
 */

/**
 * @fileoverview 气泡功能扩展
 * @version 1.$Rev: 1349 $
 * @author QzoneWebGroup
 * @lastUpdate $Date: 2009-07-22 18:07:39 +0800 (星期三, 22 七月 2009) $
 */

/**
 * extend Bubble Create
 * 
 * @param {String} key 关键key
 * @param {Element} target 对象
 * @param {String} msg 气泡标题
 * @param {Object} options 气泡参数 {timeout,className,id,styleText,callback}
 * @return 返回新建的气泡编号
 */
QZFL.widget.bubble.showEx = function(key, target, msg, options) {
	var k = "bubble_" + key;
	var _so = QZFL.shareObject.getValidSO();
	if (!_so) {
		return null;
	}
	// _so.del(k); //debugger
	var _v = _so.get(k);
	if (_v == 1) {
		return null;
	} else {
		return QZFL.widget.bubble
				.show(
						target,
						msg,
						'<div class=tx_r><label for="' + k + '" style="cursor:pointer;"><input id="' + k + '" onclick="QZFL.widget.bubble.setExKey(\'bubble_' + key + '\', this.checked)" type="checkbox"/>以后不再提醒</label></div>',
						options);
	}
};

/**
 * 设置气泡是否不再显示的key
 * 
 * @param {string} key shareObject 的 key
 * @param {bool} value 设置不在显示的值
 */
QZFL.widget.bubble.setExKey = function(key, value) {
	var _so = QZFL.shareObject.getValidSO();
	if (_so) {
		_so.set(key, value ? 1 : 0);
	}
};
/*
 * Copyright (c) 2008, Tencent Inc. All rights reserved.
 */
/**
 * @fileoverview 随机seed
 * @author QzoneWebGroup
 * @version 1.0
 */

/**
 * 用来返回
 * 
 * @namespace
 */
QZFL.widget.seed = {
	_seed : 1,

	/**
	 * 记录cooki的域名
	 */
	domain : "qq.com",
	
	prefix : "__Q_w_s_",

	/**
	 * 更新Seed数值
	 * @param {string} [k] seed的名称
	 */
	update : function(k) {
		if (typeof(k) == "undefined") {
			this._update();
		}else{
			var s, n;
			k = this.prefix + k;
			s = QZFL.shareObject.getValidSO();
			if (!s) {
				this._update();
			} else {
				n = s.get(k);
				if (!n) {
					s.set(k, n = 1);
				} else {
					s.set(k, ++n);
				}
			}
		}
		return true;
	},
	
	_update : function(){
		this._seed = parseInt(Math.random() * 10000000);
		QZFL.cookie.set("randomSeed", this._seed, this.domain, null, 3000);
	},

	/**
	 * 获得Seed数值
	 * @param {string} [k] seed的名称
	 * @return {number} seed值
	 */
	get : function(k) {
		if (typeof(k) == "undefined") {
			this._seed = QZFL.cookie.get("randomSeed");
			if (!this._seed) {
				this.update();
			}
			
			return this._seed;
		}else{
			var s, n;
			k = this.prefix + k;
			s = QZFL.shareObject.getValidSO();
			if(!s){
				return this._seed;
			}
			n = s.get(k);
			if(!n){
				s.set(k, n = 1);
			}
			return n;
		}
	}
};
/**
 * @fileoverview 这是个有趣的widget,能够在两个Dom之期间绘制一个会跑的外框 需要 QZFL.Tween 支持
 */

/**
 * runBox widget 能够在两个Dom之期间绘制一个会跑的外框,可以用作提醒
 * 
 * @namespace
 */
QZFL.widget.runBox = {
	/**
	 * 记录一些动作的队列,递增的.
	 */
	_actions : [],
	
	/**
	 * 一些默认配置：duration动画的持续时间，单位s（秒）。
	 */
	_def_cong : {'duration' : 0.6},

	/**
	 * @param {HTMLElement|String} startDom 开始的dom
	 * @param {HTMLElement|String} finishDom 移动到结束的dom
	 * @param {Object} conf 可选参数 duration表示动画时间。默认为0.6s。eg:{'duration':0.6}，可选参数使用object，便于扩展。
	 */
	start : function(startDom, finishDom, conf) {
		this._actions.push(new this._runAction(startDom, finishDom, conf));
	},

	/**
	 * 播放动画的行为
	 * 
	 * @param {HTMLElement|String} _sDom 开始的dom
	 * @param {HTMLElement|String} _fDom 移动到结束的dom
	 * @param {Object} conf 可选参数 
	 * @ignore
	 * @constructor
	 */
	_runAction : function(_sDom, _fDom, _conf) {
		/**
		 * 动画初始位置的dom
		 */
		this._sDom = QZFL.dom.get(_sDom);

		/**
		 * 动画结束位置的dom
		 */
		this._fDom = QZFL.dom.get(_fDom);
		
		/**
		 * 一些配置
		 */
		this._conf = QZFL.lang.propertieCopy(_conf, QZFL.widget.runBox._def_cong, null, true);
		
		
		this._actionID = -1;

		/**
		 * 记录初始的位置
		 */
		this._sPosition = null;

		/**
		 * 记录结束的位置
		 */
		this._fPosition = null;

		/**
		 * 逃跑的box
		 */
		this._runBox = null;

		if (_init.call(this)) { // 初始化数据,如果成功就开始run
			_run.call(this);
		}

		/**
		 * 初始化一些对象
		 * 
		 * @ignore
		 * @return boolean 返回初始化是否成功
		 */
		function _init() {
			if (!this._sDom || !this._fDom) {
				return false;
			}
			var o = this;
			o._sPosition = QZFL.dom.getPosition(this._sDom);
			o._fPosition = QZFL.dom.getPosition(this._fDom);
			o._actionID = QZFL.widget.runBox._actions.length - 1;

			o._runBox = QZFL.dom.createElementIn("div", document.body, false, {
				style : "border:3px solid #999;position:absolute"
			});
			QZFL.dom.setXY(this._runBox, this._sPosition.left, this._sPosition.top);
			QZFL.dom.setSize(this._runBox, this._sPosition.width, this._sPosition.height);
			// QZFL.dom.setStyle(this._runBox,"opacity",0.4);
			return true;
		}

		/**
		 * 开始执行
		 */
		function _run() {
			// QZFL.Tween = function(el, property, func, startValue,
			// finishValue, duration)

			/**
			 * @ignore
			 */
			var _t = new QZFL.Tween(this._runBox, "_p", QZFL.transitions.backEaseIn, 1, 100, this._conf.duration);
			var _me = this;
			/**
			 * @ignore
			 */
			_t.onMotionChange = function(o, p, c) {
				var _p = c / 100;

				var l = _me._sPosition.left * (1 - _p) + _me._fPosition.left * _p;
				var t = _me._sPosition.top * (1 - _p) + _me._fPosition.top * _p;
				var w = _me._sPosition.width * (1 - _p) + _me._fPosition.width * _p;
				var h = _me._sPosition.height * (1 - _p) + _me._fPosition.height * _p;

				QZFL.dom.setXY(_me._runBox, l, t);
				QZFL.dom.setSize(_me._runBox, w, h);
			}
			/**
			 * @ignore
			 */
			_t.onMotionStop = function() {
				delMe.call(_me);
				_me = null;
				_t = null;
			}
			_t.start();
		}

		/**
		 * 删除runBox
		 */
		function delMe() {
			QZFL.dom.removeElement(this._runBox);
			QZFL.widget.runBox[this._actionID] = null;
		}
	}
};

/**
 * @author scorr
 */
 
/**
 * 需要打开string命名空间
 */
if (typeof(QZFL.string) == "object") {
	QZFL.namespace.map(QZFL.string, window, "function");
}

/**
 * 需要打开util命名空间
 */
if (typeof(QZFL.util) == "object") {
	QZFL.namespace.map(QZFL.util, window, "function");
}

