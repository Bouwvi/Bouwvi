export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key niet geconfigureerd' })
  }

  try {
    const { prompt, ctx } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 700,
        system: 'Je bent Bouwvi, een ervaren Nederlandse bouwadviseur. ' + (ctx || '') + ' Geef praktisch advies in helder Nederlands. Gebruik **vet** voor kopjes en - voor lijstjes. Max 200 woorden. Veiligheid voorop.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || 'Er ging iets mis.'
    res.status(200).json({ text })
  } catch (error) {
    res.status(500).json({ error: 'Fout bij ophalen advies' })
  }
}
