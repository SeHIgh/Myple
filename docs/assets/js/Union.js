let cachedOcid = null; // 캐시된 ocid를 저장할 전역 변수

async function getApiKey() {
  const response = await fetch("./config.json");
  const config = await response.json();
  return config.maple_apiKey;
}

async function lookupCharacterOcid() {
  const characterName = document.getElementById("characterName").value;

  if (!characterName) {
    // 캐릭터 이름이 입력되지 않은 경우
    document.getElementById("result").innerText = `캐릭터 이름을 입력해주세요.`;
    return null;
  }

  try {
    const apiKey = await getApiKey();
    const url = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(
      characterName
    )}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    cachedOcid = data.ocid; // 조회된 ocid를 전역 변수에 저장합니다.
    return cachedOcid;
  } catch (error) {
    document.getElementById(
      "result"
    ).innerText = `존재하지 않는 캐릭터 입니다.`;
    return null;
  }
}

async function lookupCharacterInfo() {
  const ocid = await lookupCharacterOcid();
  if (!ocid) return; // OCID가 null일 경우 함수 종료
  const apiKey = await getApiKey();
  const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-nxopen-api-key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();

    // 스타일을 개별적으로 설정하여 transition 효과 적용
    const section1 = document.getElementById("section1");
    section1.style.transition = "all 0.6s ease-in-out";
    section1.style.width = "50%";
    section1.style.padding = "50px 0";
    await delay(100);

    const characterPreview = document.getElementById("character-preview");
    // characterPreview.style.transition = "all 0.5s ease-in-out";
    characterPreview.style.display = "flex";
    await delay(350);

    const characterInfo = document.getElementById("character-info-box");
    // characterInfo.style.transition = "all 1s ease-in-out";
    characterInfo.style.display = "flex";
    // await delay(500);

    // 캐릭터 정보 표시
    document.getElementById("characterImgResult").src = data.character_image;
    document.getElementById(
      "serverLogo"
    ).src = `./assets/images/logos/worlds/${data.world_name.replace(
      /[0-9]/g,
      ""
    )}.png`;
    document.getElementById("serverResult").innerText = data.world_name;
    document.getElementById("characterNameResult").innerText =
      data.character_name;
    document.getElementById("jobResult").innerText = data.character_class;

    const lvElement = document.getElementById("lv");
    lvElement.style.color = "black";
    document.getElementById("levelResult").innerText = data.character_level;
    await delay(350);

    const nextBtn = document.getElementById("nextBtn");
    nextBtn.style.transition = "all 0.4s ease";
    nextBtn.style.display = "block";
  } catch (error) {
    document.getElementById("characterNameResult").innerText = ``;
  }
}

async function redirectToCharacterInfoPage() {
  try {
    const ocid = cachedOcid; // 전역 변수에 저장된 ocid를 사용합니다.
    if (ocid) {
      // ocid 정보를 쿼리 파라미터로 전달하며 페이지 이동
      window.location.href = `./pages/main.html?ocid=${ocid}`;
    }
  } catch (error) {
    console.error("Error redirecting to character info page:", error);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("DOMContentLoaded", () => {
  const lookupButton = document.getElementById("lookupButton");
  const characterNameInput = document.getElementById("characterName");
  const nextBtn = document.getElementById("nextBtn");

  if (lookupButton) {
    // 버튼 클릭 이벤트
    lookupButton.addEventListener("click", () => {
      // 기존 캐릭터 정보 초기화
      resetCharacterInfo();

      // 캐릭터 정보 조회
      lookupCharacterInfo();
    });
  }

  if (characterNameInput) {
    // 엔터 키 이벤트
    characterNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // 기존 캐릭터 정보 초기화
        resetCharacterInfo();

        // 캐릭터 정보 조회
        lookupCharacterInfo();
      }
    });
  }

  if (nextBtn) {
    // nextBtn 클릭 이벤트
    nextBtn.addEventListener("click", () => {
      redirectToCharacterInfoPage();
    });
  }
});

// 캐릭터 정보 초기화 함수
function resetCharacterInfo() {
  const result = document.getElementById("result");
  if (result) result.innerText = "";

  const section1 = document.getElementById("section1");
  if (section1) {
    section1.style.transition = "none"; // transition 없애기
    section1.style.width = "auto";
    section1.style.padding = "50px";
  }

  const characterPreview = document.getElementById("character-preview");
  if (characterPreview) {
    characterPreview.style.transition = "none"; // transition 없애기
    characterPreview.style.display = "none";
  }

  const characterInfo = document.getElementById("character-info-box");
  if (characterInfo) {
    characterInfo.style.transition = "none"; // transition 없애기
    characterInfo.style.display = "none";
  }

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.style.transition = "none"; // transition 없애기
    nextBtn.style.display = "none";
  }

  // 기타 필요한 요소 초기화
  const characterImgResult = document.getElementById("characterImgResult");
  if (characterImgResult) characterImgResult.src = "";

  const serverLogo = document.getElementById("serverLogo");
  if (serverLogo) serverLogo.src = "";

  const serverResult = document.getElementById("serverResult");
  if (serverResult) serverResult.innerText = "";

  const characterNameResult = document.getElementById("characterNameResult");
  if (characterNameResult) characterNameResult.innerText = "";

  const jobResult = document.getElementById("jobResult");
  if (jobResult) jobResult.innerText = "";

  const levelResult = document.getElementById("levelResult");
  if (levelResult) levelResult.innerText = "";

  const lvElement = document.getElementById("lv");
  if (lvElement) lvElement.style.color = "";
}
