import requests
from bs4 import BeautifulSoup
import re
import time
import logging

logger = logging.getLogger(__name__)


class SiteCrawler:
    def __init__(self, base_url: str, faculties_link: str):
        self.base_url = base_url
        self.faculties_link = faculties_link

    def fetch_page(self, url: str):
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.text
        except requests.RequestException as e:
            logger.error(f"Ошибка при запросе {url}: {e}")
            return None

    def get_faculties_url(self, main_page):
        soup = BeautifulSoup(main_page, 'html.parser')
        faculties_link = soup.find('a', href=self.faculties_link)
        if not faculties_link:
            logger.error(f"Ссылка {faculties_link} на факультеты не найдена")
            return
        faculties_url = self.base_url + faculties_link['href']
        return faculties_url

    def parse_communities(self, html: str):
        soup = BeautifulSoup(html, 'html.parser')
        communities = []

        community_list_head = soup.find('h2', class_='ds-list-head')
        if not community_list_head:
            return communities

        community_list_ul = community_list_head.find_next_sibling('ul')
        if not community_list_ul:
            return communities

        for li in community_list_ul.find_all('li'):
            a_tag = li.find('a', href=True)
            if not a_tag:
                continue

            name_span = a_tag.find('span', class_='Z3988')
            name = name_span.get_text(strip=True) if name_span else None
            relative_url = a_tag['href']
            count_text = li.get_text(strip=True)
            match = re.search(r'\[(\d+)\]', count_text)
            count = int(match.group(1)) if match else 0

            if name and relative_url:
                communities.append({
                    'name': name,
                    'url': self.base_url + relative_url,
                    'relative_path': relative_url,
                    'count': count
                })
        return communities

    def parse_materials_list(self, html: str):
        """Извлекает список ссылок на материалы со страницы кафедры."""
        soup = BeautifulSoup(html, 'html.parser')
        materials = []

        artifact_list = soup.find('ul', class_='ds-artifact-list')
        if not artifact_list:
            return materials

        for li in artifact_list.find_all('li', class_='ds-artifact-item'):
            description = li.find('div', class_='artifact-description')
            if description:
                title_a = description.find('a')
                if title_a:
                    materials.append({
                        'title': title_a.text.strip(),
                        'url': self.base_url + title_a['href'] + '?show=full',
                        'relative_path': title_a['href']
                    })
        return materials

    def get_all_materials(self, dept_url, count):
        materials = []
        offset = 0
        page_size = 20
        while offset < count:
            page_url = f"{dept_url}/recent-submissions?offset={offset}"
            html = self.fetch_page(page_url)
            if not html:
                break

            page_materials = self.parse_materials_list(html)
            materials.extend(page_materials)

            if len(page_materials) < page_size:
                break

            offset += page_size

        return materials

    def parse_material_metadata(self, html: str):
        """Парсит детальные метаданные конкретного материала из таблицы."""
        soup = BeautifulSoup(html, 'html.parser')
        metadata = {
            'title': None, 'creator': [], 'abstract': None,
            'issued': None, 'pages': 0, 'identifier': None,
            'subject': [], 'type': [], 'spec': [], 'udc': []
        }

        table = soup.find('table', class_='ds-includeSet-table detailtable')
        if not table:
            return metadata

        for row in table.find_all('tr'):
            cells = row.find_all(['td', 'th'])
            if len(cells) < 2:
                continue

            label = cells[0].get_text(strip=True).lower()
            raw_text = cells[1].get_text(strip=True)
            values = [v.strip() for v in raw_text.split('|') if v.strip()]

            if 'author' in label:
                metadata['creator'].extend(values)
            elif 'available' in label:
                metadata['available'] = values[0]
            elif 'issued' in label:
                metadata['issued'] = values[0]
            elif 'abstract' in label:
                metadata['abstract'] = values[0]
            elif 'language' in label:
                metadata['language'] = values[0]
            elif 'publisher' in label:
                metadata['publisher'] = values[0]
            elif 'uri' in label:
                metadata['identifier'] = values[0]
            elif 'dc.title' == label:
                metadata['title'] = values[0]
            elif 'citation' in label:
                metadata['bibliographic_citation'] = values[0]
                match = re.search(r'-\s*(\d+)\s*с\.', values[0])
                if match:
                    pages = int(match.group(1))
                    metadata['pages'] = pages
            elif 'dc.subject' == label:
                metadata['subject'].extend(values)
            elif 'alternative' in label:
                metadata['title_alternative'] = values[0]
            elif 'type' in label:
                metadata['type'].extend(values)
            elif 'spec' in label:
                metadata['spec'].extend(values)
            elif 'udc' in label:
                metadata['udc'].extend(values)

        file_link = soup.find('div', class_='file-link').find('a').get('href')
        metadata['file_link'] = self.base_url + file_link

        return metadata