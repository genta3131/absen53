<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

use App\Exports\AttendanceExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\PDF as PdfFacade;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // 1. Ambil tanggal dari filter, kalau tidak ada pakai hari ini
        $startDate = $request->input('startDate', Carbon::today()->toDateString());
        $endDate = $request->input('endDate', Carbon::today()->toDateString());
        $kelas = $request->input('kelas'); // Opsional: Filter per kelas

        // 2. Query Data Presensi
        $query = Attendance::with('student')
            ->whereBetween('tanggal', [$startDate, $endDate]);

        // Jika ada filter kelas, tambahkan kondisi
        if ($kelas) {
            $query->whereHas('student', function($q) use ($kelas) {
                $q->where('kelas', $kelas);
            });
        }

        $attendances = $query->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // 3. Kirim ke Frontend
        return Inertia::render('Reports/Index', [
            'attendances' => $attendances,
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'kelas' => $kelas
            ],
            // Kirim daftar kelas unik untuk dropdown filter
            'classes' => \App\Models\Student::select('kelas')->distinct()->pluck('kelas')
        ]);
    }

    public function exportExcel(Request $request)
    {
        $startDate = $request->input('startDate', Carbon::today()->toDateString());
        $endDate = $request->input('endDate', Carbon::today()->toDateString());
        $kelas = $request->input('kelas');

        return Excel::download(new AttendanceExport($startDate, $endDate, $kelas), 'laporan-presensi-' . $startDate . '-sd-' . $endDate . '.xlsx');
    }

    public function exportPdf(Request $request)
    {
        $startDate = $request->input('startDate', Carbon::today()->toDateString());
        $endDate = $request->input('endDate', Carbon::today()->toDateString());
        $kelas = $request->input('kelas');

        $query = Attendance::with('student')
            ->whereBetween('tanggal', [$startDate, $endDate]);

        if ($kelas) {
            $query->whereHas('student', function($q) use ($kelas) {
                $q->where('kelas', $kelas);
            });
        }

        $attendances = $query->orderBy('tanggal', 'desc')->orderBy('created_at', 'desc')->get();

        $pdf = PdfFacade::loadView('exports.attendance_pdf', [
            'attendances' => $attendances,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'kelas' => $kelas
        ]);

        return $pdf->download('laporan-presensi-' . $startDate . '-sd-' . $endDate . '.pdf');
    }
}
