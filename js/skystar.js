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

// ---------- 2. 背景词“逐步浮现”（加速，300ms一个） ----------
function init() {
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
        word.style.fontSize = isMobile ? '12px' : '18px';

        word_box.classList.add('word-box');
        let vhRange = isMobile ? [-6, 6] : [-12, 12]; // 更紧凑，不飘远
        let vwRange = isMobile ? [5, 25] : [8, 35];

        word_box.style.setProperty("--margin-top", randomNum(vhRange[0], vhRange[1]) + 'vh');
        word_box.style.setProperty("--margin-left", randomNum(vwRange[0], vwRange[1]) + 'vw');
        word_box.style.setProperty("--animation-duration", randomNum(8, 15) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-3, 0) + 's');

        word_box.appendChild(word);
        container.appendChild(word_box);
        index++;
        // 300毫秒出现一个，2秒内涌现完
        setTimeout(appendWord, 300);
    }
    appendWord();
}
window.addEventListener('load', init);

// ---------- 3. 粉色粒子特效 (Canvas) ----------
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles = [];

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            radius: Math.random() * 3 + 1,
            alpha: Math.random() * 0.6 + 0.3,
            color: `hsla(340, 80%, 70%, ${Math.random() * 0.5 + 0.3})`
        });
    }
}
function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
}
window.addEventListener('resize', initParticles);
initParticles();
drawParticles();

// ---------- 4. 主标题文字切换（严格控制在2分钟内 120s） ----------
let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

// 第一变：25秒时（缩短）
setTimeout(function() {
    textone.innerHTML = '新的一岁，愿你闪闪发光';
    texttwo.innerHTML = '';     // 清空中间
    textthree.innerHTML = '万事皆可期待';
}, 25000);

// 第二变：80秒时（缩短）
setTimeout(function() {
    textone.innerHTML = '祝你生日快乐';
    texttwo.innerHTML = '不止今天';
    textthree.innerHTML = '而是未来每一天';
}, 80000);

// 在 120秒（2分钟）时，确保所有的淡入动画都已完成，并且保持展示
// (无需额外动作，因为前面已经在 80 秒切换完了)

// ---------- 5. 音乐自动播放解锁 ----------
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.querySelector('audio');
    if (audio) {
        const unmuteAudio = () => {
            if (audio.muted) {
                audio.muted = false;
                document.removeEventListener('click', unmuteAudio);
                document.removeEventListener('touchstart', unmuteAudio);
            }
        };
        document.addEventListener('click', unmuteAudio);
        document.addEventListener('touchstart', unmuteAudio);
    }
});
