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
        document.getElementById('result').innerText = `OCID: ${data.ocid}`;
        return data.ocid;
    } catch (error) {
        document.getElementById('result').innerText = `Error: ${error.message}`;
    }
}

async function lookupCharacterInfo() {
    const ocid = await lookupCharacterOcid();
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
        document.getElementById('characterImgResult').src = `${data.character_image}`;
        document.getElementById('serverResult').innerText = `${data.world_name}`;
        document.getElementById('characterNameResult').innerText = `${data.character_name}`;
        document.getElementById('jobResult').innerText = `${data.character_class}`;
        document.getElementById('levelResult').innerText = `${data.character_level}`;
        document.getElementById('expResult').innerText = `${data.character_exp_rate}`;
    } catch (error) {
        document.getElementById('characterNameResult').innerText = `Error: ${error.message}`;
    }
}