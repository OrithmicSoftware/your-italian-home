// Отправка лида из формы на сервер Telegram-бота
export async function sendLeadToTelegram({ name, contact, message }) {
  // Укажите здесь адрес вашего сервера/бота
  const url = 'http://localhost:3000/lead'; // или https://your-server/lead
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, contact, message })
  });
  return res.ok;
}
