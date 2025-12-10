<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // MENAMPILKAN HALAMAN INPUT PRESENSI (PER KELAS)
    public function create(Request $request)
    {
        // Ambil daftar kelas unik
        $classes = Student::select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');
        
        $selectedClass = $request->query('kelas');
        $selectedDate = $request->query('date', now()->toDateString()); // Default hari ini jika tidak ada
        $students = [];

        // Jika ada kelas yang dipilih, ambil siswanya beserta data presensi pada tanggal yang dipilih
        if ($selectedClass) {
            $students = Student::where('kelas', $selectedClass)
                ->orderBy('nama')
                ->with(['attendances' => function($query) use ($selectedDate) {
                    $query->whereDate('tanggal', $selectedDate);
                }])
                ->get()
                ->map(function ($student) {
                    // Ratakan struktur data untuk mempermudah di frontend
                    $student->today_attendance = $student->attendances->first();
                    return $student;
                });
        }

        return Inertia::render('Attendances/Create', [
            'classes' => $classes,
            'students' => $students,
            'selectedClass' => $selectedClass,
            'selectedDate' => $selectedDate,
        ]);
    }

    // MENYIMPAN DATA PRESENSI (BULK INSERT)
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'attendances' => 'required|array',
            'attendances.*.student_nis' => 'required|exists:students,nis',
            'attendances.*.status' => 'required|in:Hadir,Sakit,Izin,Alpa,Terlambat',
            'attendances.*.keterangan' => 'nullable|string',
            'attendances.*.waktu_masuk' => 'nullable',
        ]);

        $date = $request->date;
        $userId = Auth::id();

        foreach ($request->attendances as $data) {
            // Gunakan updateOrCreate agar tidak duplikat di hari yang sama
            Attendance::updateOrCreate(
                [
                    'student_nis' => $data['student_nis'],
                    'tanggal' => $date,
                ],
                [
                    'user_id' => $userId,
                    'status' => $data['status'],
                    'keterangan' => $data['keterangan'] ?? null,
                    'waktu_masuk' => $data['status'] === 'Terlambat' ? ($data['waktu_masuk'] ?? null) : null,
                ]
            );
        }


        return redirect()->route('dashboard')->with('message', 'Presensi berhasil dicatat!');
    }

    // HALAMAN EDIT PRESENSI (KOREKSI)
    public function edit(Attendance $attendance)
    {
        // Load data siswa agar namanya muncul
        $attendance->load('student');

        return Inertia::render('Attendances/Edit', [
            'attendance' => $attendance
        ]);
    }

    // PROSES UPDATE (SIMPAN KOREKSI)
    public function update(Request $request, Attendance $attendance)
    {
        $request->validate([
            'status' => 'required|in:Hadir,Sakit,Izin,Alpa,Terlambat',
            'keterangan' => 'nullable|string',
            'waktu_masuk' => 'nullable',
            'alasan_koreksi' => 'required|string|min:5', // Wajib sesuai PDF Hal 9
        ]);

        // Simpan data lama untuk catatan sejarah
        $oldStatus = $attendance->status;

        // Update Data
        $attendance->update([
            'status' => $request->status,
            'keterangan' => $request->keterangan,
            'waktu_masuk' => $request->status === 'Terlambat' ? $request->waktu_masuk : null,
        ]);

        // Catat di Audit Trail
        \App\Models\AuditTrail::create([
            'user_id' => Auth::id(),
            'aksi' => 'Koreksi Presensi',
            'detail' => "Mengubah status siswa {$attendance->student->nama} dari {$oldStatus} menjadi {$request->status}. Alasan: {$request->alasan_koreksi}",
        ]);

        return redirect()->route('reports.index')->with('message', 'Data presensi berhasil dikoreksi.');
    }
}
