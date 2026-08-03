// ---------- 1. 生日祝福词汇（保持旋转，不消失） ----------
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

// ---------- 2. 生成固定悬浮词（像最初的分布一样散开，但以中心为锚点） ----------
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
        // 手机端小字体，保证不拥挤
        word.style.fontSize = isMobile ? '12px' : '18px';

        word_box.classList.add('word-box');

        // --- 核心：“满天星”散射，绝不重叠 ---
        // 手机竖屏水平范围小，用 vw 控制，垂直范围大，用 vh
        let mt = randomNum(-30, 30) + 'vh'; // 上下散开 
        let ml = randomNum(-25, 25) + 'vw'; // 左右散开
        
        word_box.style.setProperty("--margin-top", mt);
        word_box.style.setProperty("--margin-left", ml);
        
        word_box.style.setProperty("--animation-duration", randomNum(8, 15) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-3, 0) + 's');

        word_box.appendChild(word);
        container.appendChild(word_box);
        index++;
        // 逐字浮现
        setTimeout(appendWord, 300);
    }
    appendWord();
}

// 首次加载生成，永不刷新
window.addEventListener('load', renderWords);

// ---------- 3. 按钮换文字（只换主标题，不碰悬浮词） ----------
// 准备三组标题文字
var titleGroups = [
    { one: "生日快乐", two: "愿你岁岁常欢愉", three: "年年皆胜意" },
    { one: "新的一岁，愿你闪闪发光", two: "", three: "万事皆可期待" },
    { one: "祝你生日快乐", two: "不止今天", three: "而是未来每一天" }
];
let currentTitleIndex = 0;

let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

document.getElementById('next-btn').addEventListener('click', function() {
    currentTitleIndex = (currentTitleIndex + 1) % titleGroups.length;
    let group = titleGroups[currentTitleIndex];
    textone.innerHTML = group.one;
    texttwo.innerHTML = group.two;
    textthree.innerHTML = group.three;
    
    // 为了每次点击都重新触发粉色淡入效果，重置动画
    textone.style.animation = 'none';
    texttwo.style.animation = 'none';
    textthree.style.animation = 'none';
    // 触发重绘后重新添加动画
    setTimeout(() => {
        textone.style.animation = '';
        texttwo.style.animation = '';
        textthree.style.animation = '';
    }, 50);
});

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

// ---------- 5. 音乐自动播放解锁 ----------
document.addEventListener('DOMContentLoaded', function() {
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
