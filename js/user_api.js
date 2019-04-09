//user_api
var config_user_active = 86340000;
//var config_user_api_url = 'http://longtengcd.app.xiaozhuschool.com/user_api/';
var config_user_api_url = 'http://longtengcd.app.xiaozhuschool.com/Wxsite/User/api';
var config_user_wechat_url = 'http://longtengcd.app.xiaozhuschool.com';
var globals_user_method = [];
var user_api_img_url = 'http://longtengcd.app.xiaozhuschool.com';
var user_api_useragent = window.navigator.userAgent;

function user_api_url(method) {
	var url = config_user_api_url + method;
	var parsemethod = method.split('/');
	if(parsemethod[0] == '') parsemethod[0] = parsemethod[1];
	if($.inArray(parsemethod[0], globals_user_method) == -1) {
		var user = {};
		try {
			user = $.evalJSON(localStorage.getItem('user'));
			if(!user || !user.id) return url;
		} catch(e) {
			return url;
		}
		url += '?userid=' + user.id + '&sign=' + localStorage.getItem('user_sign') + '&timestamp=' + localStorage.getItem('user_timestamp');
	}
	return url;
}

function user_api(method, data, callback) {
	method = method || 'refresh';
	data = data || {}
	url = user_api_url(method);
	//退出登录
	if(method == 'logout') {
		localStorage.setItem('user', null);
		localStorage.setItem('user_sign', null);
		localStorage.setItem('user_timestamp', null);
		localStorage.setItem('user_time', null);
	}

	$.ajax({
		type: 'post',
		url: url,
		data: data,
		dataType: 'json',
		beforeSend: function(xhr) {
			xhr.withCredentials = true;
		},
		crossDomain: true,
		success: function(apires) {
			if(apires.msg == 'success') {
				//保存数据
				if(method == 'auth_edit' || method == 'login' || method == 'register' || method == 'edit' || method == 'refresh') localStorage.setItem('user', $.toJSON(apires.data));
				if(apires.sign) {
					localStorage.setItem('user_sign', apires.sign);
					localStorage.setItem('user_timestamp', apires.timestamp);
					localStorage.setItem('user_time', (new Date()).getTime());
				}
			}
			//如果是微信跳转登录			
			if(user_api_useragent.match(/micromessenger/i)) {
				if(apires.msg == 'denied' || apires.msg == 'nologin' || apires.msg == 'usererr') {
					top.location.href = config_user_api_url + 'weixin_login?redirect=' + top.location.href;
				}
			}
			if(callback) callback(apires);
		},
		error: function() {
			//
		}
	});
}

function user_cookie(user, sign, timestamp) {
	localStorage.setItem('user', user);
	localStorage.setItem('user_sign', sign);
	localStorage.setItem('user_timestamp', timestamp);
	localStorage.setItem('user_time', (new Date()).getTime());
}

function user_profile() {
	var user = {};
	try {
		user = $.evalJSON(localStorage.getItem('user'));
	} catch(e) {}
	return user || {};
}

function user_islogin() {
	var islogin = false;
	var now_time = (new Date()).getTime();
	var user_time = localStorage.getItem('user_time');
	if(user_time && now_time - user_time < config_user_active) {
		var user = {};
		try {
			user = $.evalJSON(localStorage.getItem('user'));
			islogin = !!user.id;
		} catch(e) {
			islogin = false;
		}
	}
	return islogin;
}

function user_urlparam(name, explode, url) {
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

//判断登录
var user_api_userid = user_urlparam("userid");
var user_api_sign = user_urlparam("sign");
var user_api_timestamp = user_urlparam("timestamp");
if(user_api_userid != '' && user_api_sign != '' && user_api_timestamp != '')
	user_cookie($.toJSON({
		id: user_api_userid
	}), user_api_sign, user_api_timestamp);

//判断是否绑定过手机
function bingPhone() {
	$.ajax({
		type: "POST",
		url: config_user_api_url,
		data: {
			api_name: "getUserInfo"
		},
		dataType: "JSON",
		success: function(res) {
			if(res.code == 1) {
				if(res.data.mobile == "") {
					window.location.href = "phone_bind.html"
				} else {
					$("#userInfo img").attr("src", res.data.head_img);
					$("#userName").html(res.data.nickname);
					$("#userPhone").html(res.data.mobile);

					//	   		var userInfo =  JSON.stringify(res.data);
					//	   		localStorage.setItem("userInfo",userInfo);
				}
			} else if(res.code == -1) {
				//异常状态，没有该用户，请重新授权！
				window.location.href = "http://longtengcd.app.xiaozhuschool.com/Wxsite/Home/index";
			}
		}

	});

}

//授权config
function config(url){
	//URL 替换

	url = config_user_wechat_url + "/Wxsite/Wechat/callJssdk?u=" + url.replace("&", "jssssssssssssdk");
	//JSONP的回调
	$.ajax({
		url: url,
		type: "get",
		dataType: "jsonp",
		jsonp: "callback",
		jsonCallback: "success_jsonpCallback",
		success: function(data) {
			wx.config({
				debug: false,
				appId: data.appId,
				timestamp: data.timestamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: [
						'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                        ]
			});
		},
		error: function() {
			console.log("连接失败");
		}
	});
	
	
	
	
	

}