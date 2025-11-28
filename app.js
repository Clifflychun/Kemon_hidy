// 应用状态
const appState = {
    todayCount: 0,
    totalCount: 0,
    learnedWords: new Set(),
    soundEnabled: true,
    currentWord: null,
    difficulty: 'medium'
};

// DOM 元素
const elements = {
    gachaButton: document.getElementById('gachaButton'),
    screenContent: document.getElementById('screenContent'),
    cardDetail: document.getElementById('cardDetail'),
    cardContainer: document.getElementById('cardContainer'),
    todayCount: document.getElementById('todayCount'),
    totalCount: document.getElementById('totalCount'),
    masteryRate: document.getElementById('masteryRate'),
    soundToggle: document.getElementById('soundToggle'),
    difficultySelect: document.getElementById('difficultySelect'),
    slotLight: document.querySelector('.slot-light')
};

// 初始化
function init() {
    // 加载本地存储数据
    loadFromLocalStorage();
    
    // 更新统计
    updateStats();
    
    // 绑定事件
    bindEvents();
    
    // 创建背景粒子
    createParticles();
    
    console.log('应用初始化完成');
}

// 绑定事件
function bindEvents() {
    // 抽卡按钮
    elements.gachaButton.addEventListener('click', handleGacha);
    
    // 音效切换
    elements.soundToggle.addEventListener('click', toggleSound);
    
    // 难度选择
    elements.difficultySelect.addEventListener('change', (e) => {
        appState.difficulty = e.target.value;
        showMessage('难度已切换到：' + e.target.options[e.target.selectedIndex].text);
    });
    
    // 卡片操作按钮
    document.getElementById('btnKnow').addEventListener('click', () => handleWordAction('know'));
    document.getElementById('btnLearn').addEventListener('click', () => handleWordAction('learn'));
    document.getElementById('btnNext').addEventListener('click', handleGacha);
}

// 处理抽卡
function handleGacha() {
    // 防止连续点击
    if (elements.gachaButton.classList.contains('spinning')) {
        return;
    }
    
    // 播放音效
    playSound('gacha');
    
    // 按钮动画
    elements.gachaButton.classList.add('spinning');
    
    // 显示加载状态
    showMessage('🎰 抽卡中...');
    
    // 出口灯光效果
    elements.slotLight.classList.add('active');
    
    // 模拟抽卡延迟
    setTimeout(() => {
        const word = drawWord();
        displayWord(word);
        
        // 更新统计
        appState.todayCount++;
        appState.totalCount++;
        updateStats();
        
        // 保存数据
        saveToLocalStorage();
        
        // 移除动画
        elements.gachaButton.classList.remove('spinning');
        setTimeout(() => {
            elements.slotLight.classList.remove('active');
        }, 1000);
        
        // 播放成功音效
        playSound('success');
        
        // 创建庆祝粒子
        createCelebrationParticles(word.rarity);
        
    }, 1000);
}

// 抽取单词
function drawWord() {
    // 根据难度筛选单词
    let filteredWords = wordsDatabase;
    
    switch(appState.difficulty) {
        case 'easy':
            filteredWords = wordsDatabase.filter(w => w.rarity <= 3);
            break;
        case 'medium':
            filteredWords = wordsDatabase.filter(w => w.rarity >= 3 && w.rarity <= 4);
            break;
        case 'hard':
            filteredWords = wordsDatabase.filter(w => w.rarity >= 4);
            break;
    }
    
    // 随机抽取
    const randomIndex = Math.floor(Math.random() * filteredWords.length);
    const word = filteredWords[randomIndex];
    
    appState.currentWord = word;
    return word;
}

// 显示单词
function displayWord(word) {
    // 更新卡片内容
    const rarityStars = '⭐'.repeat(word.rarity);
    document.getElementById('cardRarity').textContent = rarityStars;
    document.getElementById('cardRarity').className = `card-rarity rarity-${word.rarity}`;
    
    document.getElementById('cardWord').textContent = word.word;
    document.getElementById('cardPhonetic').textContent = word.phonetic;
    document.getElementById('cardType').textContent = word.type;
    document.getElementById('cardMeaning').textContent = word.meaning;
    document.getElementById('cardExample').textContent = word.example;
    document.getElementById('cardTranslation').textContent = word.translation;
    
    // 显示卡片
    elements.cardDetail.style.display = 'block';
    
    // 更新显示屏
    showMessage(`✨ 抽到了 ${word.rarity} 星单词！`);
}

