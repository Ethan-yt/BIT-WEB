#!/usr/bin/env node

const request = require('request')
const Hashes = require('./hashes.min')
const program = require('commander')


function get(url, qs = {}) {
    return new Promise(function (resolve, reject) {
        request({ url: url, qs: qs }, function (error, response, body) {
            if (error) return reject(error);
            try {
                if (/^jsonp\(.*\)$/.test(body))
                    body = JSON.parse(body.slice(6, body.length - 1))
                else
                    body = JSON.parse(body)
                resolve(body);
            } catch (e) {
                resolve(body);
            }
        });
    });
}


var PortalError = {
    E3001: "流量或时长已用尽",
    E3002: "计费策略条件不匹配",
    E3003: "控制策略条件不匹配",
    E3004: "余额不足",
    E3005: "在线变更计费策略",
    E3006: "在线变更控制策略",
    E3007: "超时",
    E3008: "连线数超额，挤出在线表。",
    E3009: "有代理行为",
    E3010: "无流量超时",
    E3101: "心跳包超时",
    E4001: "Radius表DM下线",
    E4002: "DHCP表DM下线",
    E4003: "Juniper IPOE COA上线",
    E4004: "Juniper IPOE COA下线",
    E4005: "proxy表DM下线",
    E4006: "COA在线更改带宽",
    E4007: "本地下线",
    E4008: "虚拟下线",
    E4009: "策略切换时下发COA",
    E4011: "结算时虚拟下线",
    E4012: "下发COA",
    E4101: "来自radius模块的DM下线(挤出在线表)",
    E4102: "来自系统设置(8081)的DM下线",
    E4103: "来自后台管理(8080)的DM下线",
    E4104: "来自自服务(8800)的DM下线",
    E4112: "来自系统设置(8081)的本地下线",
    E4113: "来自后台管理(8080)的本地下线",
    E4114: "来自自服务(8800)的本地下线",
    E4122: "来自系统设置(8081)的虚拟下线",
    E4123: "来自后台管理(8080)的虚拟下线",
    E4124: "来自自服务(8800)的虚拟下线",
    E2531: "用户不存在",
    E2532: "两次认证的间隔太短",
    E2533: "尝试次数过于频繁",
    E2534: "有代理行为被暂时禁用",
    E2535: "认证系统已关闭",
    E2536: "系统授权已过期",
    E2553: "密码错误",
    E2601: "不是专用客户端",
    E2606: "用户被禁用",
    E2611: "MAC绑定错误",
    E2612: "MAC在黑名单中",
    E2613: "NAS PORT绑定错误",
    E2614: "VLAN ID绑定错误",
    E2615: "IP绑定错误",
    E2616: "已欠费",
    E2620: "已经在线了",
    E2806: "找不到符合条件的产品",
    E2807: "找不到符合条件的计费策略",
    E2808: "找不到符合条件的控制策略",
    E2833: "IP地址异常，请重新拿地址",
    E5990: "数据不完整",
    E5991: "无效的参数",
    E5992: "找不到这个用户",
    E5993: "用户已存在",
    E5001: "用户创建成功",
    E5002: "用户创建失败",
    E5010: "修改用户成功",
    E5011: "修改用户失败",
    E5020: "修改用户成功",
    E5021: "修改用户失败",
    E5030: "转组成功",
    E5031: "转组失败",
    E5040: "购买套餐成功",
    E5041: "购买套餐失败",
    E5042: "找不到套餐",
    E5050: "绑定MAC认证成功",
    E5051: "解绑MAC认证成功",
    E5052: "绑定MAC成功",
    E5053: "解绑MAC成功",
    E5054: "绑定nas port成功",
    E5055: "解绑nas port成功",
    E5056: "绑定vlan id成功",
    E5057: "解绑vlan id成功",
    E5058: "绑定ip成功",
    E5059: "解绑ip成功",
    E6001: "用户缴费成功",
    E6002: "用户缴费失败",
    //结算日志
    E7001: "用户不存在",
    E7002: "添加待结算队列失败",
    E7003: "结算成功",
    E7004: "添加已结算队列失败",
    E7005: "扣除产品实例结算金额失败",
    E7006: "没有找到产品实例",
    E7007: "没有对该用户进行手动结算的权限",
    E7008: "没有对该产品进行手动结算的权限",
    E7009: "由于使用流量小于该产品结算设置而不扣费",
    E7010: "由于使用时长小于该产品结算设置而不扣费",
    E7011: "由于产品余额不足，根据结算设置而不扣费",
    E7012: "由于产品余额不足，根据结算设置余额扣为0",
    E7013: "由于产品余额不足，根据结算设置余额扣为负值",
    E7014: "删除过期套餐操作成功",
    E7015: "删除过期套餐操作失败",
    E7016: "自动购买套餐成功",
    E7017: "自动购买套餐失败",
    E7018: "产品结算模式错误",
    //
    vcode_error: "验证码错误",
};

