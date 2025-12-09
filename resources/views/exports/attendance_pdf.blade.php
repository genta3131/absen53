<!DOCTYPE html>
<html>
<head>
    <title>Laporan Presensi</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Presensi Harian</h1>
        <p>Tanggal: {{ \Carbon\Carbon::parse($startDate)->locale('id')->translatedFormat('d F Y') }} - {{ \Carbon\Carbon::parse($endDate)->locale('id')->translatedFormat('d F Y') }}</p>
        @if($kelas)
            <p>Kelas: {{ $kelas }}</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%">No</th>
                <th style="width: 25%">Nama Siswa</th>
                <th style="width: 10%">Kelas</th>
                <th style="width: 15%">Status</th>
                <th style="width: 15%">Waktu Masuk</th>
                <th style="width: 30%">Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse($attendances as $index => $attendance)
                <tr>
                    <td style="text-align: center">{{ $index + 1 }}</td>
                    <td>{{ $attendance->student->nama }}</td>
                    <td>{{ $attendance->student->kelas }}</td>
                    <td>{{ $attendance->status }}</td>
                    <td>{{ $attendance->waktu_masuk ?? '-' }}</td>
                    <td>{{ $attendance->keterangan ?? '-' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center">Tidak ada data presensi.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
