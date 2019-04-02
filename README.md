# BIT-WEB

北理工上网命令行脚本，支持联通移动（仅在连接BIT-WEB时可用）

```
Commands:
  login|l <username> <password> [yys] [ac_id]  Login
  logout <username> [yys] [ac_id]              Logout

  yys: @liantong | @yidong | @xiaoyuanwang
  ac_id: 8 | 1
  ac_id=8 if connected to BIT-WEB

Examples:
  $ bit l 3120181054 password @yidong
  $ bit l 3120181054 password @xiaoyuanwang 1
  $ bit logout 3120181054 @yidong
```