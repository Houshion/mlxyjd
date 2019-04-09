/**
 * Created by Administrator on 2017/5/24.
 */
// 微信跳转
function redirect() {
    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx34ce9ebc8ee538fb&redirect_uri=' + location.href + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
}

function showMask() {
    $('.mask1').remove();
    $('body').append('<div class="mask1" style="position: fixed;height: 100%;width: 100%;top:0;background:rgba(0,0,0,0.6);z-index: 1;"></div>');
}

function hideMask() {
    $('.mask1').remove();
}
//数据为空提示
function emptyTip(tip) {
    return '<div class="h20"></div><div class="empty"><div class="logo"><img src="../img/y_empty_page_nothing.png"></div><div class="msg" style="color: #999;">' + tip + '</div></div>';
}
//判断身份证格式是否正确
function checkIdCode(value) {
    var value = $.trim(value);
    var userCardreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var taiwanreg = /^[A-Z][0-9]{9}$/; //台湾
    var xianggangreg = /^[A-Z][0-9]{6}\([0-9A]\)$/; //香港
    var aomenreg = /^[157][0-9]{6}\([0-9]\)$/; //澳门
    //return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    return (userCardreg.test(value) || taiwanreg.test(value) || xianggangreg.test(value) || aomenreg.test(value));
}

//判断是否为空
function isNull(value) {
    if ($.trim(value).length) {
        return false;
    } else {
        return true;
    }
}
// 存储数据
function setData(name, arr) {
    return localStorage.setItem(name, JSON.stringify(arr));
}

function getData(name) {
    return JSON.parse(localStorage.getItem(name)) || '';
}

function clearData(name) {
    return localStorage.removeItem(name);
}
var token = !!user_token();

function user_save(info) { //保存token
    localStorage.setItem('info', JSON.stringify(info));
}

function user_token() { //获取token
    return JSON.parse(localStorage.getItem('info'));
}
//判断是否未微信或者支付宝浏览器
function isWX_Allipay() {
    if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger') {
        return 'WX';
    } else if (window.navigator.userAgent.toLowerCase().match(/AlipayClient/i) == 'alipayclient') {
        return 'Allipay';
    } else {
        return 'Others';
    }
}

function isLogin(cb) {
    if (!token) { //获取不到token
        if (isWX_Allipay() == 'WX') { //如果是微信客户端
            if (getUrlParam('code') == '') {
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx34ce9ebc8ee538fb&redirect_uri=' + location.href + '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
            } else {
                dlc_request('appToken/userInfo', { code: getUrlParam('code'), phone: $('.phone').val() }, function(res) {
                    if (res.code == 1) {
                        console.log(res.userInfo)
                        user_save(res.userInfo);
                        res.flag = 1; //flag==1 登录成功
                    } else {
                        res.flag = 0; //flag==0 登录失败
                    }
                    if (cb) cb(res);
                })
            }
        } else {
            dlctipbox.show('请在微信或者支付宝环境下使用');
        }
    } else {
        //已有token
        dlc_request('/api/personage/api', { api_name: 'personageCt' }, function(res) {
            res.flag = 1;
            if (cb) cb(res);
        });
        // if(cb)cb({flag:1});//flag==1 已有token
    }
}

