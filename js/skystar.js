// ---------- 1. 生日祝福词汇 ----------
var words = [
    '生日快乐', '万事胜意', '平安喜乐', '前程似锦', 
    '岁岁常欢愉', '年年皆胜意', '未来可期', '所愿皆成真',
    '多喜乐，长安宁', '星光满载', '光芒万丈', '炙热与自由',
    '万事尽可期待', '诸事顺遂', '百事从欢', '岁岁年年',
    '万喜万般宜', '愿你三冬暖', '愿你春不寒', '永远热泪盈眶',
    '前程万里', '平安顺遂', '得偿所愿', '年少有为',
    '一生可爱', '一世无忧', '前程似锦', '喜乐长安'
];

function randomNum(min, max) {
    return (Math.random() * (max - min + 1) + min).toFixed(2);
}

// ---------- 2. 核心：生成祝福词（保证均匀公转分布） ----------
function renderWords() {
    let container = document.querySelector('.container');
    let isMobile = window.innerWidth <= 600;
    let index = 0;

    function appendWord() {
        if (index >= words.length) return;
        let w = words[index];
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w;
        word.classList.add('word');
        // 手机端使用极小字号，确保不会互相重叠
        word.style.fontSize = isMobile ? '11px' : '16px';

        word_box.classList.add('word-box');
        
        // 使用 translate 公转的核心设置：
        // 1. 定义不同的半径 (dist) 和初始角度，形成错落轨道
        let dist = randomNum(15, 35) + 'vw'; 
        // 2. 每次生成增加 20deg 初始相位差，保证散开
        let initDeg = (index * 20) + 'deg'; 
        
        word_box.style.setProperty("--dist", dist);
        // 传递旋转角度到 CSS 变量（利用 CSS calc）
        word_box.style.setProperty("--init-deg", initDeg);
        word_box.style.setProperty("--speed", randomNum(12, 20) + 's');
        word_box.style.setProperty("--delay", randomNum(-3, 0) + 's');

        word_box.appendChild(word);
        container.appendChild(word_box);
        index++;
        // 逐步浮现（每 200ms 浮现一句）
        setTimeout(appendWord, 200);
    }
    appendWord();
}

// ---------- 3. 交互逻辑：前 3 次切换主标题，第 4 次放飞满天星 ----------
var titleGroups = [
    { one: "生日快乐", two: "愿你岁岁常欢愉", three: "年年皆胜意" },
    { one: "新的一岁，愿你闪闪发光", two: "万事皆可期待", three: "" },
    { one: "祝你生日快乐", two: "不止今天", three: "而是未来每一天" },
    { one: "愿你三冬暖", two: "愿你春不寒", three: "愿你天黑有灯" },
    { one: "愿你前程似锦", two: "愿你一生可爱", three: "一生无忧" }
];

let currentTitleIndex = 0;
let clickCount = 0; // 计数器

let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

function switchTitle() {
    currentTitleIndex = (currentTitleIndex + 1) % titleGroups.length;
    let group = titleGroups[currentTitleIndex];
    
    textone.innerHTML = group.one || '';
    texttwo.innerHTML = group.two || '';
    textthree.innerHTML = group.three || '';
    
    // 重置淡入动画
    textone.style.animation = 'none';
    texttwo.style.animation = 'none';
    textthree.style.animation = 'none';
    textone.offsetHeight; texttwo.offsetHeight; textthree.offsetHeight; 
    textone.style.animation = '';
    texttwo.style.animation = '';
    textthree.style.animation = '';
}

document.getElementById('next-btn').addEventListener('click', function() {
    // 第一步：先切换标题
    switchTitle();
    clickCount++;

    // 第二步：点击 3 次后（即第 4 次点击时），触发展开全部效果
    if (clickCount >= 3) {
        // 1. 播放背景视频
        const video = document.getElementById('videofilm');
        video.style.display = 'block';
        video.play().catch(() => {}); // 强制播放

        // 2. 播放背景音乐
        const audio = document.querySelector('audio');
        audio.style.display = 'block';
        audio.muted = false;
        audio.play().catch(() => {});

        // 3. 绽放满天星悬浮祝福词
        const container = document.querySelector('.container');
        container.style.display = 'block';
        renderWords(); // 生成并逐步浮现
    }
});

// ---------- 4. 粉色粒子特效（一直存在，当作基础背景） ----------
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * width, y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
            radius: Math.random() * 2 + 1,
            color: `hsla(340, 80%, 70%, ${Math.random() * 0.5 + 0.3})`
        });
    }
}
function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
}
window.addEventListener('resize', initParticles);
initParticles(); drawParticles();
