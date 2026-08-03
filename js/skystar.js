// ---------- 1. 10组主标题 ----------
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

// ---------- 2. 公转祝福语（28句悬浮词） ----------
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

// ---------- 3. DOM 元素 ----------
const textCanvas = document.getElementById('text-canvas');
const textCtx = textCanvas.getContext('2d');
const particleCanvas = document.getElementById('particles-canvas');
const particleCtx = particleCanvas.getContext('2d');
const video = document.getElementById('videofilm');
const bgMusic = document.getElementById('bg-music');
const btn = document.getElementById('next-btn');
const container = document.querySelector('.container');
const overlay = document.getElementById('loading-overlay');
const staticBg = document.getElementById('static-bg');
const endingOverlay = document.getElementById('ending-overlay');

let W, H, particles = [], bgParticles = [];
let clickCount = 0;
let switchCount = 0; // 记录当前显示到第几句（0~9）
let isEndingShown = false;
const isMobile = window.innerWidth <= 600;

// ---------- 4. 适配尺寸 ----------
function resizeCanvas() {
    W = textCanvas.width = particleCanvas.width = window.innerWidth;
    H = textCanvas.height = particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

// ---------- 5. 极致粒子提取（强制 step = 1） ----------
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
    const step = 1; // 坚决不改：每个像素都采样
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

// ---------- 6. 生成主标题粒子 ----------
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
}

// ---------- 7. 动画循环（大号清晰粒子，无阴影） ----------
function animateText() {
    textCtx.clearRect(0, 0, W, H);
    const radius = isMobile ? 4.0 : 5.5; // 手机端 4px，保证清晰可见
    particles.forEach(p => {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            p.x += dx * 0.08; p.y += dy * 0.08;
        } else { p.x = p.tx; p.y = p.ty; }
        textCtx.beginPath(); textCtx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        textCtx.fillStyle = p.color; textCtx.fill();
    });
    requestAnimationFrame(animateText);
}

// ---------- 8. 背景小粒子 ----------
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

// ---------- 9. 【核心修复】提前预加载悬浮祝福语（隐藏状态） ----------
function preloadOrbitWords() {
    // 清空旧数据（如果有残留），但保持容器隐藏
    container.innerHTML = '';
    // 容器默认在HTML中已设置 display:none，这里不要改

    let index = 0;
    function appendWord() {
        if (index >= orbitWords.length) return;
        let w = orbitWords[index];
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w; 
        word.classList.add('word');
        word.style.fontSize = isMobile ? '12px' : '18px'; 
        word.style.color = '#FFB7C5';
        word_box.classList.add('word-box');
        
        let dist = randomNum(12, 28) + 'vw'; 
        let deg = (index * 15) + 'deg'; 
        let speed = randomNum(18, 28) + 's'; 
        let delay = (0.2 + index * 0.15) + 's'; 
        
        word_box.style.setProperty("--dist", dist); 
        word_box.style.setProperty("--deg", deg);
        word_box.style.setProperty("--speed", speed); 
        word_box.style.setProperty("--delay", delay);
        
        word_box.appendChild(word); 
        container.appendChild(word_box);
        index++;
        // 依然使用 300ms 间隔逐步生成，但因为是隐藏状态，用户感知不到
        setTimeout(appendWord, 300);
    }
    appendWord();
}

// ---------- 10. 触发切换与完结逻辑 ----------
function triggerSwitch() {
    if (isEndingShown) return;
    if (switchCount < titleGroups.length - 1) {
        switchCount++;
        generateParticles(titleGroups[switchCount].text);
    } else {
        showEnding();
    }
}

// ---------- 11. 完结页面 ----------
function showEnding() {
    if (isEndingShown) return;
    isEndingShown = true;
    endingOverlay.classList.add('show');
    btn.style.display = 'none';
    clearInterval(autoTimer);
}

// ---------- 12. 按钮交互（第4次触发视频+显示悬浮词） ----------
btn.addEventListener('click', function() {
    if (isEndingShown) return;
    if (bgMusic.muted) bgMusic.muted = false;

    clickCount++;
    triggerSwitch(); // 切换主标题粒子文字

    // 第4次点击时触发大招
    if (clickCount >= 3) { 
        // 1. 播放视频
        video.style.display = 'block';
        video.muted = false;
        video.play().then(() => {
            staticBg.style.display = 'none';
        }).catch(() => {
            video.style.display = 'none';
            staticBg.style.display = 'block';
        });

        // 2. 【关键】释放预先加载的悬浮祝福语！
        // 因为它们早已在后台建好，此刻只需解除隐藏，动画瞬间触发！
        container.style.display = 'block'; 
    }
});

// ---------- 13. 极速加载与自动切换 ----------
let autoTimer;

function preloadAll() {
    video.muted = true; video.load();
    video.play().then(() => video.pause()).catch(()=>{});

    initBgParticles();
    generateParticles(titleGroups[0].text);
    bgMusic.muted = true; bgMusic.play().catch(()=>{});

    // 【重点】立刻在后台预构建悬浮祝福语，但保持隐藏
    preloadOrbitWords();

    setTimeout(() => {
        overlay.classList.add('fade-out');
        setTimeout(() => { 
            overlay.style.display = 'none'; 
            btn.style.display = 'block'; 
        }, 800);
    }, 600);

    // 20秒自动切换下一句
    autoTimer = setInterval(() => {
        if (!isEndingShown) triggerSwitch();
    }, 20000);
}

// ---------- 14. 启动 ----------
resizeCanvas();
animateText(); 
preloadAll();
