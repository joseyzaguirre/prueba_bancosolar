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
    return res.rows[0].id
}

async function editUsuario (nombre, balance, id) {
    const client = await pool.connect()

    const res = await client.query({
        text: "update usuarios set nombre=$1, balance=$2 where id=$3",
        values: [nombre, balance, id]
    })

    client.release()
    return res
}

async function deleteUsuario(id) {
    const client = await pool.connect()
    // ejemplo de consulta con 2 parámetros
    const res = await client.query(
        "delete from usuarios where id=$1",
        [id]
    )
    client.release()
}

module.exports = { getUsuarios, getTransferencias, newUsuario, getIdUsuario, newTransferencia, editUsuario, deleteUsuario } 