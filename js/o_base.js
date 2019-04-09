// document.getElementsByTagName("head")[0].appendChild('<script src="http://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>')

var newScript = document.createElement("script");
newScript.type = "text/javascript";
newScript.src = "https://res.wx.qq.com/open/js/jweixin-1.2.0.js";

var head = document.getElementsByTagName("head")[0];
head.appendChild(newScript);

/**************************** 动作类 ****************************/
// 返回上一层
function back() {
  history.back(-1);
}
//跳转页面
function goTo(url, param) {
  if (!param) {
    url = url;
  } else {
    url = url + "?" + param;
  }
  window.location.href = url;
}
//上传图片
function uploadImg(input) {
  var imgObj = $(input).siblings("img");
  //是否支持
  if (typeof FileReader === "undefined") {
    alert("抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！");
    input.setAttribute("disabled", "disabled");
  }
  if (input.files && input.files[0]) {
    var file = input.files[0],
      reader = new FileReader();
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/gif"
    ) {
      alert("不是有效的图片文件！");
      return;
    }
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      var result = this.result; //获取到base64的图片

      var img = new Image();

      img.src = result;

      $(".UpImage").prepend(img);
    };
  }
}

/******************************* 判断类 **************************/
// 验证手机
function isPhone(phone) {
  if (/^1[3|4|5|8][0-9]\d{8}$/.test(phone)) {
    return true;
  } else {
    return false;
  }
}
// 验证身份证
function isIdNum(ID) {
  var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (!regIdNo.test(ID)) {
    return false;
  } else {
    return true;
  }
}
// 验证车牌号
function isCarNum(num) {
  if (vehicleNumber.length == 7) {
    var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (express.test(vehicleNumber)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}
// 判断是否为空
function isNull(value) {
  if ($.trim(value).length) {
    return false;
  } else {
    return true;
  }
}
// 判断是否为数字
function isNum(num) {
  if (isNaN(num)) {
    return true;
  } else {
    return false;
  }
}
// 判断邮箱是否正确
function isEmail(email) {
  var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  var isok = reg.test(email);
  if (isok) {
    return true;
  } else {
    return false;
  }
}

/***************************** 转换类 *******************************/
/**
 * @param now 时间
 * @param ff 格式 Y-m-d H:i:s / Y-m-d / Y-m-d H:i
 */
// 日期格式化
function formatDate(now, ff) {
  var year = now.getFullYear();
  var month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  var hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  var minute =
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  var second =
    now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  if (ff == "Y-m-d") {
    return year + "-" + month + "-" + date;
  } else if (ff == "Y-m-d H:i:s") {
    return (
      year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    );
  } else if (ff == "Y-m-d H:i") {
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
  }
}
// 转换时间
function format(time, ff) {
  if (time.length == 10) time = time * 1000;
  var d = new Date(time);
  return formatDate(d, ff);
}
// 转时间戳
function turnTimestamp(timestamp, ff) {
  var time = new Date();
  time.setTime(timestamp);
  return format(time, ff);
}

/****************************** 缓存类 ******************************/
// 设置本地缓存
function setItem(key, val) {
  return window.localStorage.setItem(key, val);
}
// 获取本地缓存
function getItem(key) {
  return window.localStorage.getItem(key);
}
// 删除本地缓存
function moveItem(key) {
  localStorage.removeItem(key);
}
/**
 * @param name cookie名称
 * @param value cookie值
 * @param iDay cookie的时间
 */
// 设置cookie
function setCookie(name, value, iDay) {
  var oDate = new Date();
  oDate.setDate(oDate.getDate() + iDay);
  document.cookie = name + "=" + value + ";expires=" + oDate;
}
// 获取cookie
function getCookie(name) {
  var arr = document.cookie.split("; ");
  for (var i = 0; i < arr.length; i++) {
    var arr2 = arr[i].split("=");
    if (arr2[0] == name) {
      return arr2[1];
    }
  }
  return "";
}
// 删除cookie
function removeCookie(name) {
  setCookie(name, 1, -1);
}

/****************************** 获取url参数 *********************/
function getParam() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

/******************************* Ajax ***************************/
/**
 * @param Param 参数
 * @param callback 成功回调
 * @param error 失败回调
 */
// 请求ajax
function ajaxPost(Param, url, callback) {
  $.ajax({
    type: "POST",
    url: "https://mlxyhotel.https.xiaozhuschool.com/ " + url, // ajax请求路径
    // url: "https://mlxyhotel.https.xiaozhuschool.com/" + url, // ajax请求路径
    dataType: "JSON",
    data: Param,
    async: true,
    success: function (data) {
      callback(data);
    },
    error: function (errorThrown) {
      console.log("错误::", errorThrown);
    }
  });
}

/***************************** 随机验证码 *************************/
function createCode() {
  var code = "";
  var codeLength = 4;
  //设置随机字符
  var random = new Array(
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z"
  );
  //循环codeLength 我设置的4就是循环4次
  for (var i = 0; i < codeLength; i++) {
    //设置随机数范围,这设置为0 ~ 36
    var index = Math.floor(Math.random() * 36);
    //字符串拼接 将每次随机的字符 进行拼接
    code += random[index];
  }
  return code;
}

/******************************* 判断支付环境 ***********************/
function isWX_Allipay() {
  if (
    window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
    "micromessenger"
  ) {
    return "WX";
  } else if (
    window.navigator.userAgent.toLowerCase().match(/AlipayClient/i) ==
    "alipayclient"
  ) {
    return "Allipay";
  } else {
    return "Others";
  }
}

/******************************* 微信JS-sdk ***********************/

/******************************* 微信JS-sdk ***********************/

//公共方法
$(function () {
  // 关闭遮罩层
  $(".mask").on("click", function () {
    $(".mask").fadeOut(300);
    $(".maskBox").fadeOut(300);
  });

  // 获取URL数据并显示相应内容
  var type = getParam("type");
  $("." + type.type).show();
});

//导航栏归属
function setNav(type) {
  setItem("nav", type);
  setItem("navTime", Date.parse(new Date()) / 1000);
}

function setAdminNav(type) {
  setItem("adminNav", type);
  setItem("adminNavTime", Date.parse(new Date()) / 1000);
}

function setListNav(type) {
  setItem("listNav", type);
  setItem("listNavTime", Date.parse(new Date()) / 1000);
}

function getNav(type) {
  var now = Date.parse(new Date()) / 1000;
  if (getItem("nav") && now - getItem("navTime") < 300) {
    navType = getItem("nav");
  } else {
    navType = type;
  }
  $(".navbtn").each(function () {
    if ($(this).data("type") == navType) {
      navBtn(this);
    }
  });
}

function getAdminNav(type) {
  var now = Date.parse(new Date()) / 1000;
  if (getItem("adminNav") && now - getItem("adminNavTime") < 300) {
    navType = getItem("adminNav");
  } else {
    navType = type;
  }
  $(".navbtn").each(function () {
    if ($(this).data("type") == navType) {
      navBtn(this);
    }
  });
}

function getListNav(type) {
  var now = Date.parse(new Date()) / 1000;
  if (getItem("listNav") && now - getItem("listNavTime") < 300) {
    navType = getItem("listNav");
  } else {
    navType = type;
  }
  $(".navbtn").each(function () {
    if ($(this).data("type") == navType) {
      navBtn(this);
    }
  });
}