// utils/date.js
function calculerAge(dateNaissance) {
    const aujourdHui = new Date();
    const naissance = new Date(dateNaissance);
    let age = aujourdHui.getFullYear() - naissance.getFullYear();
    const m = aujourdHui.getMonth() - naissance.getMonth();
    if (m < 0 || (m === 0 && aujourdHui.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  }
  
  module.exports = { calculerAge };
  