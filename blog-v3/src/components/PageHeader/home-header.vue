<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import { staticData } from "@/store/index.js";

import TypeWriter from "@/components/TypeWriter/type-writer";
import Waves from "@/components/WelcomeComps/waves.vue";
import { debounce } from "@/utils/tool";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { storeToRefs } from "pinia";

const route = useRoute();
const staticStore = staticData();
const { getPageHeaderList } = storeToRefs(staticStore);

const saying = ref([]);
const showScrollBottom = ref(true);

gsap.registerPlugin(ScrollTrigger);

const scrollToBottom = () => {
  const homeElement = document.querySelector("#home");

  if (homeElement) {
    window.scrollTo({
      top: homeElement.offsetHeight - 90,
      behavior: "smooth",
    });
  }
};

const scrollListener = debounce(() => {
  if (document.documentElement.scrollTop > 50) {
    showScrollBottom.value = false;
  } else {
    showScrollBottom.value = true;
  }
}, 50);

const initOneSentence = async () => {
  fetch("https://wisdom.mrzym.top/api/random")
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        saying.value = [res.data.content];
      }
    });
};

const initScrollEvent = () => {
  window.addEventListener("scroll", scrollListener);
};

const getBgCover = computed(() => {
  const bgList = getPageHeaderList.value;
  // 做一个根据路由来判断判断页面背景图片
  let url;
  let myUrl = "http://img.mrzym.top/FvmVKfygxBKoJbFVXJwzjgAASL9S";

  let index = bgList.findIndex((bg) => bg.route_name == route.name);
  url = index == -1 ? myUrl : bgList[index].bg_url;
  // eslint-disable-next-line
  return url;
});

onMounted(() => {
  initOneSentence();
  initScrollEvent();

  gsap.to(".bg", {
    scrollTrigger: {
      trigger: "#home",
      scrub: true,
      start: "top top",
      end: "bottom",
      ease: "power1.inOut",
    },
    scale: 1.3,
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scrollListener);
});
</script>

<template>
  <div id="home">
    <el-image class="bg !w-[100%] !h-[100%]" fit="cover" :src="getBgCover"></el-image>
    <div class="font">小张的个人博客</div>
    <TypeWriter class="type-writer" size="1.2em" :typeList="saying"></TypeWriter>
    <Waves />
    <!-- <First /> -->
    <div v-if="showScrollBottom" class="scroll-bottom">
      <i @click="scrollToBottom" class="iconfont icon-arrowdown"></i>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: var(--home-bg);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;

  .bg {
    z-index: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: var(--home-mask-color);
  }

  .scroll-bottom {
    position: absolute;
    cursor: pointer;
    bottom: 70px;
    left: 50%;
    color: var(--menu-color);
    transform: translate(-50%, -50%);
    z-index: 1000;

    .icon-arrowdown {
      display: inline-block;
      font-size: 1.5em;
      animation: bounce 2s infinite;
    }
  }
}

.font {
  position: absolute;
  top: 45%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
  font-size: clamp(1em, 4vmin, 20em);
  color: var(--global-white);
  padding: 0.5rem;
  cursor: pointer;
}

.font:hover {
  animation: anime 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) alternate forwards;
}

@keyframes anime {
  from {
    font-variation-settings:
      "wght" 300,
      "slnt" 15;
    text-shadow: none;
  }

  to {
    font-variation-settings:
      "wght" 800,
      "slnt" 0;
    text-shadow:
      1px 1px 0px #00e6e6,
      2px 2px 0px #01cccc,
      5px 5px 5px #dda121;
  }
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(20px);
    opacity: 0.4;
  }

  50% {
    transform: translateY(0);
    opacity: 1;
  }
}

.type-writer {
  position: absolute;
  top: 60%;
  left: 50%;
  z-index: 999;
  transform: translate(-50%, -50%);
}
</style>
