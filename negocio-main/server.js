// ===== TeVending - Servidor Principal =====
// Backend con Express, envío de correos con Nodemailer y almacenamiento en JSON.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// === Archivos de datos ===
const USERS_FILE = path.join(__dirname, 'usuarios.json');
const CONTACTS_FILE = path.join(__dirname, 'contactos.json');

// === Middlewares ===
app.use(cors());
app.use(express.json());

// === Crear archivos vacíos si no existen ===
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, '[]');

// === Funciones auxiliares ===
function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error leyendo JSON:', filePath, error);
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// === Registro de usuario ===
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios.' });

  const users = readJSON(USERS_FILE);
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(409).json({ success: false, message: 'Correo ya registrado.' });

  users.push({ name, email, password });
  writeJSON(USERS_FILE, users);

  console.log(`Nuevo usuario registrado: ${email}`);
  res.json({ success: true, message: 'Usuario registrado correctamente.' });
});

// === Inicio de sesión ===
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });

  console.log(`Usuario inició sesión: ${email}`);
  res.json({ success: true, user: { name: user.name, email: user.email } });
});

// === Envío de mensaje desde "Contáctanos" ===
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, service, message } = req.body;

  if (!name || !email || !service || !message) {
    return res.status(400).json({ success: false, message: 'Faltan campos obligatorios.' });
  }

  try {
    // Guardar mensaje en contactos.json
    const contacts = readJSON(CONTACTS_FILE);
    const newContact = {
      id: Date.now(),
      date: new Date().toISOString(),
      name,
      email,
      phone,
      service,
      message
    };
    contacts.push(newContact);
    writeJSON(CONTACTS_FILE, contacts);

    console.log(`Nuevo mensaje guardado de ${name} (${email})`);

    // Configurar transporte de correo con Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Correo al vendedor (administrador)
    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Nuevo contacto: ${name} - ${service}`,
      html: `
        <h3>Nuevo mensaje desde TeVending</h3>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <p><strong>Servicio:</strong> ${service}</p>
        <p><strong>Mensaje:</strong></p>
        <blockquote>${message}</blockquote>
        <hr/>
        <small>Fecha: ${new Date().toLocaleString()}</small>
      `
    };

    // Correo de confirmación al cliente
    const clientMail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Hemos recibido tu mensaje - TeVending',
      html: `
        <h3>Hola ${name},</h3>
        <p>Gracias por ponerte en contacto con <strong>TeVending</strong>.</p>
        <p>Tu solicitud sobre <b>${service}</b> ha sido recibida correctamente. Un asesor te responderá a la brevedad.</p>
        <p>Resumen de tu mensaje:</p>
        <blockquote>${message}</blockquote>
        <p>Saludos,<br>Equipo TeVending</p>
      `
    };

    // Enviar ambos correos
    await transporter.sendMail(adminMail);
    await transporter.sendMail(clientMail);

    console.log(`Correos enviados a admin y cliente (${email}).`);
    res.json({ success: true, message: 'Mensaje enviado y correos enviados correctamente.' });
  } catch (error) {
    console.error('Error en /api/contact:', error);
    res.status(500).json({ success: false, message: 'Error al enviar el mensaje o correo.' });
  }
});

// === Servidor en ejecución ===
app.listen(PORT, () => {
  console.log(`Servidor TeVending corriendo en: http://localhost:${PORT}`);
});
