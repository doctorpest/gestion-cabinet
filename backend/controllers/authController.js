const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role)
    return res.status(400).json({ error: 'Champs requis manquants' });

  const allowedRoles = ['medecin', 'assistante'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }

  try {
    const existing = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Nom d\'utilisateur déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, role`,
      [username, hashedPassword, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Identifiants invalides' });

    const user = result.rows[0];

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid)
      return res.status(401).json({ error: 'Identifiants invalides' });

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
