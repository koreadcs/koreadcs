function scrollToForm() {
    const form = document.getElementById('consultationForm');
    form.scrollIntoView({ behavior: 'smooth' });
}

function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;

    // EmailJS를 사용하여 이메일 전송
    const templateParams = {
        responses: `성함: {{${name}}}\n연락처: {{${phone}}}`
    };

    emailjs.send(
        'service_59b8f2h',
        'template_eqnti8r',
        templateParams
    )
    .then(function(response) {
        alert('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
        document.getElementById('consultationForm').reset();
    }, function(error) {
        alert('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
        console.error('EmailJS 전송 실패:', error);
    });

    return false;
}

// 전화번호 형식 자동 포매팅
document.getElementById('phone').addEventListener('input', function(e) {
    let number = e.target.value.replace(/[^0-9]/g, '');
    if (number.length > 3 && number.length <= 7) {
        number = number.substring(0,3) + '-' + number.substring(3);
    } else if (number.length > 7) {
        number = number.substring(0,3) + '-' + number.substring(3,7) + '-' + number.substring(7,11);
    }
    e.target.value = number;
});

// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.boxShadow = 'none';
    }
});

// FAQ 아코디언 기능
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // 다른 모든 FAQ 항목 닫기
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 클릭된 항목 토글
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// 통계 숫자 애니메이션
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseFloat(stat.textContent);
        let current = 0;
        const increment = target / 50; // 50 steps
        const duration = 1500; // 1.5 seconds
        const stepTime = duration / 50;
        
        const updateNumber = () => {
            current += increment;
            if (current <= target) {
                if (stat.textContent.includes('+')) {
                    stat.textContent = Math.floor(current) + '+';
                } else if (stat.textContent.includes('%')) {
                    stat.textContent = Math.floor(current) + '%';
                } else {
                    stat.textContent = Math.floor(current);
                }
                setTimeout(updateNumber, stepTime);
            }
        };
        
        updateNumber();
    });
}

// 스크롤 시 통계 애니메이션 실행
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
});

const statistics = document.querySelector('.statistics');
if (statistics) {
    observer.observe(statistics);
}

// 영업시간 체크 및 상태 배지 업데이트
function updateBusinessStatus() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    
    const statusBadge = document.querySelector('.status-badge');
    if (!statusBadge) return;

    // 평일(1-5) 및 영업시간(9-18) 체크
    const isBusinessDay = day >= 1 && day <= 5;
    const isBusinessHours = hours >= 9 && hours < 18;
    
    if (isBusinessDay && isBusinessHours) {
        statusBadge.textContent = '상담 가능';
        statusBadge.style.backgroundColor = '#2ecc71';
    } else {
        statusBadge.textContent = '상담 종료';
        statusBadge.style.backgroundColor = '#95a5a6';
    }
}

// 페이지 로드 시 상태 업데이트
updateBusinessStatus();
// 1분마다 상태 업데이트
setInterval(updateBusinessStatus, 60000);
