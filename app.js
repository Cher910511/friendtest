// ================================================
// 易璐全国统一考试 — 题库
// 所有题目中的"易璐"是固定考试对象
// ================================================
const QUESTION_POOL = [
  {
    q: '易璐如果说出"随便你"，那这句话意味着什么？',
    options: [
      '真的不知道怎么选，你来抉择吧',
      '你敢自己选你死定了',
      '不想和你一起所以都行吧',
      '不知道，不想猜（宝子你还要这段友谊吗）',
    ],
  },
  {
    type: 'image',
    q: '易璐近期最爱用的是下面哪个人物的表情包？',
    options: [
      'images/friendtest-1.jpg',
      'images/friendtest-2.jpg',
      'images/friendtest-3.jpg',
      'images/friendtest-4.jpg',
    ],
    captions: [
      '一个圆润的胖小孩，看起来还挺可爱的',
      'man！牢大我们想你了#曼巴精神',
      '可爱的吉伊宝宝！！妈妈爱你',
      '奶龙世一萌。不给赎金就撕票',
    ],
  },
  {
    q: '当易璐说"马上到"的时候，她实际上在干嘛？',
    options: [
      '已经在路上了，真的快到了',
      '谁管你，还躺在床上玩手机',
      '完全忘了这回事，刚想起来，就这记性怎么的',
      '刚出门，下楼ing',
    ],
  },
  {
    type: 'image',
    q: '易璐的手机相册里，占比最多的是什么？',
    options: [
      'images/friendtest-9.jpg',
      'images/friendtest-10.jpg',
      'images/friendtest-11.jpg',
      'images/friendtest-12.jpg',
    ],
    captions: [
      '美照',
      '表情包',
      '美食',
      '风景',
    ],
  },
  {
    q: '易璐的周末日常，最接近以下哪种描述？',
    options: [
      '睡到自然醒，然后出门吃饭',
      '约饭组局，社交达人',
      '突然消失，谁也不知道她在干嘛',
      '早起健身，自律的小姐姐一枚',
    ],
  },
  {
    type: 'image',
    q: '易璐近期最爱喝的是下面哪个品牌的饮品？',
    options: [
      'images/friendtest-5.jpg',
      'images/friendtest-6.jpg',
      'images/friendtest-7.jpg',
      'images/friendtest-8.jpg',
    ],
    captions: [
      '丝绒拿铁，纵享丝滑～',
      '蜜瓜摇摇冰，太清爽太夏天了吧！',
      '点门永存！！',
      '听了你这句话我真是醍醐灌顶 如沐春风 高山流水 伯牙绝弦了',
    ],
  },
  {
    q: '易璐绝对不吃的是以下哪个食物？',
    options: [
      '全都不吃（好多事的一个入！）',
      '葱',
      '姜',
      '蒜',
      '香菜',
    ],
  },
  {
    q: '以下哪个是易璐最爱玩的游戏？',
    options: [
      '某不知名需要看很多广告的小程序游戏',
      '无畏契约',
      '王者农药',
      '和平精英',
    ],
  },
  {
    type: 'trap',
    q: '本网页的创作者在易璐心目中的形象是？',
    options: [
      '举世无双、才华横溢、不仅长得好看还贴心做网页的神仙闺闺',
      '能够容忍她各种挑食行为的当代活菩萨',
      '观察细致入微、体贴暖心的好朋友',
      '以上选项皆为客观事实，不选将导致整个答题系统当场崩溃',
    ],
  },
]

// ================================================
// 等级表
// ================================================
const RANK_TABLE = [
  { min:0,  max:29, rank:'塑料友谊',   color:'#9e9e9e', seal:'不合格', comment:'你确定你跟易璐认识？<br>建议重新认识一下，从头开始做朋友。' },
  { min:30, max:49, rank:'点赞之交',   color:'#f57c00', seal:'勉强',   comment:'你大概只了解易璐的朋友圈人设。<br>多约几次饭，还有救！' },
  { min:50, max:69, rank:'饭搭子级别', color:'#2e7d32', seal:'合格',   comment:'你们可以愉快地约饭，但深交还需努力。<br>已击败全国 50% 的易璐好友！' },
  { min:70, max:84, rank:'铁杆好友',   color:'#1565c0', seal:'良好',   comment:'你是易璐为数不多能借钱的朋友之一。<br>珍惜这段友谊，它经过了考试的检验！' },
  { min:85, max:99, rank:'灵魂伴侣',   color:'#6a1b9a', seal:'优秀',   comment:'你比易璐本人还了解易璐！<br>你们上辈子可能是双胞胎。' },
  { min:100,max:100,rank:'你就是易璐本人',color:'#8b0000',seal:'满分',comment:'坦白吧，你就是易璐自己登录来答题的。<br>否则不可能全对！' },
]

// ================================================
// Vue App
// ================================================
const { createApp, ref, computed, watch } = Vue

