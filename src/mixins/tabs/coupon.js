import wepy from 'wepy'
export default class Home extends wepy.mixin {
  data = {
    nocoupon: 'block',
    coupons: '',
    limit: 100,
    offset: 0,
    total: 0,
    // 是否显示
    isLoading: false
  }
  // 页面切换显示
  onShow() {
    this.loadCoupons(this, false)
  }
  // 页面加载
  onLoad() {

    // console.log('cate页加载');
  }
  // 上拉加载事件
//   onReachBottom() {
//     console.log('上拉加载');
//     this.offset = this.limit + this.offset
//     if (this.offset > this.total) {
//       console.log('到底了')
//       this.isLoading = true
//       this.$apply()
//       return
//     }
//     this.loadCoupons(this, false)
//   }
  async loadCoupons(_this, flag) {
    if (!this.$parent.globalData.vipInfo) {
      wepy.Toast('请登录')
      return
    }
    // if (flag) {
    //   this.limit = 6
    //   this.offset = 0
    //   this.$apply()
    // }
    let params = {
      limit: this.limit,
      offset: this.offset,
      p: {
        eid: this.$parent.globalData.vipInfo.eid,
        vipid: this.$parent.globalData.vipInfo.vid
      }
    }
    const res = await wepy.post('/coupon/getecoupons', params)
    console.log(res.data, 666666666);
    let data = res.data
    // console.log(data.statu, 9);
    if(flag){
        this.coupons = []
      this.$apply()
    }
    if (data.statu) {
      this.nocoupon = 'none',

        this.coupons = data.rows
      this.total = data.total
      this.isLoading = true
      this.$apply()
    //   if (data.total < this.limit) {
    //     this.isLoading = true
    //     this.$apply()
    //   }
    } else {
      // this.coupons = []
      // this.$apply()
    }
    if (flag) {
      wepy.Toast('领取成功', 'success')
    }
  }
  // 处理事件函数
  methods = {
    async getEcoupon(e) {
      var _this = this;
      // console.warn(e.currentTarget.id);
      wepy.Toast('正在领取')
      let params = {
        mid: e.currentTarget.id,
        eid: this.$parent.globalData.vipInfo.eid,
        vipid: this.$parent.globalData.vipInfo.vid
      }
      const {
        data: res
      } = await wepy.post('/coupon/getcoupon', params)
      // console.log(res);
      if (!res.statu) return wepy.Toast(res.mes)
      // wepy.Toast(res.mes,'success')
      this.loadCoupons(_this, true)
    }

  }

  // 计算函数
  computed = {

  }
}
