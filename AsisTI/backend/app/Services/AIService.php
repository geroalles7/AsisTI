<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class AIService
{
    public function ask(string $message): string
    {
        $url = rtrim(
            config('services.ai_service.url'),
            '/'
        ) . '/chat';

        try {
            $response = Http::timeout(180)
                ->acceptJson()
                ->post($url, [
                    'message' => $message,
                ]);

            if (!$response->successful()) {
                Log::error('Error en AI Service', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                throw new RuntimeException(
                    'El servicio de IA no pudo procesar la consulta.'
                );
            }

            $data = $response->json();

            if (!isset($data['response'])) {
                throw new RuntimeException(
                    'La respuesta del servicio de IA no tiene el formato esperado.'
                );
            }

            return $data['response'];

        } catch (\Throwable $error) {
            Log::error('Error comunicÃ¡ndose con FastAPI', [
                'message' => $error->getMessage(),
            ]);

            throw $error;
        }
    }
}
