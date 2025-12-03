<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // 1. Hitung Ringkasan untuk Hari Ini (Sesuai PDF Hal 17: Ringkasan)
        $summary = [
            'sakit' => Attendance::whereDate('tanggal', $today)->where('status', 'Sakit')->count(),
            'izin' => Attendance::whereDate('tanggal', $today)->where('status', 'Izin')->count(),
            'alpa' => Attendance::whereDate('tanggal', $today)->where('status', 'Alpa')->count(),
            'terlambat' => Attendance::whereDate('tanggal', $today)->where('status', 'Terlambat')->count(),
            'hadir' => Attendance::whereDate('tanggal', $today)->where('status', 'Hadir')->count(),
        ];
        
        // Hitung total data masuk
        $summary['total'] = array_sum($summary);

        // 2. Ambil Daftar Riwayat Presensi Hari Ini untuk Tabel Bawah
        $todaysAttendances = Attendance::with('student')
            ->whereDate('tanggal', $today)
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'summary' => $summary,
            'todaysAttendances' => $todaysAttendances
        ]);
    }
}
