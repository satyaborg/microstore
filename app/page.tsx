"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showStorefront, setShowStorefront] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);

  const categories = [
    { name: "Fashion & Apparel", emoji: "👕", description: "Clothing, shoes, accessories" },
    { name: "Home & Garden", emoji: "🏠", description: "Furniture, decor, tools" },
    { name: "Electronics", emoji: "📱", description: "Gadgets, computers, tech" },
    { name: "Health & Beauty", emoji: "💄", description: "Skincare, cosmetics, wellness" },
    { name: "Sports & Fitness", emoji: "⚽", description: "Equipment, gear, supplements" },
    { name: "Books & Media", emoji: "📚", description: "Books, movies, music" },
    { name: "Food & Beverages", emoji: "🍕", description: "Gourmet, snacks, drinks" },
    { name: "Toys & Games", emoji: "🎮", description: "Kids toys, board games" },
    { name: "Handmade & Crafts", emoji: "🎨", description: "Artisan, DIY, custom items" }
  ];

  const generateStorefront = (category) => {
    const mockProducts = [
      {
        id: 1,
        name: `${category} Product 1`,
        price: 24.99,
        image: "https://via.placeholder.com/300x300?text=Product+1",
        description: `Premium ${category.toLowerCase()} item with excellent quality`
      },
      {
        id: 2,
        name: `${category} Product 2`,
        price: 12.99,
        image: "https://via.placeholder.com/300x300?text=Product+2",
        description: `Popular ${category.toLowerCase()} choice for enthusiasts`
      },
      {
        id: 3,
        name: `${category} Product 3`,
        price: 5.99,
        image: "https://via.placeholder.com/300x300?text=Product+3",
        description: `Affordable ${category.toLowerCase()} option with great value`
      },
      {
        id: 4,
        name: `${category} Product 4`,
        price: 39.99,
        image: "https://via.placeholder.com/300x300?text=Product+4",
        description: `Premium ${category.toLowerCase()} item for serious buyers`
      }
    ];
    
    setGeneratedProducts(mockProducts);
    setSelectedCategory(category);
    setShowStorefront(true);
  };

  const resetGenerator = () => {
    setShowStorefront(false);
    setSelectedCategory("");
    setGeneratedProducts([]);
  };

  if (showStorefront) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{selectedCategory} Store</h1>
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
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            What do you want to sell?
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a category to start building your store
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.name} 
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => generateStorefront(category.name)}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{category.emoji}</div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
