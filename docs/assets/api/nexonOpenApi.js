// nexonOpenApi.js

// Async function to fetch API key
export async function getApiKey() {
  try {
    const response = await fetch("../config.json");
    if (!response.ok) {
      throw new Error("Failed to fetch API key");
    }
    const config = await response.json();
    return config.maple_apiKey;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

// 캐릭터 이름으로 ocid 조회
export async function lookupCharacterOcid() {
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

// 사용자 기본 정보 조회 API 호출
export async function lookupCharacterInfo(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character info data:", error);
    return null;
  }
}

// 사용자 종합 능력치 정보 조회 API 호출
export async function lookupCharacterStat(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character stat data:", error);
    return null;
  }
}

// 사용자 인기도 정보 조회 API 호출
export async function lookupCharacterPopularity(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/popularity?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character popularity data:", error);
    return null;
  }
}

// 사용자 하이퍼스탯 정보 조회 API 호출
export async function lookupCharacterHyperStat(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/hyper-stat?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character hyper-stat data:", error);
    return null;
  }
}

// 사용자 어빌리티 정보 조회 API 호출
export async function lookupCharacterAbility(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/ability?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character ability data:", error);
    return null;
  }
}

// 사용자 장착 심볼 정보 조회 API 호출
export async function lookupCharacterSymbolEquip(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/symbol-equipment?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character symbol-equipment data:", error);
    return null;
  }
}

// 사용자 적용 세트 효과 정보 조회 API 호출
export async function lookupCharacterSetEffect(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/set-effect?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character set-effect data:", error);
    return null;
  }
}

// 사용자 장착 링크 스킬 정보 조회 API 호출
export async function lookupCharacterLinkSkill(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/link-skill?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character link-skill data:", error);
    return null;
  }
}

// 사용자 V매트릭스 정보 조회 API 호출
export async function lookupCharacterVMatrix(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/vmatrix?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character vmatrix data:", error);
    return null;
  }
}

// 사용자 HEXA 코어 정보 조회 API 호출
export async function lookupCharacterHexaMatrix(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character hexamatrix data:", error);
    return null;
  }
}

// 사용자 HEXA 스탯 정보 조회 API 호출
export async function lookupCharacterHexaStat(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/hexamatrix-stat?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character hexamatrix-stat data:", error);
    return null;
  }
}

// 사용자 무릉도장 최고 기록 정보 조회 API 호출
export async function lookupCharacterDojang(ocid) {
  try {
    const apiKey = await getApiKey();
    if (!apiKey) return null; // Exit if API key is not available

    const url = `https://open.api.nexon.com/maplestory/v1/character/dojang?ocid=${ocid}`;
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
    return data;
  } catch (error) {
    console.error("Error fetching character dojang data:", error);
    return null;
  }
}