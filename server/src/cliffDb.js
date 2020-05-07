const { Pool } = require('pg');
const pool = new Pool();

exports.findAccountById = async (id) => {
  return getFirstRow(
    await pool.query('SELECT * FROM account WHERE id = $1', [id])
  );
};

exports.findAccountByUsername = async (username) => {
  return getFirstRow(
    await pool.query('SELECT * FROM account WHERE username = $1', [username])
  );
};

exports.findAllTracks = async () => {
  return (await pool.query('SELECT * FROM track order by id desc')).rows;
};

exports.saveTrack = async (counter) => {
  return getFirstRow(
    await pool.query('INSERT INTO track (counter) VALUES ($1) RETURNING *', [
      counter,
    ])
  );
};

const getFirstRow = (res) => {
  if (res.rows.length == 0) {
    return null;
  } else {
    return res.rows[0];
  }
};
