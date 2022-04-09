<template>
  <div class="news-box">
    <virtual-list
      :msg="msg"
      :oneHeight="oneHeight"
      :requestUrl="requestUrl"
      :requestNum="requestNum"
      :moreRequestNum="moreRequestNum"
    >
      <template v-slot:item="data">
        <router-link
          class="one-new"
          :to="
            '/article/' +
            data.item.title +
            '/' +
            data.item.reads +
            '/' +
            data.item.from +
            '/' +
            data.item.date +
            '/' +
            data.item.image
          "
        >
          <!-- 新闻左侧标题、评论、来源部分 -->
          <div class="new-left">
            <h3>{{ data.item.id }}{{ data.item.title }}</h3>
            <div>
              <p>
                <img src="../assets/icons/msg.png" alt="评" />
                <span>{{ data.item.reads }}</span>
                <span>{{ data.item.from }}</span>
              </p>
              <h4>{{ data.item.date }}</h4>
            </div>
          </div>
          <!-- 新闻右侧图片部分 -->
          <div class="new-right">
            <img :src="imgsList[data.item.image]" alt="PIC" />
          </div>
        </router-link>
      </template>
      <template v-slot:msg>
        <div class="loading">小二在这里～</div>
      </template>
    </virtual-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { imgsLists } from "../components/newsImgs";

export default defineComponent({
  name: "HomeView",
  setup() {
    // 初始化数据
    const msg = ref("努力加载中～");
    const oneHeight = ref(100);
    const requestUrl = ref("http://localhost:5058/data");
    const requestNum = ref(20);
    const moreRequestNum = ref(20);
    // 初始化图片列表
    const imgsList = ref(imgsLists);
    return {
      msg,
      oneHeight,
      requestUrl,
      requestNum,
      moreRequestNum,
      imgsList,
    };
  },
});
</script>
<style scoped lang="less">
.news-box {
  width: 100%;
  max-width: 800px;
  height: 100%;
  .one-new {
    text-decoration: none;
    display: block;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding: 14px 10px 5px;
    .new-left {
      height: 80px;
      position: relative;
      h3 {
        padding: 0;
        margin: 0;
        font-size: 16px;
        text-align: justify;
        color: #555;
      }
      div {
        position: absolute;
        width: 100%;
        bottom: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        p {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: space-between;
          align-items: center;
          img {
            height: 16px;
          }
          span {
            font-size: 12px;
            color: #555;
            margin-left: 3px;
            margin-right: 3px;
          }
        }
        h4 {
          font-size: 12px;
          color: #888;
        }
      }
    }
    .new-right {
      margin-left: 10px;
      img {
        height: 68px;
      }
    }
  }
}
</style>
