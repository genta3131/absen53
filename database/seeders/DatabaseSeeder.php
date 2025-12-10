<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Login (User)
        User::create([
            'name' => 'Guru Piket',
            'email' => 'piket@sekolah.id',
            'password' => Hash::make('password'),
            'role' => 'guru_piket',
        ]);

        User::create([
            'name' => 'Kepala Sekolah',
            'email' => 'kepsek@sekolah.id',
            'password' => Hash::make('password'),
            'role' => 'kepsek',
        ]);
        
        User::create([
            'name' => 'Staf Tata Usaha',
            'email' => 'tu@sekolah.id',
            'password' => Hash::make('password'),
            'role' => 'staf_tu',
        ]);

        // 2a. Anggota Kelompok (JANGAN DIHAPUS) - Kelas X-1
        $specificStudents = [
            ['nis' => '1512622026', 'nama' => 'Genta Abdi Fathir', 'kelas' => 'X-1'],
            ['nis' => '1512622038', 'nama' => 'Frasetia Adi Kusuma', 'kelas' => 'X-1'],
            ['nis' => '1512622006', 'nama' => 'Muhammad Ramdany', 'kelas' => 'X-1'],
            ['nis' => '1512622041', 'nama' => 'Puja Putri Maisyaroh', 'kelas' => 'X-1'],
        ];

        foreach ($specificStudents as $student) {
            Student::create($student);
        }

        // 2b. Buat Data Siswa Otomatis (X-1 s/d XII-7)
        $faker = Faker::create('id_ID'); // Pakai nama orang Indonesia
        
        // Daftar Tingkat Kelas
        $grades = ['X', 'XI', 'XII'];
        
        $nisCounter = 20240001; // NIS Awal

        foreach ($grades as $grade) {
            // Loop kelas 1 sampai 7 (Misal X-1 s/d X-7)
            for ($kelasNum = 1; $kelasNum <= 7; $kelasNum++) {
                
                // Format Nama Kelas (misal: X-2, XII-7)
                $namaKelas = "{$grade}-{$kelasNum}";

                // Buat 10 Siswa per Kelas
                for ($s = 1; $s <= 10; $s++) {
                    Student::create([
                        'nis' => (string) $nisCounter++, // NIS otomatis nambah
                        'nama' => $faker->name, // Nama otomatis random
                        'kelas' => $namaKelas,
                    ]);
                }
            }
        }
    }
}
