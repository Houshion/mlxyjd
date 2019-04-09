function showMask() {
	$('.mask').remove();
	$('body').append('<div class="mask" style="position: fixed;height: 100%;width: 100%;top:0;background:rgba(0,0,0,0.6);z-index: 1;"></div>');
}

function hideMask() {
	$('.mask').remove();
}
//数据为空提示
function emptyTip(tip) {
	return '<div class="h20"></div><div class="empty"><div class="logo"><img src="../img/empty_page_nothing.png"></div><div class="msg" style="color: #999;">' + tip + '</div></div>';
}
//判断身份证格式是否正确
function checkIdCode(value) {
	var value = $.trim(value);
	var userCardreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	var taiwanreg = /^[A-Z][0-9]{9}$/; //台湾
	var xianggangreg = /^[A-Z][0-9]{6}\([0-9A]\)$/; //香港
	var aomenreg = /^[157][0-9]{6}\([0-9]\)$/; //澳门
	//return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
	return(userCardreg.test(value) || taiwanreg.test(value) || xianggangreg.test(value) || aomenreg.test(value));
}
//日历插件(年月日时分秒)
function mobiscroll() {
	var now = new Date(),
		minDate = new Date(now.getFullYear() - 10, now.getMonth(), now.getDate()),
		maxDate = new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());

	$('.mobiscroll').mobiscroll().datetime({
		theme: 'ios',
		display: 'bottom',
		lang: "zh", //设置中文
		headerText: '选择时间',
		dateFormat: 'yyyy-mm-dd', //设置日期格式
		inputClass: 'tmp',
		min: minDate,
		max: maxDate
	});
}

//判断是否为空
function isNull(value) {
	if($.trim(value).length) {
		return false;
	} else {
		return true;
	}
}
//判断手机或者电话号码格式
function checkMobileAndTel(value) {
	var dalu = /^1(3|4|5|7|8)\d{9}$/;
	var aomen = /^[0][9]\d{8}$/;
	var xianggan = /^([5|6|8|9])\d{7}$/;
	return(dalu.test(value) || xianggan.test(value) || aomen.test(value));
};
//多张图片上传，配合表单使用
function upLoadImg(file, picbox, size) {
	var size = size ? size : 1;
	if($('.shade').length == 0) {
		$('body').append($('<div class="shade" onclick="javascript:closeShade()" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: rgba(0, 0, 0, 0.2);z-index: 1000;display: none;"><div class="" style="width: 300px;height: 200px;line-height: 200px;position: absolute;top: 50%;left: 50%;margin-top: -100px;margin-left: -150px;background: white;border-radius: 5px;text-align: center;"><span class="text_span"></span></div></div>'));
	}
	if($('.shadeImg').length == 0) {
		$('body').append($('<div class="shadeImg" onclick="javascript:closeShadeImg()" style="position: absolute;display: none;width: 100%;height: 100%;top: 0;left: 0;z-index: 15;text-align: center;background: rgba(0, 0, 0, 0.2);"><div><img class="showImg" src="" style="width: 100%;margin-top: 140px;"></div></div>'));
	}
	var objUrl;
	var img_html;
	var template = $(file).parent().html();
	var picbox = document.getElementById(picbox);
	var filepath = $(file).val();
	if($(picbox).children('label').length > size) {
		$(".shade").fadeIn(500);
		$(".text_span").text("最多可以上传" + size + '张图片');
		$(picbox).find('label:last input').attr('name', '');
		return false;
	} else {
		$(picbox).find('label:last input').attr('name', "backpics[]");
	};
	for(var i = 0; i < file.files.length; i++) {
		objUrl = getObjectURL(file.files[i]);
		var extStart = filepath.lastIndexOf(".");
		var ext = filepath.substring(extStart, filepath.length).toUpperCase();
		if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
			$(".shade").fadeIn(500);
			$(".text_span").text("图片限于bmp,png,gif,jpeg,jpg格式");
			return false;
		} else {
			img_html = "<div class='isImg' style='height: 100%'><img src='" + objUrl + "' onclick='javascript:lookBigImg(this)' style='height: 100%; width: 100%;' /><button class='removeBtn' onclick='javascript:removeImg(this)' style='position:absolute;right: 0;top: 0;background: rgba(0,0,0,0.2);color: #fff;border-radius: 50%;width: 0.3rem;height: 0.3rem;font-size: 0.1rem;display: flex;align-items: center;justify-content: center;'>x</button></div>";
			$(file).parent().append(img_html);
			var obj = $('<label class="a-upload fl" style="position: relative">' + template + '</label>');
			$(picbox).append(obj);
		}
	}
	return true;
}

