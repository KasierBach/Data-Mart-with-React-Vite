import csv
import json
import os

csv_file_path = r"d:\Thực tập stuff\DF with React Only\Data Mart Kết quả học tập.csv"
output_file_path = r"d:\Thực tập stuff\DF with React Only\src\data.ts"

data = []

try:
    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        # The CSV seems to have headers based on the view_file output:
        # "gender","race_ethnicity","parental_education","math","math_score","reading","reading_score","writing","writing_score"
        reader = csv.DictReader(csvfile)
        
        for index, row in enumerate(reader):
            record = {
                "id": index + 1,
                "gender": row["gender"],
                "race_ethnicity": row["race_ethnicity"],
                "parental_education": row["parental_education"],
                "math_label": row["math"],
                "math_score": int(row["math_score"]),
                "reading_label": row["reading"],
                "reading_score": int(row["reading_score"]),
                "writing_label": row["writing"],
                "writing_score": int(row["writing_score"]),
                "status": "active",
                "lastUpdate": "2024-01-15"
            }
            data.append(record)

    ts_content = f"import {{ DataRecord }} from './App';\n\nexport const fullMockData: DataRecord[] = {json.dumps(data, indent=4)};"
    
    # We need to export the interface in App.tsx or redefine it here. 
    # To avoid circular dependency or type errors if I import from App, I'll just omit the type annotation in the export 
    # or ANY type, but better to just export as const and let inference work or use 'any'.
    # Actually, let's just make it a simple export.
    ts_content = f"export const fullMockData = {json.dumps(data, indent=4)};"

    with open(output_file_path, mode='w', encoding='utf-8') as outfile:
        outfile.write(ts_content)
    
    print(f"Successfully converted {len(data)} records to {output_file_path}")

except Exception as e:
    print(f"Error: {e}")
