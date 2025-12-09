<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentsImport implements ToModel, WithHeadingRow, WithValidation
{
    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        return new Student([
            'nis'   => $row['nis'],
            'nama'  => $row['nama'],
            'kelas' => $row['kelas'],
        ]);
    }

    public function rules(): array
    {
        return [
            'nis' => 'required|numeric|unique:students,nis',
            'nama' => 'required|string',
            'kelas' => ['required', 'string', function ($attribute, $value, $fail) {
                // Validasi format kelas: X-1 s/d X-7, XI-1 s/d XI-7, XII-1 s/d XII-7
                $validClasses = [];
                foreach (['X', 'XI', 'XII'] as $level) {
                    for ($i = 1; $i <= 7; $i++) {
                        $validClasses[] = "$level-$i";
                    }
                }
                
                if (!in_array($value, $validClasses)) {
                    $fail("Kelas tidak valid. Pilih antara X-1 s/d XII-7.");
                }
            }],
        ];
    }
}
