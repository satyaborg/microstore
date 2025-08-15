"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [trend, setTrend] = useState("");
  const [showStorefront, setShowStorefront] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);

  const generateStorefront = () => {
    if (!trend.trim()) return;
    
    const mockProducts = [
      {
        id: 1,
        name: `${trend} T-Shirt`,
        price: 24.99,
        image: "https://via.placeholder.com/300x300?text=Product+1",
        description: `Trendy ${trend} themed t-shirt with premium quality fabric`
      },
      {
        id: 2,
        name: `${trend} Mug`,
        price: 12.99,
        image: "https://via.placeholder.com/300x300?text=Product+2",
        description: `Perfect ${trend} coffee mug for enthusiasts`
      },
      {
        id: 3,
        name: `${trend} Sticker Pack`,
        price: 5.99,
        image: "https://via.placeholder.com/300x300?text=Product+3",
        description: `Collectible ${trend} sticker pack - 10 unique designs`
      },
      {
        id: 4,
        name: `${trend} Hoodie`,
        price: 39.99,
        image: "https://via.placeholder.com/300x300?text=Product+4",
        description: `Cozy ${trend} themed hoodie for all seasons`
      }
    ];
    
    setGeneratedProducts(mockProducts);
    setShowStorefront(true);
  };

  const resetGenerator = () => {
    setShowStorefront(false);
    setTrend("");
    setGeneratedProducts([]);
  };

  if (showStorefront) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{trend} Store</h1>
              <Button onClick={resetGenerator} variant="outline">
                Create New Store
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {generatedProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold">${product.price}</span>
                    <Button size="sm">Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Views:</span>
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span className="font-semibold">3.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue:</span>
                  <span className="font-semibold">$892.45</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="email" placeholder="Email address" />
                <Input type="text" placeholder="Full name" />
                <Button className="w-full" size="lg">
                  Complete Purchase
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Micro-Storefront Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Turn any trend into a pop-up online store in seconds
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <label htmlFor="trend" className="block text-lg font-semibold mb-3">
              What's trending? 🔥
            </label>
            <Input
              id="trend"
              type="text"
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
              placeholder="e.g., Barbenheimer merch, Taylor Swift tour mugs, AI art prints..."
              className="text-lg py-3"
              onKeyPress={(e) => e.key === 'Enter' && generateStorefront()}
            />
          </div>

          <Button
            onClick={generateStorefront}
            disabled={!trend.trim()}
            className="w-full text-lg py-4"
            size="lg"
          >
            🚀 Generate My Store
          </Button>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-2xl mb-2">🤖</div>
              <div className="font-semibold">AI-Generated</div>
              <div className="text-sm text-muted-foreground">Products & descriptions</div>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold">Instant Setup</div>
              <div className="text-sm text-muted-foreground">Ready in seconds</div>
            </div>
            <div className="p-4">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold">Built-in Analytics</div>
              <div className="text-sm text-muted-foreground">Track performance</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
