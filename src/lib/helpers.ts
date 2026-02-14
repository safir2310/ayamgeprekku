// Generate 4-digit ID
export function generate4DigitId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return num.toString();
}

// Format currency to IDR
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format points
export function formatPoints(points: number): string {
  return points.toLocaleString('id-ID');
}

// Convert points to currency
export function pointsToCurrency(points: number, pointValue: number = 100): number {
  return points * pointValue;
}

// Convert currency to points
export function currencyToPoints(amount: number, pointValue: number = 100): number {
  return Math.floor(amount / pointValue);
}

// Generate referral code
export function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate redeem code
export function generateRedeemCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Calculate member level based on total spent
export function calculateMemberLevel(totalSpent: number): string {
  if (totalSpent >= 1000000) return 'Platinum';
  if (totalSpent >= 500000) return 'Gold';
  return 'Silver';
}

// Get member level color
export function getMemberLevelColor(level: string): string {
  switch (level) {
    case 'Platinum':
      return 'from-purple-500 to-pink-500';
    case 'Gold':
      return 'from-yellow-400 to-orange-500';
    case 'Silver':
      return 'from-gray-300 to-gray-500';
    default:
      return 'from-gray-300 to-gray-500';
  }
}

// Format phone number for WhatsApp
export function formatWhatsAppNumber(phone: string): string {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');

  // If starts with 0, replace with 62
  if (cleanPhone.startsWith('0')) {
    return '62' + cleanPhone.substring(1);
  }

  // If starts with 62, return as is
  if (cleanPhone.startsWith('62')) {
    return cleanPhone;
  }

  // Default: add 62
  return '62' + cleanPhone;
}

// Create WhatsApp message for order
export function createWhatsAppMessage(
  orderData: {
    userName: string;
    userId: string;
    address: string;
    phone: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    total: number;
    saldoUsed: number;
    discount: number;
    finalTotal: number;
  },
  storeProfile?: {
    nama: string;
    alamat: string;
  }
): string {
  let message = `🍗 *ORDER BARU*\n`;
  message += `📦 ${storeProfile?.nama || 'AYAM GEPREK SAMBAL IJO'}\n\n`;

  message += `👤 *DATA PELANGGAN*\n`;
  message += `Nama: ${orderData.userName}\n`;
  message += `ID: ${orderData.userId}\n`;
  message += `No HP: ${orderData.phone}\n`;
  message += `Alamat: ${orderData.address}\n\n`;

  message += `🛒 *DETAIL PESANAN*\n`;
  message += '```\n';
  orderData.items.forEach((item, index) => {
    message += `${index + 1}. ${item.name}\n`;
    message += `   Qty: ${item.quantity} x ${formatCurrency(item.price)}\n`;
    message += `   Subtotal: ${formatCurrency(item.subtotal)}\n`;
  });
  message += '```\n\n';

  message += `💰 *PEMBAYARAN*\n`;
  message += `Subtotal: ${formatCurrency(orderData.total)}\n`;
  if (orderData.saldoUsed > 0) {
    message += `Saldo Digunakan: -${formatCurrency(orderData.saldoUsed)}\n`;
  }
  if (orderData.discount > 0) {
    message += `Diskon Point: -${formatCurrency(orderData.discount)}\n`;
  }
  message += `*TOTAL: ${formatCurrency(orderData.finalTotal)}*\n\n`;

  message += `🔥 *Pedasnya Bikin Nagih!* 🔥\n`;
  message += `Terima kasih sudah memesan!`;

  return encodeURIComponent(message);
}

// Get WhatsApp URL
export function getWhatsAppUrl(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  return `https://wa.me/${formattedPhone}?text=${message}`;
}

// Check if date is expired
export function isExpired(date?: Date | null): boolean {
  if (!date) return false;
  return new Date() > new Date(date);
}

// Format date
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Generate 6-digit verification code from date of birth
// Format: DDMMYY (Day + Month + Last 2 digits of Year)
export function generateVerificationCodeFromDate(dateOfBirth: string): string {
  try {
    // Parse date string (supports YYYY-MM-DD, DD-MM-YYYY, DD/MM/YYYY, etc.)
    const date = new Date(dateOfBirth);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits

    // Combine to create 6-digit code: DDMMYY
    return `${day}${month}${year}`;
  } catch (error) {
    console.error('Error generating verification code:', error);
    // Return random 6-digit code as fallback
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Verify code matches date of birth
export function verifyCodeWithDateOfBirth(code: string, dateOfBirth: string): boolean {
  const generatedCode = generateVerificationCodeFromDate(dateOfBirth);
  return code === generatedCode;
}

// Generate 6-digit verification code from phone number and save logic
// Format: Last 6 digits of phone number
export function generateVerificationCodeFromPhone(phoneNumber: string): string {
  try {
    // Remove all non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // If phone number is less than 6 digits, pad with zeros
    if (cleanPhone.length < 6) {
      return cleanPhone.padStart(6, '0');
    }

    // Take last 6 digits
    return cleanPhone.slice(-6);
  } catch (error) {
    console.error('Error generating verification code from phone:', error);
    // Return random 6-digit code as fallback
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Verify code matches phone number (for direct comparison)
export function verifyCodeWithPhone(code: string, phoneNumber: string): boolean {
  const generatedCode = generateVerificationCodeFromPhone(phoneNumber);
  return code === generatedCode;
}
