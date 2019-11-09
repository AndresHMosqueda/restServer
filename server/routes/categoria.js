const express = require('express');

let { verificaToken, vefiricaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Categoria = require('../models/categoria');

// Mostrar las categorias
app.get('/categoria', (req, res) => {

    Categoria.find({})
            .exec((err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    categorias
                })
            })

});


// Mostrar la categoria por ID
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                message: 'El ID no es correcto'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
});



// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })


});



// Mostrar todas las categorias
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});


// Eliminar todas las categorias
app.delete('/categoria/:id', [verificaToken, vefiricaAdminRole], (req, res) => {

    let id= req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        })


    })


});


module.exports = app;