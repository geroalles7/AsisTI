<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class N8nContactService
{
    public function createContact(array $data): array
    {
        $url = config('services.n8n.contactos_webhook');

        try {
            $response = Http::timeout(30)
                ->acceptJson()
                ->post($url, [
                    'nombre' => $data['nombre'],
                    'email' => $data['email'],
                    'tipo_inconveniente' => $data['tipo_inconveniente'],
                    'descripcion' => $data['descripcion'],
                ]);

            if (!$response->successful()) {
                Log::error('Error al enviar contacto a n8n', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                ]);

                throw new Exception(
                    'n8n respondió con el estado HTTP ' . $response->status()
                );
            }

            return $response->json();

        } catch (Exception $e) {
            Log::error('Error en N8nContactService', [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
