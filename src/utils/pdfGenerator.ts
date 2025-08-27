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

    // Inject a print-safe CSS reset to avoid unsupported color functions (e.g., oklch)
    const resetStyle = document.createElement('style');
    resetStyle.textContent = `
      .__pdf-reset * {
        color: #000000 !important;
        background: #ffffff !important;
        border-color: #000000 !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      .__pdf-reset [class*="bg-"] { background: #ffffff !important; }
      .__pdf-reset [class*="text-"] { color: #000000 !important; }
      .__pdf-reset [class*="from-"] { background-image: none !important; }
      .__pdf-reset [class*="to-"] { background-image: none !important; }
      .__pdf-reset [class*="via-"] { background-image: none !important; }
      .__pdf-reset [style*="oklch"],
      .__pdf-reset [style*="hsl"] {
        color: #000000 !important;
        background: #ffffff !important;
      }
    `;

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
    // Wrap cloned element with a reset container
    const wrapper = document.createElement('div');
    wrapper.className = '__pdf-reset';
    wrapper.appendChild(clonedElement);
    tempContainer.appendChild(resetStyle);
    tempContainer.appendChild(wrapper);
    document.body.appendChild(tempContainer);

    try {
      await html2pdf().set(opt).from(wrapper).save();
    } finally {
      // Clean up the temporary container
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    throw error;
  }
};

