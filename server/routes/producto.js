const express = require('express');

let { verificaToken, vefiricaAdminRole } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//Obtener productos
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    // populate: usuario categoria

    let desde = req.query.desde || 0
    desde = Number(desde)

    Producto.find({ disponible: true})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })

})

//Obtener product por ID
app.get('/productos/:id', (req, res)=>{
    // populate: usuario categoria
    //paginado
    let id = req.params.id;
    let body = req.body;
    
    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productoDB) => {

                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'ID no existe'
                        }
                    })
                }


                res.json({
                    ok: true,
                    producto: productoDB
                })
            })
    
})

app.get('/productos/buscar/:termino', verificaToken, (req,res ) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err, productos) => {
                if(err){
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok:true,
                    productos
                })
            })
})


//Crear producto
app.post('/productos', verificaToken, (req, res) => {
    // guardar user
    // grabar una categoria del listado

    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.nombre,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    })

    producto.save( (err, productoDb) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDb
        })

    })
    
})


//Actualizar producto
app.put('/productos/:id',verificaToken, (req, res)=>{
    // guardar user
    // grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;
    
    Producto.findById(id, (err, productoDb)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDb){
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            })
        }

        productoDb.nombre = body.nombre;
        productoDb.precioUni = body.precioUni;
        productoDb.categoria = body.categoria;
        productoDb.disponible = body.disponible;
        productoDb.descripcion = body.descripcion;

        productoDb.save((err, productoGuardado) => {

            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                producto: productoGuardado
            })


        })
    })

    
})


//Eliminar producto
app.delete('/productos/:id',verificaToken, (req, res)=>{

    let id = req.params.id;
    Producto.findByIdAndRemove(id, (err, productoDb)=> {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!productoDb){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'ID no existe'
                }
            })
        }

        productoDb.disponible = false;
        productoDB.save((err, productoBorrado) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            res,json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    })

    
})

module.exports = app;