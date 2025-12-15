const fs = require('fs');
const path = require('path');

const csvFilePath = "d:\\Thực tập stuff\\DF with React Only\\Data Mart Kết quả học tập.csv";
const outputFilePath = "d:\\Thực tập stuff\\DF with React Only\\src\\data.ts";

try {
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split(/\r?\n/).filter(line => line.trim() !== '');

    // Headers are: "gender","race_ethnicity","parental_education","math","math_score","reading","reading_score","writing","writing_score"
    // We skip the first line
    const data = [];

    // Regex to handle quoted strings properly: split by comma, but ignore commas inside quotes
    const splitCSV = (str) => {
        const result = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"') {
                inQuote = !inQuote;
            } else if (char === ',' && !inQuote) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current);
        return result.map(s => s.replace(/^"|"$/g, '')); // Remove surrounding quotes
    };

    for (let i = 1; i < lines.length; i++) {
        const columns = splitCSV(lines[i]);
        if (columns.length < 9) continue;

        const record = {
            id: i,
            gender: columns[0],
            race_ethnicity: columns[1],
            parental_education: columns[2],
            math_label: columns[3],
            math_score: parseInt(columns[4]) || 0,
            reading_label: columns[5],
            reading_score: parseInt(columns[6]) || 0,
            writing_label: columns[7],
            writing_score: parseInt(columns[8]) || 0,
            status: "active",
            lastUpdate: "2024-01-15"
        };
        data.push(record);
    }

    const tsContent = `export const fullMockData = ${JSON.stringify(data, null, 4)};`;

    fs.writeFileSync(outputFilePath, tsContent);
    console.log(`Successfully converted ${data.length} records to ${outputFilePath}`);

} catch (err) {
    console.error('Error:', err);
}
