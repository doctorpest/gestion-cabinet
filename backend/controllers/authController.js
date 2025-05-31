const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Champs requis manquants' });

  try {
    const existing = await db.query(
      'SELECT * FROM utilisateurs WHERE username = $1',
      [username]
    );

    if (existing.rows.length > 0)
      return res.status(409).json({ error: 'Nom d\'utilisateur déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO utilisateurs (username, password)
       VALUES ($1, $2)
       RETURNING id, username, date_creation`,
      [username, hashedPassword]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



const SECRET_KEY = 'supersecretkey'; // ⚠️ Remplace ça avec un vrai secret via .env plus tard

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie l'utilisateur
    const result = await db.query('SELECT * FROM utilisateurs WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const user = result.rows[0];

    // Vérifie le mot de passe
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Crée le token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
