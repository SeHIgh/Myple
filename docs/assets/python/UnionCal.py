import requests
import json

# 넥슨 API 엔드포인트와 API 키
list_api_endpoint = 'https://open.api.nexon.com/maplestory/v1/character/list'
# api_key = 'test_cf92cd14930e08e300ab26408fc39a0423307bfeffb68e8601913d93e8ed7f36efe8d04e6d233bd35cf2fabdeb93fb0d'
api_key = 'test_cf92cd14930e08e300ab26408fc39a04106ffd90a4270419752ce5af9d9627efefe8d04e6d233bd35cf2fabdeb93fb0d'

# API 요청을 위한 헤더 설정
headers = {
    'accept': 'application/json',
    'x-nxopen-api-key': api_key,
}

try:
    # 캐릭터 목록 API 요청
    response_list = requests.get(list_api_endpoint, headers=headers)
    response_list.raise_for_status()  # HTTP 에러 발생 시 예외 발생
    data_list = response_list.json()  # JSON 형식의 응답 데이터 파싱

    # 특정 world_name 설정
    target_world = '스카니아'

    # JobList.json 파일에서 데이터 읽어오기
    with open('../json/self/jobList.json', 'r', encoding='utf-8') as f:
        job_list_data = json.load(f)

    # 특정 world_name의 character_class 배열 추출
    character_classes = []
    for account in data_list['account_list']:
        for character in account['character_list']:
            if character['world_name'] == target_world:
                character_classes.append(character['character_class'])

    # JobList.json의 직업 목록 추출
    job_list = [job['직업'] for job in job_list_data]

    # 없는 직업 추려내기
    missing_jobs = [job for job in job_list if job not in character_classes]

    # 결과 출력
    print("총 캐릭터 개수:", len(character_classes) + len(missing_jobs))
    print("있는 직업 개수:", len(character_classes))
    print("없는 직업 개수:", len(missing_jobs))
    print("없는 직업 목록:", missing_jobs)
    
except requests.exceptions.RequestException as e:
    print(f'API 요청 중 에러 발생: {e}')
except json.JSONDecodeError as e:
    print(f'JSON 디코딩 중 에러 발생: {e}')
except KeyError as e:
    print(f'키 에러 발생: {e}')
except TypeError as e:
    print(f'TypeError 발생: {e}')
