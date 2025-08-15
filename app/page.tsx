"use client";

import Gradients from "@/components/gradients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Loader2,
  Menu,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showStorefront, setShowStorefront] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storePrompt, setStorePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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

  const trendingIdeas = [
    { text: "Taylor Swift concert merch & friendship bracelets", emoji: "💫" },
    { text: "Barbie-core pink fashion accessories", emoji: "💗" },
    { text: "Stanley tumbler dupes & viral water bottles", emoji: "🥤" },
    { text: "Cottagecore mushroom lamps & fairy lights", emoji: "🍄" },
    { text: "Crocs charms & jibbitz collections", emoji: "👟" },
    { text: "Genshin Impact cosplay & anime figures", emoji: "⚔️" },
    { text: "Rare Plants & trendy houseplant accessories", emoji: "🪴" },
    { text: "BookTok aesthetic reading accessories", emoji: "📖" },
    { text: "Korean skincare K-beauty glass skin sets", emoji: "✨" },
    { text: "Viral TikTok gadgets & life hacks", emoji: "📱" },
  ];

  const generateStorefront = async (prompt) => {
    setIsGenerating(true);
    setSelectedCategory(prompt);

    try {
      const aiPrompt = `Generate a detailed e-commerce store concept for: "${prompt}"

Please provide a JSON response with the following structure:
{
  "storeName": "Creative store name",
  "description": "Brief store description",
  "products": [
    {
      "id": 1,
      "name": "Product name",
      "price": 24.99,
      "description": "Detailed product description",
      "category": "Product category"
    }
  ]
}

Create 6-8 realistic products that would sell well for this concept. Include varied pricing ($5-$150 range) and compelling product descriptions that would convert customers. Make products specific and trendy.`;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate storefront");
      }

      const aiResponse = await response.text();

      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const storeData = JSON.parse(jsonMatch[0]);
        if (storeData.products) {
          // Add placeholder images and format products
          const formattedProducts = storeData.products.map(
            (product, index) => ({
              ...product,
              image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                product.name.slice(0, 20)
              )}`,
            })
          );
          setGeneratedProducts(formattedProducts);
          setShowStorefront(true);
        }
      }
    } catch (error) {
      console.error("Error generating storefront:", error);
      // Fallback to mock data
      const mockProducts = [
        {
          id: 1,
          name: `${prompt} Product 1`,
          price: 24.99,
          image: "https://via.placeholder.com/300x300?text=Product+1",
          description: `Premium ${prompt.toLowerCase()} item with excellent quality`,
        },
        {
          id: 2,
          name: `${prompt} Product 2`,
          price: 12.99,
          image: "https://via.placeholder.com/300x300?text=Product+2",
          description: `Popular ${prompt.toLowerCase()} choice for enthusiasts`,
        },
      ];
      setGeneratedProducts(mockProducts);
    } finally {
      setIsGenerating(false);
      setShowStorefront(true);
    }
  };

  const resetGenerator = () => {
    setShowStorefront(false);
    setSelectedCategory("");
    setGeneratedProducts([]);
    setStorePrompt("");
    setIsGenerating(false);
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
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
              <Button size="sm">Start Free Trial</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border/40 py-4">
              <div className="flex flex-col space-y-3">
                <Button variant="ghost" size="sm" className="justify-start">
                  Features
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Pricing
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  About
                </Button>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Start Free Trial</Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="flex items-center justify-center p-4 pt-16 pb-20">
          <div className="max-w-6xl w-full text-center">
            {/* Trust Signals */}
            <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Join 10,000+ entrepreneurs</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Launch in 60 seconds</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              What do you want to sell?
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Launch your premium online store in seconds. No coding required,
              infinite possibilities. Average 3x higher conversion rates than
              traditional platforms.
            </p>

            {/* Store Prompt Input */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="relative">
                <textarea
                  placeholder="Describe your products..."
                  value={storePrompt}
                  onChange={(e) => setStorePrompt(e.target.value)}
                  className="w-full h-32 p-6 text-xl resize-none border-2 border-border/50 backdrop-blur-sm bg-card/80 rounded-2xl focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-muted-foreground/70"
                  rows={4}
                />
                <Button
                  size="lg"
                  className="absolute bottom-4 right-4 h-12 px-8 rounded-xl text-base font-semibold shadow-lg"
                  onClick={() =>
                    storePrompt.trim() && generateStorefront(storePrompt)
                  }
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Store →"
                  )}
                </Button>
              </div>
            </div>

            {/* Trending Ideas */}
            <div className="mb-12">
              <p className="text-sm text-muted-foreground mb-4">
                🔥 Trending ideas:
              </p>
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {trendingIdeas.map((idea, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setStorePrompt(idea.text);
                      generateStorefront(idea.text);
                    }}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/50 hover:bg-card hover:border-border transition-all duration-200 text-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>{idea.emoji}</span>
                    <span>{idea.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Generation Loading State */}
            {isGenerating && (
              <div className="mb-12">
                <Card className="max-w-2xl mx-auto p-8 text-center border-border/50 backdrop-blur-sm bg-card/80">
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Creating Your Store
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is generating personalized products and store details
                    for "{selectedCategory}"...
                  </p>
                  <div className="mt-4 w-full bg-border/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </Card>
              </div>
            )}

            {/* Primary CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                🚀 Start Free Trial - No Credit Card
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo (2 min)
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why MicroStore?
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to launch and scale your online business
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <Card className="p-6 text-center border-border/50 backdrop-blur-sm bg-card/80">
                <Zap className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <h3 className="font-semibold text-xl mb-2">
                  Lightning Fast Setup
                </h3>
                <p className="text-muted-foreground">
                  Go from idea to live store in under 60 seconds. No technical
                  skills required.
                </p>
              </Card>

              <Card className="p-6 text-center border-border/50 backdrop-blur-sm bg-card/80">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold text-xl mb-2">
                  3x Higher Conversions
                </h3>
                <p className="text-muted-foreground">
                  AI-optimized designs and checkout flows that actually convert
                  visitors to customers.
                </p>
              </Card>

              <Card className="p-6 text-center border-border/50 backdrop-blur-sm bg-card/80">
                <Shield className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold text-xl mb-2">
                  Enterprise Security
                </h3>
                <p className="text-muted-foreground">
                  Bank-level security with automated backups and 99.9% uptime
                  guarantee.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trusted by entrepreneurs worldwide
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Launched my jewelry store in 45 seconds. Made $2,000 in the
                  first week!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">
                      Fashion Entrepreneur
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The AI suggestions helped me optimize my store. Conversion
                  rate went from 1% to 4.2%!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 mr-3"></div>
                  <div>
                    <p className="font-semibold">Marcus Rodriguez</p>
                    <p className="text-sm text-muted-foreground">
                      Tech Gadgets Store
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border/50 backdrop-blur-sm bg-card/80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Perfect for testing new product ideas. I've launched 5
                  successful stores this year!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mr-3"></div>
                  <div>
                    <p className="font-semibold">Emma Thompson</p>
                    <p className="text-sm text-muted-foreground">
                      Serial Entrepreneur
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Category Selection */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Choose your category
              </h2>
              <p className="text-xl text-muted-foreground">
                Select a category to see your store come to life
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
        </section>
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
