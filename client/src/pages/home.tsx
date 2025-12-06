import React, { useState, useEffect } from 'react';
import { Smartphone, Receipt, Wallet, ArrowLeft, CheckCircle, Banknote, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Types
type ServiceType = {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  description: string;
};

type ScreenState = 'home' | 'details' | 'insertCash' | 'processing' | 'confirmation';

export default function PaymentKiosk() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [billType, setBillType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [insertedAmount, setInsertedAmount] = useState(0);
  const [transactionId, setTransactionId] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const services: ServiceType[] = [
    { id: 'gcash', name: 'GCash Cash-In', icon: Wallet, color: 'text-blue-500', description: 'Instant cash-in to your GCash wallet' },
    { id: 'maya', name: 'Maya Cash-In', icon: Smartphone, color: 'text-green-500', description: 'Add money to your Maya account' },
    { id: 'bills', name: 'Bills Payment', icon: Receipt, color: 'text-indigo-500', description: 'Pay electricity, water, and other bills' }
  ];

  const billTypes = [
    'Electricity (Meralco)',
    'Electricity (Davao Light)',
    'Water (Manila Water)',
    'Water (Water District)',
    'Internet (PLDT)',
    'Mobile (Globe/Smart)',
    'Credit Card'
  ];

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
    setScreen('details');
  };

  const handleProceedToPayment = () => {
    if ((selectedService?.id !== 'bills' && mobileNumber && amount) ||
        (selectedService?.id === 'bills' && billType && accountNumber && amount)) {
      setScreen('insertCash');
    }
  };

  const handleCashInserted = () => {
    setInsertedAmount(parseInt(amount));
    setScreen('processing');
    setTimeout(() => {
      setTransactionId('TXN' + Math.random().toString(36).substr(2, 9).toUpperCase());
      setScreen('confirmation');
    }, 2000);
  };

  const handleNewTransaction = () => {
    setScreen('home');
    setSelectedService(null);
    setMobileNumber('');
    setAmount('');
    setBillType('');
    setAccountNumber('');
    setInsertedAmount(0);
    setTransactionId('');
  };

  // Animations
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.3
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col h-[800px]">
        
        {/* Header */}
        <header className="bg-primary p-6 text-primary-foreground flex justify-between items-center shadow-md z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">SecurePay Kiosk</h1>
              <p className="text-xs text-blue-100 opacity-80">Self-Service Terminal #4022</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-sm text-blue-100 opacity-80">
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative overflow-hidden bg-gray-50/50">
          <AnimatePresence mode='wait'>
            
            {/* HOME SCREEN */}
            {screen === 'home' && (
              <motion.div
                key="home"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 p-8 md:p-12 flex flex-col items-center justify-center"
              >
                <div className="text-center mb-12 space-y-2">
                  <h2 className="text-4xl font-bold text-gray-800">Select Service</h2>
                  <p className="text-gray-500 text-lg">Please choose a transaction type to proceed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                  {services.map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="group relative bg-white rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-primary hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center h-64 justify-center"
                        data-testid={`service-btn-${service.id}`}
                      >
                        <div className={`w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${service.color.replace('text-', 'bg-').replace('500', '100')}`}>
                          <Icon className={`w-12 h-12 ${service.color}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">{service.name}</h3>
                        <p className="text-sm text-gray-500 px-4">{service.description}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-auto pt-12 text-gray-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Need help? Call customer support at 1-800-PAY-KIOSK</span>
                </div>
              </motion.div>
            )}

            {/* DETAILS SCREEN */}
            {screen === 'details' && selectedService && (
              <motion.div
                key="details"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 p-8 md:p-12 overflow-y-auto"
              >
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                  <Button 
                    variant="ghost" 
                    onClick={() => setScreen('home')} 
                    className="self-start mb-6 text-gray-500 hover:text-primary pl-0 hover:bg-transparent text-lg"
                  >
                    <ArrowLeft className="w-6 h-6 mr-2" />
                    Back to Menu
                  </Button>

                  <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                    <div className={`p-3 rounded-full ${selectedService.color.replace('text-', 'bg-').replace('500', '100')}`}>
                      <selectedService.icon className={`w-8 h-8 ${selectedService.color}`} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">{selectedService.name}</h2>
                      <p className="text-gray-500">Enter transaction details below</p>
                    </div>
                  </div>

                  <div className="space-y-8 flex-1">
                    {selectedService.id === 'bills' ? (
                      <>
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-700">Biller / Service Provider</Label>
                          <Select value={billType} onValueChange={setBillType}>
                            <SelectTrigger className="h-16 text-xl px-6 bg-white border-2 focus:border-primary focus:ring-0 rounded-xl">
                              <SelectValue placeholder="Select biller" />
                            </SelectTrigger>
                            <SelectContent>
                              {billTypes.map((type) => (
                                <SelectItem key={type} value={type} className="text-lg py-3">{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-3">
                          <Label className="text-lg font-semibold text-gray-700">Account Number</Label>
                          <Input
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="Enter account number"
                            className="h-16 text-xl px-6 bg-white border-2 focus:border-primary focus:ring-0 rounded-xl"
                            data-testid="input-account-number"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-gray-700">Mobile Number</Label>
                        <div className="relative">
                          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-medium">+63</div>
                          <Input
                            type="tel"
                            value={mobileNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (val.length <= 10) setMobileNumber(val);
                            }}
                            placeholder="9XX XXX XXXX"
                            className="h-16 text-2xl pl-20 pr-6 bg-white border-2 focus:border-primary focus:ring-0 rounded-xl tracking-wider font-mono"
                            data-testid="input-mobile-number"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-lg font-semibold text-gray-700">Amount (PHP)</Label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl font-bold">₱</div>
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="h-16 text-3xl pl-16 pr-6 bg-white border-2 focus:border-primary focus:ring-0 rounded-xl font-bold text-gray-800"
                          data-testid="input-amount"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      {[100, 200, 500, 1000].map((preset) => (
                        <Button
                          key={preset}
                          variant="outline"
                          onClick={() => setAmount(preset.toString())}
                          className="h-14 text-lg font-medium hover:border-primary hover:text-primary hover:bg-blue-50 transition-all"
                        >
                          ₱{preset}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8">
                    <Button
                      onClick={handleProceedToPayment}
                      disabled={
                        (selectedService.id !== 'bills' && (!mobileNumber || !amount)) ||
                        (selectedService.id === 'bills' && (!billType || !accountNumber || !amount))
                      }
                      className="w-full h-20 text-2xl font-bold rounded-xl shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50"
                      data-testid="btn-proceed"
                    >
                      Proceed to Payment
                      <ChevronRight className="ml-2 w-8 h-8" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* INSERT CASH SCREEN */}
            {screen === 'insertCash' && (
              <motion.div
                key="insertCash"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 p-8 md:p-12 flex flex-col items-center justify-center"
              >
                <div className="text-center space-y-4 mb-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-600 mb-4 animate-bounce">
                    <Banknote className="w-12 h-12" />
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800">Insert Cash Now</h2>
                  <p className="text-xl text-gray-500">Please insert exact amount into the bill acceptor</p>
                </div>

                <Card className="w-full max-w-2xl bg-blue-50 border-2 border-blue-200 border-dashed mb-12 overflow-hidden relative">
                  <CardContent className="p-12 flex flex-col items-center relative z-10">
                    <div className="flex items-center gap-8 mb-6">
                      <div className="w-48 h-24 bg-white rounded border-2 border-green-500 shadow-sm flex items-center justify-center relative overflow-hidden">
                         <div className="absolute inset-0 flex items-center justify-center opacity-10">
                             <span className="text-4xl font-bold text-green-900">₱</span>
                         </div>
                         <span className="font-mono font-bold text-xl text-green-700">PHP BILL</span>
                      </div>
                      
                      <div className="flex flex-col items-center gap-1">
                         <div className="w-16 h-1 bg-blue-300 rounded-full animate-pulse"></div>
                         <div className="w-16 h-1 bg-blue-300 rounded-full animate-pulse delay-75"></div>
                         <div className="w-16 h-1 bg-blue-300 rounded-full animate-pulse delay-150"></div>
                         <ArrowLeft className="w-8 h-8 text-blue-500 rotate-180 mt-1 animate-pulse" />
                      </div>

                      <div className="w-8 h-32 bg-gray-800 rounded-lg border-4 border-gray-600 shadow-inner flex items-center justify-center">
                          <div className="w-1 h-24 bg-black rounded-full opacity-50"></div>
                      </div>
                    </div>
                    
                    <p className="font-medium text-blue-800">Insert bills flat and one at a time</p>
                  </CardContent>
                  
                  {/* Decorative background elements */}
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl"></div>
                  <div className="absolute -left-10 -top-10 w-40 h-40 bg-green-100 rounded-full blur-3xl"></div>
                </Card>

                <div className="text-center space-y-2 mb-12">
                  <p className="text-gray-500 font-medium uppercase tracking-wide text-sm">Total Amount Due</p>
                  <p className="text-6xl font-bold text-gray-900">₱ {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>

                <Button
                  onClick={handleCashInserted}
                  className="w-full max-w-md h-16 text-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-200 transition-all"
                  data-testid="btn-simulate-insert"
                >
                  Simulate Cash Insertion
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setScreen('details')} 
                  className="mt-4 text-gray-500"
                >
                  Cancel Transaction
                </Button>
              </motion.div>
            )}

             {/* PROCESSING SCREEN */}
             {screen === 'processing' && (
              <motion.div
                key="processing"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 flex flex-col items-center justify-center bg-white"
              >
                <div className="relative">
                    <div className="w-24 h-24 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-8"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-16 h-16 bg-blue-50 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Processing...</h2>
                <p className="text-gray-500">Please wait while we complete your transaction</p>
              </motion.div>
            )}

            {/* CONFIRMATION SCREEN */}
            {screen === 'confirmation' && (
              <motion.div
                key="confirmation"
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="absolute inset-0 p-8 md:p-12 flex flex-col items-center justify-center bg-green-50/30"
              >
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                  {/* Receipt Top Edge (CSS Sawtooth) */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-gray-100 to-white"></div>

                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Transaction Successful</h2>
                    <p className="text-sm text-gray-500 mt-1">{currentTime.toLocaleString()}</p>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Transaction ID</span>
                        <span className="font-mono font-medium text-gray-900">{transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Service</span>
                        <span className="font-medium text-gray-900">{selectedService?.name}</span>
                    </div>
                    
                    {selectedService?.id === 'bills' ? (
                        <>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Biller</span>
                            <span className="font-medium text-gray-900">{billType}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Account No.</span>
                            <span className="font-mono font-medium text-gray-900">{accountNumber}</span>
                        </div>
                        </>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Mobile No.</span>
                            <span className="font-mono font-medium text-gray-900">+63 {mobileNumber}</span>
                        </div>
                    )}
                    
                    <Separator className="my-4 border-dashed" />
                    
                    <div className="flex justify-between items-end">
                        <span className="text-gray-600 font-semibold">Total Amount</span>
                        <span className="text-2xl font-bold text-primary">₱ {parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  {/* Receipt Bottom Edge (Visual only) */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50"></div>
                </div>

                <div className="mt-12 flex flex-col items-center gap-4 w-full max-w-md">
                    <Button 
                        onClick={() => window.print()} 
                        variant="outline" 
                        className="w-full h-14 text-lg border-2 hover:bg-gray-50"
                    >
                        <Receipt className="mr-2 w-5 h-5" />
                        Print Receipt
                    </Button>
                    <Button 
                        onClick={handleNewTransaction} 
                        className="w-full h-14 text-lg font-bold shadow-lg"
                    >
                        Start New Transaction
                    </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
