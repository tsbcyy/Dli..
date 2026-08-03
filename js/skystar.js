// ---------- 1. 设置 5 组主标题（支持多行换行） ----------
const titleGroups = [
    { text: "生日快乐\n愿你岁岁常欢愉\n年年皆胜意" },
    { text: "新的一岁，愿你闪闪发光\n万事皆可期待" },
    { text: "祝你生日快乐\n不止今天\n而是未来每一天" },
    { text: "愿你三冬暖\n愿你春不寒\n愿你天黑有灯" },
    { text: "愿你前程似锦\n愿你一生可爱\n一生无忧" }
];

// ---------- 2. 获取 DOM 节点 ----------
const textCanvas = document.getElementById('text-canvas');
const textCtx = textCanvas.getContext('2d');
const particleCanvas = document.getElementById('particles-canvas');
const particleCtx = particleCanvas.getContext('2d');
const video = document.getElementById('videofilm');
const bgMusic = document.getElementById('bg-music');
const btn = document.getElementById('next-btn');

let W, H;
let particles = [];
let targetPoints = [];
let currentTitleIndex = 0;
let clickCount = 0;
let isAnimationReady = false;

// ---------- 3. 尺寸适配函数 ----------
function resizeCanvas() {
    W = textCanvas.width = particleCanvas.width = window.innerWidth;
    H = textCanvas.height = particleCanvas.height = window.innerHeight;
}
window.addEventListener('resize', () => {
    resizeCanvas();
    if (isAnimationReady) generateParticles(titleGroups[currentTitleIndex].text);
});

// ---------- 4. 文字点阵提取器 ----------
function getTextPoints(text) {
    const fontSize = Math.min(W * 0.09, 45); // 手机 9vw，大屏 45px
    const lineHeight = fontSize * 1.3;
    const lines = text.split('\n');
    
    // 离屏 Canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = W * 0.9;
    offCanvas.height = H * 0.6;
    const offCtx = offCanvas.getContext('2d');
    offCtx.fillStyle = '#fff';
    offCtx.font = `${fontSize}px '楷体', 'KaiTi', serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';

    // 逐行绘制
    const startY = (offCanvas.height - lines.length * lineHeight) / 2 + lineHeight / 2;
    lines.forEach((line, index) => {
        offCtx.fillText(line, offCanvas.width / 2, startY + index * lineHeight);
    });

    const imageData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
    const data = imageData.data;
    const points = [];
    const step = 3; // 步长 3，手机端粒子数量均衡，不卡顿
    for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
            const idx = (y * offCanvas.width + x) * 4;
            if (data[idx + 3] > 128) {
                // 将坐标映射回真实屏幕
                const tx = (x / offCanvas.width) * W;
                const ty = (y / offCanvas.height) * H;
                points.push({ tx, ty });
            }
        }
    }
    return points;
}

// ---------- 5. 生成并过渡粒子（切换时触发） ----------
function generateParticles(text) {
    const newPoints = getTextPoints(text);
    targetPoints = newPoints;

    // 补齐或减少粒子数量
    while (particles.length < newPoints.length) {
        particles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            tx: 0,
            ty: 0,
            // 粉红色调渐变
            color: `hsla(${330 + Math.random() * 30}, 80%, ${60 + Math.random() * 30}%, 0.9)`
        });
    }
    // 删掉多余的粒子
    particles.splice(newPoints.length);

    // 为每个粒子分配目标位置，并加上随机延迟（形成“漂移聚拢”效果）
    particles.forEach((p, i) => {
        p.tx = newPoints[i].tx;
        p.ty = newPoints[i].ty;
        // 添加随机偏移起始点，产生“从四面八方聚集”或“向外消散”的粒子特效
        if (!p.animStart) {
            p.x = Math.random() * W;
            p.y = Math.random() * H;
        }
        p.delay = Math.random() * 0.5; // 0~0.5秒延迟
        p.speed = 0.05 + Math.random() * 0.08; // 移动速度
        p.progress = 0;
    });
    isAnimationReady = true;
}

// ---------- 6. 动画循环（粒子主标题） ----------
function animateText() {
    textCtx.clearRect(0, 0, W, H);
    let allDone = true;
    
    particles.forEach(p => {
        // 缓动逼近目标 (Ease Out)
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist > 0.5) {
            p.x += dx * 0.08;
            p.y += dy * 0.08;
            allDone = false;
        } else {
            p.x = p.tx;
            p.y = p.ty;
        }

        // 绘制粒子（加一点发光效果）
        textCtx.beginPath();
        textCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        textCtx.shadowColor = '#FFB7C5';
        textCtx.shadowBlur = 10;
        textCtx.fillStyle = p.color;
        textCtx.fill();
    });
    
    requestAnimationFrame(animateText);
}

// ---------- 7. 漂浮粉色小粒子（背景点缀） ----------
function initBgParticles() {
    const bgParticles = [];
    for (let i = 0; i < 50; i++) {
        bgParticles.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            r: Math.random() * 2 + 1,
            color: `hsla(340, 80%, 70%, ${Math.random() * 0.4 + 0.2})`
        });
    }
    function drawBg() {
        particleCtx.clearRect(0, 0, W, H);
        bgParticles.forEach(p => {
            particleCtx.beginPath();
            particleCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            particleCtx.fillStyle = p.color;
            particleCtx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > W) p.vx *= -1;
            if (p.y < 0 || p.y > H) p.vy *= -1;
        });
        requestAnimationFrame(drawBg);
    }
    drawBg();
}

// ---------- 8. 按钮逻辑：前 3 次切标题，第 4 次换背景+音乐 ----------
function switchTitle() {
    currentTitleIndex = (currentTitleIndex + 1) % titleGroups.length;
    generateParticles(titleGroups[currentTitleIndex].text);
}

btn.addEventListener('click', function() {
    clickCount++;
    switchTitle(); // 切换文字粒子

    // 前 3 次（点击1,2,3）只切换标题，第 4 次（点击4）触发背景
    if (clickCount >= 3) { 
        // A. 隐藏静态背景图
        document.getElementById('static-bg').style.display = 'none';
        
        // B. 显示并强制播放视频（用户手势下一定成功）
        video.style.display = 'block';
        video.play().catch(() => {});
        
        // C. 播放音乐
        bgMusic.style.display = 'block';
        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
        
        // 为防止某些手机仍静音，设置一个超时取消静音（可选）
        setTimeout(() => { bgMusic.muted = false; }, 200);
    }
});

// ---------- 9. 初始化启动 ----------
resizeCanvas();
initBgParticles();
// 首次加载显示第一组标题
generateParticles(titleGroups[0].text);
animateText();
