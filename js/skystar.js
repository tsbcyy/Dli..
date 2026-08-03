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

// 打乱数组（换页时洗牌）
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function renderWords() {
    let container = document.querySelector('.container');
    container.innerHTML = ''; 
    let isMobile = window.innerWidth <= 600;
    let shuffled = shuffleArray([...words]);
    let index = 0;

    function appendWord() {
        if (index >= shuffled.length) return;
        let w = shuffled[index];
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w;
        word.classList.add('word');
        word.style.fontSize = isMobile ? '11px' : '16px';

        word_box.classList.add('word-box');

        // --- 间距缩小到原来的一半 ---
        // 垂直偏移从 [-6, 6] 变 [-3, 3]
        let marginTop = randomNum(-3, 3) + 'vh';
        // 水平偏移从 [5, 25] 变 [-8, 8]（以中心为原点对称）
        let marginLeft = randomNum(-8, 8) + 'vw';
        
        word_box.style.setProperty("--margin-top", marginTop);
        word_box.style.setProperty("--margin-left", marginLeft);
        
        word_box.style.setProperty("--animation-duration", randomNum(8, 15) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-3, 0) + 's');

        word_box.appendChild(word);
        container.appendChild(word_box);
        index++;
        // 逐段显现（每 300ms 出现一句）
        setTimeout(appendWord, 300);
    }
    appendWord();
}

window.addEventListener('load', renderWords);

// 换页按钮：清空旧词，生成新词
document.getElementById('next-btn').addEventListener('click', function() {
    renderWords();
});

// 粉色粒子特效
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

// 主标题切换
let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

setTimeout(() => {
    textone.innerHTML = '新的一岁，愿你闪闪发光';
    texttwo.innerHTML = ''; 
    textthree.innerHTML = '万事皆可期待';
}, 25000);

setTimeout(() => {
    textone.innerHTML = '祝你生日快乐';
    texttwo.innerHTML = '不止今天';
    textthree.innerHTML = '而是未来每一天';
}, 80000);

// 音乐播放解锁
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
