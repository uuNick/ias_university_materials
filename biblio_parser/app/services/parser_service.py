import os
import httpx
import time
import logging
import re

logger = logging.getLogger(__name__)


class ParserService:
    def __init__(self, crawler, repository):
        self.crawler = crawler
        self.repo = repository
        self.ai_reindex_url = os.getenv("AI_SERVER_URL_REINDEX")
        self.chunk_size = 50

    def run_full_sync(self):
        logger.info("Запуск парсера электронной библиотеки...")

        # Получить главную страницу
        main_html = self.crawler.fetch_page(self.crawler.base_url)
        if not main_html:
            logger.error("Не удалось загрузить главную страницу")
            return

        # Получить страницу факультетов
        faculties_link = self.crawler.base_url + self.crawler.faculties_link
        faculties_html = self.crawler.fetch_page(faculties_link)
        if not faculties_html:
            logger.error("Не удалось загрузить страницу факультетов")
            return

        faculties = self.crawler.parse_communities(faculties_html)
        logger.info(f"Найдено факультетов для обработки: {len(faculties)}")

        for fac_data in faculties:
            faculty_id = self.repo.save_faculty(fac_data['name'], fac_data['url'])
            if not faculty_id:
                continue

            logger.info(f"Обработка факультета: {fac_data['name']}")

            # Для каждого факультета получить его страницу и парсить кафедры
            fac_html = self.crawler.fetch_page(fac_data['url'])
            if not fac_html:
                continue

            departments = self.crawler.parse_communities(fac_html)

            for dept_data in departments:
                dept_id = self.repo.save_department(dept_data['name'], dept_data['url'], faculty_id)
                if not dept_id:
                    continue

                logger.info(f"Кафедра: {dept_data['name']} (материалов: {dept_data['count']})")

                # Получить список всех материалов кафедры
                materials_list = self.crawler.get_all_materials(dept_data['url'], dept_data['count'])

                materials_batch = []

                for index, mat_info in enumerate(materials_list, start=1):
                    mat_html = self.crawler.fetch_page(mat_info['url'])
                    if not mat_html:
                        continue

                    metadata = self.crawler.parse_material_metadata(mat_html)

                    material_tuple = (
                        metadata.get('title') or mat_info['title'],
                        metadata.get('title_alternative'),
                        metadata.get('abstract'),
                        metadata.get('language', 'ru'),
                        metadata.get('publisher'),
                        metadata.get('bibliographic_citation'),
                        metadata.get('identifier'),
                        metadata.get('available'),
                        metadata.get('issued'),
                        metadata.get('pages'),
                        metadata.get('file_link'),
                        dept_id,
                        metadata.get('creator', []),
                        metadata.get('subject', []),
                        metadata.get('type', []),
                        metadata.get('udc', []),
                        metadata.get('spec', [])
                    )

                    materials_batch.append(material_tuple)

                    if index % 10 == 0 or index == len(materials_list):
                        logger.info(f"Собрано метаданных: {index} из {len(materials_list)}")

                    if len(materials_batch) >= self.chunk_size:
                        logger.info(f"Достигнут лимит пачки ({self.chunk_size}). Запись в БД...")
                        self.repo.save_materials_batch(materials_batch)
                        materials_batch.clear()

                    #time.sleep(0.1)

                    # mat_id = self.repo.save_material(
                    #     title=metadata.get('title') or mat_info['title'],
                    #     uri=metadata.get('identifier'),
                    #     file_link=metadata.get('file_link'),
                    #     department_id=dept_id,
                    #     alternative_title=metadata.get('title_alternative'),
                    #     abstract_text=metadata.get('abstract'),
                    #     language_code=metadata.get('language', 'ru'),
                    #     publisher=metadata.get('publisher'),
                    #     citation=metadata.get('bibliographic_citation'),
                    #     available_date=metadata.get('available'),
                    #     issued_year=metadata.get('issued'),
                    #     pages=metadata.get('pages')
                    # )

                    # if mat_id:
                    #     self._save_related_entities(mat_id, metadata)

                    #time.sleep(0.1)

                if materials_batch:
                    logger.info(f"Запись пакета из {len(materials_batch)} материалов в БД...")
                    self.repo.save_materials_batch(materials_batch)

        logger.info("Парсинг завершен")
        self.notify_ai_server()

    def _save_related_entities(self, material_id, metadata):
        """Вспомогательный метод для сохранения связей многие-ко-многим."""

        # Авторы
        for author_name in metadata.get('creator', []):
            author_id = self.repo.save_author(author_name)
            if author_id:
                self.repo.save_material_author(material_id, author_id)

        # Ключевые слова
        for word in metadata.get('subject', []):
            kw_id = self.repo.save_keyword(word)
            if kw_id:
                self.repo.save_material_keyword(material_id, kw_id)

        # Типы материалов
        for type_name in metadata.get('type', []):
            t_id = self.repo.save_type(type_name)
            if t_id:
                self.repo.save_material_type(material_id, t_id)

        # Коды УДК
        # Формат: "004.42 Название" или просто "004.42"
        for udc_entry in metadata.get('udc', []):
            # Разбиваем по первому пробелу
            parts = udc_entry.split(' ', 1)
            udc_code = parts[0].strip()
            udc_name = parts[1].strip() if len(parts) > 1 else None

            self.repo.save_udc_code(udc_code, udc_name)
            self.repo.save_material_udc(material_id, udc_code)

        # Специальности
        for spec_entry in metadata.get('spec', []):
            match = re.match(r'^([0-9.\- ]+)\s+(.*)', spec_entry.strip())

            if match:
                spec_code = match.group(1).strip()
                spec_name = match.group(2).strip()
                logger.info(spec_code, spec_name)
                self.repo.save_specialty(spec_code, spec_name)
                self.repo.save_material_specialty(material_id, spec_code)

    def notify_ai_server(self):
        if not self.ai_reindex_url:
            logger.warning("URL сервера ИИ не настроен")
            return
        logger.info(f"Отправка запроса на создание/обновление векторов материалов: {self.ai_reindex_url}")
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(self.ai_reindex_url)
                if response.status_code == 200:
                    logger.info("Сервер ИИ успешно принял задачу на создание/обновление векторов материалов")
                else:
                    logger.error(f"Сервер ИИ вернул ошибку: {response.status_code}")
        except Exception as e:
            logger.error(f"Не удалось связаться с сервером ИИ: {e}")

