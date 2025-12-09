<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    // MENAMPILKAN DAFTAR PENGGUNA
    public function index()
    {
        // Ambil semua user kecuali user yang sedang login (biar gak hapus diri sendiri)
        $users = User::where('id', '!=', auth()->id())->get();

        return Inertia::render('Users/Index', [
            'users' => $users
        ]);
    }

    // FORM TAMBAH PENGGUNA
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    // SIMPAN PENGGUNA BARU
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'role' => 'required|string|in:guru_piket,guru_mapel,kepsek,staf_tu',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')->with('message', 'Akun pengguna berhasil dibuat!');
    }

    // FORM EDIT PENGGUNA
    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
            'userToEdit' => $user // Ubah nama variabel biar gak bentrok sama auth user
        ]);
    }

    // UPDATE PENGGUNA
    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:guru_piket,guru_mapel,kepsek,staf_tu',
        ];

        // Password hanya di-update jika diisi
        if ($request->password) {
            $rules['password'] = ['confirmed', Rules\Password::defaults()];
        }

        $request->validate($rules);

        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('users.index')->with('message', 'Akun pengguna diperbarui!');
    }

    // HAPUS PENGGUNA
    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index')->with('message', 'Akun berhasil dihapus!');
    }
}
