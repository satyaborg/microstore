"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Gradients from "@/components/gradients";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showStorefront, setShowStorefront] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);

  const categories = [
    {
      name: "Fashion & Apparel",
      emoji: "👕",
      description: "Clothing, shoes, accessories",
    },
    {
      name: "Home & Garden",
      emoji: "🏠",
      description: "Furniture, decor, tools",
    },
    {
      name: "Electronics",
      emoji: "📱",
      description: "Gadgets, computers, tech",
    },
    {
      name: "Health & Beauty",
      emoji: "💄",
      description: "Skincare, cosmetics, wellness",
    },
    {
      name: "Sports & Fitness",
      emoji: "⚽",
      description: "Equipment, gear, supplements",
    },
    { name: "Books & Media", emoji: "📚", description: "Books, movies, music" },
    {
      name: "Food & Beverages",
      emoji: "🍕",
      description: "Gourmet, snacks, drinks",
    },
    {
      name: "Toys & Games",
      emoji: "🎮",
      description: "Kids toys, board games",
    },
    {
      name: "Handmade & Crafts",
      emoji: "🎨",
      description: "Artisan, DIY, custom items",
    },
  ];

  const generateStorefront = (category) => {
    const mockProducts = [
      {
        id: 1,
        name: `${category} Product 1`,
        price: 24.99,
        image: "https://via.placeholder.com/300x300?text=Product+1",
        description: `Premium ${category.toLowerCase()} item with excellent quality`,
      },
      {
        id: 2,
        name: `${category} Product 2`,
        price: 12.99,
        image: "https://via.placeholder.com/300x300?text=Product+2",
        description: `Popular ${category.toLowerCase()} choice for enthusiasts`,
      },
      {
        id: 3,
        name: `${category} Product 3`,
        price: 5.99,
        image: "https://via.placeholder.com/300x300?text=Product+3",
        description: `Affordable ${category.toLowerCase()} option with great value`,
      },
      {
        id: 4,
        name: `${category} Product 4`,
        price: 39.99,
        image: "https://via.placeholder.com/300x300?text=Product+4",
        description: `Premium ${category.toLowerCase()} item for serious buyers`,
      },
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
                  <p className="text-muted-foreground text-sm mb-3">
                    {product.description}
                  </p>
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
    <div className="min-h-screen flex flex-col relative">
      <Gradients />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-border/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl">MicroStore</div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">
                Features
              </Button>
              <Button variant="ghost" size="sm">
                Pricing
              </Button>
              <Button variant="ghost" size="sm">
                About
              </Button>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 pt-8 pb-16 relative z-10 min-h-0">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              What do you want to sell?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose a category to start building your premium online store in
              seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="p-8 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-border/50 backdrop-blur-sm bg-card/80"
                onClick={() => generateStorefront(category.name)}
              >
                <div className="text-center">
                  <div className="text-5xl mb-6">{category.emoji}</div>
                  <h3 className="font-semibold text-xl mb-3">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/40 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="font-bold text-2xl mb-4">MicroStore</div>
              <p className="text-muted-foreground mb-6 max-w-md">
                The fastest way to turn your ideas into profitable online
                stores. No coding required, infinite possibilities.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2024 MicroStore. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm mt-4 md:mt-0">
              Built with ❤️ for entrepreneurs
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
