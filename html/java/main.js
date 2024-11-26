document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      // 현재 클릭된 질문이 활성화 상태인지 확인
      const isActive = question.classList.contains('active');
      
      // 모든 질문의 active 클래스 제거
      faqQuestions.forEach(q => {
        q.classList.remove('active');
        // 모든 답변 숨기기
        const answer = q.nextElementSibling;
        if (answer) {
          answer.style.display = 'none';
        }
      });
      
      // 클릭된 질문이 비활성화 상태였다면 active 클래스 추가
      if (!isActive) {
        question.classList.add('active');
        // 해당 답변 보이기
        const answer = question.nextElementSibling;
        if (answer) {
          answer.style.display = 'block';
        }
      }
    });
  });

  // 폼에 이벤트 리스너 추가 (한 번만)
  const form = document.getElementById('consultationForm');
  if (form) {
    form.addEventListener('submit', submitConsultation);
  }

  // 연락처 입력 필드에 이벤트 리스너 추가
  document.getElementById('consult-phone').addEventListener('input', function(e) {
    // 숫자만 추출
    let number = e.target.value.replace(/[^0-9]/g, '');
    
    // 11자리를 초과하는 입력 방지
    if (number.length > 11) {
      number = number.slice(0, 11);
    }
    
    // 하이픈 추가
    if (number.length >= 3) {
      if (number.length <= 7) {
        // 010-1234
        number = number.replace(/(\d{3})(\d{1,4})/, '$1-$2');
      } else {
        // 010-1234-5678
        number = number.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
      }
    }
    
    // 변환된 값을 입력 필드에 설정
    e.target.value = number;
  });
});

// EmailJS 초기화
(function() {
  // YOUR_PUBLIC_KEY를 실제 EmailJS public key로 교체하세요
  emailjs.init("NwKEG-8OlHeKR20mA");
})();

// 상담 예약 폼 제출 처리
function submitConsultation(event) {
  event.preventDefault();
  
  const loading = document.querySelector('.loading');
  loading.style.display = 'flex';
  
  // 상담 예약 정보를 포맷팅
  const responses = [
    `성함: ${document.getElementById('consult-name').value}`,
    `연락처: ${document.getElementById('consult-phone').value}`,
    `상담희망일: ${document.getElementById('consult-date').value}`,
    `상담희망시간: ${document.getElementById('consult-time').value}`,
    `상담내용: ${document.getElementById('consult-message').value}`
  ].join('\n\n');

  // EmailJS 템플릿 파라미터 수정
  const templateParams = {
    name: document.getElementById('consult-name').value,
    phone: document.getElementById('consult-phone').value,
    responses: responses // 포맷팅된 상담 예약 정보 추가
  };

  emailjs.send('service_59b8f2h', 'template_eqnti8r', templateParams)
    .then(function(response) {
      loading.style.display = 'none';
      alert('상담 예약이 성공적으로 접수되었습니다.');
      document.getElementById('consultationForm').reset();
    }, function(error) {
      loading.style.display = 'none';
      alert('상담 예약 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error('이메일 전송 실패:', error);
    });
}

// 폼에 이벤트 리스너 추가
document.getElementById('consultationForm').addEventListener('submit', submitConsultation); 