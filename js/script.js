let currentPage = 1;
const totalPages = 4;
let isTransitioning = false;

// 페이지 전환 함수
function goToPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    
    // 이전 페이지와 같거나 전환 중이면 실행하지 않음
    if (pageNum === currentPage || isTransitioning) return;
    isTransitioning = true;
    
    // 현재 페이지 아웃 애니메이션
    const currentPageEl = document.querySelector(`.page-${currentPage}`);
    if (currentPageEl) {
        currentPageEl.classList.add('out');
        currentPageEl.classList.remove('active');
    }
    
    // 새로운 페이지로 전환 (약간의 딜레이 후)
    setTimeout(() => {
        currentPage = pageNum;
        
        // 모든 out 클래스 제거
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('out');
        });
        
        // 새 페이지 표시
        const nextPageEl = document.querySelector(`.page-${pageNum}`);
        if (nextPageEl) {
            nextPageEl.classList.add('active');
            restartFadeIn(pageNum);
        }
        
        // 네비게이션 도트 업데이트
        document.querySelectorAll('.nav-dot').forEach((dot, index) => {
            if (index + 1 === pageNum) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // 페이지 표시기 업데이트
        const currentPageIndicator = document.querySelector('.current-page');
        if (currentPageIndicator) {
            currentPageIndicator.textContent = pageNum;
        }
        
        isTransitioning = false;
    }, 150);
}

function restartFadeIn(pageNum) {
    const pageEl = document.querySelector(`.page-${pageNum}`);
    if (!pageEl) return;

    pageEl.querySelectorAll('.fade-in').forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
    });
}

// 네비게이션 도트 클릭 이벤트
document.querySelectorAll('.nav-dot').forEach(dot => {
    dot.addEventListener('click', () => {
        const pageNum = parseInt(dot.dataset.page);
        goToPage(pageNum);
    });
});

// 키보드 네비게이션
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        goToPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft') {
        goToPage(currentPage - 1);
    }
});

// 마우스 휠 네비게이션
let wheelTimeout;
document.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
            goToPage(currentPage + 1);
        } else if (e.deltaY < 0) {
            goToPage(currentPage - 1);
        }
    }, 50);
}, { passive: false });

// 초기 페이지 로드
window.addEventListener('load', () => {
    const firstPage = document.querySelector('.page-1');
    if (firstPage && !firstPage.classList.contains('active')) {
        firstPage.classList.add('active');
    }
    restartFadeIn(1);
});
