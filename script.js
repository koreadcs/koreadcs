// 페이지 로드 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // EmailJS 초기화
    emailjs.init("NwKEG-8OlHeKR20mA");

    // 폼 제출 이벤트 리스너 등록
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    // 전화번호 입력 이벤트 리스너 등록
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhoneNumber);
    }

    // 개인정보 처리방침 버튼 이벤트 리스너
    const privacyBtn = document.querySelector('.privacy-detail-btn');
    if (privacyBtn) {
        privacyBtn.addEventListener('click', () => showModal('privacyModal'));
    }

    // 모달 닫기 버튼 이벤트 리스너
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.show');
            if (visibleModal) hideModal(visibleModal.id);
        }
    });

    // 모달 외부 클릭으로 닫기
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal(modal.id);
        });
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

    // 통계 숫자 애니메이션
    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const originalText = stat.textContent;
            const hasPlus = originalText.includes('+');
            const hasComma = originalText.includes(',');
            let target = parseFloat(originalText.replace(/[+,]/g, ''));
            
            let current = 0;
            const increment = target / 50; // 50 steps
            const duration = 1500; // 1.5 seconds
            const stepTime = duration / 50;
            
            const updateNumber = () => {
                current += increment;
                if (current <= target) {
                    let displayNumber = Math.floor(current);
                    if (hasComma) {
                        displayNumber = displayNumber.toLocaleString();
                    }
                    if (hasPlus) {
                        displayNumber = displayNumber + '+';
                    }
                    stat.textContent = displayNumber;
                    setTimeout(updateNumber, stepTime);
                } else {
                    stat.textContent = originalText; // 최종적으로 원래 텍스트로 복원
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
});

// Toast message functionality
function showToast(message, type = 'info', duration = 3000) {
    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            icon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // Create message element
    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    
    // Append elements to toast
    toast.appendChild(icon);
    toast.appendChild(messageElement);
    
    // Add toast to container
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    // Remove toast after duration
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            container.removeChild(toast);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, duration);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

function formatPhoneNumber(e) {
    let number = e.target.value.replace(/[^0-9]/g, '');
    if (number.length > 13) number = number.slice(0, 13);
    
    if (number.length > 3 && number.length <= 7) {
        number = number.substring(0,3) + '-' + number.substring(3);
    } else if (number.length > 7) {
        number = number.substring(0,3) + '-' + number.substring(3,7) + '-' + number.substring(7);
    }
    e.target.value = number;
}

function isBusinessHours() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay();
    return day >= 1 && day <= 5 && hours >= 9 && hours < 18;
}

function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.loading-spinner');
    
    // 입력값 가져오기
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    // 기본적인 유효성 검사
    if (!name || name.length < 2) {
        showToast('이름을 올바르게 입력해주세요.', 'error');
        return false;
    }
    
    if (!phone || !/^010-\d{4}-\d{4}$/.test(phone)) {
        showToast('올바른 휴대폰 번호를 입력해주세요.', 'error');
        return false;
    }
    
    // 영업시간 체크
    if (!isBusinessHours()) {
        showModal('officeHoursModal');
    }
    
    // 버튼 비활성화 및 로딩 표시
    submitButton.disabled = true;
    spinner.style.display = 'inline-block';
    
    // EmailJS를 사용하여 이메일 전송
    const templateParams = {
        responses: `성함: {{${name}}}\n연락처: {{${phone}}}`
    };

    emailjs.send('service_59b8f2h', 'template_eqnti8r', templateParams)
        .then(function(response) {
            console.log('Email sent successfully:', response);
            showToast('상담 신청이 완료되었습니다. 빠른 시일 내에 연락드리겠습니다.');
            form.reset();
        })
        .catch(function(error) {
            console.error('EmailJS 전송 실패:', error);
            showToast('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        })
        .finally(function() {
            // 버튼 활성화 및 로딩 제거
            submitButton.disabled = false;
            spinner.style.display = 'none';
        });

    return false;
}

function scrollToForm() {
    const form = document.querySelector('.consultation-form');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth' });
    }
}
