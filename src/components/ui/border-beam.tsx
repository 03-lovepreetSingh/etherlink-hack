"use client"
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BorderBeam } from "@/components/ui/border-beam";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BorderBeamDemo() {
  const [size, setSize] = useState(50);
  const [duration, setDuration] = useState(6);
  const [delay, setDelay] = useState(0);
  const [colorFrom, setColorFrom] = useState("#7400ff");
  const [colorTo, setColorTo] = useState("#9b41ff");
  const [reverse, setReverse] = useState(false);
  const [initialOffset, setInitialOffset] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("default");
  const [borderThickness, setBorderThickness] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [beamBorderRadius, setBeamBorderRadius] = useState(50);
  const [pauseOnHover, setPauseOnHover] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [hovered, setHovered] = useState(false);

  // Presets for quick configuration
  const presets = {
    default: {
      size: 50,
      duration: 6,
      delay: 0,
      colorFrom: "#7400ff",
      colorTo: "#9b41ff",
      reverse: false,
      initialOffset: 0,
      borderThickness: 1,
      opacity: 1,
      glowIntensity: 0,
      beamBorderRadius: 50,
      pauseOnHover: false,
      speedMultiplier: 1,
    },
    subtle: {
      size: 30,
      duration: 8,
      delay: 0,
      colorFrom: "#4f46e5",
      colorTo: "#8b5cf6",
      reverse: false,
      initialOffset: 0,
      borderThickness: 1,
      opacity: 0.7,
      glowIntensity: 0,
      beamBorderRadius: 30,
      pauseOnHover: false,
      speedMultiplier: 0.8,
    },
    vibrant: {
      size: 60,
      duration: 4,
      delay: 0,
      colorFrom: "#f97316",
      colorTo: "#ec4899",
      reverse: true,
      initialOffset: 0,
      borderThickness: 2,
      opacity: 1,
      glowIntensity: 4,
      beamBorderRadius: 60,
      pauseOnHover: false,
      speedMultiplier: 1.5,
    },
    slow: {
      size: 70,
      duration: 12,
      delay: 0,
      colorFrom: "#06b6d4",
      colorTo: "#3b82f6",
      reverse: false,
      initialOffset: 30,
      borderThickness: 1,
      opacity: 0.9,
      glowIntensity: 2,
      beamBorderRadius: 20,
      pauseOnHover: true,
      speedMultiplier: 0.5,
    },
    glow: {
      size: 45,
      duration: 6,
      delay: 0,
      colorFrom: "#22c55e",
      colorTo: "#10b981",
      reverse: false,
      initialOffset: 0,
      borderThickness: 2,
      opacity: 1,
      glowIntensity: 8,
      beamBorderRadius: 45,
      pauseOnHover: false,
      speedMultiplier: 1,
    }
  };

  const applyPreset = (preset: string) => {
    setSelectedPreset(preset);
    const config = presets[preset as keyof typeof presets];
    setSize(config.size);
    setDuration(config.duration);
    setDelay(config.delay);
    setColorFrom(config.colorFrom);
    setColorTo(config.colorTo);
    setReverse(config.reverse);
    setInitialOffset(config.initialOffset);
    setBorderThickness(config.borderThickness);
    setOpacity(config.opacity);
    setGlowIntensity(config.glowIntensity);
    setBeamBorderRadius(config.beamBorderRadius);
    setPauseOnHover(config.pauseOnHover);
    setSpeedMultiplier(config.speedMultiplier);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Border Beam</CardTitle>
          <CardDescription>
            An animated border beam effect that adds visual interest to containers
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div 
            className={cn(
              "relative min-h-[200px] rounded-lg p-1 flex items-center justify-center",
              pauseOnHover && "group"
            )}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <BorderBeam 
              size={size}
              duration={duration}
              delay={delay}
              colorFrom={colorFrom}
              colorTo={colorTo}
              reverse={reverse}
              initialOffset={initialOffset}
              borderThickness={borderThickness}
              opacity={opacity}
              glowIntensity={glowIntensity}
              beamBorderRadius={beamBorderRadius}
              pauseOnHover={pauseOnHover}
              speedMultiplier={speedMultiplier}
            />
            <div className="relative bg-card p-6 rounded-md z-10 w-full h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">Interactive Border</p>
                {pauseOnHover && (
                  <Badge variant={hovered ? "secondary" : "outline"} className="transition-colors">
                    {hovered ? "Animation Paused" : "Hover to pause"}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Card className="col-span-2">
              <CardHeader className="py-3">
                <CardTitle className="text-sm">Presets</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(presets).map((presetName) => (
                    <Button
                      key={presetName}
                      variant={selectedPreset === presetName ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPreset(presetName)}
                      className="capitalize"
                    >
                      {presetName}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Customize the border beam effect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="animation">Animation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4">
              <div className="space-y-2">
                <Label>Size: {size}px</Label>
                <Slider 
                  value={[size]} 
                  min={20} 
                  max={100} 
                  step={1} 
                  onValueChange={(value) => setSize(value[0])} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="colorFrom">Color From</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-md border cursor-pointer"
                      style={{ backgroundColor: colorFrom }}
                    />
                    <Input
                      id="colorFrom"
                      value={colorFrom}
                      onChange={(e) => setColorFrom(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="colorTo">Color To</Label>
                  <div className="flex gap-2">
                    <div 
                      className="w-8 h-8 rounded-md border cursor-pointer"
                      style={{ backgroundColor: colorTo }}
                    />
                    <Input
                      id="colorTo"
                      value={colorTo}
                      onChange={(e) => setColorTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Border Thickness: {borderThickness}px</Label>
                  <Slider 
                    value={[borderThickness]} 
                    min={1} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => setBorderThickness(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Opacity: {opacity.toFixed(2)}</Label>
                  <Slider 
                    value={[opacity * 100]} 
                    min={10} 
                    max={100} 
                    step={5} 
                    onValueChange={(value) => setOpacity(value[0] / 100)} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Glow Intensity: {glowIntensity}</Label>
                  <Slider 
                    value={[glowIntensity]} 
                    min={0} 
                    max={10} 
                    step={1} 
                    onValueChange={(value) => setGlowIntensity(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Beam Border Radius: {beamBorderRadius}px</Label>
                  <Slider 
                    value={[beamBorderRadius]} 
                    min={0} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setBeamBorderRadius(value[0])} 
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="animation" className="space-y-4">
              <div className="space-y-2">
                <Label>Duration: {duration}s</Label>
                <Slider 
                  value={[duration]} 
                  min={1} 
                  max={15} 
                  step={0.5} 
                  onValueChange={(value) => setDuration(value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Delay: {delay}s</Label>
                <Slider 
                  value={[delay]} 
                  min={0} 
                  max={5} 
                  step={0.1} 
                  onValueChange={(value) => setDelay(value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Initial Offset: {initialOffset}%</Label>
                <Slider 
                  value={[initialOffset]} 
                  min={0} 
                  max={100} 
                  step={1} 
                  onValueChange={(value) => setInitialOffset(value[0])} 
                />
              </div>
              
              <div className="space-y-2">
                <Label>Speed Multiplier: {speedMultiplier.toFixed(1)}x</Label>
                <Slider 
                  value={[speedMultiplier * 10]} 
                  min={5} 
                  max={20} 
                  step={1} 
                  onValueChange={(value) => setSpeedMultiplier(value[0] / 10)} 
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="reverse" 
                  checked={reverse} 
                  onCheckedChange={setReverse} 
                />
                <Label htmlFor="reverse">Reverse Direction</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="pauseOnHover" 
                  checked={pauseOnHover} 
                  onCheckedChange={setPauseOnHover}
                />
                <Label htmlFor="pauseOnHover">Pause On Hover</Label>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="rounded-md bg-muted p-4">

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
