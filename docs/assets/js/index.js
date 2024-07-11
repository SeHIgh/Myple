let cachedOcid = null; // 캐시된 ocid를 저장할 전역 변수

async function getApiKey() {
  const response = await fetch("./config.json");
  const config = await response.json();
  return config.maple_apiKey;
}
// 캐릭터 이름으로 ocid 조회
async function lookupCharacterOcid() {
  const characterName = document.getElementById("characterName").value;

  if (!characterName) {
    // 캐릭터 이름이 입력되지 않은 경우
    document.getElementById("result").innerText = `캐릭터 이름을 입력해주세요.`;
    return null;
  }

  try {
    const apiKey = await getApiKey();
    const url = `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(characterName)}`;

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
    document.getElementById("result").innerText = `존재하지 않는 캐릭터 입니다.`;
    return null;
  }
}
// 캐릭터 정보 조회
async function lookupCharacterInfo() {
  await resetCharacterInfo(); // 초기화 먼저 수행
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

    // 캐릭터 정보 표시 전에 회전 애니메이션 적용
    document.querySelector("section.content-section").classList.add("flip");

    // 캐릭터 정보 표시
    document.getElementById("characterImgResult").src = data.character_image;
    document.getElementById("serverLogo").src = `./assets/images/logos/worlds/${data.world_name.replace(/[0-9]/g, "")}.png`;
    document.getElementById("serverResult").innerText = data.world_name;
    document.getElementById("characterNameResult").innerText = data.character_name;
    document.getElementById("jobResult").innerText = data.character_class;
    document.getElementById("levelResult").innerText = data.character_level;

    const lvElement = document.getElementById("lv");
    lvElement.style.color = "black";

    const nextBtn = document.getElementById("nextBtn");
    nextBtn.style.display = "block";
    const resetBtn = document.getElementById("resetBtn");
    resetBtn.style.display = "block";
  } catch (error) {
    document.getElementById("characterNameResult").innerText = ``;
  }
}
// 다음 페이지로 이동 & ocid 정보 전달
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
// 클릭 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  const lookupButton = document.getElementById("lookupButton");
  const characterNameInput = document.getElementById("characterName");
  const nextBtn = document.getElementById("nextBtn");
  const resetBtn = document.getElementById("resetBtn");

  if (lookupButton) {
    // 버튼 클릭 이벤트
    lookupButton.addEventListener("click", () => {
      // 기존 캐릭터 정보 초기화 및 조회
      lookupCharacterInfo();
    });
  }

  if (characterNameInput) {
    // 엔터 키 이벤트
    characterNameInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        // 기존 캐릭터 정보 초기화 및 조회
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

  if (resetBtn) {
    // resetBtn 클릭 이벤트
    resetBtn.addEventListener("click", () => {
      const contentSection = document.querySelector("section.content-section");
      contentSection.classList.add("flip-back");
      contentSection.classList.remove("flip");
    });
  }
});

// 캐릭터 정보 초기화 함수
async function resetCharacterInfo() {
  const result = document.getElementById("result");
  if (result) result.innerText = "";

  // 캐릭터 정보 초기화 전에 회전 애니메이션 초기화
  const contentSection = document.querySelector("section.content-section");
  contentSection.classList.remove("flip");
  contentSection.classList.remove("flip-back");
  await delay(10); // 10ms 대기 (애니메이션 초기화를 위해 짧게 대기)

  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) nextBtn.style.display = "none";
  
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) resetBtn.style.display = "none";

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
