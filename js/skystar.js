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

// ---------- 2. 生成悬浮词（拉大手机散射范围，绝不重叠） ----------
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
        // 手机字体再小一点，减少拥挤
        word.style.fontSize = isMobile ? '11px' : '16px';

        word_box.classList.add('word-box');
        
        // --- 核心修正：手机端拉大散射范围，从 25vw 扩至 35vw ---
        let mt = randomNum(-30, 30) + 'vh'; 
        let ml = isMobile ? randomNum(-35, 35) + 'vw' : randomNum(-40, 40) + 'vw';
        
        word_box.style.setProperty("--margin-top", mt);
        word_box.style.setProperty("--margin-left", ml);
        word_box.style.setProperty("--anim-speed", randomNum(8, 15) + 's');
        word_box.style.setProperty("--anim-delay", randomNum(-3, 0) + 's');

        word_box.appendChild(word);
        container.appendChild(word_box);
        index++;
        setTimeout(appendWord, 300);
    }
    appendWord();
}
window.addEventListener('load', renderWords);

// ---------- 3. 5组主标题安全切换逻辑 ----------
var titleGroups = [
    { one: "生日快乐", two: "愿你岁岁常欢愉", three: "年年皆胜意" },
    { one: "新的一岁，愿你闪闪发光", two: "万事皆可期待", three: "" },
    { one: "祝你生日快乐", two: "不止今天", three: "而是未来每一天" },
    { one: "愿你三冬暖", two: "愿你春不寒", three: "愿你天黑有灯" },
    { one: "愿你前程似锦", two: "愿你一生可爱", three: "一生无忧" }
];

let currentTitleIndex = 0;
let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

function switchTitle() {
    currentTitleIndex = (currentTitleIndex + 1) % titleGroups.length;
    let group = titleGroups[currentTitleIndex];
    
    // 直接换内容，确保如果 group 有值就显示，无值就显示空
    textone.innerHTML = group.one || '';
    texttwo.innerHTML = group.two || '';
    textthree.innerHTML = group.three || '';
    
    // 移除动画，然后再重新添加，强制触发“重新淡入”
    textone.style.animation = 'none';
    texttwo.style.animation = 'none';
    textthree.style.animation = 'none';
    // 强制浏览器重绘
    textone.offsetHeight; 
    texttwo.offsetHeight; 
    textthree.offsetHeight;
    // 恢复默认动画，使新文字浮现
    textone.style.animation = '';
    texttwo.style.animation = '';
    textthree.style.animation = '';
}

// 按钮点击切换
document.getElementById('next-btn').addEventListener('click', function() {
    switchTitle();
});

// 自动切换（每20秒自动换一组）
setInterval(switchTitle, 20000);

// ---------- 4. 粉色粒子特效 ----------
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * width, y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 3 + 1,
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

// ---------- 5. 强制加载视频 + 音乐播放解锁 ----------
document.addEventListener('DOMContentLoaded', function() {
    // 强制播放视频（应对某些手机浏览器）
    const video = document.querySelector('video');
    if (video) video.play().catch(() => {});
    
    const audio = document.querySelector('audio');
    if (audio) {
        const unmuteAudio = () => {
            if (audio.muted) { audio.muted = false; 
                document.removeEventListener('click', unmuteAudio);
                document.removeEventListener('touchstart', unmuteAudio); }
        };
        document.addEventListener('click', unmuteAudio);
        document.addEventListener('touchstart', unmuteAudio);
    }
});
