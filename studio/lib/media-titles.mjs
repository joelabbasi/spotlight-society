const titles = {
  '1EoMD5NMbWUdj3Rem5wAoa7XH3Sjf5bSd': 'Eight Ball — Commercial',
  '1mq9HnmYFVwtHyUSOls9nYzMEzwBr3Sk_': 'Five Dollar Campaign',
  '1a4127ZMkk4qZcO0fQ-Enb2F5quVyCndS': 'Diablo Lake — MAPS Youth',
  '1J8g8WqQYvvXrL7Ohqoed3-GGYuafxELx': 'Essentials First',
  '1Q6_qvuLoRVekmeXGqAdlnpr2FOaP0dUS': 'Jonah — Event Recap',
  '1b_LdoQMAGo0Q28zEDgA2CpGiW-ue1KCe': 'LEGO × GE HealthCare',
  '14_CgA-LraVVzK8wKUDt9NfqnlzeDSudA': 'Mintish',
  '1ZumSaa4r9Kdah5Mrj4HztAP7H0niJy3A': 'MAPS — Opening Event',
  '1X8IKLIUsA-ug5CdanuvlsghNWDA4xDci': 'Goodwill',
  '1ySV-Z63R0aD3qYVupHEhsmeSJFjCg2yQ': 'Transcend — Panel Recap',
  '1mAMqHQLnNZLa9daLeXDNVsM0nklxmgEX': 'Muzfest — Event Recap',
};

export function mediaTitle(item) {
  if (titles[item.id]) return titles[item.id];
  return item.name.replace(/^(?:copy of\s+)+/i, '')
    .replace(/\.(mp4|mov|m4v|webm|jpe?g|png|webp|heic)$/i, '')
    .replace(/[_\s]+/g, ' ').trim()
    .toLowerCase().replace(/\b\p{L}/gu, letter => letter.toUpperCase())
    .replace(/\b(maps|lego|ge)\b/gi, word => word.toUpperCase());
}
