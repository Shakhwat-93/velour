import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import type { IncomingMessage, ServerResponse } from 'http'

const STEADFAST_BASE_URL = 'https://portal.packzy.com/api/v1'

const readJsonBody = async (request: IncomingMessage) => {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }

  const rawBody = Buffer.concat(chunks).toString('utf8')
  return rawBody ? JSON.parse(rawBody) : {}
}

const sendJson = (response: ServerResponse, statusCode: number, payload: unknown) => {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(payload))
}

const steadfastDevApi = () => ({
  name: 'steadfast-dev-api',
  configureServer(server: any) {
    server.middlewares.use('/api/steadfast', async (request: IncomingMessage, response: ServerResponse) => {
      if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        sendJson(response, 405, { error: 'Method not allowed.' })
        return
      }

      try {
        const { apiKey, secretKey, endpoint, payload } = await readJsonBody(request)
        const allowedEndpoints = new Set(['/create_order', '/get_balance'])

        if (!apiKey || !secretKey) {
          sendJson(response, 400, { error: 'Steadfast API key and secret key are required.' })
          return
        }

        if (!allowedEndpoints.has(endpoint)) {
          sendJson(response, 400, { error: 'Unsupported Steadfast endpoint.' })
          return
        }

        const steadfastResponse = await fetch(`${STEADFAST_BASE_URL}${endpoint}`, {
          method: endpoint === '/get_balance' ? 'GET' : 'POST',
          headers: {
            'Api-Key': apiKey,
            'Secret-Key': secretKey,
            'Content-Type': 'application/json',
          },
          body: endpoint === '/get_balance' ? undefined : JSON.stringify(payload || {}),
        })

        const text = await steadfastResponse.text()
        let data: unknown

        try {
          data = text ? JSON.parse(text) : {}
        } catch {
          data = { raw: text }
        }

        sendJson(response, steadfastResponse.status, data)
      } catch (error) {
        sendJson(response, 502, {
          error: error instanceof Error ? error.message : 'Unable to process Steadfast request.',
        })
      }
    })
  },
})

export default defineConfig({
  plugins: [
    steadfastDevApi(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
