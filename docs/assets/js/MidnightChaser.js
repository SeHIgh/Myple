// 초기 설정: objList 숨기기
const objList = document.querySelector('.objList');
objList.style.display = 'none';
const resetButton = document.querySelector('#resetBtn');
resetButton.style.display = 'none';

// .board의 obj_box 요소들을 가져옵니다.
const boardBoxes = document.querySelectorAll('.board .obj_box');

// objList의 obj_box 요소들을 가져옵니다.
const listBoxes = document.querySelectorAll('.objList .obj_box');

// 선택된 이미지 상태를 저장할 변수
let selectedImageIndex = null;

// 이전 테두리 스타일을 저장할 변수
let previousBorderStyle = null;

// 타이머 요소를 가져옵니다.
const timerElement = document.querySelector('.timer');

// 초기 상태를 저장
const initialBoardState = Array.from(boardBoxes).map(box => box.querySelector('img').src);
const initialListState = Array.from(listBoxes).map(box => box.style.display);

// 현재 상태를 업데이트하는 함수
const updateTimer = () => {
    const totalBoxes = boardBoxes.length;
    const changedBoxes = Array.from(boardBoxes).filter(box => !box.querySelector('img').src.includes('midnightChaser.hint.hide.0.png')).length;
    timerElement.innerHTML = `${changedBoxes}<span>개</span> / ${totalBoxes}<span>개</span>`;

    if (changedBoxes > 0) {
        resetButton.style.display = 'block';
    }
};

// .board의 obj_box 요소를 클릭하면 objList를 보이게 합니다.
boardBoxes.forEach((box, index) => {
    box.addEventListener('click', (e) => {
        // 클릭 이벤트가 버블링 되지 않도록 합니다.
        e.stopPropagation();

        // 선택 해제 시 이전 테두리 스타일을 복원
        if (previousBorderStyle) {
            previousBorderStyle.box.style.border = previousBorderStyle.borderStyle;
        }

        // 선택된 상태로 표시
        boardBoxes.forEach(b => {
            b.classList.remove('selected');
        });
        box.classList.add('selected');
        previousBorderStyle = { box: box, borderStyle: box.style.border }; // 현재 테두리 스타일 저장
        box.style.border = '3px solid #CA170B'; // 선택된 상자에 테두리 색상 설정
        objList.style.display = 'flex';
    });
});

// objList의 obj_box 요소를 클릭하면 선택된 이미지를 .board의 obj_box에 나타나게 합니다.
listBoxes.forEach((listBox, index) => {
    listBox.addEventListener('click', (e) => {
        // 클릭 이벤트가 버블링 되지 않도록 합니다.
        e.stopPropagation();
        const imgSrc = listBox.querySelector('img').src;
        const imgIndex = listBox.dataset.index;

        // .board의 선택된 .obj_box에 이미지를 설정합니다.
        boardBoxes.forEach(box => {
            if (box.classList.contains('selected')) {
                // 이미 같은 이미지가 선택되어 있으면 이미지 해제
                // 기존에 선택된 이미지를 리스트에 다시 보이게 설정
                listBoxes.forEach(lb => {
                    if (lb.querySelector('img').src === box.querySelector('img').src) {
                        lb.style.display = 'block';
                    }
                });

                if (previousBorderStyle) {
                    previousBorderStyle.box.style.border = previousBorderStyle.borderStyle;
                }
                // 새로운 이미지 선택
                box.querySelector('img').src = imgSrc;
                box.style.backgroundImage = 'linear-gradient(to bottom, #523396, #7677C0)'; // 배경 색상 변경
                listBox.style.display = 'none'; // 리스트에서 숨기기
                box.classList.remove('selected');

                // 현재 테두리 스타일 저장
                previousBorderStyle = { box: box, borderStyle: box.style.border };
                box.style.border = '3px solid #C6A6EA'; // 선택된 상자에 테두리 색상 설정
            }
        });

        // 모든 obj_box가 바뀌었는지 확인
        const allChanged = Array.from(boardBoxes).every(box => !box.querySelector('img').src.includes('midnightChaser.hint.hide.0.png'));

        if (allChanged) {
            console.log('SUCCESS');
        }

        // objList를 다시 숨깁니다.
        objList.style.display = 'none';

        // 타이머 업데이트
        updateTimer();
    });
});

// body에 클릭 이벤트를 추가하여 objList가 아닌 다른 부분을 클릭하면 objList를 숨기고 선택 해제된 상자의 테두리 스타일을 복원합니다.
const body = document.querySelector('body');
body.addEventListener('click', (e) => {
    // objList가 아닌 부분을 클릭한 경우
    if (!objList.contains(e.target)) {
        // 선택 해제 시 이전 테두리 스타일을 복원
        if (previousBorderStyle) {
            previousBorderStyle.box.style.border = previousBorderStyle.borderStyle;
            previousBorderStyle = null; // 이전 스타일 변수 초기화
        }
        // objList 숨기기
        objList.style.display = 'none';
    }
});

// 초기 상태로 리셋하는 함수
const resetGame = () => {
    // .board의 obj_box 요소들의 이미지를 초기 상태로 복원
    boardBoxes.forEach((box, index) => {
        box.querySelector('img').src = initialBoardState[index];
        box.style.border = '2px solid #707070';
        box.style.backgroundImage = 'linear-gradient(to bottom, #000000, #543798)';
    });

    // objList의 obj_box 요소들을 초기 상태로 복원
    listBoxes.forEach((box, index) => {
        box.style.display = initialListState[index];
    });

    // 선택 상태 초기화
    selectedImageIndex = null;
    previousBorderStyle = null;

    // 타이머 업데이트
    updateTimer();

    // 리셋 버튼 숨기기
    resetButton.style.display = 'none';
};

// 초기 상태 업데이트
updateTimer();

// resetButton 클릭 이벤트 추가
resetButton.addEventListener('click', resetGame);
