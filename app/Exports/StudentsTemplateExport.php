<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentsTemplateExport implements WithHeadings
{
    public function headings(): array
    {
        return [
            'nis',
            'nama',
            'kelas',
        ];
    }
}
