<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display the list of students.
     */
    public function index(\Illuminate\Http\Request $request)
    {
        $query = Student::query();

        // Filter by Search (Name or NIS)
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        // Filter by Class
        if ($request->has('kelas') && $request->kelas) {
            $query->where('kelas', $request->kelas);
        }

        $students = $query->orderBy('kelas')
            ->orderBy('nama')
            ->paginate(10)
            ->withQueryString();

        // Get unique classes for dropdown
        $classes = Student::select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['search', 'kelas']),
            'classes' => $classes,
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
        // 1. Validasi Input
        $validated = $request->validate([
            'nis' => 'required|unique:students|numeric', // NIS harus unik & angka
            'nama' => 'required|string|max:255',
            'kelas' => ['required', 'string', 'max:10', function ($attribute, $value, $fail) {
                // Validasi format kelas: X-1 s/d X-7, XI-1 s/d XI-7, XII-1 s/d XII-7
                $validClasses = [];
                foreach (['X', 'XI', 'XII'] as $level) {
                    for ($i = 1; $i <= 7; $i++) {
                        $validClasses[] = "$level-$i";
                    }
                }
                
                if (!in_array($value, $validClasses)) {
                    $fail("Kelas tidak valid. Pilih antara X-1 s/d XII-7.");
                }
            }],
        ]);

        // 2. Simpan ke Database
        Student::create($validated);

        // 3. Kembali ke Halaman Index dengan notifikasi (Opsional: Flash message bisa ditambahkan nanti)
        return redirect()->route('students.index')->with('message', 'Data siswa berhasil ditambahkan!');
    }
    // MENAMPILKAN HALAMAN EDIT
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
            'kelas' => ['required', 'string', 'max:10', function ($attribute, $value, $fail) {
                // Validasi format kelas: X-1 s/d X-7, XI-1 s/d XI-7, XII-1 s/d XII-7
                $validClasses = [];
                foreach (['X', 'XI', 'XII'] as $level) {
                    for ($i = 1; $i <= 7; $i++) {
                        $validClasses[] = "$level-$i";
                    }
                }
                
                if (!in_array($value, $validClasses)) {
                    $fail("Kelas tidak valid. Pilih antara X-1 s/d XII-7.");
                }
            }],
        ]);

        // Update data di database
        $student->update($validated);

        // Kembali ke index
        return redirect()->route('students.index')->with('message', 'Data siswa berhasil diperbarui!');
    }

    // MENGHAPUS DATA
    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index')->with('message', 'Data siswa berhasil dihapus!');
    }

    // IMPORT DATA DARI EXCEL
    public function import(\Illuminate\Http\Request $request) 
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        try {
            \Maatwebsite\Excel\Facades\Excel::import(new \App\Imports\StudentsImport, $request->file('file'));
            return redirect()->route('students.index')->with('message', 'Data siswa berhasil diimport!');
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
             $failures = $e->failures();
             $errorMessages = [];
             foreach ($failures as $failure) {
                 $errorMessages[] = "Baris " . $failure->row() . ": " . implode(', ', $failure->errors());
             }
             return redirect()->back()->withErrors(['file' => implode(' | ', $errorMessages)]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['file' => 'Terjadi kesalahan saat import: ' . $e->getMessage()]);
        }
    }

    // DOWNLOAD TEMPLATE EXCEL
    public function downloadTemplate()
    {
        return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\StudentsTemplateExport, 'template_siswa.xlsx');
    }
}
