<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Department::create(['name' => 'Chi cục trồng trọt và bảo vệ thực vật', 'description' => '']);
        Department::create(['name' => 'Chi cục chăn nuôi thú y', 'description' => '']);
        Department::create(['name' => 'Phòng quản lý chất lượng nông lâm và thuỷ sản', 'description' => '']);
        Department::create(['name' => 'Văn phòng điều phối chương trình', 'description' => '']);
    }
}
