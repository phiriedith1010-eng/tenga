"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { formatK } from "@/lib/format";
import { formatPhone, guessNetwork } from "@/lib/phone";
import {
  paymentMethod,
  validateCard,
  validatePin,
  type PaymentMethodId,
} from "@/lib/payments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const networkNames = { airtel: "Airtel", mtn: "MTN", zamtel: "Zamtel" };

export function PaymentDialog({
  method,
  amount,
  phone,
  open,
  onOpenChange,
  onConfirm,
}: {
  method: PaymentMethodId;
  amount: number;
  phone: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}) {
  const [step, setStep] = useState<"momo" | "waiting" | "pin" | "card" | "cash" | "placing">("momo");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const openRef = useRef(open);
  openRef.current = open;
  const info = paymentMethod(method);
  const momo = method === "airtel" || method === "mtn" || method === "zamtel";
  const guess = guessNetwork(phone);

  useEffect(() => {
    if (!open) return;
    setError("");
    setPin("");
    setCard({ number: "", expiry: "", cvc: "", name: "" });
    setStep(method === "card" ? "card" : method === "cash" ? "cash" : "momo");
  }, [open, method]);

  async function place() {
    setStep("placing");
    setError("");
    try {
      await onConfirm();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The order did not save.");
      setStep(method === "card" ? "card" : method === "cash" ? "cash" : "pin");
    }
  }

  async function sendPrompt() {
    setError("");
    setStep("waiting");
    await new Promise((resolve) => setTimeout(resolve, 1400));
    if (openRef.current) setStep("pin");
  }

  function submitPin() {
    const message = validatePin(pin);
    if (message) {
      setError(message);
      return;
    }
    setPin("");
    void place();
  }

  function submitCard() {
    const message = validateCard(card);
    if (message) {
      setError(message);
      return;
    }
    setCard({ number: "", expiry: "", cvc: "", name: "" });
    void place();
  }

  return (
    <Dialog open={open} onOpenChange={(next) => step !== "placing" && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {info.label} · demo
          </DialogTitle>
          <DialogDescription>
            Sandbox only. No money moves, and nothing is sent to a bank or mobile-money network.
          </DialogDescription>
        </DialogHeader>

        <p className="rounded-xl bg-muted px-3 py-2 text-sm">
          Amount <span className="font-semibold">{formatK(amount)}</span>
        </p>

        {momo && step === "momo" ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              Tenga will pretend to send a prompt to <span className="font-medium">{formatPhone(phone)}</span>.
              Approve it with any 4-digit PIN except 0000.
            </p>
            {guess && guess !== method ? (
              <p className="text-sm text-muted-foreground">
                This number looks like {networkNames[guess]}. You can still run the {info.label} demo.
              </p>
            ) : null}
            <Button type="button" className="h-11 w-full" onClick={() => void sendPrompt()}>
              Send prompt to my phone
            </Button>
          </div>
        ) : null}

        {step === "waiting" ? (
          <div className="flex items-center gap-3 rounded-xl border px-3 py-4 text-sm">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            <p>Check your phone. Approving {formatK(amount)} on {info.label}…</p>
          </div>
        ) : null}

        {step === "pin" ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              submitPin();
            }}
          >
            <Label htmlFor="demo-pin">Demo PIN</Label>
            <Input
              id="demo-pin"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={(event) => setPin(event.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="1234"
              className="h-12 text-center text-lg tracking-[0.4em]"
              aria-invalid={Boolean(error)}
            />
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK"].map((key) => (
                <Button
                  key={key}
                  type={key === "OK" ? "submit" : "button"}
                  variant={key === "OK" ? "default" : "outline"}
                  className="h-11"
                  onClick={() => {
                    if (key === "OK") return;
                    if (key === "⌫") setPin((current) => current.slice(0, -1));
                    else setPin((current) => (current + key).slice(0, 4));
                  }}
                >
                  {key}
                </Button>
              ))}
            </div>
          </form>
        ) : null}

        {step === "card" ? (
          <form
            className="space-y-3"
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              submitCard();
            }}
          >
            <p className="text-sm leading-relaxed">
              Use <span className="font-medium">4242 4242 4242 4242</span>, any future expiry, and any
              3-digit CVC. The number stays in this browser. It is not sent or stored. 4000 0000 0000
              0002 is the decline test.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="demo-pan">Card number</Label>
              <Input
                id="demo-pan"
                name="demo-card-pan"
                inputMode="numeric"
                autoComplete="off"
                value={card.number}
                onChange={(event) => setCard({ ...card, number: event.target.value })}
                placeholder="4242 4242 4242 4242"
                className="h-11 text-base"
                aria-invalid={Boolean(error)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="demo-exp">Expiry</Label>
                <Input
                  id="demo-exp"
                  autoComplete="off"
                  value={card.expiry}
                  onChange={(event) => setCard({ ...card, expiry: event.target.value })}
                  placeholder="12/28"
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="demo-cvc">CVC</Label>
                <Input
                  id="demo-cvc"
                  autoComplete="off"
                  inputMode="numeric"
                  value={card.cvc}
                  onChange={(event) => setCard({ ...card, cvc: event.target.value })}
                  placeholder="123"
                  className="h-11 text-base"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="demo-name">Name on card</Label>
              <Input
                id="demo-name"
                autoComplete="off"
                value={card.name}
                onChange={(event) => setCard({ ...card, name: event.target.value })}
                placeholder="Chipo Banda"
                className="h-11 text-base"
              />
            </div>
            <Button type="submit" className="h-11 w-full">
              Pay {formatK(amount)} in the demo
            </Button>
          </form>
        ) : null}

        {step === "cash" ? (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed">
              Have {formatK(amount)} ready in cash for the rider. Nothing is paid now.
            </p>
            <Button type="button" className="h-11 w-full" onClick={() => void place()}>
              Place the order
            </Button>
          </div>
        ) : null}

        {step === "placing" ? (
          <div className="flex items-center gap-3 text-sm">
            <LoaderCircle className="size-5 animate-spin text-primary" />
            Placing your order…
          </div>
        ) : null}

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
