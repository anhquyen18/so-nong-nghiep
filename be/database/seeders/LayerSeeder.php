<?php

namespace Database\Seeders;

use App\Models\Layer;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LayerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Layer::create([
            'name' => "Khu vực trồng trọt",
            'description' => "Khu vực trồng trọt",
            'department_id' => 1,
            'is_visible' => true,
        ]);

        Layer::create([
            'name' => "Vùng bảo vệ thực vật",
            'description' => "Vùng bảo vệ thực vật",
            'department_id' => 1,
            'is_visible' => true,
        ]);
        Layer::create([
            'name' => "Hộ nông dân",
            'description' => "Hộ nông dân",
            'department_id' => 1,
            'is_visible' => true,
        ]);
        Layer::create([
            'name' => "Trạm bảo vệ thực vât",
            'description' => "Trạm bảo vệ thực vât",
            'department_id' => 1,
            'is_visible' => true,
        ]);
        Layer::create([
            'name' => "Vùng sản xuất nông nghiệp tiêu chuẩn",
            'description' => "Vùng sản xuất nông nghiệp tiêu chuẩn",
            'department_id' => 1,
            'is_visible' => true,
        ]);
        Layer::create([
            'name' => "Kho lưu trữ phân bón và vật tư nông nghiệp",
            'description' => "Kho lưu trữ phân bón và vật tư nông nghiệp",
            'department_id' => 1,
            'is_visible' => true,
        ]);
        Layer::create([
            'name' => "Vùng dịch hại",
            'description' => "Vùng dịch hại",
            'department_id' => 1,
            'is_visible' => true,
        ]);
    }
}
