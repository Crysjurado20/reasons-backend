const http = require('http');

function postContact(data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(body)
        });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getContacts() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/contact',
      method: 'GET'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: JSON.parse(body)
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('================================================================');
  console.log('🧪 INICIANDO PRUEBAS DE LA FUNCIÓN DE CONTACTO SMTP RESILIENTE');
  console.log('================================================================\n');

  try {
    // 1. Crear nuevo mensaje de contacto
    console.log('Step 1: Enviando un nuevo mensaje de contacto a la API...');
    const testMessage = {
      sender_name: "Juan Pérez",
      sender_email: "saimoljimenez@gmail.com",
      subject: "Consulta sobre Proyectos de Investigación",
      institution: "Universidad UTA",
      message: "Estimados, quisiera consultar sobre la postulación a proyectos de investigación para este ciclo."
    };

    const postResult = await postContact(testMessage);
    console.log(`STATUS CODE: ${postResult.statusCode}`);
    console.log('RESPUESTA DE CREACIÓN:', JSON.stringify(postResult.data, null, 2));
    console.log('\n----------------------------------------------------------------\n');

    // 2. Obtener la lista completa de mensajes para verificar que se guardó
    console.log('Step 2: Obteniendo la lista de mensajes guardados en la base de datos...');
    const getResult = await getContacts();
    console.log(`STATUS CODE: ${getResult.statusCode}`);
    console.log(`CANTIDAD DE MENSAJES RECUPERADOS: ${getResult.data.length}`);

    console.log('\nÚLTIMOS MENSAJES REGISTRADOS:');
    getResult.data.slice(0, 3).forEach((msg, idx) => {
      console.log(`\n[Mensaje #${idx + 1}] ID: ${msg.id}`);
      console.log(`   Remitente: ${msg.sender_name} (${msg.sender_email})`);
      console.log(`   Asunto: ${msg.subject || 'Sin Asunto'}`);
      console.log(`   Estado de envío SMTP: ${msg.sent ? '✅ ENVIADO' : '❌ PENDIENTE'}`);
      console.log(`   Creado el: ${msg.created_at}`);
    });

    console.log('\n================================================================');
    console.log('🎉 PRUEBAS COMPLETADAS CON ÉXITO');
    console.log('================================================================');
  } catch (error) {
    console.error('❌ ERROR AL EJECUTAR LAS PRUEBAS:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('👉 Asegúrate de que el servidor backend esté corriendo en http://localhost:3000 antes de ejecutar la prueba.');
    }
  }
}

runTests();
