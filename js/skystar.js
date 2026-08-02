// 1. 将诗句替换为生日/祝福语
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
    var num = (Math.random() * (max - min + 1) + min).toFixed(2);
    return num;
}

function init() {
    let container = document.querySelector('.container');
    let f = document.createDocumentFragment();
    let isMobile = window.innerWidth <= 600;
    
    words.forEach(w => {
        let word_box = document.createElement('div');
        let word = document.createElement('div');
        word.innerText = w;
        word.classList.add('word');
        word.style.color = '#BAABDA';
        word.style.fontFamily = '楷体';
        word.style.fontSize = isMobile ? '14px' : '20px'; // 手机端字小一点
        
        word_box.classList.add('word-box');
        word_box.style.setProperty("--margin-top", randomNum(-40, 20) + 'vh');
        word_box.style.setProperty("--margin-left", randomNum(6, 35) + 'vw');
        word_box.style.setProperty("--animation-duration", randomNum(8, 20) + 's');
        word_box.style.setProperty("--animation-delay", randomNum(-20, 0) + 's');
        
        word_box.appendChild(word);
        f.appendChild(word_box);
    })
    container.appendChild(f);
}

window.addEventListener('load', init);

// ---------------- 文字定时切换逻辑 ----------------
let textone = document.querySelector('.textone').querySelector('h1');
let texttwo = document.querySelector('.texttwo').querySelector('h1');
let textthree = document.querySelector('.textthree').querySelector('h1');

// 28秒后切换
setTimeout(function() {
    textone.innerHTML = '新的一岁，愿你闪闪发光';
    textone.style.color = '#E8F9FD';
    texttwo.style.color = '#E8F9FD';
    textthree.style.color = '#E8F9FD';
    texttwo.innerHTML = ''; // 清空中间一行
    textthree.innerHTML = '万事皆可期待';
}, 28000);

// 112.5秒后切换
setTimeout(function() {
    textone.innerHTML = '祝你生日快乐';
    texttwo.innerHTML = '不止今天';
    textthree.innerHTML = '而是未来每一天';
}, 112500);

// ---------------- 解决手机自动播放音乐的技巧 ----------------
// 浏览器必须通过用户手势才能播放有声视频/音频
// 我们让页面加载时“静音自动播放”，用户第一次点击屏幕时自动“取消静音”
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.querySelector('audio');
    // 首次用户交互时，取消静音
    const unmuteAudio = () => {
        if (audio.muted) {
            audio.muted = false; // 声音出来了！
            // 移除监听器，只执行一次
            document.removeEventListener('click', unmuteAudio);
            document.removeEventListener('touchstart', unmuteAudio);
        }
    };
    document.addEventListener('click', unmuteAudio);
    document.addEventListener('touchstart', unmuteAudio);
});
