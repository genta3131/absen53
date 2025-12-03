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
        $students = [];

        // Jika ada kelas yang dipilih, ambil siswanya beserta data presensi hari ini
        if ($selectedClass) {
            $students = Student::where('kelas', $selectedClass)
                ->orderBy('nama')
                ->with(['attendances' => function($query) {
                    $query->whereDate('tanggal', now()->toDateString());
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
        ]);
    }

    // MENYIMPAN DATA PRESENSI (BULK INSERT)
    public function store(Request $request)
    {
        $request->validate([
            'attendances' => 'required|array',
            'attendances.*.student_id' => 'required|exists:students,id',
            'attendances.*.status' => 'required|in:Hadir,Sakit,Izin,Alpa,Terlambat',
            'attendances.*.keterangan' => 'nullable|string',
            'attendances.*.waktu_masuk' => 'nullable',
        ]);

        $today = now()->toDateString();
        $userId = Auth::id();

        foreach ($request->attendances as $data) {
            // Gunakan updateOrCreate agar tidak duplikat di hari yang sama
            Attendance::updateOrCreate(
                [
                    'student_id' => $data['student_id'],
                    'tanggal' => $today,
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

        // Catat di Audit Trail (Sesuai PDF Hal 9 Poin 211)
        \App\Models\AuditTrail::create([
            'user_id' => Auth::id(),
            'aksi' => 'Koreksi Presensi',
            'detail' => "Mengubah status siswa {$attendance->student->nama} dari {$oldStatus} menjadi {$request->status}. Alasan: {$request->alasan_koreksi}",
        ]);

        return redirect()->route('reports.index')->with('message', 'Data presensi berhasil dikoreksi.');
    }
}
