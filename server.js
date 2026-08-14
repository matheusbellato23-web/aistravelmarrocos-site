const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Transporter Hostinger SMTP SSL 465
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: 'aistravelmarrocos@aistravelmarrocos.com.br',
    pass: 'vaso3238@'
  }
});

// Endpoint de envio de formulário
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, type, interest, message } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Campos obrigatórios ausentes.' });
    }

    const mailOptions = {
      from: '"AIS Travel Marrocos" <aistravelmarrocos@aistravelmarrocos.com.br>',
      to: 'aistravelmarrocos@aistravelmarrocos.com.br',
      replyTo: email,
      subject: `Nova Cotação do Site: ${name}`,
      text: `
===============================================
  NOVA SOLICITAÇÃO DE COTAÇÃO - AIS TRAVEL MARROCOS
===============================================

Nome: ${name}
E-mail: ${email}
WhatsApp / Telefone: ${phone}
Perfil: ${type}
Interesse: ${interest}

Mensagem:
${message}

===============================================
Enviado pelo formulário do site oficial.
`
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'E-mail enviado com sucesso!' });
  } catch (error) {
    console.error('Erro SMTP:', error);
    res.status(500).json({ success: false, message: 'Falha no envio via SMTP.' });
  }
});

// Servir arquivos estáticos da pasta dist ou raiz
const staticPath = path.join(__dirname, 'dist');
app.use(express.static(staticPath));
app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor de e-mail rodando na porta ${PORT}`);
});
