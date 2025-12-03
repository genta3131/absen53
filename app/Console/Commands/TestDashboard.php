<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TestDashboard extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:dashboard';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test dashboard queries';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Dashboard Test...');

        try {
            $today = \Carbon\Carbon::today();
            $startOfMonth = \Carbon\Carbon::now()->startOfMonth();
            $endOfMonth = \Carbon\Carbon::now()->endOfMonth();

            $this->info("Checking Summary...");
            $summary = [
                'sakit' => \App\Models\Attendance::whereDate('tanggal', $today)->where('status', 'Sakit')->count(),
                'izin' => \App\Models\Attendance::whereDate('tanggal', $today)->where('status', 'Izin')->count(),
                'alpa' => \App\Models\Attendance::whereDate('tanggal', $today)->where('status', 'Alpa')->count(),
                'terlambat' => \App\Models\Attendance::whereDate('tanggal', $today)->where('status', 'Terlambat')->count(),
                'hadir' => \App\Models\Attendance::whereDate('tanggal', $today)->where('status', 'Hadir')->count(),
            ];
            $this->table(['Status', 'Count'], array_map(function($k, $v) { return [$k, $v]; }, array_keys($summary), $summary));

            $this->info("Checking Monthly Stats...");
            $monthlyStats = [
                ['name' => 'Hadir', 'jumlah' => \App\Models\Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Hadir')->count()],
                ['name' => 'Sakit', 'jumlah' => \App\Models\Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Sakit')->count()],
                ['name' => 'Izin', 'jumlah' => \App\Models\Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Izin')->count()],
                ['name' => 'Alpa', 'jumlah' => \App\Models\Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Alpa')->count()],
                ['name' => 'Terlambat', 'jumlah' => \App\Models\Attendance::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->where('status', 'Terlambat')->count()],
            ];
            $this->table(['Name', 'Jumlah'], $monthlyStats);

            $this->info("Checking Top Late Classes...");
            $topLateClasses = \Illuminate\Support\Facades\DB::table('attendances')
                ->join('students', 'attendances.student_id', '=', 'students.id')
                ->select('students.kelas', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
                ->where('attendances.status', 'Terlambat')
                ->whereBetween('attendances.tanggal', [$startOfMonth, $endOfMonth])
                ->groupBy('students.kelas')
                ->orderByDesc('total')
                ->limit(5)
                ->get();
            
            $this->info("Top Late Classes Count: " . $topLateClasses->count());
            foreach ($topLateClasses as $item) {
                $this->line("{$item->kelas}: {$item->total}");
            }

            $this->info('Test Completed Successfully.');

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            $this->error("Trace: " . $e->getTraceAsString());
        }
    }
}
