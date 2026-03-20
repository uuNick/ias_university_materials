import os
import pandas as pd
from db.manager import DatabaseManager


def main():
    db = DatabaseManager()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    excel_file = os.path.join(project_root, "data", "disciplines.xlsx")
    sheet_name = "2026"

    if not os.path.exists(excel_file):
        print(excel_file)
        print(f"Файл {excel_file} не найден")
        return

    df = pd.read_excel(excel_file, sheet_name=sheet_name)
    df.columns = ['dept', 'disc', 'spec', 'year']

    print(f"Импорт {len(df)} строк...")

    success_count = 0
    for index, row in df.iterrows():
        raw_year = str(row['year']).replace(' ', '').replace('\xa0', '')
        year = int(float(raw_year))
        res = db.insert_discipline_data(
            str(row['dept']).strip(),
            str(row['disc']).strip(),
            str(row['spec']).strip(),
            year
        )
        if res:
            success_count += 1

        if index % 50 == 0:
            print(f"Обработано {index} строк...")

    print(f"Добавлено/обновлено записей: {success_count}")
    db.close()


if __name__ == "__main__":
    main()