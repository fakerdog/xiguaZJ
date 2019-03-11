// pages/province/province.js
const data = require("./data.js");
var util = require("../../utils/util.js");
var server = require("../../utils/server.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenCanvas: true
  },

  //分享
  toshare: function(){
    var shareObj = this.data.shareObj;
    if(shareObj){
      wx.navigateToMiniProgram({
        appId: shareObj.appid,
        path: shareObj.path
      })
      server.submitClick(shareObj.appid);
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //分享
    wx.showShareMenu({
      withShareTicket: true
    });

    var shareObj = app.globalData.shareObj;
    this.setData({
      shareObj: shareObj
    });

    var province = data.province();
    var city = province[0].city;
    this.setData({
      province: province,
      city: city
    });

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var iphone = true;
        var system = res.system;
        if(system.indexOf("iOS") > -1){
          iphone = true;
        }else{
          iphone = false;
        }
        that.setData({
          iphone: iphone,
          myheight: res.windowHeight,
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        });
      }
    });
  },

  //省份点击
  provinceClick: function (e) {
    var id = e.currentTarget.dataset.d;
    var province = this.data.province;
    var city;
    for (var i = 0; i < province.length; i++) {
      var item = province[i];
      if (item.id === id) {
        item.cls = "cur";
        city = item.city;
      } else {
        item.cls = "pview";
      }
    }

    this.setData({
      province: province,
      city: city
    });
  },

  //城市点击
  cityClick: function (e) {
    var id = e.currentTarget.dataset.d;
    var pid = e.currentTarget.dataset.p;
    var city = this.data.city;
    var count = 0;
    for (var i = 0; i < city.length; i++) {
      if (id === city[i].id) {
        if (city[i].cls == 'citycurbtn') {
          city[i].cls = "citybtn";
        } else {
          city[i].cls = "citycurbtn";
        }
      }
      if (city[i].cls === 'citycurbtn') {
        count += 1;
      }
    }

    var province = this.data.province;
    for (var i = 0; i < province.length; i++) {
      var item = province[i];
      if (item.id === pid) {
        item.count = count;
        item.city = city;
      }
    }
    this.setData({
      province: province,
      city: city
    });
  },

  //取消
  doCancel: function(){
    this.setData({
      showModalStatus: false,
      hiddenCanvas: true
    });
  },

  //提交
  doSubmit: function () {
    //上传用户打卡数据
    wx.getUserInfo({
      fail: res =>{
        wx.showToast({
          title: '授权失败',
          icon: 'success',
          image: '../../images/error.png',
          duration: 2000
        })
      },
      success: res => {
        var userInfo = res.userInfo;
        this.setData({ nickName: userInfo.nickName});
        var province = this.data.province;
        var totalcount = 0;
        var selectP = [];
        var selectCity = [];
        var pcount = 0;

        for (var i = 0; i < province.length; i++) {
          if (province[i].count > 0) {
            totalcount += 1;
            if (province[i].id == 1) {//直辖市
              var city = province[i].city;
              for (var j = 0; j < city.length; j++) {
                if (city[j].cls == 'citycurbtn') {//选中了这个城市
                  selectP.push(city[j].id);
                  selectCity.push(city[j]);
                  pcount += 1;
                }
              }
            } else {
              pcount += 1;
              selectP.push(province[i].id);
              var city = province[i].city;
              for (var j = 0; j < city.length; j++) {
                if (city[j].cls == 'citycurbtn') {//选中了这个城市
                  selectCity.push(city[j]);
                }
              }
            }
          }
        }

        if (totalcount > 0) {
          this.drawShareImg(selectP, selectCity, pcount);
        } else {
          wx.showToast({
            title: '请选择城市',
            icon: 'success',
            image: '../../images/error.png',
            duration: 2000
          })
        }
      }
    });
  },

  /**
   * 画图
   */
  drawShareImg: function (selectP, selectCity, pcount) {
    this.setData({
      showModalStatus: true,
      hiddenCanvas: false
    });
    wx.showLoading({
      title: '图片生成中...',
    });
    this._drawShareImg(selectP, selectCity, pcount);
  },

  //画图
  _drawShareImg: function (selectP, selectCity, pcount) {
    var destWidth = 900;
    var destHeight = 1600;
    
    this.setData({
      hiddenCanvas: false
    });
    
    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage('../../images/mapbg.png', 0, 0, destWidth, destHeight);
    ctx.stroke();

    //文字
    ctx.setFontSize(40);
    ctx.setFillStyle("#c8c8c8");
    ctx.textAlign = 'center';
    ctx.fillText("踏足中国          个省区，           个城市", 450, 250);
    ctx.fillText("超越了                      的用户", 450, 350);

    //头像
    var nickName = this.data.nickName;
    //昵称
    ctx.setFontSize(80);
    ctx.setFillStyle("#fac828");
    ctx.textAlign = 'center';
    ctx.fillText(nickName, 450, 150);

    var citycount = selectCity.length;
    ctx.setFillStyle("#fac828");
    ctx.fillText(pcount, 340, 250);
    ctx.fillText(citycount, 600, 250);

    var rand = util.getRand(citycount);
    ctx.fillText(rand + "%", 450, 350);

    //城市列表
    var nanshaFlag = false;
    var name = "";
    var step = 0;
    for (var i = 0; i < selectCity.length; i++){
      if (selectCity[i].id == 2609){
        nanshaFlag = true;
      }
      name += selectCity[i].name + " ";
      if((i+1) % 9 == 0){
        step += 1;
      }
      if (i == selectCity.length-1 || (i + 1) % 9 == 0){
        ctx.setFontSize(30);
        ctx.setFillStyle("#000000");
        ctx.textAlign = 'left';
        if (i == selectCity.length - 1 && (i + 1) % 9 != 0){
          step = step+1;
        }
        ctx.fillText(name, 36, 1100 + step * 50);
        name = "";
      }
    }

    //画省份
    if (util.arrayContains(selectP, 2)){
      ctx.drawImage('../../images/jiangsu.png', 614, 702);//江苏 
    }
    if (util.arrayContains(selectP, 3)) {
      ctx.drawImage('../../images/zhejiang.png', 634, 769);//浙江
    }
    if (util.arrayContains(selectP, 4)) {
      ctx.drawImage('../../images/anhui.png', 596, 709);//安徽
    }
    if (util.arrayContains(selectP, 5)) {
      ctx.drawImage('../../images/henan.png', 532, 678);//河南
    }
    if (util.arrayContains(selectP, 6)) {
      ctx.drawImage('../../images/shandong.png', 592, 642);//山东
    }
    if (util.arrayContains(selectP, 7)) {
      ctx.drawImage('../../images/hebei.png', 575, 563);//河北
    }
    if (util.arrayContains(selectP, 8)) {
      ctx.drawImage('../../images/heilongjiang.png', 680, 361);//黑龙江
    }
    if (util.arrayContains(selectP, 9)) {
      ctx.drawImage('../../images/jilin.png', 688, 496);//吉林
    }
    if (util.arrayContains(selectP, 10)) {
      ctx.drawImage('../../images/liaoning.png', 648, 547);//辽宁 
    }
    if (util.arrayContains(selectP, 11)) {
      ctx.drawImage('../../images/neimenggu.png', 347, 363);//内蒙古
    }
    if (util.arrayContains(selectP, 12)) {
      ctx.drawImage('../../images/xinjiang.png', 22, 441);//新疆
    }
    if (util.arrayContains(selectP, 13)) {
      ctx.drawImage('../../images/xizang.png', 89, 672);//西藏
    }
    if (util.arrayContains(selectP, 14)) {
      ctx.drawImage('../../images/qinghai.png', 243, 624);//青海
    }
    if (util.arrayContains(selectP, 15)) {
      ctx.drawImage('../../images/gansu.png', 282, 559);//甘肃
    }
    if (util.arrayContains(selectP, 16)) {
      ctx.drawImage('../../images/ningxia.png', 450, 622);//宁夏
    }
    if (util.arrayContains(selectP, 17)) {
      ctx.drawImage('../../images/shanxi.png', 467, 615);//陕西
    }
    if (util.arrayContains(selectP, 18)) {
      ctx.drawImage('../../images/shanxi1.png', 528, 600);//山西
    }
    if (util.arrayContains(selectP, 19)) {
      ctx.drawImage('../../images/hubei.png', 500, 730);//湖北
    }
    if (util.arrayContains(selectP, 20)) {
      ctx.drawImage('../../images/hunan.png', 509, 790);//湖南
    }
    if (util.arrayContains(selectP, 21)) {
      ctx.drawImage('../../images/jiangxi.png', 573, 794);//江西
    }
    if (util.arrayContains(selectP, 22)) {
      ctx.drawImage('../../images/fujian.png', 606, 826);//福建
    }
    if (util.arrayContains(selectP, 23)) {
      ctx.drawImage('../../images/taiwan.png', 651, 875);//台湾
    }
    if (util.arrayContains(selectP, 24)) {
      ctx.drawImage('../../images/guangdong.png', 516, 877);//广东
    }
    if (util.arrayContains(selectP, 25)) {
      ctx.drawImage('../../images/guangxi.png', 450, 859);//广西
    }
    if (util.arrayContains(selectP, 26)) {
      ctx.drawImage('../../images/hainan.png', 505, 973);//海南
    }
    if (util.arrayContains(selectP, 27)) {
      ctx.drawImage('../../images/sichuan.png', 345, 710);//四川
    }
    if (util.arrayContains(selectP, 28)) {
      ctx.drawImage('../../images/guizhou.png', 439, 810);//贵州
    }
    if (util.arrayContains(selectP, 29)) {
      ctx.drawImage('../../images/yunnan.png', 347, 805);//云南
    }
    if (util.arrayContains(selectP, 101)) {//北京
      ctx.drawImage('../../images/beijing.png', 601, 592);//北京
    }
    if (util.arrayContains(selectP, 102)) {//上海
      ctx.drawImage('../../images/shanghai.png', 675, 757);//上海
    }
    if (util.arrayContains(selectP, 103)) {//天津
      ctx.drawImage('../../images/tianjin.png', 617, 606);//天津
    }
    if (util.arrayContains(selectP, 104)) {//重庆
      ctx.drawImage('../../images/chongqing.png', 460, 750);//重庆
    }
    if (util.arrayContains(selectP, 105)) {//香港
      ctx.drawImage('../../images/xianggang.png', 585, 940);//香港
    }
    if (util.arrayContains(selectP, 106)) {//澳门
      ctx.drawImage('../../images/aomen.png', 570, 943);//澳门
    }
    if (nanshaFlag) {//南沙群岛
      ctx.drawImage('../../images/nanshaqundao.png', 497, 1093);//南沙群岛
    } 
    
    //图片显示
    var that = this;
    ctx.draw(true, res => {
      wx.canvasToTempFilePath({
        width: destWidth,
        height: destHeight,
        destWidth: destWidth,
        destHeight: destHeight,

        canvasId: 'shareCanvas',
        success: function (res) {
          that.setData({
            hiddenCanvas: true,
            imagePath: res.tempFilePath
          });
        },
        complete: function (res) {
          //console.log(res);
          wx.hideLoading();
        }
      });
    });
    
  },

  //画市
  _drawCity(ctx , x, y){
    var basex = 750;
    var basey = 850;
    var bjx = 116;
    var bjy = 40;
    x = basex + bjx + (bjx - x) * 15;
    y = basey + bjy + (y - bjy) * 30;
    ctx.setFontSize(50);
    ctx.setFillStyle("#000");
    ctx.textAlign = 'center';
    ctx.fillText("·", x, y);
  },

  /**
   * 保存图片
   */
  saveImg: function () {
    var filePath = this.data.imagePath;
    return wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: res => {
        wx.showToast({
          title: '已保存到相册',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          hiddenCanvas: true
        });
      }
    });
  },

  /**
   * 保存图片
   */
  cancel: function () {
    this.setData({
      showModalStatus: false,
      hiddenCanvas: true
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "[有人@我]来来来，炫一下你的诗和远方",
      path: "/pages/index/index"
    }
  }
})