import wepy from 'wepy'
export default class Home extends wepy.mixin {
    data = {
        // tab栏
        canuse: '',
        useed: '',
        unuse: '',
        btnTab:'canuse',
        coupons:'',
        // coupons:[1,2,3],
        nocoupon:'none',
        // nocoupon:'none',
        couponbox:'none',
        // couponbox:'block',
        couponbg:'couponbged',
        toDetail:true,
        limit: 100,
        offset: 0,
        total: 0,
        // 是否显示
        isLoading: false
    }
    // 页面切换显示
    onShow() {
        this.changeBtn('canuse', this);
    }
    // 页面加载
    onLoad() {
        // console.log('mycoupon页加载');
    }
     // 上拉加载事件
    //  onReachBottom() {
    //     console.log('上拉加载');
    //     this.offset=this.limit+this.offset
    //     if(this.offset>this.total){
            
    //         this.isLoading=true
    //         this.$apply()
    //         console.log('到底了')
    //         console.log(this.isLoading)
    //         return
    //     }
    //     this.changeBtn(this)
    // }
    // tab栏切换
    async changeBtn(_this) {
        // 初始化
        this.isLoading=false
        this.coupons=[]
        this.total=0
        this.$apply()
        if (this.btnTab === 'canuse') {
            this.canuse = 'selected'
            this.useed=''
            this.unuse=''
            // this.btnTab='canuse'
        } else if (this.btnTab === 'useed') {
            this.useed = 'selected'
            this.canuse=''
            this.unuse=''
            // this.btnTab='useed'
        } else if (this.btnTab === 'unuse') {
            this.unuse = 'selected'
            this.canuse=''
            this.useed=''
            // this.btnTab='unuse'
        }
        var types = 0;
        if (this.btnTab == 'useed') {
            types = 1;
        } else if (this.btnTab == 'unuse') {
            types = 2;
        }
        wx.showLoading({
            title: '加载中',
            mask: true
          })
        // 发请求
        let params={
            limit: this.limit,
            offset: this.offset,
            p: {
                eid: this.$parent.globalData.vipInfo.eid,
                vipid: this.$parent.globalData.vipInfo.vid,
                ctype: types
            }
            
          }
        const {data:res}=await wepy.post('/coupon/getmycoupon',params)
        console.log(res,'获取我的优惠券');
        if(res==null){
            console.log('没有优惠券');
            this.nocoupon='block'
            this.couponbox='none'
            this.$apply()
            return
        }
        if(res.statu){
            this.coupons=res.rows
            this.total=res.total
            this.nocoupon='none'
            this.couponbox='block'
            this.isLoading=true
            this.$apply()
            if(types == 0){
                this.couponbg='couponbg'
                this.$apply()
            }else {
                this.couponbg='couponbged'
                this.$apply()
            }
        }
        
        wx.hideLoading();
    }
    // 处理事件函数
    methods = {
        // tab栏切换触发
        useBtnFun: function (e) {
            // console.log(e.currentTarget.id,666);
            this.btnTab=e.currentTarget.id

            this.limit=100
            this.offset=0
            this.total=0
            this.$apply()
            this.changeBtn(e.currentTarget.id, this);
          },
        // 前往优惠券详情页
        couponDetail(e){
            if (this.data.toDetail){
                wx.setStorageSync('id', e.currentTarget.dataset.id)
                wx.setStorageSync('cid', e.currentTarget.dataset.cid)
                console.log(e);
                wepy.navigateTo({
                  url: '/packageA/pages/other/coupondetail?id=' + e.currentTarget.dataset.id + '&cid=' + e.currentTarget.dataset.cid+ '&instructions=' + e.currentTarget.dataset.instructions
                });
            }
        },
        // 前往优惠券领取
        tocoupon(){
            wepy.switchTab({
                url:'/pages/tabs/coupon'
            })
        }
    }
    // 计算函数
    computed = {

    }
}