createApp({
  setup() {
    const stage = ref('cover')
    const takerName = ref('')          // 考生姓名（做题人的名字）

    const currentIdx = ref(0)
    const answers = ref([])
    const questions = ref([])
    const correctIdx = ref([])
    const score = ref(0)
    const trapFled = ref([])
    const STORAGE_KEY = 'yilu_exam_results'
    const results = ref(loadResults())  // 历史成绩
    const lastTaker = ref('')

    function loadResults() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
      catch (_) { return [] }
    }
    function saveResults() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(results.value))
    }

    // ---- 排行榜（按分数降序） ----
    const resultsSorted = computed(() => {
      return [...results.value].sort((a, b) => b.score - a.score)
    })

    // ---- 每题统计 ----
    const questionStats = computed(() => {
      return QUESTION_POOL.map((q, qi) => {
        const dist = new Array(q.options.length).fill(0)
        results.value.forEach(r => {
          if (r.answers[qi] !== undefined && r.answers[qi] >= 0) {
            dist[r.answers[qi]]++
          }
        })
        return { q: q.q, dist, total: dist.reduce((s, v) => s + v, 0), correctIdx: 0 }
      })
    })

    // ---- 当前题目 ----
    const currentQuestion = computed(() => {
      return questions.value[currentIdx.value] || { q: '', options: [] }
    })

    // ---- 等级 ----
    const rankInfo = computed(() => {
      return RANK_TABLE.find(r => score.value >= r.min && score.value <= r.max)
    })

    // ---- 切换页面 / 题目时滚到顶部 ----
    watch(stage, () => { window.scrollTo(0, 0) })
    watch(currentIdx, () => { window.scrollTo(0, 0) })

    // ---- 开始考试 ----
    function startQuiz() {
      const name = takerName.value.trim()
      if (!name) return
      loadQuestions()
      stage.value = 'quiz'
    }

    // ---- 加载题目（打乱顺序 + 打乱选项，记录正确答案） ----
    function loadQuestions() {
      const correctIndices = []
      const shuffled = [...QUESTION_POOL]
        .map((poolQ) => {
          // 陷阱题不洗牌，保持选项顺序
          if (poolQ.type === 'trap') {
            correctIndices.push(0) // 正确答案始终在位置 0
            return { ...poolQ }
          }
          const correctText = poolQ.options[0]
          const indices = poolQ.options.map((_, i) => i)
          const order = indices.sort(() => Math.random() - 0.5)
          const newOptions = order.map(i => poolQ.options[i])
          const newCaptions = poolQ.captions ? order.map(i => poolQ.captions[i]) : undefined
          correctIndices.push(newOptions.indexOf(correctText))
          return { q: poolQ.q, options: newOptions, type: poolQ.type, captions: newCaptions }
        })
      questions.value = shuffled
      correctIdx.value = correctIndices
      currentIdx.value = 0
      answers.value = new Array(shuffled.length).fill(-1)
      score.value = 0
    }

    // ---- 陷阱题：点 A 选中，点 B/C/D 只让被点的消失 ----
    function handleTrapClick(oi) {
      if (oi === 0) {
        answers.value[currentIdx.value] = oi
      } else {
        if (!trapFled.value.includes(oi)) {
          trapFled.value = [...trapFled.value, oi]
        }
      }
    }

    // ---- 导航 ----
    function prevQ() {
      if (currentIdx.value > 0) { currentIdx.value--; trapFled.value = [] }
    }
    function nextQ() {
      if (currentIdx.value < questions.value.length - 1) { currentIdx.value++; trapFled.value = [] }
    }

    // ---- 交卷 ----
    function submitExam() {
      let correctCount = 0
      answers.value.forEach((userAns, qi) => {
        if (userAns === correctIdx.value[qi]) correctCount++
      })
      score.value = Math.round((correctCount / questions.value.length) * 100)
      // 保存成绩
      const now = new Date()
      const timeStr = `${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`
      results.value.push({
        name: takerName.value,
        score: score.value,
        answers: [...answers.value],
        rankInfo: RANK_TABLE.find(r => score.value >= r.min && score.value <= r.max),
        time: timeStr,
      })
      if (results.value.length > 50) results.value = results.value.slice(-50)
      saveResults()
      lastTaker.value = takerName.value
      stage.value = 'cert'
    }

    // ---- 再考一次 ----
    function retry() {
      loadQuestions()
      stage.value = 'quiz'
    }

    // ---- 分享 ----
    function shareCert() {
      if (navigator.share) {
        navigator.share({
          title: '「易璐全国统一考试」朋友鉴定证书',
          text: `我在易璐全国统一考试中测出了「${rankInfo.value.rank}」等级，你也来测测对易璐有多了解！`,
          url: window.location.href,
        }).catch(() => {})
      } else {
        window.print()
      }
    }

    // ---- 清除统计 ----
    function clearStats() {
      if (confirm('确定要清空所有考试成绩记录吗？')) {
        results.value = []
        saveResults()
      }
    }

    // ---- 暗门：三击徽章进入统计 ----
    let tapCount = 0
    let tapTimer = null
    function secretTap() {
      tapCount++
      if (tapCount >= 3) {
        tapCount = 0
        clearTimeout(tapTimer)
        stage.value = 'stats'
        return
      }
      clearTimeout(tapTimer)
      tapTimer = setTimeout(() => { tapCount = 0 }, 1500)
    }

    // ---- 中文数字 ----
    const CN_NUMS = ['零','一','二','三','四','五','六','七','八','九','十']
    function toChineseNum(n) {
      if (n <= 10) return CN_NUMS[n]
      if (n < 20) return '十' + (n % 10 === 0 ? '' : CN_NUMS[n % 10])
      if (n < 30) return '二十' + (n % 10 === 0 ? '' : CN_NUMS[n % 10])
      return String(n)
    }

    return {
      stage, takerName,
      currentIdx, answers, questions, score,
      currentQuestion, rankInfo, trapFled,
      results, resultsSorted, questionStats, lastTaker,
      startQuiz, prevQ, nextQ, submitExam,
      retry, shareCert, toChineseNum, clearStats,
      secretTap, handleTrapClick,
    }
  }
}).mount('#app')
