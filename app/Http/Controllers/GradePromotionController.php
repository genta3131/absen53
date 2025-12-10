<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GradePromotionController extends Controller
{
    /**
     * Display the promotion page.
     */
    public function create(Request $request)
    {
        // Get all unique classes for the dropdown
        $classes = Student::select('kelas')->distinct()->orderBy('kelas')->pluck('kelas');

        $students = [];
        if ($request->has('source_class')) {
            $students = Student::where('kelas', $request->source_class)
                ->orderBy('nama')
                ->get();
        }

        return Inertia::render('Students/Promotion', [
            'classes' => $classes,
            'students' => $students,
            'filters' => $request->only(['source_class']),
        ]);
    }

    /**
     * Store the promotion (bulk update).
     */
    public function store(Request $request)
    {
        $request->validate([
            'source_class' => 'required|string',
            'destination_class' => ['required', 'string', function ($attribute, $value, $fail) {
                $validClasses = ['Alumni', 'Lulus'];
                foreach (['X', 'XI', 'XII'] as $level) {
                    for ($i = 1; $i <= 7; $i++) {
                        $validClasses[] = "$level-$i";
                    }
                }
                
                if (!in_array($value, $validClasses)) {
                    $fail("Kelas tujuan tidak valid.");
                }
            }],
            'student_nises' => 'required|array',
            'student_nises.*' => 'exists:students,nis',
        ]);

        try {
            DB::transaction(function () use ($request) {
                Student::whereIn('nis', $request->student_nises)
                    ->update(['kelas' => $request->destination_class]);
            });

            return redirect()->route('students.index')->with('message', 'Siswa berhasil dinaikkan kelasnya.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Terjadi kesalahan saat memproses data.']);
        }
    }
}
