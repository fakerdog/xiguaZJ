//app.js
var util = require("./utils/util.js");
const V = "1.0"; //版本

App({
  CACHE_PREFIX: "XIGUA_",

  //HTTP_SERVER: "http://localhost:8080/ocWechat/",
  // HTTP_SERVER: "https://www.weixinpy.com/",
  // HTTP_SERVER: "http://192.168.2.196:8080/xgApp/",
  HTTP_SERVER: "https://tscapp.xiguazuji.com/xgApp/",

  CDN_URL: "https://zuji.weixinpy.com/luckyDraw/",
  onLaunch: function () {
  },

  //获取缓存中今天的缓存
  getTodayStorage: function (key) {
    var dateStr = util.getDateStr(new Date());
    key = this.CACHE_PREFIX + V + key + "_" + dateStr;
    return wx.getStorageSync(key);
  },

  //重置缓存中的今天缓存
  setTodayStorage: function (key, value) {
    var dateStr = util.getDateStr(new Date());
    key = this.CACHE_PREFIX + V + key + "_" + dateStr;
    wx.setStorageSync(key, value);
  },

  globalData: {
    userInfo: null
  }
})
