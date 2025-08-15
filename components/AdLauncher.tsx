"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdFormData {
  product: string;
  headline: string;
  description: string;
  imageUrl: string;
  cta: string;
  dailyBudget: string;
}

interface AdResult {
  campaignId: string;
  adSetId: string;
  creativeId: string;
  adId: string;
}

interface AnalyticsData {
  impressions: number;
  ctr: number;
  cpc: number;
  conversions: number;
  conversionRate: number;
}

export default function AdLauncher() {
  const [formData, setFormData] = useState<AdFormData>({
    product: "Stanley cups",
    headline: "",
    description: "",
    imageUrl: "",
    cta: "LEARN_MORE",
    dailyBudget: "20"
  });
  
  const [loading, setLoading] = useState(false);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [copyGenerating, setCopyGenerating] = useState(false);
  const [result, setResult] = useState<AdResult | null>(null);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    impressions: 0,
    ctr: 0,
    cpc: 0,
    conversions: 0,
    conversionRate: 0
  });

  const ctaOptions = [
    { value: "LEARN_MORE", label: "Learn More" },
    { value: "SHOP_NOW", label: "Shop Now" },
    { value: "SIGN_UP", label: "Sign Up" },
    { value: "DOWNLOAD", label: "Download" },
    { value: "BOOK_TRAVEL", label: "Book Now" }
  ];

  const generatePrimaryText = () => {
    if (!formData.headline || !formData.description) return "";
    const valueProps = formData.description.split(" ").slice(0, 20).join(" ");
    return `${formData.headline} — ${valueProps}`;
  };

  const generateMockAnalytics = (): AnalyticsData => {
    const impressions = Math.floor(Math.random() * 45000) + 5000;
    const clicks = Math.floor(impressions * (Math.random() * 0.03 + 0.005));
    const ctr = (clicks / impressions) * 100;
    const cpc = Math.random() * 2.3 + 0.2;
    const conversions = Math.floor(clicks * (Math.random() * 0.15 + 0.02));
    const conversionRate = (conversions / clicks) * 100;
    
    return {
      impressions,
      ctr: Number(ctr.toFixed(2)),
      cpc: Number(cpc.toFixed(2)),
      conversions,
      conversionRate: Number(conversionRate.toFixed(2))
    };
  };

  useEffect(() => {
    // Initialize with mock analytics data on component mount
    setAnalytics(generateMockAnalytics());
  }, []);

  const generateAdCopy = async () => {
    if (!formData.product) {
      setError("Please enter a product name first");
      return;
    }

    setCopyGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: formData.product
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate ad copy");
      }

      setFormData({ 
        ...formData, 
        headline: data.headline, 
        description: data.description 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy generation failed");
    } finally {
      setCopyGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!formData.headline) {
      setError("Please enter a headline first");
      return;
    }

    setImageGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: formData.headline,
          description: formData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setFormData({ ...formData, imageUrl: data.imageUrl });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image generation failed");
    } finally {
      setImageGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    
    if (!formData.product || !formData.headline || !formData.description) {
      setError("Please fill in product, headline and description");
      return;
    }
    
    if (!formData.imageUrl) {
      setError("Please generate an AI image first");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("/api/meta/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create ad");
      }
      
      setResult(data);
      
      // Refresh analytics with new mock data after ad creation
      setTimeout(() => {
        setAnalytics(generateMockAnalytics());
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Meta Ad Launcher</h1>
        <p className="text-muted-foreground">Create Facebook & Instagram ads from your landing page content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product *</label>
                <div className="space-y-3">
                  <Input
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    placeholder="e.g., Stanley cups, iPhone cases, running shoes"
                  />
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={generateAdCopy}
                    disabled={copyGenerating || !formData.product}
                  >
                    {copyGenerating ? "Generating Ad Copy..." : "✨ Generate Ad Copy with AI"}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Headline *</label>
                <Input
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                  placeholder="Your compelling headline"
                  maxLength={40}
                />
                <div className="text-xs text-muted-foreground mt-1">{formData.headline.length}/40 chars</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-input rounded-md bg-transparent text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your product or service..."
                  maxLength={90}
                />
                <div className="text-xs text-muted-foreground mt-1">{formData.description.length}/90 chars</div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ad Image *</label>
                <div className="space-y-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full"
                    onClick={generateImage}
                    disabled={imageGenerating || !formData.headline}
                  >
                    {imageGenerating ? "Generating AI Image..." : "🎨 Generate AI Image"}
                  </Button>
                  {formData.imageUrl && (
                    <div className="text-xs text-green-600">✅ Image generated successfully</div>
                  )}
                  {!formData.headline && (
                    <div className="text-xs text-muted-foreground">Enter a headline first to generate image</div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Call to Action</label>
                <select
                  className="w-full h-9 px-3 py-1 border border-input rounded-md bg-transparent text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                  value={formData.cta}
                  onChange={(e) => setFormData({...formData, cta: e.target.value})}
                >
                  {ctaOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Daily Budget (AUD)</label>
                <Input
                  type="number"
                  min="5"
                  value={formData.dailyBudget}
                  onChange={(e) => setFormData({...formData, dailyBudget: e.target.value})}
                  placeholder="20"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Ad..." : "Launch Ad (PAUSED)"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Ad Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="w-full h-48 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              {formData.imageUrl ? (
                <img 
                  src={formData.imageUrl} 
                  alt="AI generated ad image"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjMuNGY0LWY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NjY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==";
                  }}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="text-4xl mb-2">🎨</div>
                  <div className="text-sm">AI image will appear here</div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Primary Text:</div>
              <div className="text-sm bg-muted p-2 rounded">
                {generatePrimaryText() || "Enter headline and description to see preview"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Headline:</div>
              <div className="font-semibold">{formData.headline || "Your headline here"}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Description:</div>
              <div className="text-sm">{formData.description || "Your description here"}</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Call to Action:</div>
              <Button variant="outline" size="sm" disabled>
                {ctaOptions.find(opt => opt.value === formData.cta)?.label}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive font-medium">Error: {error}</div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700">✅ Ad Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>Campaign ID:</strong> {result.campaignId}</div>
              <div><strong>Ad Set ID:</strong> {result.adSetId}</div>
              <div><strong>Creative ID:</strong> {result.creativeId}</div>
              <div><strong>Ad ID:</strong> {result.adId}</div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              All entities have been created in PAUSED status. Review in Meta Ads Manager before activating.
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Dashboard */}
      <Card>
          <CardHeader>
            <CardTitle>📊 Live Analytics</CardTitle>
            <p className="text-sm text-muted-foreground">Mock performance data (simulated)</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analytics.impressions.toLocaleString()}
                </div>
                <div className="text-sm font-medium text-muted-foreground">Impressions</div>
                <div className="text-xs text-green-600 mt-1">+12.3%</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analytics.ctr}%
                </div>
                <div className="text-sm font-medium text-muted-foreground">CTR</div>
                <div className="text-xs text-green-600 mt-1">+5.7%</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${analytics.cpc}
                </div>
                <div className="text-sm font-medium text-muted-foreground">CPC</div>
                <div className="text-xs text-red-600 mt-1">-8.2%</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analytics.conversions}
                </div>
                <div className="text-sm font-medium text-muted-foreground">Conversions</div>
                <div className="text-xs text-green-600 mt-1">+18.9%</div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Conversion Rate:</span>
                <span className="font-medium">{analytics.conversionRate}%</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-muted-foreground">Estimated Daily Spend:</span>
                <span className="font-medium">${formData.dailyBudget}</span>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Product Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle>🏭 Recommended Suppliers</CardTitle>
          <p className="text-sm text-muted-foreground">Top-rated suppliers for your products</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold text-blue-700">Global Electronics Co.</div>
                  <div className="text-2xl font-bold">3,247</div>
                  <div className="text-sm text-muted-foreground">Products Available</div>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                  <div className="text-xs text-muted-foreground">📍 Shenzhen, China</div>
                  <div className="space-y-1 text-xs">
                    <div>⚡ 3-7 days shipping</div>
                    <div>📦 Min order: $50</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold text-green-700">Premium Goods Ltd.</div>
                  <div className="text-2xl font-bold">1,892</div>
                  <div className="text-sm text-muted-foreground">Products Available</div>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-yellow-500">★★★★☆</span>
                    <span className="text-sm font-medium">4.6</span>
                  </div>
                  <div className="text-xs text-muted-foreground">📍 Mumbai, India</div>
                  <div className="space-y-1 text-xs">
                    <div>⚡ 5-10 days shipping</div>
                    <div>📦 Min order: $25</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <div className="text-lg font-semibold text-purple-700">Euro Fashion Hub</div>
                  <div className="text-2xl font-bold">956</div>
                  <div className="text-sm text-muted-foreground">Products Available</div>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-yellow-500">★★★★★</span>
                    <span className="text-sm font-medium">4.7</span>
                  </div>
                  <div className="text-xs text-muted-foreground">📍 Milan, Italy</div>
                  <div className="space-y-1 text-xs">
                    <div>⚡ 7-14 days shipping</div>
                    <div>📦 Min order: $100</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}