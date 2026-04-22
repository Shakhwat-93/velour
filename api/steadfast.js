const STEADFAST_BASE_URL = 'https://portal.packzy.com/api/v1'

function sendJson(response, statusCode, payload) {
  response.status(statusCode).json(payload)
}

function normalizeError(error) {
  if (error instanceof Error) return error.message
  return 'Unable to process Steadfast request.'
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return sendJson(response, 405, { error: 'Method not allowed.' })
  }

  const { apiKey, secretKey, endpoint, payload } = request.body || {}

  if (!apiKey || !secretKey) {
    return sendJson(response, 400, { error: 'Steadfast API key and secret key are required.' })
  }

  const allowedEndpoints = new Set([
    '/create_order',
    '/get_balance',
  ])

  if (!allowedEndpoints.has(endpoint)) {
    return sendJson(response, 400, { error: 'Unsupported Steadfast endpoint.' })
  }

  try {
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
    let data

    try {
      data = text ? JSON.parse(text) : {}
    } catch {
      data = { raw: text }
    }

    return sendJson(response, steadfastResponse.status, data)
  } catch (error) {
    return sendJson(response, 502, { error: normalizeError(error) })
  }
}
