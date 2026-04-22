function getClientIp(request) {
  const forwardedFor = request.headers['x-forwarded-for']
  const realIp = request.headers['x-real-ip']

  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }

  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim()
  }

  return request.socket?.remoteAddress || 'unknown'
}

export default function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET')
    response.status(405).json({ error: 'Method not allowed.' })
    return
  }

  response.status(200).json({
    ip: getClientIp(request),
    userAgent: request.headers['user-agent'] || '',
  })
}
