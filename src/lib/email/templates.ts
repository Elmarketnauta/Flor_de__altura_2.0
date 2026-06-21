import { Order, OrderItem } from "@/types";

export function generateOrderConfirmedHTML(order: Order, userEmail: string): string {
  const itemsHTML = order.items
    .map(
      (item) =>
        `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5d4c1;">
        <strong>${item.productId}</strong> (${item.format})
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5d4c1; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5d4c1; text-align: right;">
        S/ ${(item.priceAtPurchase * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #3d2817; background-color: #f5f1ed; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #8b6f47 0%, #a68968 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px; }
    .content { padding: 32px 24px; }
    .order-section { margin-bottom: 24px; }
    .order-section h2 { margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #3d2817; }
    table { width: 100%; border-collapse: collapse; }
    .summary { background-color: #f9f7f5; border-radius: 8px; padding: 16px; margin-top: 16px; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .summary-row:last-child { margin-bottom: 0; font-weight: 600; font-size: 16px; color: #8b6f47; }
    .cta { text-align: center; margin-top: 28px; }
    .cta a { display: inline-block; background-color: #d4af37; color: #3d2817; padding: 12px 32px; border-radius: 24px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s; }
    .cta a:hover { background-color: #c9a227; }
    .footer { background-color: #f9f7f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #8b6f47; border-top: 1px solid #e5d4c1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Pedido Confirmado</h1>
    </div>
    <div class="content">
      <p>Gracias por tu compra, tu café está en camino!</p>

      <div class="order-section">
        <h2>Detalles del Pedido #${order.id.slice(0, 8).toUpperCase()}</h2>
        <p style="margin: 0; color: #666;">
          <strong>Email:</strong> ${userEmail}<br>
          <strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleDateString("es-PE")}
        </p>
      </div>

      <div class="order-section">
        <h2>Productos</h2>
        <table>
          <thead style="border-bottom: 2px solid #e5d4c1;">
            <tr>
              <th style="padding: 12px; text-align: left; font-weight: 600;">Producto</th>
              <th style="padding: 12px; text-align: center; font-weight: 600;">Cantidad</th>
              <th style="padding: 12px; text-align: right; font-weight: 600;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHTML}</tbody>
        </table>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>S/ ${order.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Impuesto (IGV):</span>
          <span>S/ ${order.tax.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Total:</span>
          <span>S/ ${order.total.toFixed(2)}</span>
        </div>
      </div>

      <div class="cta">
        <a href="${process.env.NEXTAUTH_URL}/ordenes">Ver mis Órdenes</a>
      </div>

      <p style="margin-top: 24px; font-size: 13px; color: #666; line-height: 1.6;">
        Si tienes preguntas sobre tu pedido, contáctanos en <strong>hola@flordealtura.com</strong> o por WhatsApp a <strong>+51 910 251 455</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">© 2026 Flor de Altura Café · Pichanaqui, Junín, Perú</p>
    </div>
  </div>
</body>
</html>
`;
}

export function generatePaymentFailedHTML(orderId: string, retryUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #3d2817; background-color: #f5f1ed; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #c94c4c 0%, #d66464 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .content { padding: 32px 24px; }
    .cta { text-align: center; margin-top: 28px; }
    .cta a { display: inline-block; background-color: #d4af37; color: #3d2817; padding: 12px 32px; border-radius: 24px; text-decoration: none; font-weight: 600; font-size: 14px; }
    .footer { background-color: #f9f7f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #8b6f47; border-top: 1px solid #e5d4c1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠ Pago No Completado</h1>
    </div>
    <div class="content">
      <p>Hubo un problema al procesar tu pago para el pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong>.</p>
      <p>Tu carrito está reservado. Intenta de nuevo:</p>
      <div class="cta">
        <a href="${retryUrl}">Reintentar Pago</a>
      </div>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">
        Si el problema persiste, contáctanos en <strong>hola@flordealtura.com</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">© 2026 Flor de Altura Café</p>
    </div>
  </div>
</body>
</html>
`;
}

export function generateOrderRefundedHTML(orderId: string, refundAmount: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #3d2817; background-color: #f5f1ed; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #6b9080 0%, #7fa394 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .content { padding: 32px 24px; }
    .amount { text-align: center; font-size: 32px; font-weight: 600; color: #6b9080; margin: 20px 0; }
    .footer { background-color: #f9f7f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #8b6f47; border-top: 1px solid #e5d4c1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✓ Reembolso Procesado</h1>
    </div>
    <div class="content">
      <p>Tu reembolso para el pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> ha sido procesado exitosamente.</p>
      <div class="amount">S/ ${refundAmount.toFixed(2)}</div>
      <p style="text-align: center; color: #666;">El monto aparecerá en tu cuenta bancaria entre 3-5 días hábiles.</p>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">
        Si tienes preguntas, escríbenos a <strong>hola@flordealtura.com</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">© 2026 Flor de Altura Café</p>
    </div>
  </div>
</body>
</html>
`;
}

export function generateOrderShippedHTML(
  orderId: string,
  trackingUrl?: string,
  trackingNumber?: string
): string {
  const trackingSection = trackingNumber
    ? `
    <p><strong>Código de rastreo:</strong> ${trackingNumber}</p>
    ${trackingUrl ? `<p><a href="${trackingUrl}" style="color: #d4af37;">Rastrear tu pedido</a></p>` : ""}
  `
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif; color: #3d2817; background-color: #f5f1ed; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #8b6f47 0%, #a68968 100%); color: white; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
    .content { padding: 32px 24px; }
    .tracking { background-color: #f9f7f5; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .footer { background-color: #f9f7f5; padding: 20px 24px; text-align: center; font-size: 12px; color: #8b6f47; border-top: 1px solid #e5d4c1; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📦 Tu Pedido Está en Camino</h1>
    </div>
    <div class="content">
      <p>¡Excelente noticia! Tu pedido <strong>#${orderId.slice(0, 8).toUpperCase()}</strong> acaba de ser enviado.</p>
      ${trackingSection ? `<div class="tracking">${trackingSection}</div>` : ""}
      <p style="font-size: 13px; color: #666;">
        Recibirás tu café en los próximos días. Si tienes preguntas, contáctanos en <strong>hola@flordealtura.com</strong>.
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0;">© 2026 Flor de Altura Café</p>
    </div>
  </div>
</body>
</html>
`;
}