function xEncode(str, key) {
    if (str == "") {
        return "";
    }
    var v = s(str, true),
        k = s(key, false);
    if (k.length < 4) {
        k.length = 4;
    }
    var n = v.length - 1,
        z = v[n],
        y = v[0],
        c = 0x86014019 | 0x183639A0,
        m,
        e,
        p,
        q = Math.floor(6 + 52 / (n + 1)),
        d = 0;
    while (0 < q--) {
        d = d + c & (0x8CE0D9BF | 0x731F2640);
        e = d >>> 2 & 3;
        for (p = 0; p < n; p++) {
            y = v[p + 1];
            m = z >>> 5 ^ y << 2;
            m += (y >>> 3 ^ z << 4) ^ (d ^ y);
            m += k[(p & 3) ^ e] ^ z;
            z = v[p] = v[p] + m & (0xEFB8D130 | 0x10472ECF);
        }
        y = v[0];
        m = z >>> 5 ^ y << 2;
        m += (y >>> 3 ^ z << 4) ^ (d ^ y);
        m += k[(p & 3) ^ e] ^ z;
        z = v[n] = v[n] + m & (0xBB390742 | 0x44C6F8BD);
    }

    function s(a, b) {
        var c = a.length, v = [];
        for (var i = 0; i < c; i += 4) {
            v[i >> 2] = a.charCodeAt(i) | a.charCodeAt(i + 1) << 8 | a.charCodeAt(i + 2) << 16 | a.charCodeAt(i + 3) << 24;
        }
        if (b) {
            v[v.length] = c;
        }
        return v;
    }

    function l(a, b) {
        var d = a.length, c = (d - 1) << 2;
        if (b) {
            var m = a[d - 1];
            if ((m < c - 3) || (m > c))
                return null;
            c = m;
        }
        for (var i = 0; i < d; i++) {
            a[i] = String.fromCharCode(a[i] & 0xff, a[i] >>> 8 & 0xff, a[i] >>> 16 & 0xff, a[i] >>> 24 & 0xff);
        }
        if (b) {
            return a.join('').substring(0, c);
        } else {
            return a.join('');
        }
    }

    return l(v, false);
}

function getJSON(url, data) {
    data = {
        ...data,
        'callback': 'jsonp'
    }
    if (url.match("srun_portal") != null || url.match("get_challenge") != null) {
        var enc = "s" + "run" + "_bx1",
            n = 200,
            type = 1,
            base64 = new Hashes.Base64();
        if (data.action == "login") {   //login
            $data = data;
            return getJSON(url.replace("srun_portal", "get_challenge"), { "username": $data.username, "ip": $data.ip })
                .then(function (data) {
                    var token = "";
                    if (data.res != "ok") {
                        throw data.error;
                    }
                    token = data.challenge;
                    $data.info = "{SRBX1}" + base64.encode(xEncode(JSON.stringify({ "username": $data.username, "password": $data.password, "ip": $data.ip, "acid": $data.ac_id, "enc_ver": enc }), token));
                    var hmd5 = new Hashes.MD5().hex_hmac(token, data.password);
                    $data.password = "{MD5}" + hmd5;
                    $data.chksum = new Hashes.SHA1().hex(token + $data.username + token + hmd5 + token + $data.ac_id + token + $data.ip + token + n + token + type + token + $data.info);
                    $data.n = n;
                    $data.type = type;
                    return get(url, $data);
                });
        } else if (data.action == "logout") {   //logout
            $data = data;
            return getJSON(url.replace("srun_portal", "get_challenge"), { "username": $data.username, "ip": $data.ip })
                .then(function (data) {
                    var token = "";
                    if (data.res != "ok") {
                        throw data.error;
                    }
                    token = data.challenge;
                    $data.info = "{SRBX1}" + base64.encode(xEncode(JSON.stringify({ "username": $data.username, "ip": $data.ip, "acid": $data.ac_id, "enc_ver": enc }), token));
                    var str = token + $data.username + token + $data.ac_id + token + $data.ip + token + n + token + type + token + $data.info;
                    $data.chksum = new Hashes.SHA1().hex(str);
                    $data.n = n;
                    $data.type = type;
                    return get(url, $data);
                });
        } else {
            return get(url, data)
        }
    }
    return get(url, data)
}


