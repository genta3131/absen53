<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display the list of students.
     */
    public function index()
    {
        $students = Student::orderBy('nama')->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
        ]);
    }

    // MENAMPILKAN FORM TAMBAH
    public function create()
    {
        return Inertia::render('Students/Create');
    }

    // MENYIMPAN DATA KE DATABASE
    public function store(\Illuminate\Http\Request $request)
    {
        // 1. Validasi Input (Sesuai PDF Hal 4: Validasi Input Data)
        $validated = $request->validate([
            'nis' => 'required|unique:students|numeric', // NIS harus unik & angka
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:10',
        ]);

        // 2. Simpan ke Database
        Student::create($validated);

        // 3. Kembali ke Halaman Index dengan notifikasi (Opsional: Flash message bisa ditambahkan nanti)
        return redirect()->route('students.index');
    }
    // MENAMPILKAN HALAMAN EDIT (Sesuai PDF Hal 5)
    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student
        ]);
    }

    // MEMPROSES UPDATE DATA
    public function update(\Illuminate\Http\Request $request, Student $student)
    {
        // Validasi
        $validated = $request->validate([
            // Rule unique sedikit beda: NIS boleh sama asalkan milik siswa ini sendiri (ignore id)
            'nis' => 'required|numeric|unique:students,nis,' . $student->id,
            'nama' => 'required|string|max:255',
            'kelas' => 'required|string|max:10',
        ]);

        // Update data di database
        $student->update($validated);

        // Kembali ke index
        return redirect()->route('students.index')->with('message', 'Data siswa berhasil diperbarui!');
    }

    // MENGHAPUS DATA (Sesuai PDF Hal 6)
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index')->with('message', 'Data siswa berhasil dihapus!');
    }
}
