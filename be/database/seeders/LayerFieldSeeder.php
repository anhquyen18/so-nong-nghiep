<?php

namespace Database\Seeders;

use App\Models\LayerField;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LayerFieldSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LayerField::create([
            'layer_id' => 1,
            // Diện tích canh tác
            'field_name' => "area",
            'is_required' => true,
        ]);
        LayerField::create([
            'layer_id' => 1,
            // Năng suất mong muốn
            'field_name' => "expected_yield",
            'is_required' => true,
        ]);
        LayerField::create([
            'layer_id' => 1,
            // Loại cây trồng
            'field_name' => "crop_type",
            'is_required' => true,
        ]);
        LayerField::create([
            'layer_id' => 1,
            // Thời gian thu hoạch
            'field_name' => "harvest_time",
            'is_required' => true,
        ]);
    }
}
