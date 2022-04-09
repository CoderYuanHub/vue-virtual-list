<template>
  <div class="scroll-container" ref="myRef" @scroll.passive="handleScroll">
    <div class="news-list" :style="blankFill">
      <!-- 根据待显示新闻列表数组，显示新闻列表 -->
      <div v-for="(item, index) in showDataList" :key="index">
        <slot name="item" :item="item"></slot>
      </div>
      <!-- 请求状态下 显示对应 msg 提示信息 -->
      <div v-if="isRequestStatus" class="msg">
        <slot name="msg">
          <h2>{{ msg }}</h2>
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  computed,
  onActivated,
  nextTick,
} from "vue";
import axios from "axios";

export default defineComponent({
  name: "HomeView",
  props: {
    // 提示内容
    msg: {
      type: String,
      default: "",
    },
    // 一行高度
    oneHeight: {
      type: Number,
      default: 0,
    },
    // 请求接口
    requestUrl: {
      type: String,
      default: "",
    },
    // 请求个数
    requestNum: {
      type: Number,
      default: 20,
    },
    // 更多格式
    moreRequestNum: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    // 初始化数据
    const allDataList = reactive({
      list: [],
    });
    // 初始化请求状态
    let isRequestStatus = ref(true);

    // 初始化滚动条
    const myRef = ref<HTMLElement | null>(null);
    // 初始化高度
    const AllHeight = ref<number>(0);
    // 存放数据的个数
    const AllCount = ref<number>(0);
    // 记录索引开始位置
    const startIndex = ref<number>(0);
    // 记录滚动的高度
    const scrollTop = ref<number>(0);
    // 计算索引最后的位置
    const endIndex = computed(() => {
      const end = startIndex.value + AllCount.value * 2;
      if (!allDataList.list[end]) {
        return allDataList.list.length - 1;
      } else {
        return startIndex.value + AllCount.value;
      }
    });

    // 计算展示的数据
    const showDataList = computed(() => {
      // 优化快速滚动产生的空白
      let start = 0;
      if (startIndex.value >= AllCount.value) {
        start = startIndex.value - AllCount.value;
      }
      return allDataList.list.slice(start, endIndex.value);
    });

    // 计算留白高度
    const topBlankfill = computed(() => {
      // 优化快速滚动产生的空白
      let start = 0;
      if (startIndex.value >= AllCount.value) {
        start = startIndex.value - AllCount.value;
      }
      return start * props.oneHeight;
    });
    const bottomBlankfill = computed(() => {
      return (allDataList.list.length - endIndex.value) * props.oneHeight;
    });

    // 留白是为了处理数据切割时候的问题
    const blankFill = computed(() => {
      return {
        paddingTop: topBlankfill.value + "px",
        paddingBottom: bottomBlankfill.value + "px",
      };
    });
    // 高度计算方法
    const getHeight = () => {
      AllHeight.value = myRef.value?.offsetHeight || 0;
      // 获取数据个数,+2是为滑动过程中顶部和底部出现一部分页面
      AllCount.value = ~~(AllHeight.value / props.oneHeight) + 2;
    };
    // 是否滚动
    // let isScroll = true;
    // 滚动条滚动事件
    const handleScroll = () => {
      // if (isScroll) {
      //   isScroll = false;
      //   let timer = setTimeout(() => {
      //     isScroll = true;
      //     clearTimeout(timer);
      //   }, 30);
      //   handleScrollData();
      // }
      // 滚动式节流请求动画帧优化
      let requestAnimationFrame = window.requestAnimationFrame;
      let fps = 30;
      let interval = 1000 / fps;
      let then = Date.now();
      const handleRequest = () => {
        let now = Date.now();
        let delta = now - then;
        handleScrollData();
        if (delta >= interval) {
          then = now;
          requestAnimationFrame(handleRequest);
        }
      };
      requestAnimationFrame(handleRequest);
    };
    const handleScrollData = async () => {
      // 获取滚动条高度
      scrollTop.value = myRef.value?.scrollTop || 0;
      // 滚动索引开始位置
      let currentIndex = ~~(scrollTop.value / props.oneHeight);
      if (startIndex.value === currentIndex) return;
      startIndex.value = currentIndex;
      // 判断是否滚动到底部,计算个数
      if (
        startIndex.value + AllCount.value > allDataList.list.length - 1 &&
        !isRequestStatus.value
      ) {
        isRequestStatus.value = true;
        const newList = await getDataList(props.moreRequestNum);
        allDataList.list = allDataList.list.concat(newList);
      }
    };
    // 请求新闻列表数据
    const getDataList = async (num) => {
      const res = await axios.get(props.requestUrl + "?num=" + num);
      isRequestStatus.value = false;
      if (res?.data?.list?.length) {
        return res.data.list;
      } else {
        return [];
      }
    };
    onMounted(async () => {
      allDataList.list = await getDataList(props.requestNum);
      getHeight();
      // 页面重绘时，更新高度
      window.addEventListener("resize", () => {
        getHeight();
      });
      // 页面翻转时，更新高度
      window.addEventListener("orientationchange", () => {
        getHeight();
      });
    });
    // 利用钩子函数保存数据位置
    onActivated(() => {
      nextTick(() => {
        if (myRef.value) {
          myRef.value.scrollTop = scrollTop.value;
        }
      });
    });

    return {
      showDataList,
      isRequestStatus,
      myRef,
      handleScroll,
      blankFill,
    };
  },
});
</script>

<style scoped lang="less">
.scroll-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  .msg h2 {
    font-size: 18px;
    text-align: center;
    color: #666;
    padding-top: 58px;
  }
}
</style>
