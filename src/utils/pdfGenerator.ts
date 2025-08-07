import html2pdf from 'html2pdf.js';
import { type FirebasePaymentData } from '../services/paymentService';

export interface PDFOptions {
  filename?: string;
  margin?: number | number[];
  image?: { type: string; quality: number };
  html2canvas?: {
    scale: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
    width?: number;
    height?: number;
  };
  jsPDF?: { unit: string; format: string; orientation: string };
}

export const generatePDF = async (
  elementSelector: string,
  options: PDFOptions = {}
): Promise<void> => {
  try {
    const element = document.querySelector(elementSelector);

    if (!element) {
      throw new Error(`Element with selector "${elementSelector}" not found`);
    }

    // Clone the element to avoid modifying the original
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Remove any problematic CSS that might cause issues
    const styleSheets = document.styleSheets;
    for (let i = 0; i < styleSheets.length; i++) {
      try {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const rule = rules[j] as CSSStyleRule;
            if (rule.style && rule.style.color) {
              // Replace problematic color functions with standard colors
              if (rule.style.color.includes('oklch') || rule.style.color.includes('hsl')) {
                rule.style.color = '#000000';
              }
            }
          }
        }
      } catch (e) {
        // Skip cross-origin stylesheets
        continue;
      }
    }

    const defaultOptions = {
      filename: 'invoice.pdf',
      margin: 10,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    const pdfOptions = {
      ...defaultOptions,
      ...options,
      html2canvas: { ...defaultOptions.html2canvas, ...options.html2canvas },
      jsPDF: { ...defaultOptions.jsPDF, ...options.jsPDF }
    };

    const opt = {
      margin: pdfOptions.margin,
      filename: pdfOptions.filename,
      image: pdfOptions.image,
      html2canvas: pdfOptions.html2canvas,
      jsPDF: pdfOptions.jsPDF
    };

    // Create a temporary container for the cloned element
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
      await html2pdf().set(opt).from(clonedElement).save();
    } finally {
      // Clean up the temporary container
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    throw error;
  }
};

