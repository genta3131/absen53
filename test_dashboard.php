<?php
use App\Models\Attendance;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

try {
    $today = Carbon::today();
    $startOfMonth = Carbon::now()->startOfMonth();
    $endOfMonth = Carbon::now()->endOfMonth();

    echo "Checking Summary...\n";
    $summary = [
        'sakit' => Attendance::whereDate('tanggal', $today)->where('status', 'Sakit')->count(),
        'izin' => Attendance::whereDate('tanggal', $today)->where('status', 'Izin')->count(),
        'alpa' => Attendance::whereDate('tanggal', $today)->where('status', 'Alpa')->count(),
        'terlambat' => Attendance::whereDate('tanggal', $today)->where('status', 'Terlambat')->count(),
        'hadir' => Attendance::whereDate('tanggal', $today)->where('status', 'Hadir')->count(),
    ];
    print_r($summary);

    echo "Checking Monthly Stats...\n";
    $monthlyStats = [
        ['name' => 'Hadir', 'jumlah' => Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Hadir')->count()],
    ];
    print_r($monthlyStats);

    echo "Checking Top Late Classes...\n";
    $topLateClasses = DB::table('attendances')
        ->join('students', 'attendances.student_id', '=', 'students.id')
        ->select('students.kelas', DB::raw('count(*) as total'))
        ->where('attendances.status', 'Terlambat')
        ->whereBetween('attendances.tanggal', [$startOfMonth, $endOfMonth])
        ->groupBy('students.kelas')
        ->orderByDesc('total')
        ->limit(5)
        ->get();
    print_r($topLateClasses);
    
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
