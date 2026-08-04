var words = [
    '生日快乐', '万事胜意', '平安喜乐', '前程似锦', 
    '岁岁常欢愉', '年年皆胜意', '未来可期', '所愿皆成真',
    '多喜乐，长安宁', '星光满载', '光芒万丈', '炙热与自由',
    '万事尽可期待', '诸事顺遂', '百事从欢', '岁岁年年',
    '万喜万般宜', '愿你三冬暖', '愿你春不寒', '永远热泪盈眶',
    '前程万里', '平安顺遂', '得偿所愿', '年少有为',
    '一生可爱', '一世无忧', '前程似锦', '喜乐长安'
];

const titleGroups = [
    { text: "生日快乐\n愿你岁岁常欢愉\n年年皆胜意" },
    { text: "新的一岁，愿你闪闪发光\n万事皆可期待" },
    { text: "祝你生日快乐\n不止今天\n而是未来每一天" },
    { text: "愿你三冬暖\n愿你春不寒\n愿你天黑有灯" },
    { text: "愿你前程似锦\n愿你一生可爱\n一生无忧" },
    { text: "愿你眼里有光\n心中有爱\n目光所及皆美好" },
    { text: "愿你此生尽兴\n赤诚善良\n永远热泪盈眶" },
    { text: "愿你平安喜乐\n万事胜意\n前程万里" },
    { text: "愿你朝朝暮暮\n都有微风与花开" },
    { text: "祝你生日快乐\n未来可期\n不负心中热爱" }
];

function randomNum(min, max) { return (Math.random() * (max - min + 1) + min).toFixed(2); }

const video = document.getElementById('videofilm');
const bgMusic = document.getElementById('bg-music');
const container = document.querySelector('.container');
const staticBg = document.getElementById('static-bg');
const endingOverlay = document.getElementById('ending-overlay');
const entryScreen = document.getElementById('entry-screen');
const mainScreen = document.getElementById('main-screen');
const startBtn = document.getElementById('start-btn');
const loadingStatus = document.getElementById('loading-status');
const userNameInput = document.getElementById('user-name');
const userMonthInput = document.getElementById('user-month');
const endingDynamic = document.getElementById('ending-dynamic');
const mainTitleEl = document.getElementById('main-title');

document.querySelectorAll('.textone, .texttwo, .textthree').forEach(el => el.remove());

let switchCount = 0, isEndingShown = false, autoTimer, charInterval = null;
let bgParticles = [];
const isMobile = window.innerWidth <= 600;
const loadManager = { videoReady: false, audioReady: false, wordsReady: false, isAllReady: false };

function updateTitle(text) {
    if (charInterval) clearInterval(charInterval);
    mainTitleEl.innerHTML = '';
    let index = 0;
    charInterval = setInterval(() => {
        if (index >= text.length) { clearInterval(charInterval); return; }
        let char = text[index];
        if (char === '\n') {
            mainTitleEl.appendChild(document.createElement('br'));
        } else {
            let span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            mainTitleEl.appendChild(span);
            span.offsetHeight;
            span.classList.add('active');
        }
        index++;
    }, 70);
}

function initBgParticles() {
    const W = window.innerWidth, H = window.innerHeight;
    bgParticles = [];
    for (let i = 0; i < 40; i++) {
        bgParticles.push({
            x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1, color: `hsla(340, 80%, 70%, ${Math.random() * 0.4 + 0.2})`
        });
    }
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    function drawBg() {
        ctx.clearRect(0, 0, W, H);
        bgParticles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color; ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(drawBg);
    }
    drawBg();
}

function preloadRandomWords() {
    if (!container) return;
    container.innerHTML = '';
    container.classList.remove('show');
    let f = document.createDocumentFragment();
    words.forEach((w, index) => {
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w; word.classList.add('word');
        word.style.fontSize = isMobile ? '14px' : '18px'; 
        word.style.color = '#FFB7C5';
        word_box.classList.add('word-box');
        let dist = randomNum(45, 60) + 'vw'; 
        let deg = (index * 15) + 'deg'; 
        let speed = randomNum(15, 25) + 's'; 
        let delay = (0.2 + index * 0.15) + 's'; 
        word_box.style.setProperty("--dist", dist);
        word_box.style.setProperty("--deg", deg);
        word_box.style.setProperty("--speed", speed);
        word_box.style.setProperty("--delay", delay);
        word_box.appendChild(word);
        f.appendChild(word_box);
    });
    container.appendChild(f);
    loadManager.wordsReady = true;
    checkAllLoaded();
}

