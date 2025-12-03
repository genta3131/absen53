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
        // Guru Piket account
        User::firstOrCreate(
            ['email' => 'piket@sekolah.id'],
            [
                'name' => 'Pak Budi (Guru Piket)',
                'password' => Hash::make('password'),
                'role' => 'guru_piket',
            ]
        );

        // Kepala Sekolah account
        User::firstOrCreate(
            ['email' => 'kepsek@sekolah.id'],
            [
                'name' => 'Ibu Kepsek',
                'password' => Hash::make('password'),
                'role' => 'kepsek',
            ]
        );

        // Student seed data
        $students = [
            ['nis' => '1512622026', 'nama' => 'Genta Abdi Fathir', 'kelas' => 'XII-RPL'],
            ['nis' => '1512622038', 'nama' => 'Frasetia Adi Kusuma', 'kelas' => 'XII-RPL'],
            ['nis' => '1512622006', 'nama' => 'Muhammad Ramdany', 'kelas' => 'XII-TKJ'],
            ['nis' => '1512622041', 'nama' => 'Puja Putri Maisyaroh', 'kelas' => 'XII-TKJ'],
        ];

        foreach ($students as $student) {
            Student::firstOrCreate(['nis' => $student['nis']], $student);
        }
    }
}
