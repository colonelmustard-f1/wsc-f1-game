import { F1ResultsService } from '../services/f1Results';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ status: 'API is running' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
