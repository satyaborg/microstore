"use client";

import AdLauncher from "@/components/ad-launcher";
import { Image } from "@/components/ai-elements/image";
import Gradients from "@/components/gradients";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Loader2,
  Menu,
  Minus,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  imageData?: any;
  quantity: number;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showStorefront, setShowStorefront] = useState(false);
  const [generatedProducts, setGeneratedProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storePrompt, setStorePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartDialog, setShowCartDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [showPublishSuccessDialog, setShowPublishSuccessDialog] =
    useState(false);
  const [trendingIdeas, setTrendingIdeas] = useState([
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
  ]);
  const [trendsLoading, setTrendsLoading] = useState(true);

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

  // Fetch Google Trends data on component mount
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setTrendsLoading(true);
        const response = await fetch("/api/trends");
        console.log("trends response", response);
        const result = await response.json();

        if (result.success && result.data) {
          // Extract trends from the nested data structure
          const trendsData = result.data;
          const dailyTrends =
            trendsData.default?.trendingSearchesDays?.[0]?.trendingSearches ||
            [];

          // Map daily trends to our format
          const combinedTrends = dailyTrends.slice(0, 10).map((trend: any) => ({
            text: trend.title?.query || trend.title,
            emoji: getEmojiForTrend(trend.title?.query || trend.title),
            traffic: trend.formattedTraffic,
          }));

          if (combinedTrends.length > 0) {
            setTrendingIdeas(combinedTrends);
          }
        }
      } catch (error) {
        console.error("Failed to fetch trends:", error);
        // Keep default trending ideas if fetch fails
      } finally {
        setTrendsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  // Helper function to assign emojis based on trend keywords
  const getEmojiForTrend = (title: string) => {
    if (!title) return "🔥";

    const lowerTitle = title.toLowerCase();

    // Entertainment & Media
    if (
      lowerTitle.includes("movie") ||
      lowerTitle.includes("film") ||
      lowerTitle.includes("netflix")
    )
      return "🎬";
    if (
      lowerTitle.includes("music") ||
      lowerTitle.includes("concert") ||
      lowerTitle.includes("song")
    )
      return "🎵";
    if (
      lowerTitle.includes("tv") ||
      lowerTitle.includes("show") ||
      lowerTitle.includes("series")
    )
      return "📺";
    if (
      lowerTitle.includes("celebrity") ||
      lowerTitle.includes("actor") ||
      lowerTitle.includes("actress")
    )
      return "⭐";

    // Technology & Gaming
    if (
      lowerTitle.includes("iphone") ||
      lowerTitle.includes("android") ||
      lowerTitle.includes("phone")
    )
      return "📱";
    if (
      lowerTitle.includes("tech") ||
      lowerTitle.includes("gadget") ||
      lowerTitle.includes("app")
    )
      return "💻";
    if (
      lowerTitle.includes("gaming") ||
      lowerTitle.includes("game") ||
      lowerTitle.includes("xbox") ||
      lowerTitle.includes("playstation")
    )
      return "🎮";

    // Fashion & Beauty
    if (
      lowerTitle.includes("fashion") ||
      lowerTitle.includes("clothing") ||
      lowerTitle.includes("outfit")
    )
      return "👕";
    if (
      lowerTitle.includes("beauty") ||
      lowerTitle.includes("skincare") ||
      lowerTitle.includes("makeup")
    )
      return "💄";
    if (lowerTitle.includes("jewelry") || lowerTitle.includes("accessories"))
      return "💎";

    // Food & Lifestyle
    if (
      lowerTitle.includes("food") ||
      lowerTitle.includes("recipe") ||
      lowerTitle.includes("restaurant")
    )
      return "🍽️";
    if (lowerTitle.includes("coffee") || lowerTitle.includes("drink"))
      return "☕";
    if (lowerTitle.includes("travel") || lowerTitle.includes("vacation"))
      return "✈️";

    // Sports & Health
    if (
      lowerTitle.includes("sport") ||
      lowerTitle.includes("fitness") ||
      lowerTitle.includes("workout")
    )
      return "⚽";
    if (lowerTitle.includes("health") || lowerTitle.includes("medical"))
      return "🏥";

    // Home & Living
    if (
      lowerTitle.includes("home") ||
      lowerTitle.includes("decor") ||
      lowerTitle.includes("furniture")
    )
      return "🏠";
    if (lowerTitle.includes("plant") || lowerTitle.includes("garden"))
      return "🌱";

    // Art & Creativity
    if (
      lowerTitle.includes("art") ||
      lowerTitle.includes("creative") ||
      lowerTitle.includes("design")
    )
      return "🎨";
    if (lowerTitle.includes("book") || lowerTitle.includes("reading"))
      return "📖";

    // Business & Finance
    if (lowerTitle.includes("business") || lowerTitle.includes("startup"))
      return "💼";
    if (
      lowerTitle.includes("crypto") ||
      lowerTitle.includes("bitcoin") ||
      lowerTitle.includes("stock")
    )
      return "💰";

    // Default fire emoji for trending
    return "🔥";
  };

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

Create exactly 6 realistic products that would sell well for this concept. Include varied pricing ($5-$150 range) and compelling product descriptions that would convert customers. Make products specific and trendy.`;

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

      console.log("response", response);

      const aiResponse = await response.text();

      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const storeData = JSON.parse(jsonMatch[0]);
        if (storeData.products) {
          // Generate AI images for each product
          const formattedProducts = await Promise.all(
            storeData.products.map(async (product, index) => {
              try {
                const imageResponse = await fetch(
                  "/api/generate-product-image",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      productName: product.name,
                      productDescription: product.description,
                      category: product.category || prompt,
                    }),
                  }
                );

                if (imageResponse.ok) {
                  const imageData = await imageResponse.json();
                  return {
                    ...product,
                    image: `data:${imageData.mediaType};base64,${imageData.base64}`,
                    imageData: imageData, // Store full image data for the Image component
                  };
                } else {
                  // Fallback to placeholder if image generation fails
                  return {
                    ...product,
                    image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                      product.name.slice(0, 20)
                    )}`,
                  };
                }
              } catch (error) {
                console.error(
                  `Error generating image for ${product.name}:`,
                  error
                );
                // Fallback to placeholder
                return {
                  ...product,
                  image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                    product.name.slice(0, 20)
                  )}`,
                };
              }
            })
          );
          setGeneratedProducts(formattedProducts);
          setShowStorefront(true);
        }
      }
    } catch (error) {
      console.error("Error generating storefront:", error);
      // Fallback to mock data with AI generated images
      const mockProducts = await Promise.all(
        [
          {
            id: 1,
            name: `${prompt} Product 1`,
            price: 24.99,
            description: `Premium ${prompt.toLowerCase()} item with excellent quality`,
          },
          {
            id: 2,
            name: `${prompt} Product 2`,
            price: 12.99,
            description: `Popular ${prompt.toLowerCase()} choice for enthusiasts`,
          },
        ].map(async (product) => {
          try {
            const imageResponse = await fetch("/api/generate-product-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                productName: product.name,
                productDescription: product.description,
                category: prompt,
              }),
            });

            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              return {
                ...product,
                image: `data:${imageData.mediaType};base64,${imageData.base64}`,
                imageData: imageData,
              };
            } else {
              return {
                ...product,
                image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                  product.name.slice(0, 20)
                )}`,
              };
            }
          } catch (error) {
            console.error(
              `Error generating fallback image for ${product.name}:`,
              error
            );
            return {
              ...product,
              image: `https://via.placeholder.com/300x300?text=${encodeURIComponent(
                product.name.slice(0, 20)
              )}`,
            };
          }
        })
      );
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

  const addToCart = (product: any) => {
    setSelectedProduct(product);
    setShowCartDialog(true);
  };

  const confirmAddToCart = (quantity: number) => {
    if (!selectedProduct) return;

    const existingItem = cartItems.find(
      (item) => item.id === selectedProduct.id
    );

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...selectedProduct, quantity }]);
    }

    setShowCartDialog(false);
    setSelectedProduct(null);
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (showStorefront) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">VibeStore</h1>
              <Button
                onClick={() => setShowPublishDialog(true)}
                variant="default"
              >
                Publish
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Store Preview Card */}
          <Card className="mb-8 border-2 border-dashed border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Store Preview</h2>
                  <p className="text-muted-foreground">
                    Your {selectedCategory.toLowerCase()} store is ready!
                  </p>
                </div>
                <div className="text-sm text-muted-foreground bg-background px-3 py-1 rounded-full border">
                  Preview Mode
                </div>
              </div>

              {/* Store Preview Container */}
              <div className="bg-background rounded-lg border overflow-hidden">
                {/* Store Navigation */}
                <div className="border-b bg-background">
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h1 className="text-xl font-bold">
                        {selectedCategory} Store
                      </h1>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCartDialog(true)}
                          className="relative"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Cart
                          {getCartItemCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {getCartItemCount()}
                            </span>
                          )}
                        </Button>
                        <Button size="sm" variant="ghost">
                          About
                        </Button>
                        <Button size="sm" variant="ghost">
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {generatedProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden flex flex-col"
                      >
                        <div className="w-full h-64 overflow-hidden">
                          {product.imageData ? (
                            <Image
                              {...product.imageData}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <CardContent className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-lg mb-2">
                            {product.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 flex-1">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-xl font-bold">
                              ${product.price}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(product)}
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Find your customers section */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Find your customers</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Create Facebook & Instagram ads from your landing page content
                {/* Launch targeted ads to reach the right audience for your {selectedCategory.toLowerCase()} products */}
              </p>
            </div>

            <AdLauncher />
          </div>
        </main>

        {/* Add to Cart Dialog */}
        <Dialog open={showCartDialog} onOpenChange={setShowCartDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {selectedProduct ? "Add to Cart" : "Shopping Cart"}
              </DialogTitle>
              <DialogDescription>
                {selectedProduct
                  ? "Choose quantity and add to your cart"
                  : `You have ${getCartItemCount()} items in your cart`}
              </DialogDescription>
            </DialogHeader>

            {selectedProduct ? (
              <AddToCartForm
                product={selectedProduct}
                onConfirm={confirmAddToCart}
                onCancel={() => setShowCartDialog(false)}
              />
            ) : (
              <CartView
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onClose={() => setShowCartDialog(false)}
                getCartTotal={getCartTotal}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Publish Dialog */}
        <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Publish Your Store</DialogTitle>
              <DialogDescription>
                Enter your store details to publish your{" "}
                {selectedCategory.toLowerCase()} store.
              </DialogDescription>
            </DialogHeader>

            <PublishForm
              onPublish={() => {
                setShowPublishDialog(false);
                setShowPublishSuccessDialog(true);
              }}
              onCancel={() => setShowPublishDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Publish Success Dialog */}
        <Dialog
          open={showPublishSuccessDialog}
          onOpenChange={setShowPublishSuccessDialog}
        >
          <DialogContent className="max-w-md text-center">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Store Published Successfully!
              </DialogTitle>
              <DialogDescription>
                Your {selectedCategory.toLowerCase()} store is now live and
                ready to accept orders.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Your store URL:
                </p>
                <p className="font-mono text-sm bg-background px-3 py-2 rounded border">
                  vibestore.com/my-store
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setShowPublishSuccessDialog(false)}
                  className="w-full"
                >
                  View Live Store
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPublishSuccessDialog(false);
                    resetGenerator();
                  }}
                  className="w-full"
                >
                  Create Another Store
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
            <div className="font-bold text-xl">VibeStore</div>

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

            <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-gray-400 to-gray-900 text-transparent bg-clip-text">
                What do you want to sell?
              </span>
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
                      <Loader2 className="mr-auto h-4 w-4 animate-spin" />
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
              <p className="text-sm text-muted-foreground mb-4 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending ideas
              </p>
              {trendsLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    Loading trending topics...
                  </span>
                </div>
              ) : (
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
                      {idea.traffic && (
                        <span className="text-xs text-muted-foreground ml-1">
                          ({idea.traffic})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* AI Generation Loading State */}
            {/* {isGenerating && (
              <div className="mb-12">
                <Card className="max-w-2xl mx-auto p-8 text-center border-border/50 backdrop-blur-sm bg-card/80">
                  <div className="flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Creating Your Store
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI is generating personalized products, store details,
                    and custom product images for "{selectedCategory}"...
                  </p>
                  <div className="mt-4 w-full bg-border/20 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </Card>
              </div>
            )} */}

            {/* Primary CTA */}
            {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                🚀 Start Free Trial - No Credit Card
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo (2 min)
              </Button>
            </div> */}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why VibeStore?
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
                <RotateCcw className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                <h3 className="font-semibold text-xl mb-2">
                  3x Higher Conversions
                </h3>
                <p className="text-muted-foreground">
                  AI-optimized designs and checkout flows that actually convert
                  visitors to customers.
                </p>
              </Card>

              <Card className="p-6 text-center border-border/50 backdrop-blur-sm bg-card/80">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="font-semibold text-xl mb-2">
                  Capitalize on Trends
                </h3>
                <p className="text-muted-foreground">
                  We find the hottest trends and help you capitalize on them.
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
              <div className="font-bold text-2xl mb-4">VibeStore</div>
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
              © 2024 VibeStore. All rights reserved.
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

// Publish Form Component
function PublishForm({ onPublish, onCancel }: any) {
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="storeName" className="block text-sm font-medium mb-2">
          Store Name
        </label>
        <Input
          id="storeName"
          type="text"
          placeholder="My Awesome Store"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="storeUrl" className="block text-sm font-medium mb-2">
          Store URL
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 py-2 border border-r-0 border-border rounded-l-md bg-muted text-muted-foreground text-sm">
            vibestore.com/
          </span>
          <Input
            id="storeUrl"
            type="text"
            placeholder="my-store"
            value={storeUrl}
            onChange={(e) =>
              setStoreUrl(
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "")
              )
            }
            className="rounded-l-none"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="ownerName" className="block text-sm font-medium mb-2">
          Your Name
        </label>
        <Input
          id="ownerName"
          type="text"
          placeholder="John Doe"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Publish Store</Button>
      </DialogFooter>
    </form>
  );
}

// Add to Cart Form Component
function AddToCartForm({ product, onConfirm, onCancel }: any) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        {product.imageData ? (
          <Image
            {...product.imageData}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-muted-foreground text-sm">{product.description}</p>
          <p className="text-xl font-bold mt-2">${product.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Quantity:</label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            className="w-20 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-lg font-semibold">
          Total: ${(product.price * quantity).toFixed(2)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(quantity)}>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}

// Cart View Component
function CartView({ items, onUpdateQuantity, onClose, getCartTotal }: any) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button className="mt-4" onClick={onClose}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto space-y-4">
        {items.map((item: CartItem) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
            {item.imageData ? (
              <Image
                {...item.imageData}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-sm text-muted-foreground">${item.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateQuantity(item.id, 0)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">
            ${getCartTotal().toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Continue Shopping
          </Button>
          <Button className="flex-1">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
