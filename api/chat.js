export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { messages, system } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) return res.status(500).json({ reply: 'API key no configurada' });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: system,
        messages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ reply: 'Ay no, se me fue el wifi mi amor. Probá en un ratito!' });
    }

    const text = data.content?.map(b => b.text || '').join('') || 'Ay, no sé qué decir mi amor...';
    res.status(200).json({ reply: text });
  } catch (err) {
    res.status(200).json({ reply: 'Ay no, se me fue el wifi mi amor. Probá en un ratito!' });
  }
}
