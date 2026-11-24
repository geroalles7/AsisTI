<?php

namespace App\Http\Controllers;

use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function __construct(
        private AIService $aiService
    ) {}

    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:5000',
        ]);

        try {
            $response = $this->aiService->ask(
                $validated['message']
            );

            return response()->json([
                'success' => true,
                'response' => $response,
            ], 200);

        } catch (\Throwable $error) {
            Log::error('Error procesando consulta de AsisTI', [
                'error' => $error->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'No se pudo procesar tu consulta. Intentá nuevamente más tarde.',
            ], 502);
        }
    }
}