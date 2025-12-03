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
}
