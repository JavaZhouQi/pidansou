<template>
  <div class="head">
    <van-row>
      <van-col span="24">
        <p align="center">测试室测试</p>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <van-search v-model="value" show-action placeholder="请输入搜索关键词">
          <template #action>
            <div @click="hotWords">搜索</div>
          </template>
        </van-search>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <span>热门搜索：</span>
        <span v-for="entity in hotWordsList" :key="entity">{{ entity }}</span>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <span>三步省钱</span>
      </van-col>
    </van-row>
    <van-row>
      <van-col span="24">
        <span>热门搜索：</span>
      </van-col>
    </van-row>
  </div>
  <van-row>
    <van-col span="24">
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
      <van-card
        num="2"
        price="2.00"
        desc="描述信息"
        title="商品标题"
        thumb="https://cdn.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
    </van-col>
  </van-row>
</template>
 
<script>
import http from "@/request/index";

export default {
  data() {
    return {
      hotWordsList: [],
      value: ''
    };
  },
  created() {
     http.get( "/three/goods/hot/words").then((res) => {
        this.hotWordsList = res.data;
      });
  },
  methods: {
    
  },
};
</script>
 
<style>
</style>