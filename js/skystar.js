// ---------- 1. 悬浮祝福语 ----------
var words = [
    '生日快乐', '万事胜意', '平安喜乐', '前程似锦', 
    '岁岁常欢愉', '年年皆胜意', '未来可期', '所愿皆成真',
    '多喜乐，长安宁', '星光满载', '光芒万丈', '炙热与自由',
    '万事尽可期待', '诸事顺遂', '百事从欢', '岁岁年年',
    '万喜万般宜', '愿你三冬暖', '愿你春不寒', '永远热泪盈眶',
    '前程万里', '平安顺遂', '得偿所愿', '年少有为',
    '一生可爱', '一世无忧', '前程似锦', '喜乐长安'
];

// ---------- 2. 10组主标题 ----------
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

// ---------- 3. DOM 元素 ----------
const textCanvas = document.getElementById('text-canvas');
const textCtx = textCanvas.getContext('2d');
const particleCanvas = document.getElementById('particles-canvas');
const particleCtx = particleCanvas.getContext('2d');
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

// 获取三个独立的标题节点（用于隐藏，绝不删除）
const textone = document.querySelector('.textone');
const texttwo = document.querySelector('.texttwo');
const textthree = document.querySelector('.textthree');

let W, H, particles = [], bgParticles = [];
let switchCount = 0, isEndingShown = false, autoTimer;
const isMobile = window.innerWidth <= 600;
const loadManager = { videoReady: false, audioReady: false, wordsReady: false, isAllReady: false };

// ---------- 4. 尺寸适配 ----------
function resizeCanvas() {
    W = textCanvas.width = particleCanvas.width = window.innerWidth;
    H = textCanvas.height = particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// ---------- 5. 粒子提取（保持 step=1.5） ----------
function getTextPoints(text) {
    const fontSize = Math.min(W * 0.08, 40);
    const lineHeight = fontSize * 1.3;
    const lines = text.split('\n');
    const offCanvas = document.createElement('canvas');
    offCanvas.width = W * 0.9; offCanvas.height = H * 0.6;
    const offCtx = offCanvas.getContext('2d');
    offCtx.fillStyle = '#fff';
    offCtx.font = `${fontSize}px '楷体', 'KaiTi', serif`;
    offCtx.textAlign = 'center'; offCtx.textBaseline = 'middle';
    const startY = (offCanvas.height - lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, index) => offCtx.fillText(line, offCanvas.width / 2, startY + index * lineHeight));

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const data = imageData.data;
    const points = [];
    const step = 1.5; 
    for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
            const idx = (y * offCanvas.width + x) * 4;
            if (data[idx + 3] > 128) points.push({ tx: (x / offCanvas.width) * W, ty: (y / offCanvas.height) * H });
        }
    }
    return points;
}

// ---------- 6. 生成主标题 ----------
function generateParticles(text) {
    const newPoints = getTextPoints(text);
    while (particles.length < newPoints.length) {
        particles.push({ x: Math.random() * W, y: Math.random() * H, tx: 0, ty: 0, color: `hsla(${330 + Math.random() * 30}, 80%, ${65 + Math.random() * 25}%, 0.9)` });
    }
    particles.splice(newPoints.length);
    particles.forEach((p, i) => {
        p.tx = newPoints[i].tx; p.ty = newPoints[i].ty;
        if (!p.animStart) { p.x = Math.random() * W; p.y = Math.random() * H; }
    });
}

// ---------- 7. 动画循环 ----------
function animateText() {
    textCtx.clearRect(0, 0, W, H);
    const radius = isMobile ? 2.5 : 4.0; 
    textCtx.shadowColor = '#FFB7C5';
    textCtx.shadowBlur = 6;
    
    particles.forEach(p => {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) { 
            p.x += dx * 0.08; 
            p.y += dy * 0.08; 
        } else { p.x = p.tx; p.y = p.ty; }
        textCtx.beginPath(); textCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        textCtx.fillStyle = p.color; textCtx.fill();
    });
    requestAnimationFrame(animateText);
}

// ---------- 8. 背景小粒子 ----------
function initBgParticles() {
    bgParticles = [];
    for (let i = 0; i < 40; i++) {
        bgParticles.push({
            x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1, color: `hsla(340, 80%, 70%, ${Math.random() * 0.4 + 0.2})`
        });
    }
    function drawBg() {
        particleCtx.clearRect(0, 0, W, H);
        bgParticles.forEach(p => {
            particleCtx.beginPath(); particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            particleCtx.fillStyle = p.color; particleCtx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(drawBg);
    }
    drawBg();
}

// ---------- 9. 预加载悬浮词（半径 45-60vw） ----------
function preloadRandomWords() {
    container.innerHTML = '';
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

// ---------- 10. 视频无声下载 ----------
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

// ---------- 11. 加载完成检查 ----------
function checkAllLoaded() {
    if (loadManager.videoReady && loadManager.audioReady && loadManager.wordsReady) {
        loadManager.isAllReady = true;
    }
}

// ---------- 12. 大结局 ----------
function showEnding(name, month) {
    if (isEndingShown) return;
    isEndingShown = true;
    endingDynamic.innerHTML = `${name}，愿你${month}月生日的这一天<br>永远被爱包围，岁岁年年`;
    endingOverlay.classList.add('show');
    clearInterval(autoTimer);
}

// ---------- 13. 开始按钮 ----------
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

// ---------- 14. 主流程（【纯净修复】仅用 CSS 隐藏多余标题） ----------
function startMain(name, month) {
    entryScreen.style.display = 'none';
    mainScreen.style.display = 'block';

    // ========== 彻底隐藏那三个多余的HTML标题节点 ==========
    // 只用 display: none 解决，绝对不删除DOM，不影响其他逻辑
    if (textone) textone.style.display = 'none';
    if (texttwo) texttwo.style.display = 'none';
    if (textthree) textthree.style.display = 'none';
    // ========================================================

    initBgParticles();
    generateParticles(titleGroups[0].text);
    animateText();

    // 音乐取消静音
    bgMusic.muted = false;
    bgMusic.play().then(() => {}).catch(() => {});

    // 视频预激活
    video.muted = true;
    video.play().then(() => video.pause()).catch(() => {});

    let index = 0;
    autoTimer = setInterval(() => {
        index++;
        if (index < titleGroups.length) {
            generateParticles(titleGroups[index].text);
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
            container.style.display = 'block';
        }
    }, 5000);
}

// ---------- 15. 页面启动 ----------
function preloadAll() {
    preloadVideoStandard();
    preloadRandomWords();
    bgMusic.play().catch(() => {});
    bgMusic.addEventListener('canplaythrough', () => { loadManager.audioReady = true; checkAllLoaded(); });
    if (bgMusic.readyState >= 4) { loadManager.audioReady = true; checkAllLoaded(); }
    setTimeout(() => { if(!loadManager.audioReady) { loadManager.audioReady = true; checkAllLoaded(); } }, 8000);
}

// ---------- 16. 启动 ----------
resizeCanvas();
preloadAll();

// 触摸屏幕强制激活音乐
document.addEventListener('touchstart', function() {
    if (bgMusic.muted) { bgMusic.muted = false; bgMusic.play().catch(()=>{}); }
});
