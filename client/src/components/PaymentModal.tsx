import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Credit Card Form Schema
const creditCardSchema = z.object({
  cardNumber: z.string().min(16, "Card number should be at least 16 digits").max(19, "Invalid card number"),
  cardholderName: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().min(5, "Expiry date is required").max(5, "Invalid expiry date"),
  cvv: z.string().min(3, "CVV is required").max(4, "Invalid CVV"),
});

type CreditCardFormValues = z.infer<typeof creditCardSchema>;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
}) => {
  const [activeTab, setActiveTab] = useState<string>("credit-card");
  const [paymentMethod, setPaymentMethod] = useState<string>("visa");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Credit card form
  const form = useForm<CreditCardFormValues>({
    resolver: zodResolver(creditCardSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const handleProcessPayment = async () => {
    if (activeTab === "credit-card") {
      form.handleSubmit(async (data) => {
        setIsProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        toast({
          title: "Payment Successful",
          description: `$${amount.toFixed(2)} has been charged to your card ending in ${data.cardNumber.slice(-4)}`,
          variant: "default",
        });
        
        setIsProcessing(false);
        onConfirm();
      })();
    } else if (activeTab === "wallet") {
      setIsProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Payment Successful",
        description: `$${amount.toFixed(2)} has been charged to your USF Wallet`,
        variant: "default",
      });
      
      setIsProcessing(false);
      onConfirm();
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="credit-card" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="credit-card">Credit Card</TabsTrigger>
            <TabsTrigger value="wallet">USF Wallet</TabsTrigger>
          </TabsList>

          <TabsContent value="credit-card" className="pt-4">
            <RadioGroup
              defaultValue="visa"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="flex space-x-2 mb-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="visa" id="visa" />
                <Label htmlFor="visa" className="flex items-center">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                    VISA
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mastercard" id="mastercard" />
                <Label htmlFor="mastercard" className="flex items-center">
                  <div className="w-12 h-8 bg-red-500 rounded flex items-center justify-center text-white font-bold">
                    MC
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="amex" id="amex" />
                <Label htmlFor="amex" className="flex items-center">
                  <div className="w-12 h-8 bg-blue-400 rounded flex items-center justify-center text-white font-bold">
                    AMEX
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          {...field}
                          value={formatCardNumber(field.value)}
                          onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                          maxLength={16}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cardholderName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cardholder Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="MM/YY"
                            {...field}
                            value={formatExpiryDate(field.value)}
                            onChange={(e) => field.onChange(formatExpiryDate(e.target.value))}
                            maxLength={5}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVV</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="123"
                            {...field}
                            maxLength={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="wallet" className="pt-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center space-x-4 mb-4">
                  <Wallet className="w-8 h-8 text-[#006747]" />
                  <div>
                    <h3 className="font-medium">USF Wallet</h3>
                    <p className="text-sm text-neutral-600">Pay using your campus account</p>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Balance:</span>
                    <span className="font-semibold">$125.00</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">After Payment:</span>
                    <span className="font-semibold">${(125 - amount).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-neutral-50 p-4 rounded-md mt-4">
          <div className="flex justify-between">
            <span className="text-neutral-700">Total Amount:</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-[#006747] hover:bg-[#00543a]"
            onClick={handleProcessPayment}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center">
                Processing <span className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></span>
              </span>
            ) : (
              <span className="flex items-center">
                Pay ${amount.toFixed(2)} <Check className="ml-2 h-4 w-4" />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;