//判断手机或者电话号码格式
function checkMobileAndTel(value) {
    return /^1(3|4|5|7|8)\d{9}$/.test(value);
};
//多张图片上传，配合表单使用
function upLoadImg(file, picbox, size) {
    var size = size ? size : 1;
    if ($('.shade').length == 0) {
        $('body').append($('<div class="shade" onclick="javascript:closeShade()" style="position: absolute;width: 100%;height: 100%;top: 0;left: 0;background: rgba(0, 0, 0, 0.2);z-index: 1000;display: none;"><div class="" style="width: 300px;height: 200px;line-height: 200px;position: absolute;top: 50%;left: 50%;margin-top: -100px;margin-left: -150px;background: white;border-radius: 5px;text-align: center;"><span class="text_span"></span></div></div>'));
    }
    if ($('.shadeImg').length == 0) {
        $('body').append($('<div class="shadeImg" onclick="javascript:closeShadeImg()" style="position: absolute;display: none;width: 100%;height: 100%;top: 0;left: 0;z-index: 15;text-align: center;background: rgba(0, 0, 0, 0.2);"><div><img class="showImg" src="" style="width: 100%;margin-top: 140px;"></div></div>'));
    }
    var objUrl;
    var img_html;
    var template = $(file).parent().html();
    var picbox = document.getElementById(picbox);
    var filepath = $(file).val();
    if ($(picbox).children('label').length > size) {
        $(".shade").fadeIn(500);
        $(".text_span").text("最多可以上传" + size + '张图片');
        $(picbox).find('label:last input').attr('name', '');
        return false;
    } else {
        $(picbox).find('label:last input').attr('name', "backpics[]");
    };
    for (var i = 0; i < file.files.length; i++) {
        objUrl = getObjectURL(file.files[i]);
        var extStart = filepath.lastIndexOf(".");
        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
        if (ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") {
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
    if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
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

// 展示弹框
function showModal(obj) {
    $('body').addClass('p-fixed');
    $(obj).show();
    $('.mask').fadeIn(300);
}

// 隐藏弹框
function hideModal(obj) {
    $('body').removeClass('p-fixed');
    $(obj).hide();
    $('.mask').fadeOut(300);
}

// 弹框确认
function confirmModel() {

    var str = '<div class="mask"></div>' +
        '<div class="wd-60 bfff maskBox radius10" id="confirm">' +
        '<div class="pd-15">' +
        '<div class="ta-center message">' +
        '<img src="../img/o_confirm.png" class="wd-40 mg-10">' +
        '<div>是否确认收房？</div>' +
        '</div>' +
        '</div>' +
        '<div class="border-t flex">' +
        '<div class="box wd-50 pd-15 border-r colbbb" onclick="hideModal($(/"#confirm/"))">取消</div>' +
        '<div class="box wd-50 pd-15 btn1 btnConfirm">确认</div>' +
        '</div>' +
        '</div>';

    $('body').append(str);

}
// 表单提交
function formSubmit(obj, formId, url, url2) {
    $('#' + formId).ajaxSubmit({
        type: 'post',
        url: url,
        dataType: 'json',
        beforeSubmit: function() {
            if (!checkForm(obj, formId)) {
                return false;
            }
            swal({
                background: 'transparent',
                onOpen: function() {
                    swal.showLoading()
                }
            })
        },
        success: function(res) {
            swal({
                showConfirmButton: false,
                background: 'transparent',
                timer: 5,
                onClose: function() {
                    swal.hideLoading()
                }
            })
            $(obj).removeAttr('disabled');
            if (res.code == 1) {
                swal({ type: 'success', title: res.msg, showConfirmButton: false, timer: 2000 }).catch(function(e) { console.log(e) });
                if (url2 && url !== '') {
                    setTimeout(function() {
                        window.location.href = url2;
                    }, 1200);
                }
            } else {
                dlctipbox.show(res.msg);
                // swal({ type: 'error', title: res.msg, showConfirmButton: false, timer: 2000 }).catch(function(e) { console.log(e) });
                // alert(res.msg);
            }
        },
        error: function(res) {
            dlctipbox.show(res.msg);
            // swal({ type: 'error', title: res.msg, showConfirmButton: false, timer: 2000 }).catch(function(e) { console.log(e) });
            console.log('网络异常,请刷新');
        }
    })
}
// 表单验证
function checkForm(obj, fromId, filter) {
    var __options = { formId: fromId };
    var __form = new JForm(__options);
    if (!__form.checkFormData()) {
        return false;
    }
    if (obj && obj !== '') {
        $(obj).attr('disabled', 'disabled');
    }
    return true;
}
/*图片上传end*/
/*日期格式化*/
function formatDate(now, ff) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    if (ff == 'Y-m-d') {
        return year + "-" + month + "-" + date;
    } else if (ff == 'Y-m-d H:i:s') {
        return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    }
}

function format(time, ff) {
    if (time.length == 10) time = time * 1000;
    var d = new Date(time);
    return formatDate(d, ff);
}
//加载中
function loadingShow() {
    $('.loading').remove();
    var str = '<div class="mask" style="position: fixed;height: 100%;width: 100%;top:0;background:rgba(0,0,0,0.6);z-index: 1;"></div><div class="loading"><div class="spinner5"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div><div class="bounce4"></div></div><div class="loadingTip" style="margin-top: 0.2rem;">加载中...</div></div>';
    $('body').append(str);
}
//关掉加载
function loadingHide() {
    $('.loading').remove();
    $('.mask').hide()
}
function loadingClose(){
    $('.loading').remove();
    $('.mask').remove()
}
/**
 * 获取url参数
 */
function getUrlParam(name, explode, url) {
    var param = window.location.search.substr(1);
    if (url) {
        if (explode) {
            param = url.substr(url.indexOf(explode) + 1);
        } else {
            param = url.substr(url.indexOf('?') + 1);
        }
    } else {
        if (explode) {
            param = window.location.href.substr(window.location.href.indexOf(explode) + 1);
        }
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = param.match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}
//判断checkbox被选中的个数
function checkedLong(str) {
    return $(str + ":checked").length;
}

function dlcUrl() {
    // return 'https://mlxyjdgz.app.xiaozhuschool.com/api/';
    return 'https://mlxyhotel.https.xiaozhuschool.com/';
}

function dlc_request(method, data, cb, async, type) {
    var data = data || {};
    url = dlcUrl() + method;
    $.ajax({
        type: type ? type : 'POST',
        url: url,
        data: data,
        async: async == false ? false : true,
        dataType: 'json',
        crossDomain: true,
        success: function(res) {
            if (cb) cb(res);
        },
        error: function(err) {
            if (err) cb(err)
        }
    });
}
//储存用户信息
function set_user_info(cb) {
    dlc_request('App/apilike/userinfo', { 'api_name': 'userinfo' }, function(res) {
        console.log(res);
        if (res.code == 1) {
            localStorage.setItem("user_info", JSON.stringify(res.data));
        } else {
            tooltipbox.show(res.msg);
        }
        if (cb) cb(res);
    });
}
//获取用户信息
function user_info() {
    return localStorage.getItem("user_info") ? JSON.parse(localStorage.getItem("user_info")) : '';
}
var dlctipbox = {
    success: function(msg, img) {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div id="success" class="bw border-r1 pos_f tac dpn" style="z-index:9527;top: 3.4rem;width: 5.2rem;left: 50%;margin-left: -2.6rem;overflow: hidden;">' +
            '<div class="mt60">' +
            '<img src="' + (img ? img : '../img/success.png') + '" style="width: 1.4rem;">' +
            '</div>' +
            '<p class="font16 mt40 mb60" style="color: #0fdab6;">' + msg + '</p>' +
            '</div>';
        $('body').append(html);
        $('#success').fadeIn(300);
    },
    error: function(msg, img) {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div id="error" class="bw border-r1 pos_f tac dpn" style="z-index:9527;top: 3.4rem;width: 5.2rem;left: 50%;margin-left: -2.6rem;overflow: hidden;">' +
            '<div class="mt60">' +
            '<img src="' + (img ? img : '../img/error.png') + '" style="width: 1.4rem;">' +
            '</div>' +
            '<p class="font16 mt40 mb60 color2">' + msg + '</p>' +
            '</div>';
        $('body').append(html);
        $('#error').fadeIn(300);
    },
    clear: function() {
        $('#success,#tooltipbox_show_div,#dlctipbox_loading,#alert_img,#mask,#alert,#confirm_img,#confirm,#error,#share_tip').remove();
    },
    confirm_img: function(msg, cb) {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div id="confirm_img" class="bw border-r1 pos_f tac dpn" style="z-index:9527;top: 3.4rem;width: 6.5rem;left: 50%;margin-left: -3.25rem;overflow: hidden;">' +
            '<div class="mt60">' +
            '<img src="../img/error.png" style="width: 1.4rem;">' +
            '</div>' +
            '<p class="font17 ptb30 lh60 plr40 color2">' + msg + '</p>' +
            '<div class="font16 lh100 flex_a tac bdt">' +
            '<a class="flex1 confirm_btn" onclick="dlctipbox.confirm_img_callback(0)">联系管理员</a>' +
            '<a class="colw bgc1 flex1 confirm_btn" onclick="dlctipbox.confirm_img_callback(1)">提交异常</a>' +
            '</div>' +
            '</div>';
        this.confirm_img_callback = function(flag) {
            dlctipbox.clear();
            if (flag == 1) { cb(1) } else { cb(0) }
        };
        $('body').append(html);
        $('#confirm_img').fadeIn(300);
    },
    confirm: function(msg, cb) {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div id="confirm" class="bw border-r1 pos_f dpn" style="z-index:9527;top: 3.4rem;width: 6.5rem;left: 50%;margin-left: -3.25rem;overflow: hidden;">' +
            '<p class="font17 ptb60 lh60 plr40 tac">' + msg + '</p>' +
            '<div class="font16 lh100 flex_a tac bdt">' +
            '<a class="flex1" onclick="dlctipbox.confirm_callback(0)">取消</a>' +
            '<a class="colw bgc1 flex1" onclick="dlctipbox.confirm_callback(1)">确定</a>' +
            '</div>' +
            '</div>';
        this.confirm_callback = function(flag) {
            dlctipbox.clear();
            if (flag == 1) { cb(1) } else { cb(0) }
        };
        $('body').append(html);
        $('#confirm').fadeIn(300);
    },
    loading: function(msg) {
        var msg = msg ? msg : '请稍后...';
        var str = '<div style="background: rgba(0,0,0,0.6);width: 2rem;z-index:999999;height: 2rem;position: fixed;left: 50%;top: 50%;margin-left: -1rem;margin-top: -1rem;" class="flex flex-column" id="dlctipbox_loading">' +
            '<div class="loadEffect">' +
            '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>' +
            '</div>' +
            '<p style="color: #fff;font-size: .28rem;margin-top: .1rem;text-align:center;">' + msg + '</p>' +
            '</div>';
        $(document.body).append(str);
    },
    show: function(msg, position, duration, keep) {
        if (!keep) this.clear();
        var msg = msg ? msg : '请稍后...';
        if (!msg) {
            var m = document.getElementById('tooltipbox_show_div');
            var d = 0.2;
            m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function() {
                try { document.body.removeChild(m); } catch (e) {}
            }, d * 1000);
            return;
        }
        if (position != 'bottom' && position != 'middle' && position != 'top') {
            position = 'bottom';
        }

        duration = isNaN(duration) ? 1000 : duration;
        var m = document.createElement('div');
        m.id = 'tooltipbox_show_div';
        m.innerHTML = msg;
        var css = "width:60%; font-size:14px;min-width:150px; background:#000; opacity:0.7; min-height:35px; overflow:hidden; color:#fff; line-height:35px; text-align:center; border-radius:5px; position:fixed; left:20%; z-index:999999;";
        if (position == 'top') {
            css += "top:10%; ";
        } else if (position == 'bottom') {
            css += "bottom:10%; ";
        } else if (position == 'middle') {
            css += "top:50%;margin-top:-18px;";
        }
        m.style.cssText = css;
        document.body.appendChild(m);
        if (duration != 0) {
            setTimeout(function() {
                var d = 0.2;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function() {
                    try { document.body.removeChild(m); } catch (e) {}
                }, d * 1000);
            }, duration);
        }
    },
    alert_img: function(msg, img) {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div id="alert_img" class="bw font16 border-r1 pos_f tac dpn" style="z-index:9527;top: 3.4rem;width: 6.5rem;left: 50%;margin-left: -3.25rem;overflow: hidden;">' +
            '<div class="mt60">' +
            '<img src="' + (img ? img : '../img/alert_ico.png') + '" style="width: 1.04rem;">' +
            '</div>' +
            '<p class="mt20" style="color: #0fdab6;">开锁成功</p>' +
            '<p class="lh40 plr40 mb60 mt10">' + msg + '</p>' +
            '<a class="flex_aj bdt color1 lh100" onclick="dlctipbox.clear();">确认</a>' +
            '</div>';
        $('body').append(html);
        $('#alert_img').fadeIn(300);
    },
    alert: function(msg, cb) {
        if (!document.getElementById('mask')) { showMask(); }
        var html = '<div id="alert" class="bw font16 border-r1 pos_f tac dpn" style="z-index:9527;top: 3.4rem;width: 6.5rem;left: 50%;margin-left: -3.25rem;overflow: hidden;">' +
            '<p class="lh40 plr40 mt60 mb60 mt10">' + msg + '</p>' +
            '<a class="flex_aj bdt color1 lh100" onclick="dlctipbox.confirm_callback(1)">确认</a>' +
            '</div>';
        this.confirm_callback = function(flag) {
            dlctipbox.clear();
            if (flag == 1) { if (cb) cb(1) } else { if (cb) cb(0) }
        };
        $('body').append(html);
        $('#alert').fadeIn(300);
    },
    share_tip: function() {
        if (!document.getElementById('mask')) { showMask(1); }
        var html = '<div class="share_tip" id="share_tip">' +
            '<img src="../img/shareImg.png" style="width: 4rem;padding: 0.5rem 0.5rem 0 0"/>' +
            '<div class="text">' +
            '<img src="../img/font.png" style="width:5rem"/>' +
            '</div>' +
            '</div>';
        $('body').append(html);
        $('#share_tip').fadeIn(300);
    }
};
// var dlctipbox = {
//     success: function(msg) {
//         var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
//             '<div id="dlctipbox_success" class="flex flex-column bw border-r4" style="width: 6rem;height: 3.8rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
//             '<img src="../img/success.png" style="width: 1rem;height: 1rem;"/>' +
//             '<p class="font16 col3 mt20">' + (msg ? msg : '网络异常，请刷新') + '</p>' +
//             '</div>';
//         $(document.body).append(str);
//         $('body').on('click', '#dlctipbox_mask', function() { dlctipbox.clear(); });
//     },
//     error: function(msg) {
//         var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
//             '<div id="dlctipbox_success" class="flex flex-column bw border-r4" style="width: 6rem;height: 3.8rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
//             '<img src="../img/error.png" style="width: 1rem;height: 1rem;"/>' +
//             '<p class="font16 col3 mt20 plr24">' + (msg ? msg : '网络异常，请刷新') + '</p>' +
//             '</div>';
//         $(document.body).append(str);
//         $('body').on('click', '#dlctipbox_mask', function() { dlctipbox.clear(); });
//     },
//     clear: function() {
//         $('#dlctipbox_success,#dlctipbox_mask,#dlctipbox_confirm,#dlctipbox_tip,#dlctipbox_loading,#confirm').remove();
//     },
//     confirm: function(msg, cb) {
//         if (!document.getElementById('mask')) { showMask(1); }
//         var html = '<div id="confirm" class="bw border-r1 pos_f dpn" style="z-index:9999;width: 6rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
//             '<p class="font17 ptb60 lh60 plr40 tac p30">' + msg + '</p >' +
//             '<div class="font16 lh100 flex_a tac bdt">' +
//             '<a class="flex1" onclick="dlctipbox.confirm_callback(0)">取消</ a>' +
//             '<a class="colw bgc1 flex1" onclick="dlctipbox.confirm_callback(1)">确定</ a>' +
//             '</div>' +
//             '</div>';
//         this.confirm_callback = function(flag) {
//             dlctipbox.clear();
//             if (flag == 1) { cb(1) } else { cb(0) }
//         };
//         $('body').append(html);
//         $('#confirm').fadeIn(300);
//     },
//     tip: function(msg) {
//         var str = '<section id="dlctipbox_mask" onclick="dlctipbox.clear()" style="width: 100%;height: 100%;position: fixed;background: rgba(0,0,0,0.4);top: 0;left: 0;"></section>' +
//             '<section id="dlctipbox_tip" class="bw border-r4" style="width: 6rem;height: 2.5rem;position: fixed;top: 50%;left: 50%;margin-top: -1.9rem;margin-left: -3rem;">' +
//             '<div class="flex" style="padding: 0 .45rem;height: .94rem;">' +
//             '<div class="line_x" style="height: 1px;flex: 1;background: #dadada;"></div>' +
//             '<span style="padding: 0 .16rem;" class="font15 col3">提示</span>' +
//             '<div class="line_x" style="height: 1px;flex: 1;background: #dadada;"></div>' +
//             '</div>' +
//             '<div style="padding: 0 .45rem;font-size: .28rem;color: #333;margin-top: .3rem;" class="tac">' + (msg ? msg : '网络异常，请刷新') + '</div>' +
//             '</section>';
//         $(document.body).append(str);
//         $('body').on('click', '#dlctipbox_mask', function() { dlctipbox.clear() });
//     },
//     loading: function(msg) {
//         var msg = msg ? msg : '加载中...';
//         var str = '<div style="background: rgba(0,0,0,0.6);width: 2rem;z-index:999999;height: 2rem;position: fixed;left: 50%;top: 50%;margin-left: -1rem;margin-top: -1rem;" class="flex flex-column" id="dlctipbox_loading">' +
//             '<div class="loadEffect">' +
//             '<span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>' +
//             '</div>' +
//             '<p style="color: #fff;font-size: .28rem;margin-top: .1rem;">' + msg + '</p>' +
//             '</div>';
//         $(document.body).append(str);
//     },
//     show: function(msg, position, duration, keep) {
//         if (!keep) this.clear();
//         var msg = msg ? msg : '网络异常，请刷新';
//         if (!msg) {
//             var m = document.getElementById('tooltipbox_show_div');
//             var d = 0.2;
//             m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
//             m.style.opacity = '0';
//             setTimeout(function() {
//                 try { document.body.removeChild(m); } catch (e) {}
//             }, d * 1000);
//             return;
//         }
//         if (position != 'bottom' && position != 'middle' && position != 'top') {
//             position = 'bottom';
//         }

//         duration = isNaN(duration) ? 1000 : duration;
//         var m = document.createElement('div');
//         m.id = 'tooltipbox_show_div';
//         m.innerHTML = msg;
//         var css = "width:60%; font-size:14px;min-width:150px; background:#000; opacity:0.7; min-height:35px; overflow:hidden; color:#fff; line-height:35px; text-align:center; border-radius:5px; position:fixed; left:20%; z-index:999999;";
//         if (position == 'top') {
//             css += "top:10%; ";
//         } else if (position == 'bottom') {
//             css += "bottom:10%; ";
//         } else if (position == 'middle') {
//             css += "top:50%;margin-top:-18px;";
//         }
//         m.style.cssText = css;
//         document.body.appendChild(m);
//         if (duration != 0) {
//             setTimeout(function() {
//                 var d = 0.2;
//                 m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
//                 m.style.opacity = '0';
//                 setTimeout(function() {
//                     try { document.body.removeChild(m); } catch (e) {}
//                 }, d * 1000);
//             }, duration);
//         }
//     },
//     alert: function(msg, callback, data, keep) {
//         if (!keep) this.clear();
//         var msg = msg ? msg : '网络异常，请刷新';
//         var html = '<div id="tooltipbox_alert" style="z-index:999999997;"><div class="layer" style="height: 100%; width: 100%; background: rgba(0,0,0,0.4); position: fixed; top: 0px; left: 0px; z-index: 999999998; display: none;"></div><div class="tips" style="min-height: 120px; min-width: 250px; background: #fff; position: fixed; top: 50%; left: 50%; z-index: 999999999; margin: -100px -146px; display: none; border-radius:3px; border:1px solid rgba(255,255,255,0.6); padding:20px 20px 10px 20px;"><div class="title" style="min-height:90px; min-width:250px; font-size:16px; color:#676767;">';
//         html += msg;
//         html += '</div><div class="sub" style="min-height:30px; min-width:250px;"><nav data-action="ok" style="min-height:30px; width:auto; padding:0px 10px; margin:0px 2px; font-size:16px; line-height:30px; float:right; color:#5e7199; cursor:pointer;">确定</nav>';
//         html += '</div></div></div>';

//         if ($('#tooltipbox_tip').length > 0) {
//             $('#tooltipbox_tip').remove();
//         }
//         var div = $(html);
//         $(document.body).append(div);
//         $('.layer', div).fadeIn(100);
//         $('.tips', div).fadeIn(100);

//         div.find('nav').unbind('click').click(function() {

//             var action = $(this).data('action');
//             if (action == 'ok') {
//                 if (callback) {
//                     callback(data);
//                 }
//                 div.remove();
//             }
//         });
//     }
// };

function setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

function getUserInfo() {
    return JSON.parse(localStorage.getItem('userInfo'));
}
//监听微信返回按钮ios
addEventback();

function addEventback() {
    pushHistory();
    var bool = false;
    setTimeout(function() {
        bool = true;
    }, 1500);
    window.addEventListener("popstate", function(e) {
        if (bool) {
            //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
            location.reload();
        }
        pushHistory();
    }, false);
}

function pushHistory() {
    var state = {
        title: "",
        url: ""
    };
    window.history.replaceState(state, "", "");
}

//SHA1算法加密
(function(D) {
    function p(b, e, c) {
        var a = 0,
            d = [0],
            f = "",
            g = null,
            f = c || "UTF8";
        if ("UTF8" !== f && "UTF16" !== f) throw "encoding must be UTF8 or UTF16";
        if ("HEX" === e) {
            if (0 !== b.length % 2) throw "srcString of HEX type must be in byte increments";
            g = v(b);
            a = g.binLen;
            d = g.value
        } else if ("TEXT" === e) g = w(b, f), a = g.binLen, d = g.value;
        else if ("B64" === e) g = x(b), a = g.binLen, d = g.value;
        else if ("BYTES" === e) g = y(b), a = g.binLen, d = g.value;
        else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
        this.getHash = function(b, f, c, e) {
            var g = null,
                h = d.slice(),
                l = a,
                n;
            3 === arguments.length ? "number" !== typeof c && (e = c, c = 1) : 2 === arguments.length && (c = 1);
            if (c !== parseInt(c, 10) || 1 > c) throw "numRounds must a integer >= 1";
            switch (f) {
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
            if ("SHA-1" === b)
                for (n = 0; n < c; n += 1) h = s(h, l), l = 160;
            else throw "Chosen SHA variant is not supported";
            return g(h, C(e))
        };
        this.getHMAC = function(c, b, e, g, q) {
            var h, l, n, r, p = [],
                t = [];
            h = null;
            switch (g) {
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
            if ("SHA-1" === e) l = 64, r = 160;
            else throw "Chosen SHA variant is not supported";
            if ("HEX" === b) h = v(c), n = h.binLen, h = h.value;
            else if ("TEXT" === b) h = w(c, f), n = h.binLen, h = h.value;
            else if ("B64" === b) h = x(c), n = h.binLen, h = h.value;
            else if ("BYTES" === b) h = y(c), n = h.binLen, h = h.value;
            else throw "inputFormat must be HEX, TEXT, B64, or BYTES";
            c = 8 * l;
            b = l / 4 - 1;
            if (l < n / 8) {
                if ("SHA-1" === e) h = s(h, n);
                else throw "Unexpected error in HMAC implementation";
                h[b] &= 4294967040
            } else l > n / 8 && (h[b] &= 4294967040);
            for (l = 0; l <= b; l += 1) p[l] = h[l] ^ 909522486, t[l] = h[l] ^ 1549556828;
            if ("SHA-1" === e) e = s(t.concat(s(p.concat(d), c + a)), c + r);
            else throw "Unexpected error in HMAC implementation";
            return g(e, C(q))
        }
    }

    function w(b, e) {
        var c = [],
            a, d = [],
            f = 0,
            g;
        if ("UTF8" === e)
            for (g = 0; g < b.length; g += 1)
                for (a = b.charCodeAt(g), d = [], 128 > a ? d.push(a) : 2048 > a ? (d.push(192 | a >>> 6), d.push(128 | a & 63)) : 55296 > a || 57344 <= a ? d.push(224 | a >>> 12, 128 | a >>> 6 & 63, 128 | a & 63) : (g += 1, a = 65536 + ((a & 1023) << 10 | b.charCodeAt(g) & 1023),
                        d.push(240 | a >>> 18, 128 | a >>> 12 & 63, 128 | a >>> 6 & 63, 128 | a & 63)), a = 0; a < d.length; a += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= d[a] << 24 - f % 4 * 8, f += 1;
        else if ("UTF16" === e)
            for (g = 0; g < b.length; g += 1)(f >>> 2) + 1 > c.length && c.push(0), c[f >>> 2] |= b.charCodeAt(g) << 16 - f % 4 * 8, f += 2;
        return { value: c, binLen: 8 * f }
    }

    function v(b) {
        var e = [],
            c = b.length,
            a, d;
        if (0 !== c % 2) throw "String of HEX type must be in byte increments";
        for (a = 0; a < c; a += 2) {
            d = parseInt(b.substr(a, 2), 16);
            if (isNaN(d)) throw "String of HEX type contains invalid characters";
            e[a >>> 3] |=
                d << 24 - a % 8 * 4
        }
        return { value: e, binLen: 4 * c }
    }

    function y(b) {
        var e = [],
            c, a;
        for (a = 0; a < b.length; a += 1) c = b.charCodeAt(a), (a >>> 2) + 1 > e.length && e.push(0), e[a >>> 2] |= c << 24 - a % 4 * 8;
        return { value: e, binLen: 8 * b.length }
    }

    function x(b) {
        var e = [],
            c = 0,
            a, d, f, g, m;
        if (-1 === b.search(/^[a-zA-Z0-9=+\/]+$/)) throw "Invalid character in base-64 string";
        a = b.indexOf("=");
        b = b.replace(/\=/g, "");
        if (-1 !== a && a < b.length) throw "Invalid '=' found in base-64 string";
        for (d = 0; d < b.length; d += 4) {
            m = b.substr(d, 4);
            for (f = g = 0; f < m.length; f += 1) a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(m[f]),
                g |= a << 18 - 6 * f;
            for (f = 0; f < m.length - 1; f += 1) e[c >> 2] |= (g >>> 16 - 8 * f & 255) << 24 - c % 4 * 8, c += 1
        }
        return { value: e, binLen: 8 * c }
    }

    function z(b, e) {
        var c = "",
            a = 4 * b.length,
            d, f;
        for (d = 0; d < a; d += 1) f = b[d >>> 2] >>> 8 * (3 - d % 4), c += "0123456789abcdef".charAt(f >>> 4 & 15) + "0123456789abcdef".charAt(f & 15);
        return e.outputUpper ? c.toUpperCase() : c
    }

    function A(b, e) {
        var c = "",
            a = 4 * b.length,
            d, f, g;
        for (d = 0; d < a; d += 3)
            for (g = (b[d >>> 2] >>> 8 * (3 - d % 4) & 255) << 16 | (b[d + 1 >>> 2] >>> 8 * (3 - (d + 1) % 4) & 255) << 8 | b[d + 2 >>> 2] >>> 8 * (3 - (d + 2) % 4) & 255, f = 0; 4 > f; f += 1) c = 8 * d + 6 * f <= 32 * b.length ? c +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g >>> 6 * (3 - f) & 63) : c + e.b64Pad;
        return c
    }

    function B(b) {
        var e = "",
            c = 4 * b.length,
            a, d;
        for (a = 0; a < c; a += 1) d = b[a >>> 2] >>> 8 * (3 - a % 4) & 255, e += String.fromCharCode(d);
        return e
    }

    function C(b) {
        var e = { outputUpper: !1, b64Pad: "=" };
        try { b.hasOwnProperty("outputUpper") && (e.outputUpper = b.outputUpper), b.hasOwnProperty("b64Pad") && (e.b64Pad = b.b64Pad) } catch (c) {}
        if ("boolean" !== typeof e.outputUpper) throw "Invalid outputUpper formatting option";
        if ("string" !== typeof e.b64Pad) throw "Invalid b64Pad formatting option";
        return e
    }

    function q(b, e) { return b << e | b >>> 32 - e }

    function r(b, e) { var c = (b & 65535) + (e & 65535); return ((b >>> 16) + (e >>> 16) + (c >>> 16) & 65535) << 16 | c & 65535 }

    function t(b, e, c, a, d) { var f = (b & 65535) + (e & 65535) + (c & 65535) + (a & 65535) + (d & 65535); return ((b >>> 16) + (e >>> 16) + (c >>> 16) + (a >>> 16) + (d >>> 16) + (f >>> 16) & 65535) << 16 | f & 65535 }

    function s(b, e) {
        var c = [],
            a, d, f, g, m, p, u, k, s, h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        b[e >>> 5] |= 128 << 24 - e % 32;
        b[(e + 65 >>> 9 << 4) + 15] = e;
        s = b.length;
        for (u = 0; u < s; u += 16) {
            a = h[0];
            d = h[1];
            f = h[2];
            g = h[3];
            m = h[4];
            for (k = 0; 80 > k; k += 1) c[k] = 16 > k ? b[k + u] : q(c[k - 3] ^ c[k - 8] ^ c[k - 14] ^ c[k - 16], 1), p = 20 > k ? t(q(a, 5), d & f ^ ~d & g, m, 1518500249, c[k]) : 40 > k ? t(q(a, 5), d ^ f ^ g, m, 1859775393, c[k]) : 60 > k ? t(q(a, 5), d & f ^ d & g ^ f & g, m, 2400959708, c[k]) : t(q(a, 5), d ^ f ^ g, m, 3395469782, c[k]), m = g, g = f, f = q(d, 30), d = a, a = p;
            h[0] = r(a, h[0]);
            h[1] = r(d, h[1]);
            h[2] = r(f, h[2]);
            h[3] = r(g, h[3]);
            h[4] = r(m, h[4])
        }
        return h
    }
    "function" === typeof define && define.amd ? define(function() { return p }) : "undefined" !== typeof exports ? "undefined" !== typeof module && module.exports ? module.exports =
        exports = p : exports = p : D.jsSHA = p
})(this);

//转义字符转字符串
function escape2Html(str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function(all, t) { return arrEntities[t]; });
}


/*秒转时间*/
function timeStamp(second_time) {
    var time = parseInt(second_time) + "";
    if (parseInt(second_time) > 60) {
        var second = parseInt(second_time) % 60;
        var min = parseInt(second_time / 60);
        second = (second < 10) ? ('0' + second) : second
        min = (min < 10) ? ('0' + min) : min
        time = min + ":" + second + "";
        if (min > 60) {
            min = parseInt(second_time / 60) % 60;
            var hour = parseInt(parseInt(second_time / 60) / 60);
            second = (second < 10) ? ('0' + second) : second
            min = (min < 10) ? ('0' + min) : min
            hour = (hour < 10) ? ('0' + hour) : hour
            time = hour + ":" + min + ":" + second + "";

            if (hour > 24) {
                hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                second = (second < 10) ? ('0' + second) : second
                min = (min < 10) ? ('0' + min) : min
                hour = (hour < 10) ? ('0' + hour) : hour
                time = day + ":" + hour + ":" + min + ":" + second + "";
            }
        }
    } else {

        time = '00:' + (time < 10 ? '0' + time : time);
    }
    return time;
}


function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua); //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

function urlParam(routerUrl, paramObj) {
    var paramStr = '',
        href;
    for (var i in paramObj) {
        paramStr += i + '=' + encodeURIComponent(paramObj[i]) + '&';
    }
    if (paramStr === '') {
        href = routerUrl;
    } else {
        paramStr = paramStr.substring(0, paramStr.length - 1);
        href = routerUrl + '?' + paramStr;
    }
    return href;
};

function _href(href, _obj) {
    window.location.href = urlParam(href, _obj);
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
//判断身份证格式是否正确
function checkIdCode(value) {
    var value = $.trim(value);
    var userCardreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var taiwanreg = /^[A-Z][0-9]{9}$/; //台湾
    var xianggangreg = /^[A-Z][0-9]{6}\([0-9A]\)$/; //香港
    var aomenreg = /^[157][0-9]{6}\([0-9]\)$/; //澳门
    //return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    return (userCardreg.test(value) || taiwanreg.test(value) || xianggangreg.test(value) || aomenreg.test(value));
}
// 判断是否为数字
function isNum(num) {
    if (isNaN(num)) {
        return true;
    } else {
        return false;
    }
}

function date(format, timestamp) {
    var a, jsdate = ((timestamp) ? new Date(timestamp * 1000) : new Date());
    var pad = function(n, c) {
        if ((n = n + "").length < c) {
            return new Array(++c - n.length).join("0") + n;
        } else {
            return n;
        }
    };
    var txt_weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var txt_ordin = { 1: "st", 2: "nd", 3: "rd", 21: "st", 22: "nd", 23: "rd", 31: "st" };
    var txt_months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var f = {
        // Day
        d: function() { return pad(f.j(), 2) },
        D: function() { return f.l().substr(0, 3) },
        j: function() { return jsdate.getDate() },
        l: function() { return txt_weekdays[f.w()] },
        N: function() { return f.w() + 1 },
        S: function() { return txt_ordin[f.j()] ? txt_ordin[f.j()] : 'th' },
        w: function() { return jsdate.getDay() },
        z: function() { return (jsdate - new Date(jsdate.getFullYear() + "/1/1")) / 864e5 >> 0 },

        // Week
        W: function() {
            var a = f.z(),
                b = 364 + f.L() - a;
            var nd2, nd = (new Date(jsdate.getFullYear() + "/1/1").getDay() || 7) - 1;
            if (b <= 2 && ((jsdate.getDay() || 7) - 1) <= 2 - b) {
                return 1;
            } else {
                if (a <= 2 && nd >= 4 && a >= (6 - nd)) {
                    nd2 = new Date(jsdate.getFullYear() - 1 + "/12/31");
                    return date("W", Math.round(nd2.getTime() / 1000));
                } else {
                    return (1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
                }
            }
        },

        // Month
        F: function() { return txt_months[f.n()] },
        m: function() { return pad(f.n(), 2) },
        M: function() { return f.F().substr(0, 3) },
        n: function() { return jsdate.getMonth() + 1 },
        t: function() {
            var n;
            if ((n = jsdate.getMonth() + 1) == 2) {
                return 28 + f.L();
            } else {
                if (n & 1 && n < 8 || !(n & 1) && n > 7) {
                    return 31;
                } else {
                    return 30;
                }
            }
        },

        // Year
        L: function() { var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0 },
        //o not supported yet
        Y: function() { return jsdate.getFullYear() },
        y: function() { return (jsdate.getFullYear() + "").slice(2) },

        // Time
        a: function() { return jsdate.getHours() > 11 ? "pm" : "am" },
        A: function() { return f.a().toUpperCase() },
        B: function() {
            // peter paul koch:
            var off = (jsdate.getTimezoneOffset() + 60) * 60;
            var theSeconds = (jsdate.getHours() * 3600) + (jsdate.getMinutes() * 60) + jsdate.getSeconds() + off;
            var beat = Math.floor(theSeconds / 86.4);
            if (beat > 1000) beat -= 1000;
            if (beat < 0) beat += 1000;
            if ((String(beat)).length == 1) beat = "00" + beat;
            if ((String(beat)).length == 2) beat = "0" + beat;
            return beat;
        },
        g: function() { return jsdate.getHours() % 12 || 12 },
        G: function() { return jsdate.getHours() },
        h: function() { return pad(f.g(), 2) },
        H: function() { return pad(jsdate.getHours(), 2) },
        i: function() { return pad(jsdate.getMinutes(), 2) },
        s: function() { return pad(jsdate.getSeconds(), 2) },
        //u not supported yet

        // Timezone
        //e not supported yet
        //I not supported yet
        O: function() {
            var t = pad(Math.abs(jsdate.getTimezoneOffset() / 60 * 100), 4);
            if (jsdate.getTimezoneOffset() > 0) t = "-" + t;
            else t = "+" + t;
            return t;
        },
        P: function() { var O = f.O(); return (O.substr(0, 3) + ":" + O.substr(3, 2)) },
        //T not supported yet
        //Z not supported yet

        // Full Date/Time
        c: function() { return f.Y() + "-" + f.m() + "-" + f.d() + "T" + f.h() + ":" + f.i() + ":" + f.s() + f.P() },
        //r not supported yet
        U: function() { return Math.round(jsdate.getTime() / 1000) }
    };

    return format.replace(/[\\]?([a-zA-Z])/g, function(t, s) {
        if (t != s) {
            // escaped
            ret = s;
        } else if (f[s]) {
            // a date function exists
            ret = f[s]();
        } else {
            // nothing special
            ret = s;
        }
        return ret;
    });
}
//飞入购物车
function shoppingCartAnimate(dom, car) {
    var goodsItem = dom
    var flyElm = goodsItem.clone()
    $('body').append(flyElm)
    flyElm.css({
        'z-index': 9000,
        'display': 'block',
        'position': 'absolute',
        'top': goodsItem.offset().top + 'px',
        'left': goodsItem.offset().left + 'px',
        'width': goodsItem.width() + 'px',
        'height': goodsItem.height() + 'px'
    });
    flyElm.animate({
        top: car.offset().top,
        left: car.offset().left,
        width: 10,
        height: 10
    }, 'slow', function() {
        flyElm.remove();
    });
}