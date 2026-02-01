import os
from dotenv import load_dotenv
from .queries import *
import psycopg2
import logging

load_dotenv()
logger = logging.getLogger(__name__)


class DatabaseManager:
    def __init__(self):
        self.conn = None
        self.connect()

    def connect(self):
        try:
            self.conn = psycopg2.connect(
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASSWORD'),
                host=os.getenv('DB_HOST'),
                port=os.getenv('DB_PORT'),
                database=os.getenv('DB_NAME'),
            )
            self.conn.autocommit = True
            logger.info("Подключение к БД установлено")
        except psycopg2.OperationalError as e:
            logger.error(f"Ошибка подключения к БД: {e}")
            self.conn = None

    def execute(self, query, params=None, fetch=False):
        if not self.conn:
            logger.error("Нет соединения с БД")
            return None
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, params)
                if fetch:
                    result = cur.fetchone()
                    if result is None:
                        return None
                    return result[0] if len(result) == 1 else dict(result)
                #self.conn.commit()
                return True
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Ошибка выполнения запроса: {e}\nQuery: {query}\nParams: {params}")
            return None

    def fetchall(self, query, params=None):
        if not self.conn:
            return []
        try:
            with self.conn.cursor() as cur:
                cur.execute(query, params)
                return [dict(row) for row in cur.fetchall()]
        except Exception as e:
            logger.error(f"Ошибка fetchall: {e}")
            return []

    def initialize_db(self):
        if not self.conn:
            return False
        try:
            with self.conn.cursor() as cur:
                for command in INIT_DB_COMMANDS:
                    cur.execute(command)
            #self.conn.commit()
            logger.info("Таблицы успешно созданы")
            return True
        except Exception as e:
            self.conn.rollback()
            logger.error(f"Ошибка инициализации БД: {e}")
            return False

    # def insert_faculty(self, name, url):
    #     result = self.execute(INSERT_FACULTY, (name, url), fetch=True)
    #     if result is not None:
    #         logger.debug(f"Факультет вставлен/обновлён: {name}, ID: {result}")
    #         return result
    #     logger.warning(f"Не удалось вставить факультет: {name}")
    #     return None
    #
    # def insert_department(self, name, url, faculty_id):
    #     result = self.execute(INSERT_DEPARTMENT, (name, url, faculty_id), fetch=True)
    #     if result is not None:
    #         logger.debug(f"Кафедра вставлена: {name}, ID: {result}")
    #         return result
    #     logger.warning(f"Кафедра уже существует: {name} (faculty_id={faculty_id})")
    #     return None
    #
    # def insert_author(self, name):
    #     result = self.execute(INSERT_AUTHOR, name, fetch=True)
    #     if result is not None:
    #         logger.debug(f"Автор вставлен: {name}")
    #         return result
    #     logger.warning(f"Автор уже существует: {name})")
    #     return None
    #
    # def insert_keyword(self, word):
    #     result = self.execute(INSERT_KEYWORD, word, fetch=True)
    #     if result is not None:
    #         logger.debug(f"Ключевое слово вставлено: {word}")
    #         return result
    #     logger.warning(f"Ключевое слово уже существует: {word})")
    #     return None
    #
    # def insert_speciality(self, spec_code, spec_name):
    #     result = self.execute(INSERT_SPECIALTY, (spec_code, spec_name), fetch=True)
    #     if result is not None:
    #         logger.debug(f"Специальность вставлена. Код специальности: {spec_code}. Название специальности: {spec_name}")
    #         return result
    #     logger.warning(f"Специальность уже существует: Код специальности: {spec_code}. Название специальности: {spec_name}")
    #     return None
    #
    # def insert_type(self, material_type):
    #     result = self.execute(INSERT_KEYWORD, material_type, fetch=True)
    #     if result is not None:
    #         logger.debug(f"Тип вставлен: {material_type}")
    #         return result
    #     logger.warning(f"Тип уже существует: {material_type})")
    #     return None
    #
    # def insert_material(self,
    #                     title,
    #                     alternative_title,
    #                     abstract_text,
    #                     language_code,
    #                     publisher,
    #                     citation,
    #                     uri,
    #                     available_date,
    #                     issued_year,
    #                     page,
    #                     department_id):
    #     result = self.execute(INSERT_MATERIAL,
    #                           (title,
    #                            alternative_title,
    #                            abstract_text,
    #                            language_code,
    #                            publisher,
    #                            citation,
    #                            uri,
    #                            available_date,
    #                            issued_year,
    #                            page,
    #                            department_id),
    #                           fetch=True)
    #     if result is not None:
    #         logger.debug(
    #             f"Материал добавлен. Название материала: {title}. Ссылка: {uri}")
    #         return result
    #     logger.warning(
    #         f"Материал уже существует. Название материала: {title}. Ссылка: {uri}")
    #     return None
    #
    # def insert_material_author(self, material_id, author_id):
    #     result = self.execute(INSERT_MATERIAL_AUTHOR, (material_id, author_id), fetch=True)
    #     if result is not None:
    #         logger.debug(
    #             f"Автор материала добавлен. ID материала: {material_id}. ID автора: {author_id}")
    #         return result
    #     logger.warning(
    #         f"Автор материала уже добавлен. ID материала: {material_id}. ID автора: {author_id}")
    #     return None
    #
    # def insert_material_keyword(self, material_id, keyword_id):
    #     result = self.execute(INSERT_MATERIAL_KEYWORD, (material_id, keyword_id), fetch=True)
    #     if result is not None:
    #         logger.debug(
    #             f"Ключевое слово для материала добавлено. ID материала: {material_id}. ID ключевого слова: {keyword_id}")
    #         return result
    #     logger.warning(
    #         f"Ключевое слово для материала уже добавлено. ID материала: {material_id}. ID ключевого слова: {keyword_id}")
    #     return None
    #
    # def insert_material_speciality(self, material_id, specialty_id):
    #     result = self.execute(INSERT_MATERIAL_SPECIALTY, (material_id, specialty_id), fetch=True)
    #     if result is not None:
    #         logger.debug(
    #             f"Специальность для материала добавлена. ID материала: {material_id}. ID специальности: {specialty_id}")
    #         return result
    #     logger.warning(
    #         f"Специальность для материала уже добавлена. ID материала: {material_id}. ID специальности: {specialty_id}")
    #     return None

    def close(self):
        if self.conn:
            self.conn.close()
            logger.info("Соединение с БД закрыто")
            self.conn = None