export const generateInvoicePDF = async (filename?: string): Promise<void> => {
  try {
    const element = document.querySelector('.print-this');

    if (!element) {
      throw new Error('Invoice element not found');
    }

    // Create a clean version for PDF generation
    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Apply basic styles to avoid CSS parsing issues
    const style = document.createElement('style');
    style.textContent = `
      /* CSS Reset - Override all default styles */
      * {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        background: none !important;
        color: #000000 !important;
        font-family: Arial, sans-serif !important;
        font-size: 12px !important;
        font-weight: normal !important;
        text-align: left !important;
        vertical-align: middle !important;
        line-height: normal !important;
        text-decoration: none !important;
        list-style: none !important;
        box-sizing: border-box !important;
      }
      
      /* Apply our specific styles */
      .print-this {
        border: 2px solid #000000 !important;
        margin: 10px !important;
        background-color: #ffffff !important;
      }

      /* Hide elements with print-hide class during PDF generation */
      .print-hide {
        display: none !important;
      }

      /* Adjust colspan for Grand Total row since Action column is hidden */
      .invoice-table tr.bg-gray-50.font-bold td {
        colSpan: 3 !important;
      }
      
      /* Header text styling */
      .text-lg {
        font-size: 14px !important;
        text-align: center !important;
        margin-bottom: 8px !important;
        color: #000000 !important;
      }
      
      .text-2xl {
        font-size: 18px !important;
        font-weight: bold !important;
        text-align: center !important;
        margin-bottom: 12px !important;
        color: #000000 !important;
      }
      
      /* Table reset and styling */
      table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin-bottom: 0 !important;
      }
      
      th, td {
        border-top: 1px solid #000000 !important;
        border-right: 1px solid #000000 !important;
        text-align: center !important;
        vertical-align: middle !important;
        padding: 8px !important;
      }
      
      th {
        background-color: #f0f0f0 !important;
        font-weight: bold !important;
      }
      
      /* Totals row styling */
      tr.bg-gray-50 {
        background-color: #f8f8f8 !important;
        font-weight: bold !important;
      }
      
      /* Grand total row styling */
      tr.bg-gray-50.font-bold {
        background-color: #f0f0f0 !important;
        font-weight: bold !important;
        font-size: 14px !important;
      }
      
      tr.bg-gray-50.font-bold td {
        font-size: 16px !important;
        font-weight: bold !important;
        padding-top: 4px !important;
        padding-bottom: 4px !important;
      }
      
      /* Remove any conflicting border styles */
      .border-blue-300 {
        border-color: #000000 !important;
      }
      
      /* Remove left borders from all table cells */
      th:first-child, td:first-child {
        border-left: none !important;
      }
      
      /* Remove right borders from all table cells */
      th:last-child, td:last-child {
        border-right: none !important;
      }
      
      /* Remove bottom space from print container */
      .print-this {
        padding-bottom: 0 !important;
      }
      
      /* Remove bottom border only from the second table (last table) */
      table:last-of-type tr:last-child td {
        border-bottom: none !important;
      }
      
      
      /* Reduce cell height for invoice-table and center content vertically */
      .invoice-table th,
      .invoice-table tbody tr td {
        padding: 0 !important;
      }
      
      .number-span{
        margin-top: -10px !important;
        display: inline-block !important;
      }
      
      .number-span-bold{
        margin-top: -10px !important;
        display: inline-block !important;
        font-weight: bold !important;
      }
      
      /* Invoice table specific styling */
      .invoice-table{
        tbody{
          tr{
            height: 16px;
            td{
              height: 16px;
              padding: 0;
            }
          }
        }
      }
      
      /* Invoice detail table styling */
      .invoice-detail-table th,
      .invoice-detail-table td {
        padding: 6px !important;
        font-size: 11px !important;
        font-weight: bold !important;
      }


      
      /* First cell in invoice detail table - 50% width */
      .invoice-detail-table th:first-child{
        width: 56.85% !important;
        text-align: left !important;
        font-size: 13px !important;
        font-weight: bold !important;
        vertical-align: top !important;
      }
      .w-56{
        width: 49.15% !important;
      }
      
      /* Remove bottom border from last cell of invoice detail table */
      .invoice-detail-table tr:last-child td {
        border-bottom: none !important;
      }
      
      /* Remove gap between invoice detail table and invoice table */
      .invoice-detail-table {
        margin-bottom: 0 !important;
      }
      
      .invoice-table {
        margin-top: 0 !important;
      }

      .invoice-table thead tr{
        height: 30px !important;
      }

      .left-top-align{
        vertical-align: top !important;
        text-align: left !important;
      }

      .border-right-none{
        border-right: none !important;
      }

    `;

    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.appendChild(style);
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);
    
    // Debug tempContainer before PDF generation
    console.log('=== PDF GENERATION DEBUG ===');
    console.log('tempContainer:', tempContainer);
    console.log('tempContainer.innerHTML length:', tempContainer.innerHTML.length);
    console.log('tempContainer.outerHTML:', tempContainer.outerHTML);
    console.log('tempContainer dimensions:', tempContainer.offsetWidth, 'x', tempContainer.offsetHeight);
    console.log('tempContainer children count:', tempContainer.children.length);
    console.log('=== END DEBUG ===');

    const options: PDFOptions = {
      filename: filename || `invoice-${new Date().toISOString().split('T')[0]}.pdf`,
      margin: 4,
      jsPDF: {
        unit: 'mm',
        format: 'a5',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }
    };

    try {
      await html2pdf().set(options).from(clonedElement).save();
    } finally {
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    throw error;
  }
}; 

