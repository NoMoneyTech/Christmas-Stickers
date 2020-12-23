//aboutme.js
//获取应用实例
const app = getApp()

Page({
  data: {
    img: "../../images/5.png",
    title: "★~   Merry Christmas   ~★",
    intro: "这是一个可以给头像加上圣诞帽等可爱贴纸的小程序. 有任何建议欢迎反馈给我们, 我们是真的有客服.【其实就是我】",
    intro1: "这是我做的第一个小程序, 希望你能喜欢. 贴纸还不够多，我会继续努力的 ٩( ö̆ ) و 记得右上角详情页点赞好评哟 ٩(๑^o^๑)۶",
    contact: "联系方式",
    mobile: "没钱科技（nomoneytech）",
    email: "nomoneytech@qq.com"
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
