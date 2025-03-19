<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'username' => 'admin1',
            'name' => 'Admin1',
            'email' => 'anhquyen.dut1@gmail.com',
            'password' => Hash::make('admin123'),
            'department_id' => '1',
        ]);


        User::create([
            'username' => 'admin2',
            'name' => 'Admin2',
            'password' => Hash::make('admin123'),
            'email' => 'anhquyen.dut2@gmail.com',
            'department_id' => '2',
        ]);

        User::create([
            'username' => 'admin3',
            'name' => 'Admin4',
            'password' => Hash::make('admin123'),
            'email' => 'anhquyen.dut3@gmail.com',
            'department_id' => '1',
        ]);

        User::factory()->times(1000)->create();
    }
}