export const generateCustomerPaymentsPDF = async (
  customerName: string,
  payments: FirebasePaymentData[],
  filename?: string
): Promise<void> => {
  try {
    // Create a temporary container for PDF generation
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    tempContainer.style.fontSize = '12px';
    tempContainer.style.color = '#000000';

    // Create the PDF content
    const pdfContent = document.createElement('div');
    pdfContent.className = 'print-this';
    pdfContent.style.border = '2px solid #000000';
    pdfContent.style.padding = '10px 0 0 0';
    pdfContent.style.margin = '16px';
    pdfContent.style.backgroundColor = '#ffffff';


    // Header
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.marginBottom = '15px';
    header.style.borderBottom = '2px solid #000000';
    header.style.paddingBottom = '10px';

    const companyName = document.createElement('h1');
    companyName.textContent = 'MARUTI NANDAN IMITATION';
    companyName.style.fontSize = '18px';
    companyName.style.fontWeight = 'bold';
    companyName.style.margin = '0 0 10px 0';
    companyName.style.color = '#000000';

    // Customer info row with left alignment and date on right
    const customerInfoRow = document.createElement('div');
    customerInfoRow.style.display = 'flex';
    customerInfoRow.style.justifyContent = 'space-between';
    customerInfoRow.style.alignItems = 'center';
    customerInfoRow.style.margin = '0';

    const customerNameElement = document.createElement('h2');
    customerNameElement.textContent = `M/S: ${customerName}`;
    customerNameElement.style.fontSize = '14px';
    customerNameElement.style.fontWeight = 'bold';
    customerNameElement.style.margin = '0';
    customerNameElement.style.color = '#000000';
    customerNameElement.style.textAlign = 'left';
    customerNameElement.style.borderLeft = 'none';
    customerNameElement.style.paddingLeft = '10px';

    const currentDate = document.createElement('span');
    currentDate.textContent = new Date().toLocaleDateString('en-IN');
    currentDate.style.fontSize = '14px';
    currentDate.style.fontWeight = 'bold';
    currentDate.style.color = '#000000';
    currentDate.style.paddingRight = '10px';

    customerInfoRow.appendChild(customerNameElement);
    customerInfoRow.appendChild(currentDate);

    header.appendChild(companyName);
    header.appendChild(customerInfoRow);

    // Table
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.marginTop = '10px';
    table.style.marginBottom = '0';
    table.style.marginLeft = '0';
    table.style.marginRight = '0';
    table.style.borderTop = '1px solid #000000';
    table.style.borderLeft = 'none';
    table.style.borderRight = 'none';
    table.style.borderBottom = 'none';

    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.style.backgroundColor = '#f0f0f0';
    headerRow.style.fontWeight = 'bold';

    const headers = ['Sr. No.', 'Payment Amount', 'Payment Date'];
    headers.forEach((headerText, index) => {
      const th = document.createElement('th');
      th.textContent = headerText;
      th.style.borderTop = '1px solid #000000';
      // th.style.borderLeft = 'none';
      th.style.borderLeft = index === 1 ? '1px solid #000000' : 'none';
      th.style.borderRight = index === 1 ? '1px solid #000000' : 'none';
      // th.style.borderBottom = 'none';
      th.style.padding = '6px';
      th.style.textAlign = 'center';
      th.style.fontWeight = 'bold';
      th.style.backgroundColor = '#f0f0f0';
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    payments.forEach((payment, index) => {
      const row = document.createElement('tr');
      
      // Sr. No.
      const srNoCell = document.createElement('td');
      srNoCell.textContent = (index + 1).toString();
      srNoCell.style.borderTop = '1px solid #000000';
      srNoCell.style.borderLeft = 'none';
      srNoCell.style.borderRight = 'none';
      srNoCell.style.borderBottom = 'none';
      srNoCell.style.padding = '6px';
      srNoCell.style.textAlign = 'center';
      
      // Payment Amount
      const amountCell = document.createElement('td');
      amountCell.textContent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(payment.amount);
      amountCell.style.borderTop = '1px solid #000000';
      amountCell.style.borderLeft = '1px solid #000000';
      amountCell.style.borderRight = '1px solid #000000';
      amountCell.style.borderBottom = 'none';
      amountCell.style.padding = '6px';
      amountCell.style.textAlign = 'right';
      
      // Payment Date
      const dateCell = document.createElement('td');
      dateCell.textContent = payment.paymentDate;
      dateCell.style.borderTop = '1px solid #000000';
      dateCell.style.borderLeft = 'none';
      dateCell.style.borderRight = 'none';
      dateCell.style.borderBottom = 'none';
      dateCell.style.padding = '6px';
      dateCell.style.textAlign = 'center';
      
      row.appendChild(srNoCell);
      row.appendChild(amountCell);
      row.appendChild(dateCell);
      tbody.appendChild(row);
    });

    // Total row
    const totalRow = document.createElement('tr');
    totalRow.style.backgroundColor = '#f8f8f8';
    totalRow.style.fontWeight = 'bold';
    
    const totalLabelCell = document.createElement('td');
    totalLabelCell.textContent = 'Total';
    totalLabelCell.style.borderTop = '1px solid #000000';
    totalLabelCell.style.borderLeft = 'none';
    totalLabelCell.style.borderRight = 'none';
    totalLabelCell.style.borderBottom = 'none';
    totalLabelCell.style.padding = '6px';
    totalLabelCell.style.textAlign = 'center';
    totalLabelCell.style.fontWeight = 'bold';
    totalLabelCell.style.backgroundColor = '#f8f8f8';
    
    const totalAmountCell = document.createElement('td');
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    totalAmountCell.textContent = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(totalAmount);
    totalAmountCell.style.borderTop = '1px solid #000000';
    totalAmountCell.style.borderLeft = '1px solid #000000';
    totalAmountCell.style.borderRight = '1px solid #000000';
    totalAmountCell.style.borderBottom = 'none';
    totalAmountCell.style.padding = '6px';
    totalAmountCell.style.textAlign = 'right';
    totalAmountCell.style.fontWeight = 'bold';
    totalAmountCell.style.backgroundColor = '#f8f8f8';
    
    const emptyCell = document.createElement('td');
    emptyCell.style.borderTop = '1px solid #000000';
    emptyCell.style.borderLeft = 'none';
    emptyCell.style.borderRight = 'none';
    emptyCell.style.borderBottom = 'none';
    emptyCell.style.padding = '6px';
    emptyCell.style.backgroundColor = '#f8f8f8';
    
    totalRow.appendChild(totalLabelCell);
    totalRow.appendChild(totalAmountCell);
    totalRow.appendChild(emptyCell);
    tbody.appendChild(totalRow);

    table.appendChild(tbody);
    pdfContent.appendChild(header);
    pdfContent.appendChild(table);
    tempContainer.appendChild(pdfContent);
    document.body.appendChild(tempContainer);

    // Debug customer payments PDF before generation
    console.log('=== CUSTOMER PAYMENTS PDF DEBUG ===');
    console.log('tempContainer:', tempContainer);
    console.log('pdfContent:', pdfContent);
    console.log('tempContainer.innerHTML length:', tempContainer.innerHTML.length);
    console.log('pdfContent.innerHTML length:', pdfContent.innerHTML.length);
    console.log('tempContainer.outerHTML:', tempContainer.outerHTML);
    console.log('pdfContent.outerHTML:', pdfContent.outerHTML);
    console.log('tempContainer dimensions:', tempContainer.offsetWidth, 'x', tempContainer.offsetHeight);
    console.log('pdfContent dimensions:', pdfContent.offsetWidth, 'x', pdfContent.offsetHeight);
    console.log('tempContainer children count:', tempContainer.children.length);
    console.log('pdfContent children count:', pdfContent.children.length);
    console.log('=== END CUSTOMER PAYMENTS DEBUG ===');

    const options: PDFOptions = {
      filename: filename || `payments-${customerName}-${new Date().toISOString().split('T')[0]}.pdf`,
      margin: 0,
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      }
    };

    try {
      await html2pdf().set(options).from(pdfContent).save();
    } finally {
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    console.error('Error generating customer payments PDF:', error);
    throw error;
  }
}; 