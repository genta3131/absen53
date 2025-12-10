<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $primaryKey = 'nis';
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignable columns.
     *
     * @var array<int, string>
     */
    protected $fillable = ['nis', 'nama', 'kelas'];

    /**
     * A student can have many attendance records.
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }
}
