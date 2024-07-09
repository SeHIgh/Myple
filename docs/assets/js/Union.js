async function getApiKey() {
    const response = await fetch('./config.json');
    const config = await response.json();
    return config.maple_apiKey;
}

async function lookupCharacterOcid() {
    const characterName = document.getElementById('characterName').value;
    const apiKey = await getApiKey();
    const url = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data.ocid;
    } catch (error) {
        document.getElementById('result').innerText = `존재하지 않는 캐릭터 입니다.`;
        return null;
    }
}

async function lookupCharacterInfo() {
    const ocid = await lookupCharacterOcid();
    if (!ocid) return;  // OCID가 null일 경우 함수 종료
    const apiKey = await getApiKey();
    const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-nxopen-api-key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        
        // 스타일을 개별적으로 설정하여 transition 효과 적용
        const section1 = document.getElementById('section1');
        section1.style.transition = 'all 1s ease-in-out';
        section1.style.width = '50%';
        section1.style.padding = '50px 0';
        await delay(100);

        const characterPreview = document.getElementById('character-preview');
        characterPreview.style.transition = 'all 1s ease-in-out';
        characterPreview.style.display = 'flex';
        await delay(500);

        const characterInfo = document.getElementById('character-info-box');
        characterInfo.style.transition = 'all 1s ease-in-out';
        characterInfo.style.display = 'flex';
        await delay(100);

        // 캐릭터 정보 표시
        document.getElementById('characterImgResult').src = data.character_image;
        document.getElementById('serverLogo').src = `./assets/images/logos/worlds/${data.world_name.replace(/[0-9]/g, '')}.png`;
        document.getElementById('serverResult').innerText = data.world_name;
        document.getElementById('characterNameResult').innerText = data.character_name;
        document.getElementById('jobResult').innerText = data.character_class;
        
        const lvElement = document.getElementById('lv');
        lvElement.style.color = 'black';
        document.getElementById('levelResult').innerText = data.character_level;
    } catch (error) {
        document.getElementById('characterNameResult').innerText = ``;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', () => {
    const lookupButton = document.getElementById('lookupButton');
    const characterNameInput = document.getElementById('characterName');

    // 버튼 클릭 이벤트
    lookupButton.addEventListener('click', () => {
        // 기존 캐릭터 정보 초기화
        resetCharacterInfo();

        // 캐릭터 정보 조회
        lookupCharacterInfo();
    });

    // 엔터 키 이벤트
    characterNameInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            // 기존 캐릭터 정보 초기화
            resetCharacterInfo();

            // 캐릭터 정보 조회
            lookupCharacterInfo();
        }
    });
});

// 캐릭터 정보 초기화 함수
function resetCharacterInfo() {
    const result = document.getElementById('result');
    result.innerText = '';

    const section1 = document.getElementById('section1');
    section1.style.transition = 'none'; // transition 없애기
    section1.style.width = 'auto';
    section1.style.padding = '50px';

    const characterPreview = document.getElementById('character-preview');
    characterPreview.style.transition = 'none'; // transition 없애기
    characterPreview.style.display = 'none';

    const characterInfo = document.getElementById('character-info-box');
    characterInfo.style.transition = 'none'; // transition 없애기
    characterInfo.style.display = 'none';
    
    // 기타 필요한 요소 초기화
    document.getElementById('characterImgResult').src = '';
    document.getElementById('serverLogo').src = '';
    document.getElementById('serverResult').innerText = '';
    document.getElementById('characterNameResult').innerText = '';
    document.getElementById('jobResult').innerText = '';
    document.getElementById('levelResult').innerText = '';
    document.getElementById('lv').style.color = '';
}
