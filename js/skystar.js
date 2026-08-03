// ---------- 1. 悬浮词：生日祝福语列表 ----------
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

// ---------- 3. 辅助函数 ----------
function randomNum(min, max) {
    var num = (Math.random() * (max - min + 1) + min).toFixed(2);
    return num;
}

// ---------- 4. DOM 元素 ----------
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

let W, H, particles = [], bgParticles = [];
let switchCount = 0;
let isEndingShown = false;
let autoTimer;

const isMobile = window.innerWidth <= 600;
const loadManager = { videoReady: false, audioReady: false, wordsReady: false, isAllReady: false };
let videoBlobUrl = null; // 缓存视频二进制对象

// ---------- 5. 尺寸适配 ----------
function resizeCanvas() {
    W = textCanvas.width = particleCanvas.width = window.innerWidth;
    H = textCanvas.height = particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// ---------- 6. 粒子提取 (step=1 极致细) ----------
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
    const step = 1; 
    for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
            const idx = (y * offCanvas.width + x) * 4;
            if (data[idx + 3] > 128) points.push({ tx: (x / offCanvas.width) * W, ty: (y / offCanvas.height) * H });
        }
    }
    return points;
}

// ---------- 7. 生成主标题粒子 ----------
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

// ---------- 8. 动画循环（手机 2.2px, 电脑 3.5px） ----------
function animateText() {
    textCtx.clearRect(0, 0, W, H);
    const radius = isMobile ? 2.2 : 3.5; 
    particles.forEach(p => {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) { p.x += dx * 0.08; p.y += dy * 0.08; } 
        else { p.x = p.tx; p.y = p.ty; }
        textCtx.beginPath(); textCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        textCtx.fillStyle = p.color; textCtx.fill();
    });
    requestAnimationFrame(animateText);
}

// ---------- 9. 背景小粒子 ----------
function initBgParticles() {
    bgParticles = [];
    for (let i = 0; i < 50; i++) {
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

// ---------- 10. 预加载悬浮祝福语 ----------
function preloadRandomWords() {
    container.innerHTML = '';
    let f = document.createDocumentFragment();
    words.forEach(w => {
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w;
        word.classList.add('word');
        word.style.color = '#BAABDA';
        word.style.fontFamily = '楷体';
        word.style.fontSize = isMobile ? '14px' : '20px';
        word_box.classList.add('word-box');
        
        // 拉大随机范围，且以中心为锚点，避免重叠
        word_box.style.setProperty("--margin-top", randomNum(-35, 35) + 'vh');
        word_box.style.setProperty("--margin-left", randomNum(-40, 40) + 'vw');
        word_box.style.setProperty("--animation-duration", randomNum(8, 20) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-15, 0) + 's');
        
        word_box.appendChild(word);
        f.appendChild(word_box);
    });
    container.appendChild(f);
    loadManager.wordsReady = true;
    checkAllLoaded();
}

// ---------- 11. 【核心解决】XHR 终极视频预下载（解决 QQ 浏览器卡顿） ----------
function preloadVideoXHR() {
    if (videoBlobUrl) return; // 已下载完成
    // 注意：确保路径与 HTML 中的一致
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'video/skystar.mp4', true);
    xhr.responseType = 'blob';
    xhr.onprogress = function(e) {
        // 可选：您可以在输入页加一个百分比进度条（暂不实现，保持简洁）
    };
    xhr.onload = function() {
        if (this.status === 200) {
            const blob = this.response;
            videoBlobUrl = URL.createObjectURL(blob);
            video.src = videoBlobUrl;
            loadManager.videoReady = true;
            checkAllLoaded();
        } else {
            // 如果 XHR 失败，回退到普通加载方式
            setTimeout(() => { 
                if(!loadManager.videoReady) { 
                    loadManager.videoReady = true; 
                    checkAllLoaded(); 
                }
            }, 5000);
        }
    };
    xhr.onerror = function() {
        // 网络错误，走保底
        setTimeout(() => { 
            if(!loadManager.videoReady) { 
                loadManager.videoReady = true; 
                checkAllLoaded(); 
            }
        }, 5000);
    };
    xhr.send();
}

// ---------- 12. 触发预下载 ----------
userNameInput.addEventListener('input', preloadVideoXHR);
userMonthInput.addEventListener('input', preloadVideoXHR);
userNameInput.addEventListener('focus', preloadVideoXHR);
userMonthInput.addEventListener('focus', preloadVideoXHR);

// ---------- 13. 加载完成检查 ----------
function checkAllLoaded() {
    if (loadManager.videoReady && loadManager.audioReady && loadManager.wordsReady) {
        loadManager.isAllReady = true;
    }
}

// ---------- 14. 大结局 ----------
function showEnding(name, month) {
    if (isEndingShown) return;
    isEndingShown = true;
    endingDynamic.innerHTML = `${name}，愿你${month}月生日的这一天<br>永远被爱包围，岁岁年年`;
    endingOverlay.classList.add('show');
    clearInterval(autoTimer);
}

// ---------- 15. 主流程触发 ----------
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

    // 严格等待视频100%下载完毕
    const waitForLoad = setInterval(() => {
        if (loadManager.isAllReady) {
            clearInterval(waitForLoad);
            startMain(name, month);
        }
    }, 300);

    // 极限保底
    setTimeout(() => {
        if (!loadManager.isAllReady) {
            clearInterval(waitForLoad);
            loadManager.isAllReady = true;
            startMain(name, month);
        }
    }, 30000); // QQ 浏览器极限容错 30 秒
});

// ---------- 16. 正式主界面（改为5秒） ----------
function startMain(name, month) {
    entryScreen.style.display = 'none';
    mainScreen.style.display = 'block';
    
    initBgParticles();
    generateParticles(titleGroups[0].text);
    animateText();

    video.muted = true;
    video.play().then(() => video.pause()).catch(()=>{});
    
    // 音乐自动播放（一进主界面自动取消静音）
    bgMusic.muted = false;
    bgMusic.play().catch(()=>{});

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
            video.muted = false;
            video.loop = true;
            video.play().then(() => staticBg.style.display = 'none').catch(() => { video.style.display = 'none'; });
            container.style.display = 'block'; // 释放悬浮祝福语
        }
    }, 5000); // 【核心修改】改为 5000 毫秒（5秒）
}

// ---------- 17. 页面启动（一打开就自动静音播放音乐） ----------
function preloadAll() {
    // 音乐从最开始就自动静音播放（用户一进来就激活了音乐通道）
    bgMusic.muted = true; 
    bgMusic.play().catch(()=>{});
    bgMusic.addEventListener('canplaythrough', () => { 
        loadManager.audioReady = true; 
        checkAllLoaded(); 
    });
    setTimeout(() => { if(!loadManager.audioReady) { loadManager.audioReady = true; checkAllLoaded(); } }, 8000);

    // 预生成悬浮祝福语
    preloadRandomWords();
}

// ---------- 18. 启动 ----------
resizeCanvas();
preloadAll();
