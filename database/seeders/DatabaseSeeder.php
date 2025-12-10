<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call UserSeeder untuk membuat user dengan berbagai role
        $this->call(UserSeeder::class);

        // Student seed data
        $students = [
            ['nis' => '1512622026', 'nama' => 'Genta Abdi Fathir', 'kelas' => 'X-1'],
            ['nis' => '1512622038', 'nama' => 'Frasetia Adi Kusuma', 'kelas' => 'X-1'],
            ['nis' => '1512622006', 'nama' => 'Muhammad Ramdany', 'kelas' => 'X-1'],
            ['nis' => '1512622041', 'nama' => 'Puja Putri Maisyaroh', 'kelas' => 'X-1'],
        ];

        foreach ($students as $student) {
            Student::firstOrCreate(['nis' => $student['nis']], $student);
        }
    }
}
