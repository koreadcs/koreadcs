// EmailJS 초기화 제거
// emailjs.init("NwKEG-8OlHeKR20mA");

// 페이지 로드 시 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 이동 버튼 설정
    const consultButton = document.querySelector('.cta-button');
    if (consultButton) {
        consultButton.addEventListener('click', function(e) {
            e.preventDefault();
            const consultSection = document.querySelector('.consultation-form');
            if (consultSection) {
                consultSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // FAQ 아코디언 설정
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // 다른 FAQ 항목들 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });

            // 현재 FAQ 항목 토글
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
    });

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
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                hideModal(modal.id);
            }
        });
    });

    // 모달 외부 클릭으로 닫기
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal.id);
            }
        });
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const visibleModal = document.querySelector('.modal.show');
            if (visibleModal) {
                hideModal(visibleModal.id);
            }
        }
    });

    // 영업시간 상태 업데이트 시작
    updateBusinessStatus();
    // 1분마다 상태 업데이트
    setInterval(updateBusinessStatus, 60000);
});

// 전화번호 형식 변경 함수
function formatPhoneNumber(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    if (value.length >= 8) {
        value = value.slice(0, 8) + '-' + value.slice(8);
    }
    if (value.length > 13) {
        value = value.slice(0, 13);
    }
    
    input.value = value;
}

// 폼 제출 처리 함수
async function handleSubmit(event) {
    event.preventDefault();

    // 영업시간이 아닐 경우 모달 표시
    if (!isBusinessHours()) {
        showModal('officeHoursModal');
    }

    const submitButton = event.target.querySelector('button[type="submit"]');
    const spinner = submitButton.querySelector('.loading-spinner');
    
    // 버튼 비활성화 및 로딩 표시
    submitButton.disabled = true;
    spinner.style.display = 'inline-block';

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const agreement = document.getElementById('agreement').checked;

    // 기본적인 유효성 검사
    if (!name || name.length < 2) {
        showToast('이름을 올바르게 입력해주세요.', 'error');
        submitButton.disabled = false;
        spinner.style.display = 'none';
        return;
    }
    
    if (!phone || !/^010-\d{4}-\d{4}$/.test(phone)) {
        showToast('올바른 휴대폰 번호를 입력해주세요.', 'error');
        submitButton.disabled = false;
        spinner.style.display = 'none';
        return;
    }

    if (!agreement) {
        showToast('개인정보 수집 및 이용에 동의해주세요.', 'error');
        submitButton.disabled = false;
        spinner.style.display = 'none';
        return;
    }

    const formData = {
        name: name,
        phone: phone,
        agreement: agreement
    };

    try {
        // 구글 스프레드시트로 데이터 전송
        const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw5NZpOgGJr3rGEqCKMvUg0GnQOoaNtlqpOWK0MaCIjB7k3uu3nFDcrIpZujK8jAWHLtA/exec';
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // 성공 메시지 표시
        showToast('상담 신청이 완료되었습니다.', 'success');
        event.target.reset();
    } catch (error) {
        console.error('Error:', error);
        showToast('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
    } finally {
        // 버튼 활성화 및 로딩 제거
        submitButton.disabled = false;
        spinner.style.display = 'none';
    }
}

// 토스트 메시지 표시 함수
function showToast(message, type = 'info') {
    // 기존 토스트 컨테이너 찾기 또는 생성
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // 토스트 엘리먼트 생성
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // 아이콘 추가
    const icon = document.createElement('i');
    switch(type) {
        case 'success':
            icon.className = 'fas fa-check-circle';
            break;
        case 'error':
            icon.className = 'fas fa-exclamation-circle';
            break;
        default:
            icon.className = 'fas fa-info-circle';
    }
    
    // 메시지 엘리먼트 생성
    const messageElement = document.createElement('span');
    messageElement.textContent = message;
    
    // 토스트에 요소들 추가
    toast.appendChild(icon);
    toast.appendChild(messageElement);
    container.appendChild(toast);

    // 애니메이션 시작 - 50ms로 단축
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // 5초 후 제거 (3초에서 5초로 변경)
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 5000);
}

// 모달 표시 함수
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

// 모달 숨기기 함수
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// 영업시간 체크 함수
function isBusinessHours() {
    const now = new Date();
    const hours = now.getHours();
    const day = now.getDay(); // 0은 일요일, 6은 토요일
    return day >= 1 && day <= 5 && hours >= 9 && hours < 18;
}

// 영업시간 상태 업데이트 함수
function updateBusinessStatus() {
    const statusBadge = document.querySelector('.status-badge');
    if (!statusBadge) return;

    if (isBusinessHours()) {
        statusBadge.textContent = '상담 가능';
        statusBadge.style.backgroundColor = '#2ecc71';
    } else {
        statusBadge.textContent = '상담 종료';
        statusBadge.style.backgroundColor = '#95a5a6';
    }
}
