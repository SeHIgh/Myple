const fs = require('fs').promises;
const path = require('path');

async function readJSON(filePath) {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
}

function mergeJSONObjects(obj1, obj2) {
    return { ...obj1, ...obj2 };
}

async function mergeJSONFiles(filePaths) {
    const jsonData = await Promise.all(filePaths.map(readJSON));
    const mergedData = jsonData.reduce((acc, data) => mergeJSONObjects(acc, data), {});
    return mergedData;
}

// 로컬 JSON 파일 경로 리스트 (상대 경로) (변경 가능한 부분)
const jsonFilePaths = [
    path.join(__dirname, '../json/character/basic.json'),
    path.join(__dirname, '../json/character/stat.json')
];

// 병합된 JSON 파일 저장 경로 (변경 가능한 부분)
const outputFilePath = path.join(__dirname, '../json/user/mergedFile.json');

mergeJSONFiles(jsonFilePaths).then(mergedData => {
    const outputDir = path.dirname(outputFilePath);
    fs.mkdir(outputDir, { recursive: true })
        .then(() => {
            return fs.writeFile(outputFilePath, JSON.stringify(mergedData, null, 2));
        })
        .then(() => console.log('Merged JSON file created successfully:', outputFilePath))
        .catch(error => console.error('Error writing merged JSON file:', error));
}).catch(error => {
    console.error('Error reading JSON files:', error);
});