import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings, Volume2, ImageIcon, Brain, Sparkles, Mic, Tag, Palette, Clock, Zap } from 'lucide-react';

interface SettingsModalProps {
  // Voice Settings
  autoVoiceEnabled: boolean;
  setAutoVoiceEnabled: (enabled: boolean) => void;
  
  // Visual Settings
  autoImageEnabled: boolean;
  setAutoImageEnabled: (enabled: boolean) => void;
  autoMindMapEnabled: boolean;
  setAutoMindMapEnabled: (enabled: boolean) => void;
  
  // Enhancement Settings
  addEmojisEnabled: boolean;
  setAddEmojisEnabled: (enabled: boolean) => void;
  
  // Learning Settings
  learningCategory: string;
  setLearningCategory: (category: string) => void;
}

export function SettingsModal({
  autoVoiceEnabled,
  setAutoVoiceEnabled,
  autoImageEnabled,
  setAutoImageEnabled,
  autoMindMapEnabled,
  setAutoMindMapEnabled,
  addEmojisEnabled,
  setAddEmojisEnabled,
  learningCategory,
  setLearningCategory,
}: SettingsModalProps) {
  const [voiceSpeed, setVoiceSpeed] = useState([1.0]);
  const [imageStyle, setImageStyle] = useState('educational');
  const [mindMapComplexity, setMindMapComplexity] = useState('medium');
  const [autoSpeakDelay, setAutoSpeakDelay] = useState([500]);
  const [responseLength, setResponseLength] = useState('medium');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-3 text-xs rounded-full"
        >
          <Settings className="w-3 h-3 mr-1" />
          ⚙️ Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Liquid Learning Lab Settings
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* AI Voice Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">🗣️ AI Voice Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-voice">Auto Voice Reading</Label>
                <Switch
                  id="auto-voice"
                  checked={autoVoiceEnabled}
                  onCheckedChange={setAutoVoiceEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Voice Speed</Label>
                <Slider
                  value={voiceSpeed}
                  onValueChange={setVoiceSpeed}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{voiceSpeed[0]}x speed</span>
              </div>
              
              <div className="space-y-2">
                <Label>Auto-speak Delay</Label>
                <Slider
                  value={autoSpeakDelay}
                  onValueChange={setAutoSpeakDelay}
                  min={0}
                  max={2000}
                  step={100}
                  className="w-full"
                />
                <span className="text-xs text-muted-foreground">{autoSpeakDelay[0]}ms delay</span>
              </div>
            </div>
          </div>

          {/* Visual Generation Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-chart-2" />
              <h3 className="font-semibold">🖼️ Visual Generation</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-images">Auto Image Generation</Label>
                <Switch
                  id="auto-images"
                  checked={autoImageEnabled}
                  onCheckedChange={setAutoImageEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Image Style</Label>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">📚 Educational Diagrams</SelectItem>
                    <SelectItem value="realistic">📸 Realistic Photos</SelectItem>
                    <SelectItem value="illustration">🎨 Artistic Illustrations</SelectItem>
                    <SelectItem value="infographic">📊 Infographic Style</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Mind Map Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-chart-3" />
              <h3 className="font-semibold">🧠 Mind Map Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-mindmaps">Auto Mind Map Generation</Label>
                <Switch
                  id="auto-mindmaps"
                  checked={autoMindMapEnabled}
                  onCheckedChange={setAutoMindMapEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Mind Map Complexity</Label>
                <Select value={mindMapComplexity} onValueChange={setMindMapComplexity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">🌱 Simple (3-5 branches)</SelectItem>
                    <SelectItem value="medium">🌿 Medium (5-8 branches)</SelectItem>
                    <SelectItem value="complex">🌳 Complex (8+ branches)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Content Enhancement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-chart-4" />
              <h3 className="font-semibold">✨ Content Enhancement</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="add-emojis">Add Emojis to Responses</Label>
                <Switch
                  id="add-emojis"
                  checked={addEmojisEnabled}
                  onCheckedChange={setAddEmojisEnabled}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Response Length</Label>
                <Select value={responseLength} onValueChange={setResponseLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">⚡ Brief & Concise</SelectItem>
                    <SelectItem value="medium">📝 Medium Detail</SelectItem>
                    <SelectItem value="detailed">📚 Detailed & Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-chart-5" />
              <h3 className="font-semibold">📚 Learning Preferences</h3>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Default Learning Category</Label>
                <Select value={learningCategory} onValueChange={setLearningCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">📚 General Knowledge</SelectItem>
                    <SelectItem value="science">🔬 Science & Research</SelectItem>
                    <SelectItem value="math">📐 Mathematics</SelectItem>
                    <SelectItem value="history">🏛️ History & Culture</SelectItem>
                    <SelectItem value="language">🗣️ Language & Literature</SelectItem>
                    <SelectItem value="programming">💻 Programming & Tech</SelectItem>
                    <SelectItem value="art">🎨 Art & Design</SelectItem>
                    <SelectItem value="business">💼 Business & Finance</SelectItem>
                    <SelectItem value="health">🏥 Health & Medicine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-yellow-500" />
              <h3 className="font-semibold">⚡ Advanced Settings</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-categorize">Auto-categorize Questions</Label>
                <Switch id="auto-categorize" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="smart-visuals">Smart Visual Selection</Label>
                <Switch id="smart-visuals" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="learning-analytics">Learning Analytics</Label>
                <Switch id="learning-analytics" defaultChecked />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Settings are automatically saved
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Reset to Defaults
            </Button>
            <Button variant="outline" size="sm">
              Export Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}