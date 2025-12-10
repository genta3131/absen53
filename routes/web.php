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
        // CRUD Siswa - View Only (Boleh staf_tu & guru_piket)
        Route::get('/students', [StudentController::class, 'index'])->name('students.index');

        // CRUD Siswa - Full Access (Hanya staf_tu)
        Route::middleware(['role:staf_tu'])->group(function () {
            Route::get('/students/create', [StudentController::class, 'create'])->name('students.create');
            Route::post('/students', [StudentController::class, 'store'])->name('students.store');
            Route::get('/students/{student}/edit', [StudentController::class, 'edit'])->name('students.edit');
            Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
            Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
            Route::post('/students/import', [StudentController::class, 'import'])->name('students.import');
            Route::get('/students/import/template', [StudentController::class, 'downloadTemplate'])->name('students.import.template');

            // Grade Promotion
            Route::get('/students/promotion', [\App\Http\Controllers\GradePromotionController::class, 'create'])->name('students.promotion');
            Route::post('/students/promotion', [\App\Http\Controllers\GradePromotionController::class, 'store'])->name('students.promotion.store');
        });
        
        // Input Presensi
        Route::get('/attendance/input', [\App\Http\Controllers\AttendanceController::class, 'create'])->name('attendance.create');
        Route::post('/attendance', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendance.store');

        // Tambahan Route Edit Presensi
        Route::get('/attendance/{attendance}/edit', [\App\Http\Controllers\AttendanceController::class, 'edit'])->name('attendance.edit');
        Route::put('/attendance/{attendance}', [\App\Http\Controllers\AttendanceController::class, 'update'])->name('attendance.update');
    });

    // 3. KHUSUS KEPALA SEKOLAH, STAF TU & GURU MAPEL (Boleh Lihat Laporan)
    Route::middleware(['role:kepsek,staf_tu,guru_mapel'])->group(function () {
        Route::get('/reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
        Route::get('/reports/export/excel', [\App\Http\Controllers\ReportController::class, 'exportExcel'])->name('reports.export.excel');
        Route::get('/reports/export/pdf', [\App\Http\Controllers\ReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });

    // 4. KHUSUS STAF TU (Boleh Kelola Akun - SUPER POWER)
    Route::middleware(['role:staf_tu'])->group(function () {
        Route::resource('users', \App\Http\Controllers\UserController::class);
    });
});

require __DIR__.'/settings.php';
