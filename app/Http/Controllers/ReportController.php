<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil tanggal dari filter, kalau tidak ada pakai hari ini
        $date = $request->input('date', Carbon::today()->toDateString());
        $kelas = $request->input('kelas'); // Opsional: Filter per kelas

        // 2. Query Data Presensi
        $query = Attendance::with('student')
            ->whereDate('tanggal', $date);

        // Jika ada filter kelas, tambahkan kondisi
        if ($kelas) {
            $query->whereHas('student', function($q) use ($kelas) {
                $q->where('kelas', $kelas);
            });
        }

        $attendances = $query->orderBy('created_at', 'desc')->get();

        // 3. Kirim ke Frontend
        return Inertia::render('Reports/Index', [
            'attendances' => $attendances,
            'filters' => [
                'date' => $date,
                'kelas' => $kelas
            ],
            // Kirim daftar kelas unik untuk dropdown filter
            'classes' => \App\Models\Student::select('kelas')->distinct()->pluck('kelas')
        ]);
    }
}
