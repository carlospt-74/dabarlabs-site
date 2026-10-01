require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const RESEND_API_URL = 'https://api.resend.com/emails';

app.use(express.json());
app.use(express.static('public'));

app.post('/api/contacto', async (req, res) => {
  const { nombre, organizacion, correo, telefono, mensaje } = req.body || {};

  if (!nombre || !organizacion || !correo || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const texto = [
    `Nombre: ${nombre}`,
    `Organización: ${organizacion}`,
    `Correo: ${correo}`,
    `Teléfono: ${telefono || 'No proporcionado'}`,
    '',
    mensaje,
  ].join('\n');

  try {
    const respuesta = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: process.env.CONTACTO_DESTINO,
        reply_to: correo,
        subject: `Nuevo contacto desde dabarlabs.com — ${organizacion}`,
        text: texto,
      }),
    });

    if (!respuesta.ok) {
      console.error('Error al enviar correo de contacto', respuesta.status);
      return res.status(502).json({ error: 'No se pudo enviar el mensaje' });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Error de red al enviar correo de contacto', err.message);
    res.status(502).json({ error: 'No se pudo enviar el mensaje' });
  }
});

app.listen(PORT, () => {
  console.log(`Sitio de Dabar Labs escuchando en el puerto ${PORT}`);
});
