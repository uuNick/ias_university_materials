#from fastapi import FastAPI, BackgroundTasks
import os
from app.providers.db_manager import DatabaseManager
from app.providers.parser import SiteCrawler
from app.repositories.material_repository import MaterialRepository
from app.services.parser_service import ParserService
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(name)s | %(message)s',
    datefmt='%H:%M:%S'
)
logger = logging.getLogger(__name__)


BASE_URL = os.getenv("BASE_URL")
FACULTIES_LINK = os.getenv("FACULTIES_LINK")


def start_app():
    db_manager = DatabaseManager()
    success = db_manager.initialize_db()
    if success:
        logger.info("База данных готова к работе")
    else:
        logger.info("Критическая ошибка при подготовке БД")
        return

    crawler = SiteCrawler(base_url=BASE_URL, faculties_link=FACULTIES_LINK)
    repository = MaterialRepository(db_manager)
    parser_service = ParserService(crawler, repository)
    parser_service.run_full_sync()


if __name__ == "__main__":
    start_app()



