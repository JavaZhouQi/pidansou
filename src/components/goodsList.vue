 <template>
  <div class="goods-card heji">
    <img v-lazy="item.itempic" v-if="item.itempic" />
    <img
      src="http://img.bc.fqapps.com/fudai13cae4ae6ef16739ed3b100a2ec39e97.gif"
      alt=""
      v-else
    />
    <div class="detail">
      <div class="title">
        <img class="icon" :src="iconUrl" alt="" />
        <span>{{
          item.itemshorttitle ||
          item.itemtitle ||
          item.goodsnameshort ||
          item.goodsname
        }}</span>
      </div>
      <div class="center">
        <div class="today-sale">
          <i class="iconfont hdk-huo"></i>月销 {{ getMoneyStr(item.itemsale) }}
        </div>
        <!--<div class="month-sale">月销 {{getMoneyStr(item.itemsale)}}</div>-->
      </div>
      <div class="footer">
        <div class="price" v-bind:class="{ 'has-share': showShare }">
          <div class="discount">
            券后价￥<strong>{{ Number(item.itemendprice) }}</strong>
          </div>
          <div class="origin">￥{{ item.itemprice }}</div>
        </div>
        <div class="ticket" v-show="item.couponmoney != '0'">
          <span class="name">券</span
          ><span class="value">￥{{ item.couponmoney }}</span>
        </div>
      </div>
      <div class="btn-block">
        <div class="btn-share">
          <span
            v-if="activeType !== Types.tb"
            class="operation"
            v-on:click.capture="share($event, item)"
            >分享</span
          >
          <span
            v-else
            class="operation"
            v-on:click.capture="share($event, item)"
            >立即下单</span
          >
        </div>
        <div class="btn-order" v-if="activeType !== Types.tb">
          <span v-if="item.stock == 0" class="operation sell-out">已抢完</span>
          <span v-else-if="item.stock == -1" class="operation sell-out"
            >未开始</span
          >
          <span v-else class="operation" v-on:click.capture="buy($event, item)"
            >立即下单</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    iconUrl: function () {
      return this.$parent.itemIcon;
    },
    Types: function () {
      return this.$parent.Types;
    },
    activeType: function () {
      return this.$parent.activeType;
    },
  },
  methods: {
    buy: function (e, item) {
      // this.$emit("buy", e, item);
      this.$parent.handleGoodsTransfer(e, item, "link");
    },
    share: function (e, item) {
      // this.$emit("share", e, item);
      this.$parent.handleGoodsTransfer(e, item, "copy");
    },
    getMoneyStr: function (num) {
      var w = 10000;
      if (num < w) return num;
      return (num / w).toFixed(2) + "万";
    },
  },
};
</script>
