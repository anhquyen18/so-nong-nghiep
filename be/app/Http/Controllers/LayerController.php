<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Layer;
use Domain\Layer\Actions\GetLayersAction;
use Domain\Layer\Actions\GetObjectsAction;
use Illuminate\Http\Request;

class LayerController extends Controller
{
    public function getLayers(GetLayersAction $getLayersAction, $department)
    {
        $layers = $getLayersAction->handle($department);
        return response()->json(['data' => $layers], 200);
    }

    public function getLayer(Layer $layer)
    {
        return response()->json(['data' => $layer], 200);
    }


    public function getObjects(GetObjectsAction $getObjectsAction, $department, $layer)
    {
        $layerInstance = Layer::find($layer);
        if ($layerInstance->department_id != $department) {
            return response()->json(['message' => 'Không tìm thấy layer'], 404);
        }
        if (!$layerInstance) {
            return response()->json(['message' => 'Không tìm thấy layer'], 404);
        }
        $objects = $getObjectsAction->handle($layerInstance->tb_label);
        return response()->json(['data' => $objects], 200);
    }
}
