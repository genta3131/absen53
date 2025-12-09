<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AttendanceExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $startDate;
    protected $endDate;
    protected $kelas;

    public function __construct($startDate, $endDate, $kelas = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->kelas = $kelas;
    }

    public function collection()
    {
        $query = Attendance::with('student')
            ->whereBetween('tanggal', [$this->startDate, $this->endDate]);

        if ($this->kelas) {
            $query->whereHas('student', function($q) {
                $q->where('kelas', $this->kelas);
            });
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            ['Laporan Presensi Harian'],
            ['Tanggal', \Carbon\Carbon::parse($this->startDate)->locale('id')->translatedFormat('d F Y') . ' - ' . \Carbon\Carbon::parse($this->endDate)->locale('id')->translatedFormat('d F Y')],
            ['Kelas', $this->kelas ?? 'Semua Kelas'],
            [''], // Spasi
            [
                'No',
                'Nama Siswa',
                'Kelas',
                'Status',
                'Waktu Masuk',
                'Keterangan',
            ]
        ];
    }

    public function map($attendance): array
    {
        static $no = 0;
        $no++;

        return [
            $no,
            $attendance->student->nama,
            $attendance->student->kelas,
            $attendance->status,
            $attendance->waktu_masuk ?? '-',
            $attendance->keterangan ?? '-',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 14]], // Judul
            2 => ['font' => ['bold' => true]], // Tanggal
            3 => ['font' => ['bold' => true]], // Kelas
            5 => ['font' => ['bold' => true]], // Header Tabel (Baris ke-5)
        ];
    }
}
