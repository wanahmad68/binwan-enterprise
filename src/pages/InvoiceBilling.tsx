import { useState } from 'react';
import { ArrowLeft, Printer, FileText, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export default function InvoiceBilling() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoiceType, setInvoiceType] = useState<'invoice' | 'cashbill'>('invoice');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [serviceRate, setServiceRate] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState('');
  const [notes, setNotes] = useState('');
  const [sstRate, setSstRate] = useState('6');

  const generatePDF = () => {
    if (!customerName || !serviceRate || !serviceDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name, service description, and service rate.",
        variant: "destructive"
      });
      return;
    }

    const totalServiceCost = parseFloat(serviceRate) || 0;
    const additionalCost = parseFloat(additionalCharges) || 0;
    const subtotal = totalServiceCost + additionalCost;
    const taxRate = parseFloat(sstRate) / 100;
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Create PDF content
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${invoiceType === 'invoice' ? 'Invoice' : 'Cash Bill'} - BINWAN Enterprise</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
            line-height: 1.4;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #16a085;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name { 
            font-size: 28px; 
            font-weight: bold; 
            color: #16a085;
            margin-bottom: 5px;
        }
        .document-title { 
            font-size: 22px; 
            font-weight: bold; 
            color: #2c3e50;
            margin-top: 15px;
        }
        .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }
        .info-box {
            width: 45%;
            padding: 15px;
            background-color: #f8f9fa;
            border-left: 4px solid #16a085;
        }
        .info-box h3 {
            color: #16a085;
            margin-top: 0;
            font-size: 16px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background-color: #16a085; 
            color: white;
            font-weight: bold;
        }
        .amount { text-align: right; }
        .total-row { 
            background-color: #f0f8f0;
            font-weight: bold;
        }
        .grand-total { 
            background-color: #16a085;
            color: white;
            font-size: 16px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #16a085;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .notes {
            margin-top: 20px;
            padding: 15px;
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        @media print {
            body { margin: 0; }
            .info-section { display: block; }
            .info-box { width: 100%; margin-bottom: 15px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
            <img src="./assets/logo_green.png" alt="BINWAN Logo" style="height: 60px; width: 60px; margin-right: 15px; object-fit: contain;" />
            <div class="company-name">BINWAN ENTERPRISE</div>
        </div>
        <div>Penghantaran Tepat, Perjalanan Selamat</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">SSM: 202403059988</div>
        <div class="document-title">${invoiceType === 'invoice' ? 'INVOICE' : 'CASH BILL'}</div>
        <div>Document No: ${invoiceType.toUpperCase()}-${Date.now().toString().slice(-6)}</div>
        <div>Date: ${new Date().toLocaleDateString('en-MY')}</div>
    </div>

    <div class="info-section">
        <div class="info-box">
            <h3>Bill To:</h3>
            <strong>${customerName}</strong><br>
            ${customerAddress.replace(/\n/g, '<br>')}<br>
            ${customerPhone ? `Phone: ${customerPhone}` : ''}
        </div>
        <div class="info-box">
            <h3>Service Provider:</h3>
            <strong>BINWAN ENTERPRISE</strong><br>
            No. 14, Lorong Machang Bubok 3,<br>
            Taman Machang Bubok,<br>
            14020 Bukit Mertajam, Pulau Pinang<br>
            Contact: 019-4755947 | 011-11485947
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate (RM)</th>
                <th class="amount">Amount (RM)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${serviceDescription}</td>
                <td>1</td>
                <td class="amount">${totalServiceCost.toFixed(2)}</td>
                <td class="amount">${totalServiceCost.toFixed(2)}</td>
            </tr>
            ${additionalCost > 0 ? `
            <tr>
                <td>Additional Charges</td>
                <td>1</td>
                <td class="amount">${additionalCost.toFixed(2)}</td>
                <td class="amount">${additionalCost.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr class="total-row">
                <td colspan="3"><strong>Subtotal</strong></td>
                <td class="amount"><strong>RM ${subtotal.toFixed(2)}</strong></td>
            </tr>
            ${parseFloat(sstRate) > 0 ? `
            <tr>
                <td colspan="3">SST (${sstRate}%)</td>
                <td class="amount">RM ${tax.toFixed(2)}</td>
            </tr>
            ` : `
            <tr>
                <td colspan="3">SST (Tax Exempt)</td>
                <td class="amount">RM 0.00</td>
            </tr>
            `}
            <tr class="grand-total">
                <td colspan="3"><strong>TOTAL AMOUNT</strong></td>
                <td class="amount"><strong>RM ${total.toFixed(2)}</strong></td>
            </tr>
        </tbody>
    </table>

    ${notes ? `
    <div class="notes">
        <h4>Additional Notes:</h4>
        <p>${notes.replace(/\n/g, '<br>')}</p>
    </div>
    ` : ''}

    ${invoiceType === 'invoice' ? `
    <div style="margin: 20px 0; text-align: left; border-top: 1px solid #ddd; padding-top: 15px;">
        <div style="margin-bottom: 5px;"><strong>No. Akaun:</strong> 29001017718</div>
        <div><strong>Bank:</strong> Hong Leong Bank</div>
    </div>
    ` : `
    <div style="margin: 20px 0; text-align: left; border-top: 1px solid #ddd; padding-top: 15px;">
        <div style="font-size: 24px; font-weight: bold; color: red;">PAID</div>
    </div>
    `}

    <div class="footer">
        <p>Thank you for choosing BINWAN ENTERPRISE for your logistics needs!</p>
        <p>This is a computer-generated document. No signature required.</p>
        <p>Generated on ${new Date().toLocaleString('en-MY')}</p>
    </div>
</body>
</html>
    `;

    // Open PDF in new window
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(pdfContent);
      newWindow.document.close();
      newWindow.focus();
      
      // Auto-print after a short delay
      setTimeout(() => {
        newWindow.print();
      }, 500);
    }

    toast({
      title: "PDF Generated",
      description: `${invoiceType === 'invoice' ? 'Invoice' : 'Cash bill'} opened in new window for printing.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6 pt-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-teal-800">Invoice & Cash Bill Generator</h1>
            <p className="text-gray-600">Generate professional invoices and cash bills</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Document Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Document Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={invoiceType === 'invoice' ? 'default' : 'outline'}
                  onClick={() => setInvoiceType('invoice')}
                  className="h-16 flex-col"
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Invoice
                </Button>
                <Button
                  variant={invoiceType === 'cashbill' ? 'default' : 'outline'}
                  onClick={() => setInvoiceType('cashbill')}
                  className="h-16 flex-col"
                >
                  <CreditCard className="h-6 w-6 mb-2" />
                  Cash Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Service Information */}
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serviceDescription">Service Description *</Label>
                <Input
                  id="serviceDescription"
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="e.g., Transportation from KL to Penang"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceRate">Service Rate (RM) *</Label>
                  <Input
                    id="serviceRate"
                    type="number"
                    step="0.01"
                    value={serviceRate}
                    onChange={(e) => setServiceRate(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="sstRate">SST Rate (%) *</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant={sstRate === '0' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSstRate('0')}
                      className="flex-1"
                    >
                      No SST
                    </Button>
                    <Button
                      type="button"
                      variant={sstRate === '6' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSstRate('6')}
                      className="flex-1"
                    >
                      6%
                    </Button>
                    <Button
                      type="button"
                      variant={sstRate === '8' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSstRate('8')}
                      className="flex-1"
                    >
                      8%
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Label htmlFor="sstRateCustom" className="text-sm">Custom:</Label>
                    <Input
                      id="sstRateCustom"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={sstRate}
                      onChange={(e) => setSstRate(e.target.value)}
                      placeholder="0.0"
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Malaysia: No SST (tax-exempt), 6% (until June 2025), 8% (from July 2025)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Textarea
                  id="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Enter customer address"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="additionalCharges">Additional Charges (RM)</Label>
                <Input
                  id="additionalCharges"
                  type="number"
                  step="0.01"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes or terms"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Preview */}
        {serviceRate && (
          <Card className="bg-teal-50 border-teal-200">
            <CardHeader>
              <CardTitle className="text-teal-800">Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Service Amount:</span>
                  <span>RM {(parseFloat(serviceRate) || 0).toFixed(2)}</span>
                </div>
                {additionalCharges && (
                  <div className="flex justify-between">
                    <span>Additional Charges:</span>
                    <span>RM {(parseFloat(additionalCharges) || 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span>Subtotal:</span>
                  <span>RM {((parseFloat(serviceRate) || 0) + (parseFloat(additionalCharges) || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SST {parseFloat(sstRate) > 0 ? `(${sstRate}%)` : '(Tax Exempt)'}:</span>
                  <span>RM {(((parseFloat(serviceRate) || 0) + (parseFloat(additionalCharges) || 0)) * (parseFloat(sstRate) / 100)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-teal-800 border-t pt-2">
                  <span>Total Amount:</span>
                  <span>RM {(((parseFloat(serviceRate) || 0) + (parseFloat(additionalCharges) || 0)) * (1 + parseFloat(sstRate) / 100)).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={generatePDF}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700"
            disabled={!customerName || !serviceRate || !serviceDescription}
          >
            <Printer className="h-5 w-5 mr-2" />
            Generate & Print {invoiceType === 'invoice' ? 'Invoice' : 'Cash Bill'}
          </Button>
        </div>
      </div>
    </div>
  );
}