function login(username, password, ip, portalDomain = '@liantong', ac_id = '8') {
    const qData = {
        "action": "login",
        username: username + portalDomain,
        password,
        ac_id,
        ip,
    };
    return getJSON("http://10.0.0.55/cgi-bin/srun_portal", qData)
        .then(function (data) {
            if (data.error == "ok") {
                return data.access_token
            }
            for (var i in PortalError) {
                if (data.error_msg.indexOf(i) >= 0) {
                    throw PortalError[i]
                }
            }
            if (data.error_msg != "") {
                throw data.error_msg
            } else {
                throw data.error
            }
        });
}
function logout(username, onlineAddr = "@liantong", ac_id = '8') {
    var action = "localhost"

    if (onlineAddr == "@yidong") {
        //185
        action = "drop-users"
    } else if (onlineAddr == "@liantong") {
        //190
        action = "drop-users-cucc"
    } else if (onlineAddr == "@xiaoyuanwang") {
        //通过cgi-bin程序下线
        //logout  注销
        var pData = {
            "action": "logout",
            username,
            ac_id,
            "ip": ""
        };

        return getJSON("http://10.0.0.55/cgi-bin/srun_portal", pData).then(function (data) {
            if (data.error == "ok") {
                return "下线成功（logout success）";
            } else {
                throw data.error_msg;
            }
        });
    }

    //logout  注销
    var pData = {
        "action": action,
        "user_name": username
    };
    return getJSON("http://10.0.0.55/portal_proxy/proxy.php", pData)
        .then(function (data) {
            if (data.code == 0) {
                return "下线成功（logout success）";
            } else {
                throw data.message;
            }
        });
}



function get_ip() {
    return get('http://10.0.0.55/srun_portal_phone_yys.php')
        .then((body) => {
            const ip = body.match(/id="user_ip".*\s*value="(.*?)">/)[1]
            console.log(ip)
            return ip
        })
}

program
    .command('login <username> <password> [yys] [ac_id]')
    .alias('l')
    .description('Login')
    .action(function (username, password, yys, ac_id) {
        console.log('Logging in...')
        login(username, password, '', yys, ac_id)
            .then(console.log)
            .catch(console.error)
    })

program
    .command('logout <username> [yys] [ac_id]')
    .description('Logout')
    .action(function (username, yys, ac_id) {
        console.log('Logging out...')
        logout(username, yys, ac_id)
            .then(console.log)
            .catch(console.error)
    })
program
    .on('--help', function () {
        console.log('')
        console.log('  yys: @liantong | @yidong | @xiaoyuanwang')
        console.log('  ac_id: 8 | 1')
        console.log('  ac_id=8 if connected to BIT-WEB')
        console.log('')
        console.log('Examples:');
        console.log('  $ bit l 3120181054 password @yidong');
        console.log('  $ bit l 3120181054 password @xiaoyuanwang 1');
        console.log('  $ bit logout 3120181054 @yidong');
    })
program
    .on('command:*', function () {
        console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
        process.exit(1);
    });

if (!process.argv.slice(2).length) {
    program.help()
}

program.parse(process.argv);

module.exports = {
    login,
    logout,
    get_ip
}