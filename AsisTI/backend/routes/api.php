<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ChatController;

Route::post('/chat', [ChatController::class, 'send']);
Route::post('/contactos', [ContactController::class, 'store']);