// 显示消息
function showMessage(message) {
    elements.screenContent.innerHTML = `
        <p class="welcome-text">${message}</p>
    `;
}

// 处理单词操作
function handleWordAction(action) {
    if (!appState.currentWord) return;
    
    const word = appState.currentWord;
    
    switch(action) {
        case 'know':
            appState.learnedWords.add(word.word);
            showMessage('✅ 已标记为认识！');
            playSound('correct');
            break;
        case 'learn':
            showMessage('📚 继续加油学习！');
            playSound('learn');
            break;
    }
    
    updateStats();
    saveToLocalStorage();
}

// 更新统计
function updateStats() {
    elements.todayCount.textContent = appState.todayCount;
    elements.totalCount.textContent = wordsDatabase.length;
    
    const masteryRate = appState.learnedWords.size > 0 
        ? Math.round((appState.learnedWords.size / wordsDatabase.length) * 100) 
        : 0;
    elements.masteryRate.textContent = masteryRate + '%';
}

// 切换音效
function toggleSound() {
    appState.soundEnabled = !appState.soundEnabled;
    elements.soundToggle.textContent = appState.soundEnabled ? '🔊 音效开' : '🔇 音效关';
    showMessage(appState.soundEnabled ? '已开启音效' : '已关闭音效');
}

// 播放音效（使用 Web Audio API 模拟）
function playSound(type) {
    if (!appState.soundEnabled) return;
    
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'gacha':
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'success':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'correct':
                oscillator.frequency.value = 1000;
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
            case 'learn':
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
        }
    } catch(e) {
        console.log('音效播放失败:', e);
    }
}

// 创建背景粒子
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.style.animationDuration = (3 + Math.random() * 2) + 's';
            particlesContainer.appendChild(particle);
            
            // 移除旧粒子
            setTimeout(() => {
                particle.remove();
            }, 6000);
        }, i * 200);
    }
    
    // 持续创建粒子
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
        document.getElementById('particles').appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }, 1000);
}

// 创建庆祝粒子
function createCelebrationParticles(rarity) {
    const colors = {
        1: '#95a5a6',
        2: '#27ae60',
        3: '#3498db',
        4: '#9b59b6',
        5: '#f39c12'
    };
    
    const color = colors[rarity] || '#ffffff';
    const particlesContainer = document.getElementById('particles');
    
    // 创建庆祝粒子
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.width = '10px';
            particle.style.height = '10px';
            particle.style.borderRadius = '50%';
            particle.style.background = color;
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '1000';
            
            const angle = (Math.PI * 2 * i) / 30;
            const velocity = 5 + Math.random() * 5;
            const tx = Math.cos(angle) * velocity * 20;
            const ty = Math.sin(angle) * velocity * 20;
            
            particle.style.animation = `explode 1s ease-out forwards`;
            particle.style.setProperty('--tx', tx + 'px');
            particle.style.setProperty('--ty', ty + 'px');
            
            particlesContainer.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }, i * 10);
    }
}

// 添加爆炸动画
const style = document.createElement('style');
style.textContent = `
    @keyframes explode {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 本地存储
function saveToLocalStorage() {
    const data = {
        todayCount: appState.todayCount,
        totalCount: appState.totalCount,
        learnedWords: Array.from(appState.learnedWords),
        lastVisit: new Date().toDateString()
    };
    localStorage.setItem('wordGachaData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('wordGachaData');
    if (saved) {
        const data = JSON.parse(saved);
        
        // 检查是否是今天
        const today = new Date().toDateString();
        if (data.lastVisit === today) {
            appState.todayCount = data.todayCount || 0;
        } else {
            appState.todayCount = 0;
        }
        
        appState.totalCount = data.totalCount || 0;
        appState.learnedWords = new Set(data.learnedWords || []);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
