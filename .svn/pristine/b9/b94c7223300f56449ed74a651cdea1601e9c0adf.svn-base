// pages/tplmsg/tplmsg.js
var util = require("../../utils/util.js");
var server = require("../../utils/server.js");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btntext:" "
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });

    //加载数据
    server.getConfig(res =>{
      //console.log(res.data);
      if (res.data){
        var leftArr = [];
        var moreObj = null;
        var bannerObj = null;
        var shareObj = null;
        var contactObj = null;
        var promotionObj = null;

        if (res.data){
          for (var i = 0; i < res.data.length; i++){
            var obj = res.data[i];
            if(obj.id === 0 || obj.id === 1 || obj.id === 2 || obj.id === 3){
              leftArr.push(obj);
            }else if(obj.id === 4){
              moreObj = obj;
            }else if(obj.id === 5){
              bannerObj = obj;
            }else if(obj.id === 6){
              shareObj = obj;
            }else if(obj.id === 100){
              contactObj = obj;
            }else if(obj.id === 102){
              promotionObj = obj;
            }
          }
        }

        app.globalData.leftArr = leftArr;
        app.globalData.moreObj = moreObj;
        app.globalData.bannerObj = bannerObj;
        app.globalData.shareObj = shareObj;

        var randObj = null;
        if (leftArr && leftArr.length > 0){
          var rand = util.rand(0, leftArr.length-1);
          randObj = leftArr[rand];
        }

        var showPromotion = false;
        //console.log(promotionObj);
        if (promotionObj){
          var tmpflag = app.getTodayStorage("showpromotion");
          if(!tmpflag){
            showPromotion = true;
          }
        }
        this.setData({
          moreObj: moreObj,
          bannerObj: bannerObj,
          shareObj: shareObj,
          randObj: randObj,
          contactObj: contactObj,
          promotionObj: promotionObj,
          showPromotion: showPromotion
        });
        //console.log(this.data);
      }
    }
    );

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  formSubmit: function (e) {
    wx.navigateTo({
      url: '/pages/zuji/zuji'
    });
    var formId = e.detail.formId;
    
    wx.login({
      success: res => {
        var code = res.code;
        server.uploadFormId(code, formId);
      }
    });
  },

  cavs: function(){
    wx.navigateTo({
      url: '/pages/cavs/cavs'
    })
  },

  //显示窗口
  showWin: function(){
    this.setData({
      showModalStatus:true
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  //更多好玩
  tomore: function () {
    var moreObj = this.data.moreObj;
    if (moreObj){
      wx.navigateToMiniProgram({
        appId: moreObj.appid,
        path: moreObj.path
      })
      //点击数统计
      server.submitClick(moreObj.appid);
    }
  },

  //随机
  torand: function () {
    var randObj = this.data.randObj;
    if (randObj) {
      wx.navigateToMiniProgram({
        appId: randObj.appid,
        path: randObj.path
      })
      //点击数统计
      server.submitClick(randObj.appid);
    }
  },

  //banner
  tobanner: function(){
    var bannerObj = this.data.bannerObj;
    if (bannerObj) {
      wx.navigateToMiniProgram({
        appId: bannerObj.appid,
        path: bannerObj.path
      })
      //点击数统计
      server.submitClick(bannerObj.appid);
    }
  },

  //广告页面
  topromotion: function(){
    wx.navigateTo({
      url: '/pages/promotion/promotion',
    })
  },

  //关闭
  doclose: function(){
    this.setData({
      showPromotion: false
    });
    app.setTodayStorage("showpromotion", true);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "别再说诗和远方了，这些地方你去过吗？",
      path: "/pages/index/index"
    }
  }
})