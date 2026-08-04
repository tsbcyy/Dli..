// 悬浮祝福语（生日祝福）
var words = [
    '生日快乐', '万事胜意', '平安喜乐', '前程似锦', 
    '岁岁常欢愉', '年年皆胜意', '未来可期', '所愿皆成真',
    '多喜乐，长安宁', '星光满载', '光芒万丈', '炙热与自由',
    '万事尽可期待', '诸事顺遂', '百事从欢', '岁岁年年',
    '万喜万般宜', '愿你三冬暖', '愿你春不寒', '永远热泪盈眶',
    '前程万里', '平安顺遂', '得偿所愿', '年少有为',
    '一生可爱', '一世无忧', '前程似锦', '喜乐长安'
];

// 10组主标题
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

// DOM 元素
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

// 移除旧标题节点
document.querySelectorAll('.textone, .texttwo, .textthree').forEach(el => el.remove());

let switchCount = 0, isEndingShown = false, autoTimer, charInterval = null;
let bgParticles = [];
let floatAnimId = null;
let floatingItems = [];
const isMobile = window.innerWidth <= 600;
const loadManager = { videoReady: false, audioReady: false, wordsReady: false, isAllReady: false };

// 主标题逐字显现
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

// 背景小粒子
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

// 预加载悬浮词（使用 JS 驱动公转，避免 CSS 动画问题）
function preloadRandomWords() {
    if (!container) return;
    container.innerHTML = '';
    if (floatAnimId) cancelAnimationFrame(floatAnimId);
    floatingItems = [];

    words.forEach((w, index) => {
        let el = document.createElement('div');
        el.style.position = 'absolute';
        el.style.top = '50%';
        el.style.left = '50%';
        el.style.color = '#BAABDA';
        el.style.fontFamily = '楷体';
        el.style.fontSize = isMobile ? '14px' : '18px';
        el.style.textShadow = '0 0 8px rgba(186,171,218,0.5)';
        el.style.transform = 'translate(-50%, -50%)';
        el.innerText = w;
        el.style.opacity = 0;
        // 半径 35-45vw，随机初始角度
        let dist = parseFloat(randomNum(35, 45));
        let deg = index * 15 + parseFloat(randomNum(0, 30)); // 错开角度
        let speed = parseFloat(randomNum(15, 25)); // 公转一圈秒数
        let delay = 0.2 + index * 0.15; // 延迟出现
        container.appendChild(el);
        floatingItems.push({ el, dist, deg, speed, delay, startTime: Date.now() + delay * 1000 });
    });

    loadManager.wordsReady = true;
    checkAllLoaded();
}

// 驱动公转（JS 动画）
function animateFloating() {
    if (!container || container.style.display === 'none') {
        floatAnimId = requestAnimationFrame(animateFloating);
        return;
    }
    const now = Date.now();
    floatingItems.forEach(item => {
        if (now < item.startTime) {
            item.el.style.opacity = 0;
            return;
        }
        if (item.el.style.opacity !== '1') {
            item.el.style.opacity = 1;
        }
        let elapsed = (now - item.startTime) / 1000;
        let angle = item.deg + (elapsed / item.speed) * 360;
        let rad = angle * Math.PI / 180;
        let x = Math.cos(rad) * item.dist;
        let y = Math.sin(rad) * item.dist;
        // 使用 vw 和 vh 单位，保证自适应屏幕
        item.el.style.transform = `translate(-50%, -50%) translate(${x}vw, ${y}vh)`;
    });
    floatAnimId = requestAnimationFrame(animateFloating);
}

// 视频原生下载
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

// 加载完成检查
function checkAllLoaded() {
    if (loadManager.videoReady && loadManager.audioReady && loadManager.wordsReady) {
        loadManager.isAllReady = true;
    }
}

// 大结局
function showEnding(name, month) {
    if (isEndingShown) return;
    isEndingShown = true;
    endingDynamic.innerHTML = `${name}，愿你${month}月生日的这一天<br>永远被爱包围，岁岁年年`;
    endingOverlay.classList.add('show');
    clearInterval(autoTimer);
}

// 开始按钮
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

// 主流程
function startMain(name, month) {
    entryScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    initBgParticles();
    updateTitle(titleGroups[0].text);
    
    // 音乐取消静音（如果之前是静音）
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
        // 在第三次切换后触发（即显示第3组主标题，index==2）
        if (index === 2) {
            // 触发视频（作为背景）
            video.style.display = 'block';
            video.loop = true;
            if (video.readyState >= 4) {
                video.play().then(() => staticBg.style.display = 'none').catch(() => { video.style.display = 'none'; });
            } else {
                setTimeout(() => {
                    video.play().then(() => staticBg.style.display = 'none').catch(() => { video.style.display = 'none'; });
                }, 500);
            }
            
            // 显示悬浮祝福语（强制显示容器）
            if (container) {
                container.style.display = 'block';
                container.style.opacity = '1';
                container.style.visibility = 'visible';
                // 启动公转动画
                if (!floatAnimId) animateFloating();
                // 重新触发每个词的淡入（可选）
                const wordEls = container.querySelectorAll('.word');
                wordEls.forEach((wordEl, i) => {
                    wordEl.style.animation = 'none';
                    wordEl.offsetHeight;
                    const delay = randomNum(0.2, 1.0) + 's';
                    wordEl.style.animation = `fadeInWord 1s forwards ${delay}`;
                });
            }
        }
    }, 5000);
}

// 页面启动
function preloadAll() {
    preloadVideoStandard();
    preloadRandomWords();
    
    // 音乐从一开始就尝试播放
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

// 触摸屏幕时强制取消静音
document.addEventListener('touchstart', function ensureAudio() {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().catch(()=>{});
    }
}, { once: true });
