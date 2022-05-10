<template>
  <div class="page-container" id="single-page-app" v-cloak>
    <div class="banner-wrapper">
      <img class="free-banner" v-bind:src="banner" alt="" />
    </div>
    <div class="fixed-block max-width" key="fixed-block" ref="searchBox">
      <div class="search-box">
        <van-search
          v-model="search.text"
          show-action
          placeholder="搜索更多优惠"
          clear-trigger="always"
          v-on:search="onSearch"
        >
          <template #action>
            <div
              v-on:click="
                onSearch();
                resetSearchResp();
              "
            >
              搜索
            </div>
          </template>
        </van-search>
        <ul class="hot-key">
          <li
            v-for="(item, index) in hotWordsList"
            v-bind:class="{ active: item === search.text }"
            v-on:click="handleHotkey(item)"
            :key="index"
          >
            {{ item }}
          </li>
        </ul>
        <ul class="nav">
          <li class="bg" v-bind:style="{ left: navBgLeft }"></li>
          <li
            class="item"
            v-for="(item, index) in nav.list"
            v-bind:class="{ active: nav.activeIndex === index }"
            v-on:click="onNavChange(index, item)"
            :key="index"
          >
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      class="page-content"
      ref="list"
      v-bind:class="{ 'empty-list': searchResp.total > 0 }"
    >
      <div class="free-lists">
        <div
          class="goods-card heji"
          v-for="(item, index) in searchResp.goodsList"
          :key="index"
        >
          <img v-lazy="item.mainPic" />
          <div class="detail">
            <div class="title">
              <img class="icon" :src="item.itemIcon" alt="" />
              <span>{{ item.title }}</span>
            </div>
            <div class="center">
              <div class="today-sale">
                <i class="iconfont hdk-huo"></i>月销
                {{ getMoneyStr(item.sales) }}
              </div>
            </div>
            <div class="footer">
              <div class="price has-share">
                <div class="discount">
                  券后价￥<strong>{{ Number(item.actualPrice) }}</strong>
                </div>
                <div class="origin">￥{{ item.itemprice }}</div>
              </div>
              <div
                class="ticket"
                v-show="item.originalPrice != item.actualPrice"
              >
                <span class="name">券</span
                ><span class="value"
                  >￥{{
                    parseInt(item.originalPrice) - parseInt(item.actualPrice)
                  }}</span
                >
              </div>
            </div>
            <div class="btn-block">
              <div
                class="btn-share"
                v-on:click="toLink(item, 'copy')"
                v-if="search.platform == 'tb'"
              >
                <span class="operation">复制淘口令</span>
              </div>
              <div class="btn-order" v-on:click="toLink(item, 'link')">
                <span class="operation">领取优惠券</span>
              </div>
            </div>
          </div>
        </div>
        <div class="list-item-loading">
          <span v-if="searchResp.isEnd">没有更多商品了~</span>
          <span v-else>商品正在赶来的路上...</span>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import http from "@/request/index";
import useClipboard from "vue-clipboard3";
import { Toast } from "vant";

