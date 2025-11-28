// 单词数据库
const wordsDatabase = [
    // 1-2星：基础单词（简单）
    {
        word: "hello",
        phonetic: "[həˈləʊ]",
        type: "int.",
        meaning: "你好；喂",
        example: "Hello, how are you?",
        translation: "你好，你好吗？",
        rarity: 1
    },
    {
        word: "book",
        phonetic: "[bʊk]",
        type: "n.",
        meaning: "书；书籍",
        example: "I'm reading a book.",
        translation: "我正在读一本书。",
        rarity: 1
    },
    {
        word: "cat",
        phonetic: "[kæt]",
        type: "n.",
        meaning: "猫",
        example: "I have a cute cat.",
        translation: "我有一只可爱的猫。",
        rarity: 1
    },
    {
        word: "dog",
        phonetic: "[dɒɡ]",
        type: "n.",
        meaning: "狗",
        example: "The dog is barking.",
        translation: "这只狗在叫。",
        rarity: 1
    },
    {
        word: "apple",
        phonetic: "[ˈæpl]",
        type: "n.",
        meaning: "苹果",
        example: "An apple a day keeps the doctor away.",
        translation: "一天一个苹果，医生远离我。",
        rarity: 1
    },
    {
        word: "water",
        phonetic: "[ˈwɔːtə]",
        type: "n.",
        meaning: "水",
        example: "I need a glass of water.",
        translation: "我需要一杯水。",
        rarity: 2
    },
    {
        word: "happy",
        phonetic: "[ˈhæpi]",
        type: "adj.",
        meaning: "快乐的；幸福的",
        example: "She looks very happy today.",
        translation: "她今天看起来很开心。",
        rarity: 2
    },
    {
        word: "friend",
        phonetic: "[frend]",
        type: "n.",
        meaning: "朋友",
        example: "He is my best friend.",
        translation: "他是我最好的朋友。",
        rarity: 2
    },
    {
        word: "school",
        phonetic: "[skuːl]",
        type: "n.",
        meaning: "学校",
        example: "I go to school every day.",
        translation: "我每天去上学。",
        rarity: 2
    },
    {
        word: "love",
        phonetic: "[lʌv]",
        type: "v./n.",
        meaning: "爱；喜欢",
        example: "I love my family.",
        translation: "我爱我的家人。",
        rarity: 2
    },

    // 3星：常用单词（中等）
    {
        word: "important",
        phonetic: "[ɪmˈpɔːtnt]",
        type: "adj.",
        meaning: "重要的；重大的",
        example: "This is a very important meeting.",
        translation: "这是一个非常重要的会议。",
        rarity: 3
    },
    {
        word: "different",
        phonetic: "[ˈdɪfrənt]",
        type: "adj.",
        meaning: "不同的；各式各样的",
        example: "We have different opinions on this matter.",
        translation: "在这个问题上我们有不同的看法。",
        rarity: 3
    },
    {
        word: "beautiful",
        phonetic: "[ˈbjuːtɪfl]",
        type: "adj.",
        meaning: "美丽的；漂亮的",
        example: "She is a beautiful girl.",
        translation: "她是一个美丽的女孩。",
        rarity: 3
    },
    {
        word: "understand",
        phonetic: "[ˌʌndəˈstænd]",
        type: "v.",
        meaning: "理解；明白",
        example: "Do you understand what I mean?",
        translation: "你明白我的意思吗？",
        rarity: 3
    },
    {
        word: "necessary",
        phonetic: "[ˈnesəsəri]",
        type: "adj.",
        meaning: "必要的；必需的",
        example: "It is necessary to learn English.",
        translation: "学习英语是必要的。",
        rarity: 3
    },
    {
        word: "knowledge",
        phonetic: "[ˈnɒlɪdʒ]",
        type: "n.",
        meaning: "知识；学问",
        example: "Knowledge is power.",
        translation: "知识就是力量。",
        rarity: 3
    },
    {
        word: "experience",
        phonetic: "[ɪkˈspɪəriəns]",
        type: "n./v.",
        meaning: "经验；经历；体验",
        example: "She has rich working experience.",
        translation: "她有丰富的工作经验。",
        rarity: 3
    },
    {
        word: "challenge",
        phonetic: "[ˈtʃælɪndʒ]",
        type: "n./v.",
        meaning: "挑战；质疑",
        example: "This job is a big challenge for me.",
        translation: "这份工作对我来说是一个巨大的挑战。",
        rarity: 3
    },
    {
        word: "opportunity",
        phonetic: "[ˌɒpəˈtjuːnəti]",
        type: "n.",
        meaning: "机会；时机",
        example: "Don't miss this great opportunity.",
        translation: "不要错过这个好机会。",
        rarity: 3
    },
    {
        word: "develop",
        phonetic: "[dɪˈveləp]",
        type: "v.",
        meaning: "发展；开发；培养",
        example: "We need to develop new skills.",
        translation: "我们需要培养新技能。",
        rarity: 3
    },

    // 4星：进阶单词（中高级）
    {
        word: "sophisticated",
        phonetic: "[səˈfɪstɪkeɪtɪd]",
        type: "adj.",
        meaning: "复杂的；精致的；老练的",
        example: "This is a sophisticated piece of machinery.",
        translation: "这是一台精密的机器。",
        rarity: 4
    },
    {
        word: "inevitable",
        phonetic: "[ɪnˈevɪtəbl]",
        type: "adj.",
        meaning: "不可避免的；必然的",
        example: "Change is inevitable in life.",
        translation: "生活中变化是不可避免的。",
        rarity: 4
    },
    {
        word: "ambiguous",
        phonetic: "[æmˈbɪɡjuəs]",
        type: "adj.",
        meaning: "模棱两可的；含糊不清的",
        example: "His answer was ambiguous.",
        translation: "他的回答模棱两可。",
        rarity: 4
    },
    {
        word: "comprehensive",
        phonetic: "[ˌkɒmprɪˈhensɪv]",
        type: "adj.",
        meaning: "全面的；综合的",
        example: "We need a comprehensive solution.",
        translation: "我们需要一个全面的解决方案。",
        rarity: 4
    },
    {
        word: "demonstrate",
        phonetic: "[ˈdemənstreɪt]",
        type: "v.",
        meaning: "证明；展示；演示",
        example: "Let me demonstrate how it works.",
        translation: "让我演示一下它是如何工作的。",
        rarity: 4
    },
    {
        word: "enthusiasm",
        phonetic: "[ɪnˈθjuːziæzəm]",
        type: "n.",
        meaning: "热情；热忱",
        example: "She shows great enthusiasm for her work.",
        translation: "她对工作表现出极大的热情。",
        rarity: 4
    },
    {
        word: "fundamental",
        phonetic: "[ˌfʌndəˈmentl]",
        type: "adj.",
        meaning: "基本的；根本的",
        example: "These are fundamental principles.",
        translation: "这些是基本原则。",
        rarity: 4
    },
    {
        word: "accomplish",
        phonetic: "[əˈkʌmplɪʃ]",
        type: "v.",
        meaning: "完成；实现；达到",
        example: "We accomplished our goal.",
        translation: "我们完成了目标。",
        rarity: 4
    },

    // 5星：高级单词（困难）
    {
        word: "serendipity",
        phonetic: "[ˌserənˈdɪpəti]",
        type: "n.",
        meaning: "意外发现珍奇事物的本领；机缘巧合",
        example: "Meeting her was pure serendipity.",
        translation: "遇见她纯属机缘巧合。",
        rarity: 5
    },
    {
        word: "ephemeral",
        phonetic: "[ɪˈfemərəl]",
        type: "adj.",
        meaning: "短暂的；瞬息的",
        example: "Fame can be ephemeral.",
        translation: "名声可能是短暂的。",
        rarity: 5
    },
    {
        word: "ubiquitous",
        phonetic: "[juːˈbɪkwɪtəs]",
        type: "adj.",
        meaning: "无处不在的；普遍存在的",
        example: "Smartphones are ubiquitous nowadays.",
        translation: "如今智能手机无处不在。",
        rarity: 5
    },
    {
        word: "paradigm",
        phonetic: "[ˈpærədaɪm]",
        type: "n.",
        meaning: "范例；典范；模式",
        example: "This represents a paradigm shift.",
        translation: "这代表了范式转变。",
        rarity: 5
    },
    {
        word: "eloquent",
        phonetic: "[ˈeləkwənt]",
        type: "adj.",
        meaning: "雄辩的；有说服力的",
        example: "He gave an eloquent speech.",
        translation: "他发表了一场雄辩的演讲。",
        rarity: 5
    },
    {
        word: "meticulous",
        phonetic: "[məˈtɪkjələs]",
        type: "adj.",
        meaning: "一丝不苟的；极仔细的",
        example: "She is meticulous in her work.",
        translation: "她工作一丝不苟。",
        rarity: 5
    },
    {
        word: "resilient",
        phonetic: "[rɪˈzɪliənt]",
        type: "adj.",
        meaning: "有弹性的；能恢复的；适应力强的",
        example: "Children are often more resilient than adults.",
        translation: "孩子往往比成年人适应力更强。",
        rarity: 5
    },
    {
        word: "quintessential",
        phonetic: "[ˌkwɪntɪˈsenʃl]",
        type: "adj.",
        meaning: "典型的；精髓的",
        example: "He is the quintessential English gentleman.",
        translation: "他是典型的英国绅士。",
        rarity: 5
    }
];

// 导出数据
if (typeof module !== 'undefined' && module.exports) {
    module.exports = wordsDatabase;
}
