// ---------- 1. 生日祝福词汇（逐步显示） ----------
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

// ---------- 2. 逐步生成文字（不一次性铺满） ----------
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
        // 手机字号更小，保证竖屏不溢出
        word.style.fontSize = isMobile ? '12px' : '18px';

        word_box.classList.add('word-box');
        
        // 调整间距：为了让每段距离不要太远，大幅缩小了垂直偏移范围
        // 手机端范围更小
        let vhRange = isMobile ? [-8, 8] : [-15, 18]; 
        let vwRange = isMobile ? [5, 25] : [8, 35];

        word_box.style.setProperty("--margin-top", randomNum(vhRange[0], vhRange[1]) + 'vh');
        word_box.style.setProperty("--margin-left", randomNum(vwRange[0], vwRange[1]) + 'vw');
        word_box.style.setProperty("--animation-duration", randomNum(8, 20) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-5, 0) + 's'); // 随机延迟错开旋转

        word_box.appendChild(word);
        container.appendChild(word_box);

        index++;
        // 每隔 400ms 出现一个，逐步浮现
        setTimeout(appendWord, 400);
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
    // 生成 70 个粉色粒子
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.6, // 水平飘动速度
            vy: (Math.random() - 0.5) * 0.6, // 垂直飘动速度
            radius: Math.random() * 3 + 1,   // 粒子大小
            alpha: Math.random() * 0.6 + 0.3, // 透明度
            color: `hsla(340, 80%, 70%, ${Math.random() * 0.5 + 0.3})` // 粉红色系
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

        // 移动
        p.x += p.vx;
        p.y += p.vy;

        // 边界反弹，保证粒子一直在屏幕内
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
    initParticles();
});
initParticles();
drawParticles();

// ---------- 4. 文字定时切换逻辑 ----------
let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

setTimeout(function() {
    textone.innerHTML = '新的一岁，愿你闪闪发光';
    textone.style.color = '#E8F9FD';
    texttwo.style.color = '#E8F9FD';
    textthree.style.color = '#E8F9FD';
    texttwo.innerHTML = '';
    textthree.innerHTML = '万事皆可期待';
}, 28000);

setTimeout(function() {
    textone.innerHTML = '祝你生日快乐';
    texttwo.innerHTML = '不止今天';
    textthree.innerHTML = '而是未来每一天';
}, 112500);

// ---------- 5. 音乐自动播放解锁（点击屏幕取消静音） ----------
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