export default {
  data() {
    return {
      nav: {
        list: [
          {
            label: "淘宝",
            value: "tb",
          },
          {
            label: "京东",
            value: "jd",
          },
          {
            label: "拼多多",
            value: "pdd",
          },
          {
            label: "抖音",
            value: "dy",
          },
        ],
        activeIndex: 0,
      },
      banner: "http://img.bc.haodanku.com/cms/1627972539",
      search: {
        page: 1,
        pageSize: 30,
        text: "皮蛋",
        platform: "tb",
      },
      hotWordsList: [],
      searchResp: {
        total: 0,
        goodsList: [],
        isEnd: false,
      },
    };
  },
  created() {
    http.get("/three/goods/hot/words").then((res) => {
      this.hotWordsList = res.data;
    });
    this.onSearch();
  },
  methods: {
    onSearch: function () {
      if (this.search.platform == "dy") {
        this.resetSearchResp(true);
        Toast.fail("抖音搜索皮蛋还在努力开发中...");
        return;
      }
      http.post("/three/goods/search", this.search).then((res) => {
        this.searchResp.goodsList = res.data.goodsInfoList;
        this.searchResp.total = res.data.total;
        this.searchResp.isEnd =
          res.data.total == 0 ||
          this.search.page * this.search.pageSize > res.data.total;
      });
    },
    resetSearchResp: function (isEnd) {
      this.searchResp = {
        total: 0,
        goodsList: [],
        isEnd: isEnd,
      };
    },
    handleHotkey: function (hotkey) {
      this.resetSearchResp();
      this.search.text = hotkey;
      this.onSearch();
    },
    onNavChange: function (index, item) {
      this.resetSearchResp();
      this.nav.activeIndex = index;
      this.search.platform = item.value;
      this.onSearch();
    },
    getMoneyStr: function (num) {
      if (isNaN(num)) {
        return num;
      }
      var w = 10000;
      if (num < w) return num;
      return (num / w).toFixed(2) + "万+";
    },
    toLink: function (item, type) {
      http
        .post("/three/goods/turn/link", {
          goodsId: item.goodsId,
          platform: this.search.platform,
        })
        .then((res) => {
          if (type === "copy") {
            const { toClipboard } = useClipboard();
            try {
              toClipboard(res.data.tpwd);
              Toast.success("复制淘口令成功，请打开淘宝领取");
            } catch (e) {
              Toast.fail(e);
            }
          } else {
            window.location.href = res.data.shortUrl;
          }
        });
    },
  },
  computed: {
    navBgLeft: function () {
      var nav = this.nav;
      var offset = [0, 0, 1, 2];
      var index = nav.activeIndex;
      return (index / nav.list.length) * 100 + offset[index] + "%";
    },
    activeNav: function () {
      return this.nav.list[this.nav.activeIndex];
    },
  },
};
</script>
 
