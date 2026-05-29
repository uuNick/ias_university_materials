import os
from fastapi import APIRouter, BackgroundTasks, Depends
from app.services.parser_service import ParserService
from app.services.excel_service import ExcelService
from app.services.specialty_service import SpecialtyService
from app.providers.db_manager import DatabaseManager
from app.providers.parser import SiteCrawler
from app.repositories.material_repository import MaterialRepository
from app.repositories.discipline_repository import DisciplineRepository

router = APIRouter(prefix="/api/parser", tags=["Parser"])


def get_parser_service():
    db_manager = DatabaseManager()
    crawler = SiteCrawler(
        base_url=os.getenv("BASE_URL"),
        faculties_link=os.getenv("FACULTIES_LINK")
    )
    repository = MaterialRepository(db_manager)
    return ParserService(crawler, repository)


def get_excel_service():
    db_manager = DatabaseManager()
    repository = DisciplineRepository(db_manager)
    return ExcelService(repository)


def get_specialty_service():
    db_manager = DatabaseManager()
    repository = MaterialRepository(db_manager)
    return SpecialtyService(repository)


@router.post("/start")
async def start_parser_endpoint(
        background_tasks: BackgroundTasks,
        service: ParserService = Depends(get_parser_service)
):
    background_tasks.add_task(service.run_full_sync)

    return {
        "status": "accepted",
        "message": "Процесс парсинга запущен в фоновом режиме"
    }


@router.post("/import_disciplines")
async def import_disciplines_endpoint(
        background_tasks: BackgroundTasks,
        service: ExcelService = Depends(get_excel_service)
):

    background_tasks.add_task(service.import_disciplines_from_excel)

    return {
        "status": "accepted",
        "message": f"Импорт дисциплин из файла запущен в фоновом режиме"
    }


@router.post("/import_specialties")
async def import_specialties_endpoint(
        background_tasks: BackgroundTasks,
        service: SpecialtyService = Depends(get_specialty_service)
):
    background_tasks.add_task(service.import_specialties_from_file)

    return {
        "status": "accepted",
        "message": f"Импорт специальностей из файла запущен в фоновом режиме"
    }
