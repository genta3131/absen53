<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Student;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // MENAMPILKAN HALAMAN INPUT PRESENSI
    public function create()
    {
        // Kita butuh daftar siswa untuk dropdown "Cari Nama" (Sesuai Wireframe Hal 20)
        $students = Student::all();

        return Inertia::render('Attendances/Create', [
            'students' => $students
        ]);
    }

    // MENYIMPAN DATA PRESENSI
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'status' => 'required|in:Hadir,Sakit,Izin,Alpa,Terlambat',
            'keterangan' => 'nullable|string',
            'waktu_masuk' => 'nullable|date_format:H:i', // Wajib format Jam:Menit
        ]);

        Attendance::create([
            'user_id' => Auth::id(), // Siapa yang mencatat (Guru Piket yang login)
            'student_id' => $request->student_id,
            'tanggal' => now()->toDateString(), // Tanggal Otomatis (Sesuai Wireframe)
            'status' => $request->status,
            'keterangan' => $request->keterangan,
            'waktu_masuk' => $request->status === 'Terlambat' ? $request->waktu_masuk : null,
        ]);

        return redirect()->route('dashboard')->with('message', 'Presensi berhasil dicatat!');
    }
}
