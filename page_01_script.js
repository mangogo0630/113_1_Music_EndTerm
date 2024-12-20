console.clear();
gsap.registerPlugin(ScrollTrigger);

// 全局變量
const audio = document.getElementById("background-music");
const heroSection = document.querySelector(".section.hero");
const musicControlButton = document.getElementById('music-control');
const imgElement = document.getElementById("switchImage");
let isPlaying = false;
let isLastImage = false;

// 當 DOM 加載完成後初始化
window.addEventListener("DOMContentLoaded", () => {
    // 檢查是否是從第一頁來的（通過檢查 answerType）
    const answerType = localStorage.getItem('answerType');
    
    // 如果直接重整頁面（沒有 answerType）就重置分數並跳回第一頁
    if (!answerType) {
        localStorage.setItem('testScore', '0');
        window.location.href = 'page_00.html';
        return;
    }

    // 先將所有元素設置為透明
    const wrapper = document.querySelector(".wrapper");
    wrapper.style.opacity = "0";
    
    // 添加延遲後的淡入效果
    setTimeout(() => {
        wrapper.style.transition = "opacity 1s ease-in-out";
        wrapper.style.opacity = "1";
    }, 100);

    // 其他初始化
    initBackgroundEffect();
    initAudioVolume();
    initScrollEffects();
    initClickableImage();
});

// 初始化音量設置
function initAudioVolume() {
    if (audio) {
        audio.volume = 0;
    }
}

// 檢查圖片尺寸
function checkImageSizes() {
    const hero = document.querySelector(".section.hero");
    const foreground = document.querySelector(".foreground-image");
    
    console.log("Hero section size:", {
        width: hero.offsetWidth,
        height: hero.offsetHeight,
        computedStyle: window.getComputedStyle(hero)
    });
    
    console.log("Foreground image size:", {
        width: foreground.offsetWidth,
        height: foreground.offsetHeight,
        naturalWidth: foreground.naturalWidth,
        naturalHeight: foreground.naturalHeight,
        computedStyle: window.getComputedStyle(foreground)
    });
}

window.addEventListener("load", checkImageSizes);

// 背景效果初始化
function initBackgroundEffect() {
    const backgroundImage = document.querySelector(".background-image");
    if (backgroundImage) {
        setTimeout(() => {
            backgroundImage.classList.add("brightness");
        }, 500);
    }
}

// 音樂播放器初始化
function initMusicPlayer() {
    if (audio) {
        setTimeout(() => {
            audio.volume = 0;
            audio.play()
                .then(() => {
                    fadeInAudio();
                })
                .catch(error => {
                    console.error("音樂播放失敗:", error);
                });
        }, 2000);
    }
}

// 音量淡入效果
function fadeInAudio() {
    const fadeInInterval = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + 0.1, 1);
        } else {
            clearInterval(fadeInInterval);
        }
    }, 200);
}

// 初始化滾動效果
function initScrollEffects() {
    // 創建時間軸但先不啟用
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".wrapper",
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: true,
            preventScroll: true  // 預防滾動
        }
    });

    // 添加動畫但先不執行
    tl.to(".content .section.hero", {
        scale: 1.8,
        ease: "power1.inOut"
    })
    .to(".foreground-image", {
        scale: 2,
        ease: "power1.inOut"
    }, "<")
    .to(".foreground-image", {
        opacity: 0,
        ease: "power1.inOut"
    });

    // 禁用滾動
    document.body.style.overflow = 'hidden';
    
    // 設置滾動事件監聽器
    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchmove', handleScroll, { passive: false });

    // 初始化浮動按鈕
    initFloatingButton("#floating-button-1", "bottom 50%", -10, 1.5);
    initFloatingButton("#floating-button-2", "bottom 25%", -8, 1.8);
    initFloatingButton("#floating-button-3", "bottom 30%", -7, 1.0);
}

// 滾動處理函數
function handleScroll(e) {
    if (!isLastImage) {
        e.preventDefault();
        if (!document.getElementById('scrollHint')) {
            const hint = document.createElement('div');
            hint.id = 'scrollHint';
            hint.style.position = 'fixed';
            hint.style.bottom = '20px';
            hint.style.left = '50%';
            hint.style.transform = 'translateX(-50%)';
            hint.style.color = 'white';
            hint.style.padding = '10px';
            hint.style.backgroundColor = 'rgba(0,0,0,0.7)';
            hint.style.borderRadius = '5px';
            hint.style.zIndex = '1000';
            hint.textContent = '嘗試擊碎鏡子';
            document.body.appendChild(hint);
            
            setTimeout(() => {
                hint.remove();
            }, 3000);
        }
    }
}

