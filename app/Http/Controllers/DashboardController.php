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
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        // 1. Ringkasan Hari Ini (Kode Lama - Tetap Dipakai)
        $summary = [
            'sakit' => Attendance::whereDate('tanggal', $today)->where('status', 'Sakit')->count(),
            'izin' => Attendance::whereDate('tanggal', $today)->where('status', 'Izin')->count(),
            'alpa' => Attendance::whereDate('tanggal', $today)->where('status', 'Alpa')->count(),
            'terlambat' => Attendance::whereDate('tanggal', $today)->where('status', 'Terlambat')->count(),
            'hadir' => Attendance::whereDate('tanggal', $today)->where('status', 'Hadir')->count(),
        ];
        $summary['total'] = array_sum($summary);

        // 2. DATA BARU: Grafik Statistik Bulan Ini (Group by Status)
        // Menghitung total Sakit/Izin/Alpa/Terlambat selama 1 bulan penuh
        $monthlyStats = [
            ['name' => 'Hadir', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Hadir')->count()],
            ['name' => 'Sakit', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Sakit')->count()],
            ['name' => 'Izin', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Izin')->count()],
            ['name' => 'Alpa', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Alpa')->count()],
            ['name' => 'Terlambat', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Terlambat')->count()],
        ];

        // 3. DATA BARU: Top 5 Kelas Sering Terlambat Bulan Ini
        // Kita perlu join tabel attendances dengan students untuk tahu kelasnya
        $topLateClasses = \Illuminate\Support\Facades\DB::table('attendances')
            ->join('students', 'attendances.student_id', '=', 'students.id')
            ->select('students.kelas', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->where('attendances.status', 'Terlambat')
            ->whereBetween('attendances.tanggal', [$startOfMonth, $endOfMonth])
            ->groupBy('students.kelas')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // 4. Riwayat Hari Ini
        $todaysAttendances = Attendance::with('student')
            ->whereDate('tanggal', $today)
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'summary' => $summary,
            'todaysAttendances' => $todaysAttendances,
            'monthlyStats' => $monthlyStats, // Kirim data grafik
            'topLateClasses' => $topLateClasses // Kirim data top 5
        ]);
    }
}
