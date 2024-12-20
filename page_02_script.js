window.addEventListener("DOMContentLoaded", () => {
    const backgroundImage = document.querySelector(".background-image");
    const overlayBackgrounds = {
        m01: document.querySelector(".overlay-background-1"),
        m02: document.querySelector(".overlay-background-2"),
        m03: document.querySelector(".overlay-background-3")
    };
    let clickedButtons = new Set();
    let totalButtons = 3;

    function updateScore(backgroundNumber) {
        let currentScore = parseInt(localStorage.getItem('testScore') || '0');
        
        switch(backgroundNumber) {
            case '2': // coffee_bg_2.png - 佛系
                currentScore += 2;
                break;
            case '3': // coffee_bg_3.png - 消極
                currentScore += 1;
                break;
            case '4': // coffee_bg_4.png - 樂觀
                currentScore += 3;
                break;
        }
        
        localStorage.setItem('testScore', currentScore.toString());
    }

    if (backgroundImage) {
        setTimeout(() => {
            backgroundImage.classList.add("brightness");
            setTimeout(() => {
                createImageButtons();
                createControlButtons();
            }, 2000);
        }, 1000);
    }

    function createControlButtons() {
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "control-buttons";
        
        const confirmButton = document.createElement("img");
        confirmButton.src = "images/確定按鈕.png";
        confirmButton.className = "control-button confirm-button disabled";
        confirmButton.addEventListener("click", handleConfirm);
        
        const resetButton = document.createElement("img");
        resetButton.src = "images/重置按鈕.png";
        resetButton.className = "control-button reset-button";
        resetButton.addEventListener("click", handleReset);
        
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(confirmButton);
        document.body.appendChild(buttonContainer);
    }

    function createImageButtons() {
        [1, 2, 3].forEach((num, index) => {
            const buttonId = `m0${num}`;
            const image = document.createElement("img");
            image.src = `images/${buttonId}.png`;
            image.alt = `按鈕 ${num}`;
            image.id = buttonId;
            image.classList.add("fixed-image");
            document.body.appendChild(image);

            setTimeout(() => {
                image.classList.add("visible");
            }, index * 300);

            image.addEventListener("click", () => handleButtonClick(buttonId, image));
        });
    }

    function handleButtonClick(buttonId, image) {
        if (clickedButtons.has(buttonId)) {
            clickedButtons.delete(buttonId);
            image.classList.remove('clicked');
        } else if (clickedButtons.size < 2) {
            clickedButtons.add(buttonId);
            image.classList.add('clicked');
        }

        updateConfirmButtonState();
    }

    function updateConfirmButtonState() {
        const confirmButton = document.querySelector('.confirm-button');
        if (clickedButtons.size === 2) {
            confirmButton.classList.remove('disabled');
        } else {
            confirmButton.classList.add('disabled');
        }
    }

    function handleConfirm() {
        if (clickedButtons.size !== 2) return;

        const remainingButton = ['m01', 'm02', 'm03'].find(id => !clickedButtons.has(id));
        const bgIndex = remainingButton.charAt(2);
        
        const originalBg = document.querySelector('.background-image');
        if (originalBg) {
            originalBg.style.opacity = '0';
        }
        
        const overlayBg = document.querySelector(`.overlay-background-${bgIndex}`);
        if (overlayBg) {
            overlayBg.classList.add("visible");
            updateScore((parseInt(bgIndex) + 2).toString());
        }

        clickedButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.remove();
            }
        });

        const controlButtons = document.querySelector('.control-buttons');
        if (controlButtons) {
            controlButtons.remove();
        }

        setTimeout(() => {
            createNextButton();
        }, 1000);
    }

    function handleReset() {
        clickedButtons.clear();
        document.querySelectorAll('.fixed-image').forEach(img => {
            img.classList.remove('clicked');
        });
        updateConfirmButtonState();
    }

    function createNextButton() {
        const nextButton = document.createElement("img");
        nextButton.src = "images/下一頁按鈕.png";
        nextButton.className = "next-button";
        document.body.appendChild(nextButton);
    
        nextButton.addEventListener("click", () => {
            const remainingButton = document.querySelector('.fixed-image');
            if (remainingButton) {
                remainingButton.style.transition = 'opacity 1s ease-out';
                remainingButton.style.opacity = '0';
                setTimeout(() => remainingButton.remove(), 1000);
            }
            
            nextButton.style.opacity = '0';
            
            const allBackgrounds = document.querySelectorAll('.background-image, .overlay-background-1, .overlay-background-2, .overlay-background-3');
            allBackgrounds.forEach(bg => {
                if(bg.style.opacity !== '0') {
                    bg.style.transition = 'opacity 1s ease-in-out';
                    bg.style.opacity = '0';
                }
            });
            
            setTimeout(() => {
                window.location.href = 'page_03.html';
            }, 1000);
        });
    }
});

// Add button styles
const style = document.createElement('style');
style.textContent = `
    .next-button {
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        animation: fadeIn 0.5s ease forwards;
        width: 100px;
        height: auto;
        z-index: 1000;
    }

    .next-button:hover {
        transform: translateX(-50%) scale(1.1);
    }

    .control-buttons {
        position: fixed;
        bottom: 50px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 20px;
        z-index: 1000;
    }

    .control-button {
        width: 100px;
        height: auto;
        cursor: pointer;
        transition: transform 0.2s ease;
    }

    .control-button:hover {
        transform: scale(1.1);
    }

    .control-button.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .control-button.disabled:hover {
        transform: none;
    }

    .fixed-image {
        position: fixed;
        width: 120px;
        height: auto;
        transform: translate(-50%, -50%);
        transition: all 0.3s ease;
        cursor: pointer;
        opacity: 0;
    }

    .fixed-image.visible {
        opacity: 1;
    }

    .fixed-image:hover {
        transform: translate(-50%, -50%) scale(1.1);
    }

    .fixed-image.clicked {
        opacity: 0.5;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
document.head.appendChild(style);