// 浮動按鈕初始化
function initFloatingButton(buttonId, startPosition, yOffset, duration) {
    ScrollTrigger.create({
        trigger: ".section.hero",
        start: startPosition,
        endTrigger: ".new-background",
        onEnter: () => {
            gsap.to(buttonId, { opacity: 1, duration: 1, display: "block" });
        },
        onLeaveBack: () => {
            gsap.to(buttonId, { opacity: 0, duration: 1 });
        }
    });

    gsap.to(buttonId, {
        y: yOffset,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: duration
    });
}

// 點擊圖片初始化
function initClickableImage() {
    const images = [
        "images/鏡子示意圖-3_2.jpg",
        "images/鏡子示意圖-3_2.jpg",
        "images/鏡子-裂痕去背_2.png",
        "images/鏡子-無鏡片去背_2.png"
    ];
    let currentIndex = 0;

    if (imgElement) {
        imgElement.addEventListener("click", () => {
            if (currentIndex < images.length - 1) {
                currentIndex++;
                imgElement.src = images[currentIndex];
                gsap.to(imgElement, {
                    scale: 1.01,
                    duration: 0.2,
                    yoyo: true,
                    repeat: 1
                });
                
                if (currentIndex === images.length - 1) {
                    isLastImage = true;
                    document.body.style.overflow = 'auto';
                    window.removeEventListener('wheel', handleScroll);
                    window.removeEventListener('touchmove', handleScroll);
                    
                    const scrollPrompt = document.createElement('div');
                    scrollPrompt.id = 'scrollPrompt';
                    scrollPrompt.style.position = 'fixed';
                    scrollPrompt.style.bottom = '20px';
                    scrollPrompt.style.left = '50%';
                    scrollPrompt.style.transform = 'translateX(-50%)';
                    scrollPrompt.style.color = 'white';
                    scrollPrompt.style.padding = '10px';
                    scrollPrompt.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    scrollPrompt.style.borderRadius = '5px';
                    scrollPrompt.style.zIndex = '2000';
                    scrollPrompt.textContent = '進入鏡子內部';
                    document.body.appendChild(scrollPrompt);
                    
                    setTimeout(() => {
                        scrollPrompt.remove();
                    }, 3000);
                }
            }
        });
    }
}

// 按鈕點擊處理
function handleButtonClick(button) {
    // 根據按鈕 ID 設置分數
    let score;
    switch(button.id) {
        case 'floating-button-3': // eye_01.png - 樂觀型
            score = 3; 
            break;
        case 'floating-button-2': // eye_02.png - 佛系型
            score = 2;  
            break;
        case 'floating-button-1': // eye_03.png - 消極型
            score = 1;  
            break;
    }
    
    // 從 localStorage 獲取當前總分，如果沒有就設為0
    let currentTotal = parseInt(localStorage.getItem('testScore')) || 0;
    
    // 加上新的分數
    currentTotal += score;

    // 儲存更新後的總分到 localStorage
    localStorage.setItem('testScore', currentTotal);

    // 先讓其他按鈕慢慢消失
    const allButtons = document.querySelectorAll(".floating-button");
    allButtons.forEach(btn => {
        if (btn !== button) {
            gsap.to(btn, {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        }
    });
    
    // 延遲後再讓被點擊的按鈕和背景消失
    setTimeout(() => {
        // 背景變暗效果
        const heroSection = document.querySelector(".section.hero");
        heroSection.classList.add("dark");
        
        // 被點擊的按鈕消失
        gsap.to(button, {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    // 改為跳轉到下一頁，而不是直接去結果頁
                    window.location.href = "page_02.html";
                }, 1500);
            }
        });
        
        
        // 背景鏡子淡出
        gsap.to(".foreground-image", {
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    }, 500);
}

// 音樂控制
if (musicControlButton) {
    musicControlButton.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicControlButton.textContent = '播放音樂';
            musicControlButton.classList.remove('playing');
        } else {
            audio.play()
                .then(() => {
                    fadeInAudio();
                    musicControlButton.textContent = '暫停音樂';
                    musicControlButton.classList.add('playing');
                })
                .catch(error => {
                    console.error("音樂播放失敗:", error);
                    isPlaying = false;
                });
        }
        isPlaying = !isPlaying;
    });
}

// 圖片尺寸調整
window.addEventListener('load', () => {
    const heroSection = document.querySelector('.section.hero');
    const foregroundImage = document.querySelector('.foreground-image');
    
    const computedStyle = window.getComputedStyle(heroSection);
    const bgWidth = heroSection.offsetWidth;
    const bgHeight = heroSection.offsetHeight;
    
    foregroundImage.style.width = `${bgWidth}px`;
    foregroundImage.style.height = `${bgHeight}px`;
});