const express = require('express')
const { getUsuarios, getTransferencias, newUsuario, getIdUsuario, newTransferencia, editUsuario, deleteUsuario } = require('./db.js')

const app = express()
app.use(express.static('static'))

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.send(usuarios)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

app.get('/transferencias', async (req, res) => {
    let transferencias
    try {
        transferencias = await getTransferencias();
    } catch (error) {
        return res.status(400).send(error.message)
    }
    res.send(transferencias)
});

app.post('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {

        const datos = Object.values(JSON.parse(body));
        let nuevoUsuario
        try {
            nuevoUsuario = await newUsuario(datos[0], datos[1])
        } catch (error) {
            return res.status(400).send(error.message)
        }
        res.status(201)
        res.send(nuevoUsuario)
    })
});

app.post('/transferencia', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {

        const datos = Object.values(JSON.parse(body));
        let nuevaTransferencia
        try {
            const emisor = datos[0]
            const receptor = datos[1]
            const emisorId = await getIdUsuario(emisor)
            const receptorId = await getIdUsuario(receptor)

            nuevaTransferencia = await newTransferencia(emisorId, receptorId, Number(datos[2]))
            
        } catch (error) {
            return res.status(400).send(error.message)
        }
        res.status(201)
        res.json({nuevaTransferencia})
    })
});

app.put('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));
        try {
            await editUsuario(datos[0], datos[1], req.query.id)
        } catch (error) {
            return res.status(400).send(error.message)
        }
        res.send('usuario modificado exitosamente')
    })
});

app.delete('/usuario', async (req, res) => {
    try {
        await deleteUsuario(req.query.id)
    } catch (error) {
        return res.status(400).send(error.message)
    }
    res.send('usuario eliminado')
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'))