import html2pdf from 'html2pdf.js';

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
      console.log('PDF generated successfully');
    } finally {
      // Clean up the temporary container
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
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
            height: 20px;
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
    
    // Log the generated HTML and CSS for debugging
    console.log('=== PDF GENERATION DEBUG ===');
    console.log('Original element:', element);
    console.log('Cloned element:', clonedElement);
    console.log('Applied CSS styles:', style.textContent);
    console.log('Complete container HTML:', tempContainer.outerHTML);
    console.log('Container dimensions:', tempContainer.offsetWidth, 'x', tempContainer.offsetHeight);
    console.log('Container content length:', tempContainer.innerHTML.length);
    
    // Log computed styles for key elements
    const firstTable = clonedElement.querySelector('table');
    const firstCell = clonedElement.querySelector('td');
    if (firstTable) {
      console.log('First table computed styles:', window.getComputedStyle(firstTable));
    }
    if (firstCell) {
      console.log('First cell computed styles:', window.getComputedStyle(firstCell));
    }
    
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

    console.log('clonedElement-->',clonedElement)

    try {
      await html2pdf().set(options).from(clonedElement).save();
      console.log('PDF generated successfully');
    } finally {
      document.body.removeChild(tempContainer);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}; 