<style>
* {
  -webkit-tap-highlight-color: transparent;
}
*,
body,
html {
  padding: 0;
  margin: 0;
}
template {
  display: none;
}
.root-rem-calc,
html {
  font-size: 13.33333vw;
}
@media only screen and (min-width: 540px) {
  .root-rem-calc,
  html {
    font-size: 72px !important;
  }
}
.max-width {
  max-width: 7.5rem;
  margin: auto;
}
html {
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
.ellipsis-single {
  white-space: nowrap;
}
.ellipsis-multiple,
.ellipsis-single {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ellipsis-multiple {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
}
[v-cloak] {
  display: none !important;
}
.banner-wrapper {
  display: block;
  width: 7.5rem;
  min-height: 3.4rem;
}
.banner-wrapper > img {
  width: 100%;
}
.page-container {
  min-height: 100vh;
  max-width: 7.5rem;
  background: #da2702;
  padding-bottom: 1.76rem;
  margin: 0 auto;
  box-sizing: border-box;
  font-size: 0.32rem;
  box-shadow: 0 0 8px 8px rgba(0, 0, 0, 0.1);
}
.layui-layer {
  font-size: 12px;
}
::-webkit-scrollbar {
  all: unset;
  width: 0;
  height: 0;
}
::-webkit-scrollbar-thumb {
  border-radius: 0.05rem;
  background-color: #c1c1c1;
}
@media screen and (min-width: 750px) {
  ::-webkit-scrollbar {
    width: 0.05rem;
    height: 0.05rem;
  }
}
.van-toast--html,
.van-toast--text {
  font-size: 0.24rem;
}
@media (-webkit-min-device-pixel-ratio: 1.5), (min-device-pixel-ratio: 1.5) {
  .border-1px:after {
    transform: scaleY(0.7);
  }
  .border-1px-v:after {
    transform: scaleX(0.7);
  }
  .border-1px-all {
    position: relative;
  }
  .border-1px-all:after {
    display: block;
    position: absolute;
    width: 150%;
    height: 150%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.66667);
    content: "";
  }
}
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-1px:after {
    transform: scaleY(0.5);
  }
  .border-1px-v:after {
    transform: scaleX(0.5);
  }
  .border-1px-all {
    position: relative;
  }
  .border-1px-all:after {
    display: block;
    position: absolute;
    width: 200%;
    height: 200%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    content: "";
  }
}
img[lazy="loading"] {
  -o-object-fit: fill !important;
  object-fit: fill !important;
}
.img-box > img {
  width: 100%;
  height: 100%;
  -o-object-fit: cover;
  object-fit: cover;
}
.iconfont {
  font-size: inherit;
}
.free-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0.6rem 0;
}
.free-loading > p {
  font-size: 0.3rem;
  color: #fff;
  letter-spacing: 0.01rem;
  margin: 0.2rem 0 0;
}
.free-loading .la-line-scale {
  width: 1.6rem;
  height: 1.28rem;
  display: block;
  font-size: 0;
  color: #da2702;
}
.free-loading .la-line-scale > div {
  display: inline-block;
  float: none;
  background-color: currentColor;
  border: 0 solid;
  width: 0.16rem;
  height: 1.28rem;
  margin: 0 0.08rem;
  border-radius: 0;
  -webkit-animation: line-scale 1.2s ease infinite;
  animation: line-scale 1.2s ease infinite;
}
.free-loading .la-line-scale > div:first-child {
  -webkit-animation-delay: -1.2s;
  animation-delay: -1.2s;
}
.free-loading .la-line-scale > div:nth-child(2) {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.free-loading .la-line-scale > div:nth-child(3) {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.free-loading .la-line-scale > div:nth-child(4) {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.free-loading .la-line-scale > div:nth-child(5) {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
@-webkit-keyframes line-scale {
  0%,
  40%,
  to {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
@keyframes line-scale {
  0%,
  40%,
  to {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}
.free-share {
  position: fixed;
  bottom: 0;
  width: 7.5rem;
  height: 1.76rem;
  background: linear-gradient(180deg, hsla(0, 0%, 100%, 0), #da2702 50%);
  padding: 0.32rem 0.24rem;
  box-sizing: border-box;
  z-index: 100;
  cursor: pointer;
}
.free-share #share_href {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6.22rem;
  height: 0.9rem;
  margin: auto;
  background: linear-gradient(180deg, #fff8e6, #fdeabf);
  border-radius: 0.45rem;
  text-align: center;
  color: #da2702;
  font-size: 0.324rem;
  line-height: 1em;
}
.free-share #share_href #svg-icon {
  margin-top: 0.05rem;
  margin-right: 0.1rem;
  height: 1em;
}
.free-share #share_href #svg-icon path {
  fill: none;
  stroke: currentColor;
  stroke-linejoin: round;
  stroke-width: 2px;
}
.free-share #share_href #svg-icon .cls-2 {
  stroke-linecap: round;
}
.page-container {
  font-family: PingFang SC;
}
.page-container .banner-wrapper {
  height: 3.34rem;
}
.page-container .fixed-block {
  padding-top: 0.2rem;
  background-color: #da2702;
}
.page-container .fixed-block .search-box {
  padding: 0 0.54rem;
}
.page-container .fixed-block .search-box .van-search {
  padding-top: 0.04rem;
  padding-bottom: 0.04rem;
  padding-right: 0.04rem;
  height: 0.72rem;
  background: #fff;
  border-radius: 0.1rem;
}
.page-container .fixed-block .search-box .van-search .van-field__body,
.page-container .fixed-block .search-box .van-search .van-field__control,
.page-container .fixed-block .search-box .van-search .van-search__content {
  height: 100%;
}
.page-container .fixed-block .search-box .van-search .van-search__content {
  background: #fff;
  padding-left: 0;
}
.page-container .fixed-block .search-box .van-search .van-search__action {
  line-height: 0.64rem;
  height: 100%;
  width: 1.1rem;
  background: #ffe3dd;
  border-radius: 0.1rem;
  text-align: center;
  font-size: 0.26rem;
  font-weight: 400;
  color: #fd471f;
}
.page-container .fixed-block .search-box .van-search .van-field__control {
  font-size: 0.26rem;
  font-weight: 400;
  color: #575556;
}
.page-container .fixed-block .search-box .van-search .van-cell {
  display: inline-flex;
  align-items: center;
}
.page-container .fixed-block .search-box .van-search .van-field__clear,
.page-container .fixed-block .search-box .van-search .van-icon-search {
  font-size: 0.26rem;
}
.page-container .fixed-block .search-box .van-search .van-field__left-icon {
  line-height: 0.65rem;
}
.page-container .fixed-block .hot-key {
  margin-top: 0.15rem;
  font-size: 0;
  white-space: nowrap;
  overflow-x: auto;
}
.page-container .fixed-block .hot-key li {
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  margin-right: 0.37rem;
  padding: 0 0.18rem;
  height: 0.4rem;
  background: #c42302;
  border-radius: 0.2rem;
  font-size: 0.22rem;
  font-weight: 500;
  color: #ffab48;
  cursor: pointer;
}
.page-container .fixed-block .hot-key li.active {
  color: #fefefe;
  background: #fd471f;
  border: 1px solid #fff;
  cursor: default;
  pointer-events: none;
}
.page-container .fixed-block .share-box {
  margin: 0.3rem -0.54rem 0;
  padding-left: 0.2rem;
  font-size: 0;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.page-container .fixed-block .share-box li {
  display: inline-block;
  vertical-align: top;
  box-sizing: content-box;
  margin-right: 0.18rem;
  width: 3rem;
  height: 1.27rem;
  background: #b2122a;
  border-radius: 0.05rem;
  cursor: pointer;
}
.page-container .fixed-block .nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.3rem;
  margin-bottom: 0.1rem;
}
.page-container .fixed-block .nav li {
  position: relative;
  z-index: 1;
  width: 1.5rem;
  height: 0.6rem;
  border-radius: 10px;
  font-size: 0.26rem;
  font-weight: 500;
  color: #ffc148;
  line-height: 0.6rem;
  text-align: center;
  background-size: 0;
  cursor: pointer;
}
.page-container .fixed-block .nav li.active {
  color: #fff;
  background-size: auto 0.5rem;
  background-position: 100% 100%;
  background-repeat: no-repeat;
  cursor: default;
}
.page-container .fixed-block .nav .bg {
  position: absolute;
  top: 0;
  background: #ff522c;
  transition: left 0.25s;
}
.page-container .fixed-block .nav .bg:after {
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.05rem;
  border: 0.1rem solid transparent;
  border-top-color: #ff522c;
  content: "";
}
.page-container .fixed-block.fixed {
  width: 7.5rem;
}
.page-container .fixed-block.fixed .share-box,
.page-container .fixed-block.fixed .van-icon-search {
  display: none;
}
.page-container .fixed-block.fixed + .page-content {
  margin-top: 2.54rem;
}
.page-container .goods-card {
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  margin-bottom: 0.2rem;
  border-radius: 0.2rem;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.page-container .goods-card > img {
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 0.1rem;
  filter: contrast(97%);
}
.page-container .goods-card .detail {
  position: relative;
  width: calc(100% - 2.3rem);
  padding-left: 0.2rem;
  box-sizing: border-box;
}
.page-container .goods-card .detail .ticket {
  display: inline-flex;
  align-items: center;
  height: 0.38rem;
  padding: 1px 1px 1px 0;
  box-sizing: border-box;
  background: linear-gradient(0deg, #ff753c, #ff4b42);
  border-radius: 2px;
  font-size: 0;
  font-family: Microsoft YaHei;
}
.page-container .goods-card .detail .ticket .name,
.page-container .goods-card .detail .ticket .value {
  padding: 0 0.05rem;
  font-size: 0.25rem;
  font-family: Microsoft YaHei;
}
.page-container .goods-card .detail .ticket .name {
  line-height: 1em;
  font-weight: 300;
  color: #fff;
}
.page-container .goods-card .detail .ticket .value {
  display: flex;
  align-items: center;
  height: 100%;
  font-weight: 400;
  color: #ff4d42;
  background: #fff;
}
.page-container .goods-card .detail .price {
  font-size: 0.24rem;
  font-family: PingFang SC;
  font-weight: 700;
  line-height: 1em;
}
.page-container .goods-card .detail .price.has-share {
  padding-right: 0.5rem;
}
.page-container .goods-card .detail .price .discount {
  color: #f23015;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.page-container .goods-card .detail .price .discount strong {
  font-size: 0.44rem;
  line-height: 1em;
}
.page-container .goods-card .detail .price .price-bottom {
  margin-top: 0.1rem;
}
.page-container .goods-card .detail .price .price-bottom > div {
  display: inline-block;
  vertical-align: top;
}
.page-container .goods-card .detail .price .price-bottom .origin {
  font-weight: 500;
  text-decoration: line-through;
  color: #b9b9b9;
}
.page-container .goods-card .detail .price .price-bottom .sales {
  float: right;
  color: #a09f9f;
}
.page-container .goods-card .detail .price .price-bottom .sales .name {
  margin-right: 2px;
}
.page-container .goods-card .detail .icon {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 0.3rem;
  width: auto;
  margin-right: 2px;
}
.page-container .goods-card .detail .title {
  display: flex;
  align-items: center;
  font-size: 0.3rem;
  font-weight: 500;
  color: #000;
  margin: 0;
}
.page-container .goods-card .detail .title span {
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.page-container .goods-card .detail .tm-icons + div {
  margin-top: 0;
}
.page-container .goods-card .detail .center {
  margin: 0.2rem 0;
}
.page-container .goods-card .detail .share {
  position: absolute;
  top: 0.8rem;
  right: -0.2rem;
  width: 1.03rem;
  font-size: 0.26rem;
  font-weight: 500;
  padding-left: 0.1rem;
  border-radius: 0.28rem 0 0 0.28rem;
  cursor: pointer;
  box-sizing: border-box;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  z-index: 1;
  height: 0.56rem;
  color: #f23015;
  background: #ffefed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-container .goods-card .detail .footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.page-container .goods-card .detail .footer .operation {
  width: 1.87rem;
  height: 0.64rem;
  font-size: 0.28rem;
  font-weight: 700;
  color: #bd1d14;
  background: linear-gradient(0deg, #ffcd62, #fde989);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.36rem;
  cursor: pointer;
}
.page-container .goods-card .detail .footer .operation.sell-out {
  background: #eee;
  color: #ccc;
  cursor: default;
}
.page-container .goods-card.heji .center {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.1rem 0 0.45rem;
}
.page-container .goods-card.heji .center .month-sale {
  font-size: 0.2rem;
  font-family: PingFang SC;
  font-weight: 400;
  color: #999;
}
.page-container .goods-card.heji .today-sale {
  width: 2.56rem;
  height: 0.4rem;
  background: linear-gradient(90deg, #ffeeeb, #fff);
  border-radius: 0.2rem;
  font-size: 0.22rem;
  font-family: PingFang SC;
  font-weight: 500;
  color: #b0361e;
  line-height: 0.4rem;
  text-indent: 0.1rem;
}
.page-container .goods-card.heji .today-sale strong {
  font-size: 0.3rem;
  color: #f23015;
}
.page-container .goods-card.heji .footer {
  display: block;
  font-size: 0;
}
.page-container .goods-card.heji .footer .price {
  display: flex;
  align-items: baseline;
  margin-bottom: 0.2rem;
}
.page-container .goods-card.heji .footer .price > div {
  font-size: 0.22rem;
  font-family: PingFang SC;
  font-weight: 500;
  width: auto;
}
.page-container .goods-card.heji .footer .discount {
  margin-right: 0.1rem;
  color: #ef2735;
}
.page-container .goods-card.heji .footer .discount strong {
  font-size: 0.3rem;
  color: #ef2735;
}
.page-container .goods-card.heji .footer .origin {
  text-decoration: line-through;
  color: #b9b9b9;
}
.page-container .goods-card.heji .btn-block {
  position: absolute;
  right: 0;
  bottom: 0;
}
.page-container .goods-card.heji .btn-block > div {
  width: 1.3rem;
  height: 0.55rem;
  box-sizing: border-box;
  line-height: 0.55rem;
  margin-right: -0.2rem;
  font-size: 0.24rem;
  border-radius: 0.28rem 0 0 0.28rem;
  text-align: center;
}
.page-container .goods-card.heji .btn-block .btn-share {
  background: #fff9f3;
  border: 1px dashed #f5a15c;
  border-right: 0;
  color: #ff6728;
  cursor: pointer;
}
.page-container .goods-card.heji .btn-block .btn-order {
  margin-top: 0.07rem;
  background: linear-gradient(90deg, #fe3a3f, #faa450);
  box-shadow: 0 0.05rem 0.1rem 0 rgba(215, 21, 55, 0.2);
  color: #fff;
  cursor: pointer;
}
.page-container .free-loading .la-line-scale {
  color: #fff;
}
.page-container .page-content {
  padding: 0.2rem 0;
  border-radius: 0.26rem;
  background: #ff522c;
  transition: padding 0.3s;
}
.page-container .page-content.empty-list {
  padding: 1rem 0;
}
.page-container .page-content .free-lists {
  width: 7.1rem;
  margin: auto;
}
.page-container .list-item-loading {
  text-align: center;
  padding: 0.2rem 0 0.4rem;
  color: #fff;
  font-size: 0.24rem;
  letter-spacing: 0.01rem;
}
.page-container .van-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
</style>