function preloadVideoStandard() {
    video.src = 'video/skystar.mp4';
    video.load();
    video.muted = true;
    video.addEventListener('canplaythrough', function onReady() {
        video.removeEventListener('canplaythrough', onReady);
        loadManager.videoReady = true;
        checkAllLoaded();
    });
    if (video.readyState >= 4) { loadManager.videoReady = true; checkAllLoaded(); }
    setTimeout(() => {
        if (!loadManager.videoReady) {
            loadManager.videoReady = true;
            checkAllLoaded();
        }
    }, 20000);
}

function checkAllLoaded() {
    if (loadManager.videoReady && loadManager.audioReady && loadManager.wordsReady) {
        loadManager.isAllReady = true;
    }
}

function showEnding(name, month) {
    if (isEndingShown) return;
    isEndingShown = true;
    endingDynamic.innerHTML = `${name}，愿你${month}月生日的这一天<br>永远被爱包围，岁岁年年`;
    endingOverlay.classList.add('show');
    clearInterval(autoTimer);
}

startBtn.addEventListener('click', function() {
    const name = userNameInput.value.trim() || '亲爱的';
    const month = userMonthInput.value.trim() || '每一';
    if (!userNameInput.value.trim()) {
        userNameInput.style.borderColor = '#FF7EB3';
        setTimeout(() => userNameInput.style.borderColor = '', 1500);
        return;
    }
    startBtn.style.display = 'none';
    loadingStatus.style.display = 'flex';
    const waitForLoad = setInterval(() => {
        if (loadManager.isAllReady) {
            clearInterval(waitForLoad);
            startMain(name, month);
        }
    }, 300);
    setTimeout(() => {
        if (!loadManager.isAllReady) {
            clearInterval(waitForLoad);
            loadManager.isAllReady = true;
            startMain(name, month);
        }
    }, 30000);
});

function startMain(name, month) {
    entryScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    initBgParticles();
    updateTitle(titleGroups[0].text);
    
    // 音乐取消静音
    bgMusic.muted = false;
    bgMusic.play().catch(() => {
        bgMusic.muted = true;
        bgMusic.play();
    });
    
    // 视频预激活
    video.muted = true;
    video.play().then(() => video.pause()).catch(() => {});
    
    let index = 0;
    autoTimer = setInterval(() => {
        index++;
        if (index < titleGroups.length) {
            updateTitle(titleGroups[index].text);
        } else {
            showEnding(name, month);
            return;
        }
        if (index === 3) {
            video.style.display = 'block';
            video.loop = true;
            if (video.readyState >= 4) {
                video.play().then(() => staticBg.style.display = 'none').catch(() => { video.style.display = 'none'; });
            } else {
                setTimeout(() => {
                    video.play().then(() => staticBg.style.display = 'none').catch(() => { video.style.display = 'none'; });
                }, 500);
            }
            // 触发悬浮词
            if (container) {
                container.style.display = 'block';
                setTimeout(() => {
                    container.classList.add('show');
                }, 50);
            }
        }
    }, 5000);
}

function preloadAll() {
    preloadVideoStandard();
    preloadRandomWords();
    // 音乐第一时间尝试有声播放
    bgMusic.muted = false;
    bgMusic.play().then(() => {
        loadManager.audioReady = true; 
        checkAllLoaded();
    }).catch(() => {
        bgMusic.muted = true;
        bgMusic.play().catch(()=>{});
        bgMusic.addEventListener('canplaythrough', () => { 
            loadManager.audioReady = true; 
            checkAllLoaded(); 
        });
        setTimeout(() => { 
            if(!loadManager.audioReady) { 
                loadManager.audioReady = true; 
                checkAllLoaded(); 
            } 
        }, 8000);
    });
    if (bgMusic.readyState >= 4) { loadManager.audioReady = true; checkAllLoaded(); }
}

// 启动
resizeCanvas();
preloadAll();

// 触摸屏幕强制激活音乐
document.addEventListener('touchstart', function ensureAudio() {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().catch(()=>{});
    }
}, { once: true });