// Generate a PDF for a report section using styling similar to invoice PDF
export const generateReportPDF = async (
  elementSelector: string,
  filename?: string,
  reportOpts?: { dateRange?: string }
): Promise<void> => {
  try {
    const element = document.querySelector(elementSelector);
    if (!element) {
      throw new Error(`Report element not found for selector ${elementSelector}`);
    }

    const clonedElement = element.cloneNode(true) as HTMLElement;

    // Apply strong print styles similar to invoice PDF
    const style = document.createElement('style');
    style.textContent = `
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
        border-radius: 0 !important;
      }

      .print-container {
        border: 2px solid #000000 !important;
        margin: 10px !important;
        background-color: #ffffff !important;
      }

      .report-header {
        text-align: center !important;
        margin-bottom: 8px !important;
        border-bottom: 2px solid #000000 !important;
        padding-bottom: 6px !important;
      }

      .brand-title { font-size: 22px !important; font-weight: bold !important; text-align: center !important;
              padding-top: 12px !important;
 }
      .report-subtitle { font-size: 14px !important; font-weight: bold !important; margin-top: 4px !important; text-align: center !important; }

      table {
        border-collapse: collapse !important;
        width: 100% !important;
        margin: 0 !important;
        table-layout: fixed !important;
      }

      th, td {
        border-top: 1px solid #000000 !important;
        border-right: 1px solid #000000 !important;
        text-align: center !important;
        vertical-align: middle !important;
        padding: 4px !important;
        word-break: break-word !important;
      }

      th { background-color: #f0f0f0 !important; font-weight: bold !important; }

      th:first-child, td:first-child { border-left: none !important; }
      th:last-child, td:last-child { border-right: none !important; }

      .totals-row { background-color: #f8f8f8 !important; font-weight: bold !important; }

      /* Specific widths for report table to avoid overflow */
      .report-table col:nth-child(1) { width: 10% !important; }
      .report-table col:nth-child(2) { width: 34% !important; }
      .report-table col:nth-child(3) { width: 14% !important; }
      .report-table col:nth-child(4) { width: 14% !important; }
      .report-table col:nth-child(5) { width: 14% !important; }
      .report-table col:nth-child(6) { width: 14% !important; }

      .cards {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 8px !important;
        margin-top: 8px !important;
      }

      .card { border: 1px solid #000000 !important; padding: 8px !important; }
      .card-title { font-size: 12px !important; color: #000000 !important; margin-bottom: 4px !important; }
      .card-value { font-size: 16px !important; font-weight: bold !important; }

      /* Hide elements we don't want in the report PDF */
      .print-hide { display: none !important; }
      tfoot{border-bottom: 1px solid #000000 !important;}

      /* Summary bar styling for PDF */
      .summary-bar {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        font-size: 16px !important;
        font-weight: bold !important;
        margin: 8px 0 !important;
        padding: 6px 8px !important;
        border: 1px solid #000000 !important;
      }

      .pdf-flex{
        display: flex !important;
      }

      .pdf-summary{
          font-size: 20px !important;
    justify-content: flex-end;
    padding: 4px 12px !important;
      }

      .pr-4-br{
      padding-right: 4px !important;
    // border-right: 1px solid black !important;
      }

      .pl-4{
      padding-left: 4px !important;
      }

      .mtn-4{
          margin-top: -4px !important;
          }

                .print-hide {
        display: none !important;
      }
    `;

    // Build a minimal print container to avoid layout noise
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    tempContainer.style.backgroundColor = '#ffffff';

    const wrapper = document.createElement('div');
    wrapper.className = 'print-container';

    // Create header matching invoice style
    const title = document.createElement('div');
    title.className = 'report-header';
    const brand = document.createElement('div');
    brand.className = 'brand-title';
    brand.textContent = 'Santkrupa Gold';
    const sub = document.createElement('div');
    sub.className = 'report-subtitle';
    sub.textContent = reportOpts?.dateRange || '';
    title.appendChild(brand);
    title.appendChild(sub);
    wrapper.appendChild(title);

    // Ensure report table uses fixed columns by injecting colgroup if missing
    const tableEl = clonedElement.querySelector('table');
    if (tableEl && !tableEl.querySelector('colgroup')) {
      const colgroup = document.createElement('colgroup');
      for (let i = 0; i < 6; i++) {
        const col = document.createElement('col');
        colgroup.appendChild(col);
      }
      tableEl.insertBefore(colgroup, tableEl.firstChild);
      tableEl.classList.add('report-table');
    }

    // Build a single-line summary bar: "Total Weight - X | Average - Y"
    try {
      const allDivs = Array.from(clonedElement.querySelectorAll('div')) as HTMLElement[];
      const weightCard = allDivs.find((d) => d.querySelector('h3')?.textContent?.trim() === 'Total Weight');
      const avgCard = allDivs.find((d) => d.querySelector('h3')?.textContent?.trim()?.startsWith('Average'));
      if (weightCard && avgCard) {
        const container = weightCard.parentElement as HTMLElement;
        const weightVal = weightCard.querySelector('p')?.textContent?.trim() || '';
        const avgVal = avgCard.querySelector('p')?.textContent?.trim() || '';

        const bar = document.createElement('div');
        bar.className = 'summary-bar';
        const left = document.createElement('span');
        left.textContent = `Total Weight - ${weightVal}`;
        const sep = document.createElement('span');
        sep.textContent = ' | ';
        const right = document.createElement('span');
        right.textContent = `Average - ${avgVal}`;
        bar.appendChild(left);
        bar.appendChild(sep);
        bar.appendChild(right);

        // Insert bar before the cards container and remove the container
        container.parentElement?.insertBefore(bar, container);
        container.remove();
      }
    } catch {}

    // Hide non-average metric cards if any remain
    Array.from(clonedElement.querySelectorAll('.print-hide')).forEach((el) => {
      (el as HTMLElement).style.display = 'none';
    });

    wrapper.appendChild(clonedElement as HTMLElement);
    tempContainer.appendChild(style);
    tempContainer.appendChild(wrapper);
    document.body.appendChild(tempContainer);

    // Log the full HTML (including CSS) used for generating the report PDF
    try {
      // eslint-disable-next-line no-console
    } catch {}

    const pdfOpts: PDFOptions = {
      filename: filename || `report-${new Date().toISOString().split('T')[0]}.pdf`,
      margin: 4,
      jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' },
      html2canvas: { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff' }
    };

    // Match invoice formation: rely on A5 page sizing and scaling (no forced width)
    clonedElement.style.width = '100%';

    try {
      await html2pdf().set(pdfOpts).from(wrapper).save();
    } finally {
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
        margin-top: -8px !important;
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

      .bt-1{
        border-top: 1px solid #000000 !important;
      }

      .br-none{
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
    companyName.textContent = 'Santkrupa Gold';
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
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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