function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) {
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) {
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) {
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

function removeImg(r) {
	$(r).parents('label').remove();
	event.stopPropagation();
	event.preventDefault();
	return false;
}

function lookBigImg(b) {
	$(".shadeImg").fadeIn(500);
	$(".showImg").attr("src", $(b).attr("src"));
	event.stopPropagation();
	event.preventDefault();
	return false;
}

function closeShade() {
	$(".shade").fadeOut(500);
}

function closeShadeImg() {
	$(".shadeImg").fadeOut(500);
};
/*图片上传end*/
/*日期格式化*/
function formatDate(now, ff) {
	var year = now.getFullYear();
	var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
	var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
	var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
	var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
	var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
	if(ff == 'Y-m-d') {
		return year + "-" + month + "-" + date;
	} else if(ff == 'Y-m-d H:i:s') {
		return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
	}
}

function format(time, ff) {
	if(time.length == 10) time = time * 1000;
	var d = new Date(time);
	return formatDate(d, ff);
}
//加载中
function loadingShow() {
	$('.loading').remove();
	var str = '<div class="loading"><div class="spinner5"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div><div class="bounce4"></div></div><div class="loadingTip" style="margin-top: 0.2rem;">加载中...</div></div>';
	$('body').append(str);
}
//关掉加载
function loadingHide() {
	$('.loading').remove();
}
/**
 * 获取url参数
 */
function getUrlParam(name, explode, url) {
	var param = window.location.search.substr(1);
	if(url) {
		if(explode) {
			param = url.substr(url.indexOf(explode) + 1);
		} else {
			param = url.substr(url.indexOf('?') + 1);
		}
	} else {
		if(explode) {
			param = window.location.href.substr(window.location.href.indexOf(explode) + 1);
		}
	}
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = param.match(reg);
	if(r != null) return unescape(r[2]);
	return '';
}
//判断checkbox被选中的个数
function checkedLong(str) {
	return $(str + ":checked").length;
}

function dlcUrl() {
	return 'http://longtengcd.app.xiaozhuschool.com';
}

function dlc_request(method, data, cb, type) {
	var data = data || {};
	url = dlcUrl() + method;
	$.ajax({
		type: type ? type : 'post',
		url: url,
		data: data,
		dataType: 'json',
		crossDomain: true,
		success: function(res) {
			if(cb) cb(res);
		},
		error: function(err) {
			if(err) cb(err)
		}
	});
}

//参数截取
function GetRequest() {
	var url = location.search; //获取url中"?"符后的字串   
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}

function set_user_info(cb) {
	dlc_request('App/apilike/userinfo', {
		'api_name': 'userinfo'
	}, function(res) {
		console.log(res);
		if(res.code == 1) {
			localStorage.setItem("user_info", JSON.stringify(res.data));
		} else {
			//tooltipbox.show(res.msg);
		}
		if(cb) cb(res);
	});
}

function user_info() {
	return localStorage.getItem("user_info") ? JSON.parse(localStorage.getItem("user_info")) : '';
}
var dlctipbox = {
	success: function(msg) {
		var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
			'<div id="dlctipbox_success" class="flex flex-column bw border-r4" style="width: 6rem;height: 3.8rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
			'<img src="../img/success.png" style="width: 1rem;height: 1rem;"/>' +
			'<p class="font16 col3 mt20">' + (msg ? msg : '网络异常，请刷新') + '</p>' +
			'</div>';
		$(document.body).append(str);
		$('body').on('click', '#dlctipbox_mask', function() {
			dlctipbox.clear();
		});
	},
	error: function(msg) {
		var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
			'<div id="dlctipbox_success" class="flex flex-column bw border-r4" style="width: 6rem;height: 3.8rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
			'<img src="../img/error.png" style="width: 1rem;height: 1rem;"/>' +
			'<p class="font16 col3 mt20 plr24">' + (msg ? msg : '网络异常，请刷新') + '</p>' +
			'</div>';
		$(document.body).append(str);
		$('body').on('click', '#dlctipbox_mask', function() {
			dlctipbox.clear();
		});
	},
	clear: function() {
		$('#dlctipbox_success,#dlctipbox_mask,#dlctipbox_confirm,#dlctipbox_tip,#dlctipbox_loading').remove();
	},
	confirm: function(msg, callback, cancelcall) {
		showMask();
		var str = '<section id="dlctipbox_confirm" class="flex flex-column bw border-r4" style="z-index:9999;width: 6rem;height: 3.8rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
			'<div class="msg font16 col3">' + (msg ? msg : "网络异常，请刷新") + '</div>' +
			'<div class="btn_bar" style="margin-top: .9rem;">' +
			'<button class="font16 col9 border-r4 confirm_btn" style="width: 1.6rem;line-height: .6rem;border: 1px solid #dadada;background: transparent;" data-btn="1">取消</button>' +
			'<button class="font16 colw bgc1 border-r4 confirm_btn" style="width: 1.6rem;line-height: .6rem;margin-left: .8rem;" data-btn="2">确定</button>' +
			'</div>' +
			'</section>';
		$(document.body).append(str);
		$('body').on('click', '.confirm_btn', function() {
			if($(this).data('btn') == 2) {
				if(callback) {
					callback();
				}
			} else {
				if(cancelcall) {
					cancelcall();
				}
			}
			hideMask();
			$('#dlctipbox_confirm').remove();
		});
	},
	tip: function(msg) {
		var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
			'<section id="dlctipbox_tip" class="bw border-r4" style="width: 6rem;height: 2.5rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
			'<div class="flex" style="padding: 0 .45rem;height: .94rem;">' +
			'<div class="line_x" style="height: 1px;flex: 1;background: #dadada;"></div>' +
			'<span style="padding: 0 .16rem;" class="font15 col3">提示</span>' +
			'<div class="line_x" style="height: 1px;flex: 1;background: #dadada;"></div>' +
			'</div>' +
			'<div style="padding: 0 .45rem;font-size: .28rem;color: #333;margin-top: .3rem;" class="tac">' + (msg ? msg : '网络异常，请刷新') + '</div>' +
			'</section>';
		$(document.body).append(str);
		$('body').on('click', '#dlctipbox_mask', function() {
			dlctipbox.clear()
		});
	},
	loading: function(msg) {
		var msg = msg ? msg : '加载中...';
		var str = '<div style="background: rgba(0,0,0,0.6);width: 2rem;z-index:999999;height: 2rem;position: fixed;left: 50%;top: 50%;margin-left: -1rem;margin-top: -1rem;" class="flex flex-column" id="dlctipbox_loading">' +
			'<div class="loadEffect">' +
			'<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>' +
			'</div>' +
			'<p style="color: #fff;font-size: .28rem;margin-top: .1rem;">' + msg + '</p>' +
			'</div>';
		$(document.body).append(str);
	},
	show: function(msg, position, duration, keep) {
		if(!keep) this.clear();
		var msg = msg ? msg : '网络异常，请刷新';
		if(!msg) {
			var m = document.getElementById('tooltipbox_show_div');
			var d = 0.2;
			m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
			m.style.opacity = '0';
			setTimeout(function() {
				try {
					document.body.removeChild(m);
				} catch(e) {}
			}, d * 1000);
			return;
		}
		if(position != 'bottom' && position != 'middle' && position != 'top') {
			position = 'bottom';
		}

		duration = isNaN(duration) ? 1000 : duration;
		var m = document.createElement('div');
		m.id = 'tooltipbox_show_div';
		m.innerHTML = msg;
		var css = "width:60%; font-size:14px;min-width:150px; background:#000; opacity:0.7; min-height:35px; overflow:hidden; color:#fff; line-height:35px; text-align:center; border-radius:5px; position:fixed; left:20%; z-index:999999;";
		if(position == 'top') {
			css += "top:10%; ";
		} else if(position == 'bottom') {
			css += "bottom:10%; ";
		} else if(position == 'middle') {
			css += "top:50%;margin-top:-18px;";
		}
		m.style.cssText = css;
		document.body.appendChild(m);
		if(duration != 0) {
			setTimeout(function() {
				var d = 0.2;
				m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
				m.style.opacity = '0';
				setTimeout(function() {
					try {
						document.body.removeChild(m);
					} catch(e) {}
				}, d * 1000);
			}, duration);
		}
	},
	alert: function(msg, callback, data, keep) {
		if(!keep) this.clear();
		var msg = msg ? msg : '网络异常，请刷新';
		var html = '<div id="tooltipbox_alert" style="z-index:999999997;"><div class="layer" style="height: 100%; width: 100%; background: rgba(0,0,0,0.4); position: fixed; top: 0px; left: 0px; z-index: 999999998; display: none;"></div><div class="tips" style="min-height: 120px; min-width: 250px; background: #fff; position: fixed; top: 50%; left: 50%; z-index: 999999999; margin: -100px -146px; display: none; border-radius:3px; border:1px solid rgba(255,255,255,0.6); padding:20px 20px 10px 20px;"><div class="title" style="min-height:90px; min-width:250px; font-size:16px; color:#676767;">';
		html += msg;
		html += '</div><div class="sub" style="min-height:30px; min-width:250px;"><nav data-action="ok" style="min-height:30px; width:auto; padding:0px 10px; margin:0px 2px; font-size:16px; line-height:30px; float:right; color:#5e7199; cursor:pointer;">确定</nav>';
		html += '</div></div></div>';

		if($('#tooltipbox_tip').length > 0) {
			$('#tooltipbox_tip').remove();
		}
		var div = $(html);
		$(document.body).append(div);
		$('.layer', div).fadeIn(100);
		$('.tips', div).fadeIn(100);

		div.find('nav').unbind('click').click(function() {

			var action = $(this).data('action');
			if(action == 'ok') {
				if(callback) {
					callback(data);
				}
				div.remove();
			}
		});
	}
};

//SHA1算法加密
(function(D) {
	function p(b, e, c) {
		var a = 0,
			d = [0],
			f = "",
			g = null,
			f = c || "UTF8";
		if("UTF8" !== f && "UTF16" !== f) throw "encoding must be UTF8 or UTF16";
		if("HEX" === e) {
			if(0 !== b.length % 2) throw "srcString of HEX type must be in byte increments";
			g = v(b);
			a = g.binLen;
			d = g.value
		} else if("TEXT" === e) g = w(b, f), a = g.binLen, d = g.value;
		else if("B64" === e) g = x(b), a = g.binLen, d = g.value;
		else if("BYTES" === e) g = y(b), a = g.binLen, d = g.value;
		else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
		this.getHash = function(b, f, c, e) {
			var g = null,
				h = d.slice(),
				l = a,
				n;
			3 === arguments.length ? "number" !== typeof c && (e = c, c = 1) : 2 === arguments.length && (c = 1);
			if(c !== parseInt(c, 10) || 1 > c) throw "numRounds must a integer >= 1";
			switch(f) {
				case "HEX":
					g = z;
					break;
				case "B64":
					g = A;
					break;
				case "BYTES":
					g = B;
					break;
				default:
					throw "format must be HEX, B64, or BYTES";
			}
			if("SHA-1" === b)
				for(n = 0; n < c; n += 1) h = s(h, l), l = 160;
			else throw "Chosen SHA variant is not supported";
			return g(h, C(e))
		};
		this.getHMAC = function(c, b, e, g, q) {
			var h, l, n, r, p = [],
				t = [];
			h = null;
			switch(g) {
				case "HEX":
					g = z;
					break;
				case "B64":
					g =
						A;
					break;
				case "BYTES":
					g = B;
					break;
				default:
					throw "outputFormat must be HEX, B64, or BYTES";
			}
			if("SHA-1" === e) l = 64, r = 160;
			else throw "Chosen SHA variant is not supported";
			if("HEX" === b) h = v(c), n = h.binLen, h = h.value;
			else if("TEXT" === b) h = w(c, f), n = h.binLen, h = h.value;
			else if("B64" === b) h = x(c), n = h.binLen, h = h.value;
			else if("BYTES" === b) h = y(c), n = h.binLen, h = h.value;
			else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
			c = 8 * l;
			b = l / 4 - 1;
			if(l < n / 8) {
				if("SHA-1" === e) h = s(h, n);
				else throw "Unexpected error in HMAC implementation";
				h[b] &= 4294967040
			} else l > n / 8 && (h[b] &= 4294967040);
			for(l = 0; l <= b; l += 1) p[l] = h[l] ^ 909522486, t[l] = h[l] ^ 1549556828;
			if("SHA-1" === e) e = s(t.concat(s(p.concat(d), c + a)), c + r);
			else throw "Unexpected error in HMAC implementation";
			return g(e, C(q))
		}
	}

	function w(b, e) {
		var c = [],
			a, d = [],
			f = 0,
			g;
		if("UTF8" === e)
			for(g = 0; g < b.length; g += 1)
				for(a = b.charCodeAt(g), d = [], 128 > a ? d.push(a) : 2048 > a ? (d.push(192 | a >>> 6), d.push(128 | a & 63)) : 55296 > a || 57344 <= a ? d.push(224 | a >>> 12, 128 | a >>> 6 & 63, 128 | a & 63) : (g += 1, a = 65536 + ((a & 1023) << 10 | b.charCodeAt(g) & 1023),
						d.push(240 | a >>> 18, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | a & 63)), a = 0; a < d.length; a += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= d[a] << 24 - f % 4 * 8, f += 1;
		else if("UTF16" === e)
			for(g = 0; g < b.length; g += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= b.charCodeAt(g) << 16 - f % 4 * 8, f += 2;
		return {
			value: c,
			binLen: 8 * f
		}
	}

	function v(b) {
		var e = [],
			c = b.length,
			a, d;
		if(0 !== c % 2) throw "String of HEX type must be in byte increments";
		for(a = 0; a < c; a += 2) {
			d = parseInt(b.substr(a, 2), 16);
			if(isNaN(d)) throw "String of HEX type contains invalid characters";
			e[a >>> 3] |=
				d << 24 - a % 8 * 4
		}
		return {
			value: e,
			binLen: 4 * c
		}
	}

	function y(b) {
		var e = [],
			c, a;
		for(a = 0; a < b.length; a += 1) c = b.charCodeAt(a), (a >>> 2) + 1 > e.length && e.push(0), e[a >>> 2] |= c << 24 - a % 4 * 8;
		return {
			value: e,
			binLen: 8 * b.length
		}
	}

	function x(b) {
		var e = [],
			c = 0,
			a, d, f, g, m;
		if(-1 === b.search(/^[a-zA-Z0-9=+\/]+$/)) throw "Invalid character in base-64 string";
		a = b.indexOf("=");
		b = b.replace(/\=/g, "");
		if(-1 !== a && a < b.length) throw "Invalid '=' found in base-64 string";
		for(d = 0; d < b.length; d += 4) {
			m = b.substr(d, 4);
			for(f = g = 0; f < m.length; f += 1) a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(m[f]),
				g |= a << 18 - 6 * f;
			for(f = 0; f < m.length - 1; f += 1) e[c >> 2] |= (g >>> 16 - 8 * f & 255) << 24 - c % 4 * 8, c += 1
		}
		return {
			value: e,
			binLen: 8 * c
		}
	}

	function z(b, e) {
		var c = "",
			a = 4 * b.length,
			d, f;
		for(d = 0; d < a; d += 1) f = b[d >>> 2] >>> 8 * (3 - d % 4), c += "0123456789abcdef".charAt(f >>> 4 & 15) + "0123456789abcdef".charAt(f & 15);
		return e.outputUpper ? c.toUpperCase() : c
	}

	function A(b, e) {
		var c = "",
			a = 4 * b.length,
			d, f, g;
		for(d = 0; d < a; d += 3)
			for(g = (b[d >>> 2] >>> 8 * (3 - d % 4) & 255) << 16 | (b[d + 1 >>> 2] >>> 8 * (3 - (d + 1) % 4) & 255) << 8 | b[d + 2 >>> 2] >>> 8 * (3 - (d + 2) % 4) & 255, f = 0; 4 > f; f += 1) c = 8 * d + 6 * f <= 32 * b.length ? c +
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g >>> 6 * (3 - f) & 63) : c + e.b64Pad;
		return c
	}

	function B(b) {
		var e = "",
			c = 4 * b.length,
			a, d;
		for(a = 0; a < c; a += 1) d = b[a >>> 2] >>> 8 * (3 - a % 4) & 255, e += String.fromCharCode(d);
		return e
	}

	function C(b) {
		var e = {
			outputUpper: !1,
			b64Pad: "="
		};
		try {
			b.hasOwnProperty("outputUpper") && (e.outputUpper = b.outputUpper), b.hasOwnProperty("b64Pad") && (e.b64Pad = b.b64Pad)
		} catch(c) {}
		if("boolean" !== typeof e.outputUpper) throw "Invalid outputUpper formatting option";
		if("string" !== typeof e.b64Pad) throw "Invalid b64Pad formatting option";
		return e
	}

	function q(b, e) {
		return b << e | b >>> 32 - e
	}

	function r(b, e) {
		var c = (b & 65535) + (e & 65535);
		return((b >>> 16) + (e >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535
	}

	function t(b, e, c, a, d) {
		var f = (b & 65535) + (e & 65535) + (c & 65535) + (a & 65535) + (d & 65535);
		return((b >>> 16) + (e >>> 16) + (c >>> 16) + (a >>> 16) + (d >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535
	}

	function s(b, e) {
		var c = [],
			a, d, f, g, m, p, u, k, s, h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
		b[e >>> 5] |= 128 << 24 - e % 32;
		b[(e + 65 >>> 9 << 4) + 15] = e;
		s = b.length;
		for(u = 0; u < s; u += 16) {
			a = h[0];
			d = h[1];
			f = h[2];
			g = h[3];
			m = h[4];
			for(k = 0; 80 > k; k += 1) c[k] = 16 > k ? b[k + u] : q(c[k - 3] ^ c[k - 8] ^ c[k - 14] ^ c[k - 16], 1), p = 20 > k ? t(q(a, 5), d & f ^ ~d & g, m, 1518500249, c[k]) : 40 > k ? t(q(a, 5), d ^ f ^ g, m, 1859775393, c[k]) : 60 > k ? t(q(a, 5), d & f ^ d & g ^ f & g, m, 2400959708, c[k]) : t(q(a, 5), d ^ f ^ g, m, 3395469782, c[k]), m = g, g = f, f = q(d, 30), d = a, a = p;
			h[0] = r(a, h[0]);
			h[1] = r(d, h[1]);
			h[2] = r(f, h[2]);
			h[3] = r(g, h[3]);
			h[4] = r(m, h[4])
		}
		return h
	}
	"function" === typeof define && define.amd ? define(function() {
			return p
		}) : "undefined" !== typeof exports ? "undefined" !== typeof module && module.exports ? module.exports =
		exports = p : exports = p : D.jsSHA = p
})(this);