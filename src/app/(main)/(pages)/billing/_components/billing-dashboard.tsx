"use client";

import { useBilling } from "@/providers/billing-provider";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { SubscriptionCard } from "./subscription-card";
import CreditTracker from "./creadits-tracker";

type Props = {};

const BillingDashboard = (props: Props) => {
  const { credits, tier } = useBilling();
  const [stripeProducts, setStripeProducts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const onStripeProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/payment");
      if (data) {
        setStripeProducts(data);
      }
    } catch (err: any) {
      console.error("Error fetching Stripe products:", err);
      setError("Failed to load products, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onStripeProducts();
  }, []);

  const onPayment = async (id: string) => {
    try {
      const { data } = await axios.post(
        "/api/payment",
        { priceId: id },
        { headers: { "Content-Type": "application/json" } }
      );
      window.location.assign(data);
    } catch (err: any) {
      console.error("Error processing payment:", err);
      setError("Failed to process payment, please try again later.");
    }
  };

  return (
    <div>
      {error && <div className="text-red-500">{error}</div>}{" "}
      {/* Show error if any */}
      <div className="flex gap-5 p-6">
        <SubscriptionCard
          onPayment={onPayment}
          tier={tier}
          products={stripeProducts}
        />
      </div>
      <CreditTracker tier={tier} credits={parseInt(credits)} />
    </div>
  );
};

export default BillingDashboard;
