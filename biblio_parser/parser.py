import requests
from bs4 import BeautifulSoup
from db.manager import DatabaseManager
import re
import time
import logging
#Cron  (раз в неделю индексация) 


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)

BASE_URL = "http://e.biblio.bru.by"
FACULTIES_LINK = "/handle/1212121212/10"


def fetch_page(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Ошибка при запросе {url}: {e}")
        return None


def parse_communities(html):
    soup = BeautifulSoup(html, 'html.parser')
    communities = []

    community_list_head = soup.find('h2', class_='ds-list-head')
    if not community_list_head:
        print("Not community list")
        return communities

    community_list_ul = community_list_head.find_next_sibling('ul')
    for li in community_list_ul.find_all('li'):
        a_tag = li.find('a', href=True)
        if not a_tag:
            continue

        name_span = a_tag.find('span', class_='Z3988')
        name = name_span.get_text(strip=True) if name_span else None
        relative_url = a_tag['href']
        full_url = BASE_URL + relative_url
        count_text = li.get_text(strip=True)
        match = re.search(r'\[(\d+)\]', count_text)
        count = int(match.group(1)) if match else 0

        if name and relative_url:
            communities.append({
                'name': name,
                'url': full_url,
                'relative_path': relative_url,
                'count': count
            })

    return communities



# Функция для парсинга списка материалов на странице кафедры
def parse_materials(html):
    soup = BeautifulSoup(html, 'html.parser')
    materials = []

    artifact_list = soup.find('ul', class_='ds-artifact-list')
    if not artifact_list:
        return materials

    for li in artifact_list.find_all('li', class_='ds-artifact-item'):
        description = li.find('div', class_='artifact-description')
        if description:
            title_a = description.find('a')  # Ссылка на материал
            if title_a:
                title = title_a.text.strip()
                relative_url = title_a['href']
                full_url = BASE_URL + relative_url + '?show=full'
                materials.append({
                    'title': title,
                    'url': full_url,
                    'relative_path': relative_url
                })
    return materials


def get_all_materials(dept_url, count):
    materials = []
    offset = 0
    page_size = 20
    while offset < count:
        page_url = f"{dept_url}/recent-submissions?offset={offset}"
        html = fetch_page(page_url)
        if not html:
            break

        page_materials = parse_materials(html)
        materials.extend(page_materials)

        if len(page_materials) < page_size:
            break

        offset += page_size

    return materials


def parse_material_metadata(html):
    soup = BeautifulSoup(html, 'html.parser')

    metadata = {
        'title': None,
        'creator': [],
        'available': None,
        'issued': None,
        'bibliographicCitation': None,
        'identifier': None,
        'abstract': None,
        'language': None,
        'publisher': None,
        'subject': [],
        'titlealternative': None,
        'type': [],
        'spec': [],
        'pages': []
    }

    # Находим таблицу с метаданными
    table = soup.find('table', class_='ds-includeSet-table detailtable')
    if not table:
        print("  Таблица метаданных не найдена!")
        return metadata

    rows = table.find_all('tr')
    for row in rows:
        cells = row.find_all(['td', 'th'])

        label_cell = cells[0]
        value_cell = cells[1]

        label = label_cell.get_text(strip=True).lower()

        raw_text = value_cell.get_text(strip=True)
        values = [v.strip() for v in raw_text.split('|') if v.strip()]

        # --- Обработка полей ---
        if 'author' in label:
            metadata['creator'].extend(values)

        elif 'available' in label:
            metadata['available'] = values[0]

        elif 'issued' in label:
            metadata['issued'] = values[0]

        elif 'citation' in label:
            metadata['bibliographicCitation'] = values[0]
            match = re.search(r'-\s*(\d+)\s*с\.', values[0])
            if match:
                pages = int(match.group(1))
                metadata['pages'] = pages

        elif 'uri' in label:
            metadata['identifier'] = values[0]

        elif 'abstract' in label:
            metadata['abstract'] = values[0]

        elif 'language' in label:
            metadata['language'] = values[0]

        elif 'publisher' in label:
            metadata['publisher'] = values[0]

        elif 'dc.title' == label:
            metadata['title'] = values[0]

        elif 'dc.subject' == label:
            metadata['subject'].extend(values)

        elif 'alternative' in label:
            metadata['titlealternative'] = values[0]

        elif 'type' in label:
            metadata['type'].extend(values)

        elif 'spec' in label:
            metadata['spec'].extend(values)

    return metadata


# Основная функция парсинга
def main():
    # db = DatabaseManager()
    # try:
    #     db.initialize_db()
    # finally:
    #     db.close()

    try:
        #Получить главную страницу (main_page)
        main_html = fetch_page(BASE_URL)
        if not main_html:
            print("Не удалось загрузить главную страницу.")
            return

        # На главной странице найти ссылку на факультеты: <a href="/handle/1212121212/10">
        soup = BeautifulSoup(main_html, 'html.parser')
        faculties_link = soup.find('a', href=FACULTIES_LINK)
        if not faculties_link:
            print("Ссылка на факультеты не найдена.")
            return
        faculties_url = BASE_URL + faculties_link['href']

        # Получить страницу факультетов
        faculties_html = fetch_page(faculties_url)
        if not faculties_html:
            print("Не удалось загрузить страницу факультетов.")
            return

        # Парсинг факультетов
        faculties = parse_communities(faculties_html)
        print(f"Найдено факультетов: {len(faculties)}")

        for faculty in faculties:
            #faculty_id = db.insert_faculty(faculty['name'], faculty['url'])
            print(f"Факультет: {faculty['name']} (URL: {faculty['url']})")

            # Для каждого факультета получить его страницу и парсить кафедры
            faculty_html = fetch_page(faculty['url'])
            if not faculty_html:
                continue

            departments = parse_communities(faculty_html)
            print(f"Найдено кафедр: {len(departments)}")

            for dept in departments:
                #dept_id = db.insert_department(dept['name'], dept['url'], faculty_id)
                print(f"Кафедра: {dept['name']} (URL: {dept['url']}) count: {dept['count']}")

                # Получить все материалы кафедры
                materials = get_all_materials(dept['url'], dept['count'])
                print(f"Найдено материалов: {len(materials)}")

                for mat in materials:
                    mat_html = fetch_page(mat['url'])
                    time.sleep(1)
                    if not mat_html:
                        continue

                    metadata = parse_material_metadata(mat_html)
                    print(f"Материал: {mat['title']} (URL: {mat['url']})")
                    print(f"Метаданные: {metadata}")
            time.sleep(2)
        print("Парсинг завершен")
    finally:
        pass
        #db.close()


if __name__ == "__main__":
    main()
