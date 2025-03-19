<?php

use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\LayerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


// Routes cho department
Route::prefix('api')->group(function () {
    Route::get('/', function () {
        return view('welcome');
    });
    Route::prefix('departments')->group(function () {
        Route::get('/', [DepartmentController::class, 'getDepartments']);

        Route::prefix('{department}')->group(function () {

            // Routes cho layers của department - departments/{department}/layers
            Route::prefix('layers')->group(function () {
                Route::get('/', [LayerController::class, 'getLayers']);

                // Route::get('/{layer}', [LayerController::class, 'getLayer']);
                Route::prefix('{layer}')->group(function () {

                    // Routes cho object của layer - departments/{department}/layers/{layer}/objects
                    Route::prefix('objects')->group(function () {
                        Route::get('/', [LayerController::class, 'getObjects']);
                    });
                });
            });
        });
    });
});
