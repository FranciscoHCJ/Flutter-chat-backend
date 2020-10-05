const { io } = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
    const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

    // Verificar autenticación
    if ( !valido ) { return client.disconnect(); }

    // Cliente autenticado
    usuarioConectado(uid);

    // Ingresar al usuario a una sala en particular
    // sala global, client.id, 5f70e8b1e6e4c40ca57dfd71
    client.join(uid);

    client.on('mensaje-personal', async (payload) => {
        await grabarMensaje( payload );
        io.to(payload.para).emit('mensaje-personal', payload);
    });

    client.on('disconnect', () => {
        usuarioDesconectado(uid);
    });

});
