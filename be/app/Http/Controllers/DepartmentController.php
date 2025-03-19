<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Domain\Department\Actions\GetDepartmentsAction;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function getDepartments(GetDepartmentsAction $getLayersAction)
    {
        $departments = $getLayersAction->handle();
        return response()->json(['data' => $departments], 200);
    }
}
