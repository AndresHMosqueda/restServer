const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt');
const _ = require('underscore')
const { verificaToken, vefiricaAdminRole } = require('../middlewares/autenticacion')


app.get('/usuario', verificaToken,  (req, res) => {

    let desde =  req.query.desde || 0
    desde = Number(desde)


    let limite =  req.query.limite || 0
    limite = Number(limite)

    Usuario.find({ estado: true })
            .skip(desde)
            .limit(limite)
            .exec( (err, usuarios) => {   //Para ejecutar el find

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({ estado: true }, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })


                })



            })

})

app.post('/usuario', [verificaToken, vefiricaAdminRole], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });


    });


})

app.put('/usuario/:id', [verificaToken, vefiricaAdminRole], (req, res) => {

    let id = req.params.id
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] )


    Usuario.findByIdAndUpdate( id, body, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    }) 

})

app.delete('/usuario/:id', [verificaToken, vefiricaAdminRole], (req,res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err : {
                    message: 'User not found'
                }
            });
        }

        res,json({
            
            ok: true,
            usuarioBorrado
        })

    })

})




module.exports = app;