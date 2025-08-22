console.clear();

gsap.registerPlugin(ScrollTrigger);

// 背景圖片列表
/*const backgroundImages = [
  "url('images/eyes.png')",
  "url('images/work.png')",
];*/

// 獲取音樂元素和背景容器
const audio = document.getElementById("background-music");
const heroSection = document.querySelector(".section.hero");

// 音樂與背景圖片同步
audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;

  // 根據播放時間切換背景圖片
  if (currentTime < 30) {
    heroSection.style.backgroundImage = backgroundImages[0];
  } else if (currentTime >= 30 && currentTime < 60) {
    heroSection.style.backgroundImage = backgroundImages[1];
  } else if (currentTime >= 60) {
    heroSection.style.backgroundImage = backgroundImages[2];
  }
});


gsap.registerPlugin(ScrollTrigger);

// 播放音樂
window.addEventListener("load", () => {
  audio.play();
    // 使用 GSAP 設置滾動效果
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".wrapper",
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: true,
        markers: true
      }
    })
    .to(".content .section.hero", {
      scale: 1.5, // 放大 CSS 設置的背景圖片
      ease: "power1.inOut"
    })

    .to(".foreground-image", {
      scale: 3, // 放大前景圖片，確保與背景圖片同步
      ease: "power1.inOut"
    }, "<") // 與背景圖片動畫同步

    .to(".foreground-image", {
      opacity: 0, // 在滾動接近結束時使前景圖片淡出
      ease: "power1.inOut"
    }, ); // 從滾動的 70% 開始漸變

 // 顯示按鈕動畫
ScrollTrigger.create({
  trigger: ".section.hero",
  start: "bottom 50%", // 當滾動到第一區塊（.section.hero）的底部時觸發
  endTrigger: ".new-background", // 在第二區塊出現前失效
  onEnter: () => {
    gsap.to("#floating-button", { opacity: 1, duration: 1, display: "block" });
  },
  onLeaveBack: () => {
    gsap.to("#floating-button", { opacity: 0, duration: 1 });
  }
});

  // 按鈕的上下漂浮效果
  gsap.to("#floating-button", {
    y: -10,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
    duration: 1.5
  });
});

  // 新增第二區塊的滾動效果
  gsap.timeline({
    scrollTrigger: {
      trigger: ".new-background",
      start: "top bottom", // 當滾動到 .new-background 時觸發
      end: "bottom top",
      scrub: true,
      markers: true
    }
  });

