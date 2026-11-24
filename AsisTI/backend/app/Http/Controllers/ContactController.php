<?php

namespace App\Http\Controllers;

use App\Services\N8nContactService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class ContactController extends Controller
{
    public function store(
        Request $request,
        N8nContactService $n8nContactService
    ) {
        $validated = $request->validate([
            'nombre' => 'required|string|max:150',
            'email' => 'required|email|max:255',
            'tipo_inconveniente' => 'required|string|max:100',
            'descripcion' => 'required|string|max:2000',
        ]);

        try {
            $result = $n8nContactService->createContact($validated);

            return response()->json([
                'success' => true,
                'message' => 'Tu solicitud fue registrada correctamente.',
                'data' => $result,
            ], 201);

        } catch (Throwable $e) {
            Log::error('Error al registrar contacto', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No se pudo registrar tu solicitud. Intentá nuevamente más tarde.',
            ], 502);
        }
    }
}
