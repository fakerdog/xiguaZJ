// pages/cavs/cavs.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        var iphone = true;
        var system = res.system;
        if (system.indexOf("iOS") > -1) {
          iphone = true;
        } else {
          iphone = false;
        }
        //console.log('------------------------ iphone = ' + iphone);
        that.setData({
          iphone: iphone,
          myheight: res.windowHeight,
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        });
      }
    });

    var destWidth = 1242;
    var destHeight = 2208;

    const ctx = wx.createCanvasContext('shareCanvas');
    ctx.drawImage('../../images/mapbg.png', 0, 0, destWidth, destHeight);
    ctx.stroke();

    var that = this;
    console.log("----------------------------  111");
    ctx.draw(true, res => {
      wx.canvasToTempFilePath({
        width: destWidth,
        height: destHeight,
        destWidth: destWidth,
        destHeight: destHeight,

        canvasId: 'shareCanvas',
        success: function (res) {
          console.log('---------------- ' + res.tempFilePath);
          that.setData({
            hiddenCanvas:true,
            imagePath: res.tempFilePath
          });
        },
        complete: function (res) {

        }
      });
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
  
  }
})