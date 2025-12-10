<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    /**
     * Mass assignable columns.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_nis',
        'user_id',
        'tanggal',
        'status',
        'waktu_masuk',
        'keterangan',
    ];

    /**
     * Attendance belongs to a single student.
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_nis', 'nis');
    }

    /**
     * Attendance is recorded by a single user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
