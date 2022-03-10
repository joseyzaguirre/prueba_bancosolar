const express = require('express')
const { getUsuarios, getTransferencias, newUsuario, getIdUsuario, newTransferencia } = require('./db.js')

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
    try {
        const transferencias = await getTransferencias();
        res.send(transferencias)
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

app.post('/usuario', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {

        const datos = Object.values(JSON.parse(body));
        try {
            const nuevoUsuario = await newUsuario(datos[0], datos[1])
            res.status(201)
            res.send(nuevoUsuario)
        } catch (error) {
            return res.status(400).send(error.message)
        }
    })
});

app.post('/transferencia', async (req, res) => {
    let body = ""

    req.on("data", (data) => {
        body += data
    })

    req.on("end", async () => {

        const datos = Object.values(JSON.parse(body));
        try {

            const emisor = datos[0]
            const receptor = datos[1]
            const dataEmisor = await getIdUsuario(emisor)
            const dataReceptor = await getIdUsuario(receptor)
            const emisorId = Number(dataEmisor[0].id)
            const receptorId = Number(dataReceptor[0].id)
            
            const nuevaTransferencia = await newTransferencia(emisorId, receptorId, Number(datos[2]))
            res.status(201)
            res.send(nuevaTransferencia)
            
        } catch (error) {
            return res.status(400).send(error.message)
        }
    })
});

app.put('/usuario', async (req, res) => {

});

app.delete('/usuario', async (req, res) => {

});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'))