let allQuestions = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;

async function loadQuestions() {
  const response = await fetch("题库.json");
  const data = await response.json();

  const single = shuffle(data.single_choice).slice(0, 20);
  const multiple = shuffle(data.multiple_choice).slice(0, 10);
  const judge = shuffle(data.judgment).slice(0, 10);

  allQuestions = [...single, ...multiple, ...judge];
  currentQuestions = shuffle(allQuestions);
  currentIndex = 0;
  score = 0;
  showQuestion();
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  const container = document.getElementById("question-container");
  const result = document.getElementById("result");
  result.innerHTML = "";

  if (currentIndex >= currentQuestions.length) {
    container.innerHTML = `<p>你已完成本套题目！🎉</p>
      <p>总得分：${score}/${currentQuestions.length}</p>
      <button onclick="loadQuestions()">再来一套</button>`;
    document.getElementById("submit-btn").style.display = "none";
    return;
  }

  const q = currentQuestions[currentIndex];
  let optionsHTML = "";

  if (Array.isArray(q.options)) {
    q.options.forEach((opt, i) => {
      const optId = `opt-${i}`;
      const inputType = q.answer.length > 1 ? "checkbox" : "radio";
      optionsHTML += `
        <label>
          <input type="${inputType}" name="option" value="${opt.charAt(0)}"> ${opt}
        </label>`;
    });
  }

  container.innerHTML = `
    <div class="question">
      <p><b>第 ${currentIndex + 1} 题：</b>${q.question}</p>
      <div class="options">${optionsHTML}</div>
      <div id="feedback" class="feedback"></div>
    </div>
  `;
}

document.getElementById("submit-btn").addEventListener("click", () => {
  const q = currentQuestions[currentIndex];
  const selected = Array.from(document.querySelectorAll('input[name="option"]:checked'))
    .map(el => el.value)
    .sort()
    .join('');

  const feedback = document.getElementById("feedback");
  if (!selected) {
    feedback.innerHTML = `<span class="wrong">请选择答案！</span>`;
    return;
  }

  if (selected === q.answer) {
    score++;
    feedback.innerHTML = `<span class="correct">✅ 回答正确！</span>`;
  } else {
    feedback.innerHTML = `<span class="wrong">❌ 回答错误，正确答案是：${q.answer}</span>`;
  }

  // 延迟显示下一题
  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1500);
});

loadQuestions();
