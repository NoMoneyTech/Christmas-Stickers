const config = require('../../config.js')
const app = getApp()
const {
  Canvas,
  CanvasItem
} = require('../../utils/canvas.js')

let context = null
Page({
  data: {
    userAvatar: null,
    tabbarState: false,
    imgList: config.imgList,
    startX: 0,
    startY: 0,
    data: [{
      url: '../../1.png',
      width: 200,
      height: 200
    },
    {
      url: '../../2.png',
      width: 200,
      height: 200
    }
    ],
    width: null,
    idx: 0
  },
  bindViewTap: function () {

  },
  onLoad: function () {
    this.initCanvasWidth().then(() => { })
  },
  onShow: function () {
    if (app.globalData.avatar != null) {
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        userAvatar: app.globalData.avatar
      })
      app.globalData.avatar = null
      this.initCanvas()
      wx.hideLoading()
    }
  },
  initCanvasWidth() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery()
      query.select('#add-user').boundingClientRect((res) => {
        this.data.width = res.width
        resolve()
      }).exec()
    })
  },
  initCanvas() {
    console.log('1')
    let width = this.data.width
    let bg = {
      url: this.data.userAvatar,
      width: width,
      height: width,
      x: 0,
      y: 0
    }
    context = new Canvas('decorate', bg)
  },
  hundle(e) {
    if (this.data.userAvatar == null) {
      this.showTotal('您还未上传头像')
      return
    }
    const img = e.currentTarget.dataset.item
    this.addImg(img)
  },
  addImg(img) {
    let width = this.data.width
    let item = new CanvasItem({
      url: img,
      width: width / 4,
      height: width / 4,
      x: width / 2 - width / 4,
      y: width / 2 - width / 4
    })

    context.addList(item)
    context.draw()
  },
  touchStart(e) {
    const {
      x,
      y
    } = e.touches[0]
    context.touchStart(x, y)
  },
  touchMove(e) {
    const {
      x,
      y
    } = e.touches[0]

    context.touchScale(x, y)
  },
  touchEnd() {
    context.touchEnd()
  },
  catchtouchmove() { },
  saveCanvas() {
    if (this.data.userAvatar == null) {
      this.showTotal('您还未上传头像')
      return
    }
    context.saveCanvas().then(() => {
      this.showTotal('保存成功')
    }).catch(() => {
      this.showTotal('保存失败')
    })
  },
  changeIdx(e) {
    let idx = e.currentTarget.dataset.idx
    this.setData({
      idx
    })
  },
  cancel() {
    this.setData({
      tabbarState: false
    })
  },
  show() {
    this.setData({
      tabbarState: true
    })
  },
  chooseImage() {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original'],
      success(e) {
        if (e.tempFilePaths.length > 0) {
          wx.hideLoading()
          app.globalData.cacheUrl = e.tempFilePaths[0]
          wx.navigateTo({
            url: '/pages/cutInside/cutInside',
          })
        }
      },
      fail() {
        wx.hideLoading()
        that.showTotal('您还未上传头像')
      }
    })
    that.cancel()
  },
  deleteAvatar() {
    if (this.data.userAvatar != null) {
      this.setData({
        userAvatar: null
      })
    } else {
      this.showTotal('您还未上传头像')
    }
  },
  getUserInfo(e) {
    wx.showLoading({
      title: '加载中',
    })
    if (e.detail.rawData) {
      let userAvatar = JSON.parse(e.detail.rawData).avatarUrl
      this.getImageInfo(userAvatar).then((res) => {
        this.setData({
          userAvatar: res
        })
        setTimeout(() => {
          this.initCanvas()
        }, 500)
        this.cancel()
        wx.hideLoading()
      }).catch(() => {
        wx.hideLoading()
        this.showTotal('网络问题请重试')
      })

    }
  },
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success(e) {
          resolve(e.path)
        },
        fail() {
          reject()
        }
      })
    })

  },
  showTotal(title) {
    wx.showToast({
      icon: 'none',
      title
    })
    setTimeout(() => {
      wx.hideToast()
    }, 1200)
  }
})