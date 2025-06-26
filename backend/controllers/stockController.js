const db = require('../db');

// ✅ Récupérer tous les produits
exports.getAllProduits = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM stock_produits ORDER BY date_achat DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur getAllProduits:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ✅ Ajouter un produit
exports.createProduit = async (req, res) => {
  const { nom_produit, fournisseur, date_achat, stock, prix_unitaire } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO stock_produits (nom_produit, fournisseur, date_achat, stock, prix_unitaire)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nom_produit, fournisseur, date_achat, stock, prix_unitaire]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur createProduit:', err.message);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du produit' });
  }
};

// ✅ Mettre à jour un produit (nom, fournisseur, stock, prix)
exports.updateProduit = async (req, res) => {
  const { id } = req.params;
  const { nom_produit, fournisseur, stock, prix_unitaire } = req.body;
  try {
    const result = await db.query(
      `UPDATE stock_produits SET 
        nom_produit = $1, fournisseur = $2, stock = $3, prix_unitaire = $4
       WHERE id = $5 RETURNING *`,
      [nom_produit, fournisseur, stock, prix_unitaire, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur updateProduit:', err.message);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' });
  }
};

// ✅ Supprimer un produit
exports.deleteProduit = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM stock_produits WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Erreur deleteProduit:', err.message);
    res.status(500).json({ error: 'Erreur lors de la suppression du produit' });
  }
};
