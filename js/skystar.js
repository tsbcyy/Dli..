// ---------- 1. 数据 ----------
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

var orbitWords = [
    '生日快乐', '万事胜意', '平安喜乐', '前程似锦', '岁岁常欢愉',
    '年年皆胜意', '未来可期', '所愿皆成真', '多喜乐，长安宁',
    '星光满载', '光芒万丈', '炙热与自由', '万事尽可期待',
    '诸事顺遂', '百事从欢', '岁岁年年', '万喜万般宜',
    '愿你三冬暖', '愿你春不寒', '永远热泪盈眶', '前程万里',
    '平安顺遂', '得偿所愿', '年少有为', '一生可爱',
    '一世无忧', '前程似锦', '喜乐长安'
];

function randomNum(min, max) {
    return (Math.random() * (max - min + 1) + min).toFixed(2);
}

// ---------- 2. DOM ----------
const textCanvas = document.getElementById('text-canvas');
const textCtx = textCanvas.getContext('2d');
const particleCanvas = document.getElementById('particles-canvas');
const particleCtx = particleCanvas.getContext('2d');
const video = document.getElementById('videofilm');
const bgMusic = document.getElementById('bg-music');
const btn = document.getElementById('next-btn');
const container = document.querySelector('.container');
const overlay = document.getElementById('loading-overlay');

let W, H, particles = [], bgParticles = [];
let currentTitleIndex = 0, clickCount = 0, isAnimationReady = false;
const isMobile = window.innerWidth <= 600;

// ---------- 3. 尺寸 ----------
function resizeCanvas() {
    W = textCanvas.width = particleCanvas.width = window.innerWidth;
    H = textCanvas.height = particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// ---------- 4. 提取粒子（手机优化步长，保持饱满尺寸2.5px） ----------
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
    // 手机用 step=3 保住性能，大屏用 step=2
    const step = isMobile ? 3 : 2; 
    for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
            const idx = (y * offCanvas.width + x) * 4;
            if (data[idx + 3] > 128) {
                points.push({ tx: (x / offCanvas.width) * W, ty: (y / offCanvas.height) * H });
            }
        }
    }
    return points;
}

// ---------- 5. 生成主标题 ----------
function generateParticles(text) {
    const newPoints = getTextPoints(text);
    while (particles.length < newPoints.length) {
        particles.push({
            x: Math.random() * W, y: Math.random() * H, tx: 0, ty: 0,
            color: `hsla(${330 + Math.random() * 30}, 80%, ${65 + Math.random() * 25}%, 0.9)`
        });
    }
    particles.splice(newPoints.length);
    particles.forEach((p, i) => {
        p.tx = newPoints[i].tx; p.ty = newPoints[i].ty;
        if (!p.animStart) { p.x = Math.random() * W; p.y = Math.random() * H; }
    });
    isAnimationReady = true;
}

// ---------- 6. 动画循环（饱满 2.5px，无阴影保性能） ----------
function animateText() {
    textCtx.clearRect(0, 0, W, H);
    particles.forEach(p => {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            p.x += dx * 0.08; p.y += dy * 0.08;
        } else { p.x = p.tx; p.y = p.ty; }
        // 明确要求：粒子尺寸不能缩小，锁定为 2.5px
        textCtx.beginPath(); textCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        textCtx.fillStyle = p.color; textCtx.fill();
    });
    requestAnimationFrame(animateText);
}

// ---------- 7. 背景小粒子 ----------
function initBgParticles() {
    bgParticles = [];
    for (let i = 0; i < 50; i++) {
        bgParticles.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
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

// ---------- 8. 公转祝福语 ----------
function renderOrbitWords() {
    container.innerHTML = ''; container.style.display = 'block';
    let index = 0;
    function appendWord() {
        if (index >= orbitWords.length) return;
        let w = orbitWords[index];
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w; word.classList.add('word');
        word.style.fontSize = isMobile ? '12px' : '18px'; word.style.color = '#FFB7C5';
        word_box.classList.add('word-box');
        let dist = randomNum(12, 28) + 'vw', deg = (index * 15) + 'deg';
        let speed = randomNum(18, 28) + 's', delay = (0.2 + index * 0.15) + 's';
        word_box.style.setProperty("--dist", dist); word_box.style.setProperty("--deg", deg);
        word_box.style.setProperty("--speed", speed); word_box.style.setProperty("--delay", delay);
        word_box.appendChild(word); container.appendChild(word_box);
        index++; setTimeout(appendWord, 300);
    }
    appendWord();
}

// ---------- 9. 按钮交互 ----------
function switchTitle() {
    currentTitleIndex = (currentTitleIndex + 1) % titleGroups.length;
    generateParticles(titleGroups[currentTitleIndex].text);
}
btn.addEventListener('click', function() {
    if (bgMusic.muted) bgMusic.muted = false;
    clickCount++; switchTitle();
    if (clickCount >= 3) {
        document.getElementById('static-bg').style.display = 'none';
        video.style.display = 'block'; video.muted = false;
        video.play().catch(()=>{});
        renderOrbitWords();
    }
});

// ---------- 10. 【核心】加载页预缓存逻辑 ----------
async function preloadAll() {
    try {
        // ① 提前预下载视频（静音播一下立即暂停，强制浏览器拉取缓存）
        video.muted = true;
        await video.play();
        video.pause(); 
        
        // ② 提前渲染背景粒子
        initBgParticles();
        
        // ③ 提前计算第一个主标题的粒子点阵（这样切换时秒出）
        generateParticles(titleGroups[0].text);
        
        // ④ 音频静音播放，保证媒体通道开启
        bgMusic.muted = true;
        bgMusic.play().catch(()=>{});
        
        // 模拟一个生成过程，给用户视觉缓冲（约 2 秒）
        setTimeout(() => {
            // 淡出加载页
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
                btn.style.display = 'block';
                // 取消音频静音（此时无声，等用户点屏幕/点按钮触发）
            }, 800);
        }, 2000);
        
    } catch (e) {
        // 意外失败也放行，不卡住用户
        overlay.style.display = 'none';
        btn.style.display = 'block';
    }
}

// ---------- 11. 启动 ----------
resizeCanvas();
// 主渲染线程即刻启动，因为文字在加载页里已经预计算好了
animateText();
// 开始预加载流程
preloadAll();
