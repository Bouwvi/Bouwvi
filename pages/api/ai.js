export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'API key niet geconfigureerd' })
  try {
    const { prompt, system } = req.body
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 900,
        system: system || 'Je bent Bouwvi, een ervaren Nederlandse bouwadviseur. Geef praktisch, eerlijk en veilig advies in helder Nederlands. Gebruik **vet** voor kopjes en - voor lijstjes. Max 250 woorden.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await response.json()
    res.status(200).json({ text: data.content?.[0]?.text || 'Er ging iets mis.' })
  } catch (e) {
    res.status(500).json({ error: 'Fout bij ophalen advies' })
  }
}
