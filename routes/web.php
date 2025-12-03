<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. SEMUA PENGGUNA (Boleh masuk Dashboard)
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // 2. KHUSUS STAF TU & GURU PIKET (Boleh Kelola Data Siswa & Presensi)
    Route::middleware(['role:staf_tu,guru_piket'])->group(function () {
        // CRUD Siswa
        Route::get('/students', [StudentController::class, 'index'])->name('students.index');
        Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
        Route::post('/students', [StudentController::class, 'store'])->name('students.store');
        Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
        Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
        
        // Input Presensi
        Route::get('/attendance/input', [\App\Http\Controllers\AttendanceController::class, 'create'])->name('attendance.create');
        Route::post('/attendance', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');
    });

    // 3. KHUSUS KEPALA SEKOLAH, STAF TU & GURU MAPEL (Boleh Lihat Laporan)
    Route::middleware(['role:kepsek,staf_tu,guru_mapel'])->group(function () {
        Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    });

    // 4. KHUSUS STAF TU (Boleh Kelola Akun - SUPER POWER)
    Route::middleware(['role:staf_tu'])->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
});

require __DIR__.'/settings.php';
