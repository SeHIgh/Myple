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

// 사용자 스텟 정보 조회 API 호출
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
