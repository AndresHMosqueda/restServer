const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidas son ' + tiposValidos.join(', ')
            }
        })
    }


    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.')
    let extension = nombreArchivo[nombreArchivo.length - 1];

    //Extensiones
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg' ];

    if(extensionesValidas.indexOf(extension) < 0){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        })
    }

    //Cambiar nombre del archivo
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${ extension }`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
          return res.status(500).json({
            ok: false,  
            err
        });

        //Aqui, imgn cargada
        imagenUsuario(id, res, nombreArchivo);
      

      });
});

function imagenUsuario(id, res, nombreArchivo)  {
    Usuario.findById(id, (err, usuarioDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuarion no existe'
                }
            });
        }

        let pathImagen = path.resolve(__dirname, `` );

        if(fs.existsSync(pathImagen) ) {
            fs.unlinkSync(pathImagen);
        }


        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })



    })
}
function imagenProducto()  {

}


module.exports = app;


