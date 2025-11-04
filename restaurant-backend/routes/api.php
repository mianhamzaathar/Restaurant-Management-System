<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TableController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReportController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::apiResource('menu-items', MenuItemController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('tables', TableController::class);
    Route::apiResource('orders', OrderController::class);
    Route::post('/orders/{order}/items/{item}/status', [OrderController::class, 'updateItemStatus']);
    
    Route::get('/reports/sales', [ReportController::class, 'salesReport']);
    Route::get('/reports/items', [ReportController::class, 'popularItemsReport']);
});