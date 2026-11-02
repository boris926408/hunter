// 手機版導覽按鈕：點擊後展開選單，再點一次即可收合。
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', isOpen);
});

// 選好導覽項目後自動收合選單，方便手機閱讀。
navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

// 連線資訊使用 Supabase 公開金鑰；資料寫入權限由資料庫的 RLS 規則限制。
const supabaseUrl = 'https://grutbgaghqpbwiseqrep.supabase.co';
const supabaseKey = 'sb_publishable_KQzgxoOyXHQ1AmhNz2bTKg_B-kGdCQf';

// 送出問卷時，將勾選的類型存入 Supabase。
const surveyForm = document.querySelector('.survey-form');
const surveyResult = document.querySelector('.survey-result');

surveyForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const choices = [...surveyForm.querySelectorAll('input:checked')]
    .map((input) => input.value);

  if (choices.length === 0) {
    surveyResult.textContent = '請至少選擇一種動漫類型。';
    return;
  }

  const submitButton = surveyForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  surveyResult.textContent = '問卷傳送中……';

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/anime_survey_responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ genres: choices })
    });

    if (!response.ok) {
      throw new Error('問卷儲存失敗');
    }

    surveyResult.textContent = `已收到問卷！你喜歡的動漫類型是：${choices.join('、')}。`;
    surveyForm.reset();
  } catch (error) {
    surveyResult.textContent = '問卷傳送失敗，請確認網路連線後再試一次。';
  } finally {
    submitButton.disabled = false;
  }
});
