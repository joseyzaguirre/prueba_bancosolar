const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'bancosolar',
    password: '1234',
    max: 20,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

async function getUsuarios() {
    const client = await pool.connect()
    const res = await client.query(
        "select * from usuarios"
    )
    client.release()
    return res.rows
}

async function getTransferencias() {
    const client = await pool.connect()
    const res = await client.query(
        "select * from transferencias"
    )
    client.release()
    return res.rows
}

async function newUsuario(nombre, balance) {
    const client = await pool.connect()
    await client.query(
        "insert into usuarios (nombre, balance) values ($1, $2) returning *",
        [nombre, balance]
    )
}

async function newTransferencia(emisorId, receptorId, monto) {
    const client = await pool.connect()
    await client.query(
        "insert into transferencias (emisor, receptor, monto) values ($1, $2, $3) returning *",
        [emisorId, receptorId, monto]
    )
}

async function getIdUsuario(nombre_usuario) {
    const client = await pool.connect()
    const res = await client.query(
        "select id from usuarios where nombre=$1",
        [nombre_usuario]
    )
    client.release()
    return res.rows
}

module.exports = { getUsuarios, getTransferencias, newUsuario, getIdUsuario, newTransferencia }