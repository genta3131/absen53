<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Staf TU (Admin dengan akses penuh)
        User::create([
            'name' => 'Admin Staf TU',
            'email' => 'staf_tu@sekolah.com',
            'role' => 'staf_tu',
            'password' => Hash::make('password'),
        ]);

        // Guru Piket (Bisa kelola siswa & input presensi)
        User::create([
            'name' => 'Pak Budi (Guru Piket)',
            'email' => 'guru_piket@sekolah.com',
            'role' => 'guru_piket',
            'password' => Hash::make('password'),
        ]);

        // Guru Mapel (Bisa lihat laporan)
        User::create([
            'name' => 'Bu Ani (Guru Mapel)',
            'email' => 'guru_mapel@sekolah.com',
            'role' => 'guru_mapel',
            'password' => Hash::make('password'),
        ]);

        // Kepala Sekolah (Bisa lihat laporan & audit trail)
        User::create([
            'name' => 'Pak Kepala Sekolah',
            'email' => 'kepsek@sekolah.com',
            'role' => 'kepsek',
            'password' => Hash::make('password'),
        ]);
    }
}
