import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Image, Map, Bookmark, Share2, Loader2, X, Download, History, Plus, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { MindMapData } from '@/lib/types';

interface VisualPanelProps {
  currentImage?: string | null;
  currentMindMap?: MindMapData | null;
  onClose?: () => void;
  conversationId?: number | null;
  currentUserId?: string;
}

interface SavedVisual {
  id: string;
  type: 'image' | 'mindmap';
  data: string | MindMapData;
  title: string;
  timestamp: Date;
}

export function VisualPanel({ currentImage, currentMindMap, onClose, conversationId, currentUserId }: VisualPanelProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [savedVisuals, setSavedVisuals] = useState<SavedVisual[]>([]);
  const [imageZoom, setImageZoom] = useState(1);
  const [selectedMindMapNode, setSelectedMindMapNode] = useState<string | null>(null);
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set());
  const imageRef = useRef<HTMLImageElement>(null);
  const queryClient = useQueryClient();

  // Download image function
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Save visual to memory
  const saveToMemory = (type: 'image' | 'mindmap', data: string | MindMapData, title: string) => {
    const newVisual: SavedVisual = {
      id: Date.now().toString(),
      type,
      data,
      title,
      timestamp: new Date(),
    };
    setSavedVisuals(prev => [newVisual, ...prev]);
  };

  // Explore mind map node deeper
  const exploreMindMapNode = useMutation({
    mutationFn: async (nodeText: string) => {
      if (!conversationId) throw new Error('No conversation ID');
      const response = await apiRequest('POST', `/api/conversations/${conversationId}/messages`, {
        content: `Tell me more about: ${nodeText}`,
        generateImage: true,
        generateMindMap: true,
        addEmojis: true,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${conversationId}/messages`] });
    },
  });

  // Download image function
  const handleDownloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Explore mind map node deeper
  const handleExploreNode = async (nodeText: string) => {
    if (!conversationId) return;
    try {
      await exploreMindMapNode.mutateAsync(nodeText);
    } catch (error) {
      console.error('Failed to explore node:', error);
    }
  };

  return (
    <aside className="w-full lg:w-96 bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center space-x-2">
            <Eye className="w-4 h-4 text-primary" />
            <span>Visual Learning</span>
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {/* AI Generated Image */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Visual Aid</span>
            </h4>
            
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
              {currentImage || generateImageMutation.data?.url ? (
                <>
                  <img 
                    src={currentImage || generateImageMutation.data?.url} 
                    alt="AI-generated educational visual" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm font-medium">Educational Visual</p>
                    <p className="text-gray-300 text-xs">AI-generated diagram</p>
                  </div>
                </>
              ) : generateImageMutation.isPending ? (
                <div className="w-full h-full flex items-center justify-center image-skeleton">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Image will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {generateImageMutation.error && (
              <p className="text-sm text-destructive">
                Failed to generate image. Please try again.
              </p>
            )}
          </div>

          {/* Mind Map */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Mind Map</span>
            </h4>
            
            <div className="bg-muted rounded-xl p-4 min-h-[300px] relative">
              {currentMindMap || generateMindMapMutation.data ? (
                <MindMapVisualization data={currentMindMap || generateMindMapMutation.data} />
              ) : generateMindMapMutation.isPending ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <div>
                    <Map className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Mind map will appear here</p>
                  </div>
                </div>
              )}
            </div>

            {generateMindMapMutation.error && (
              <p className="text-sm text-destructive">
                Failed to generate mind map. Please try again.
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Quick Actions</h4>
            
            {/* Custom Image Generation */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Describe an image to generate..."
                value={customImagePrompt}
                onChange={(e) => setCustomImagePrompt(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateImage()}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={handleGenerateImage}
                disabled={!customImagePrompt.trim() || generateImageMutation.isPending}
              >
                <Image className="w-4 h-4 mr-2" />
                Generate Image
              </Button>
            </div>

            {/* Custom Mind Map Generation */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Topic for mind map..."
                value={customMindMapTopic}
                onChange={(e) => setCustomMindMapTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateMindMap()}
              />
              <Button
                size="sm"
                className="w-full"
                onClick={handleGenerateMindMap}
                disabled={!customMindMapTopic.trim() || generateMindMapMutation.isPending}
              >
                <Map className="w-4 h-4 mr-2" />
                Create Mind Map
              </Button>
            </div>

            {/* Other Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" size="sm" className="p-3 h-auto">
                <div className="text-center">
                  <Bookmark className="w-4 h-4 text-primary mb-1 mx-auto" />
                  <div className="text-xs">Save</div>
                </div>
              </Button>
              <Button variant="outline" size="sm" className="p-3 h-auto">
                <div className="text-center">
                  <Share2 className="w-4 h-4 text-primary mb-1 mx-auto" />
                  <div className="text-xs">Share</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}

// Mind Map Visualization Component
function MindMapVisualization({ data }: { data: MindMapData }) {
  if (!data || !data.centralTopic) return null;

  return (
    <div className="text-center relative h-full">
      {/* Central Node */}
      <div className="inline-block mind-map-node bg-gradient-to-br from-primary to-chart-2 px-4 py-2 rounded-xl text-primary-foreground font-semibold mb-6 shadow-lg">
        {data.centralTopic}
      </div>

      {/* Branch Nodes */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.branches?.slice(0, 4).map((branch, index) => (
          <div key={index} className="space-y-2">
            <div className="mind-map-node bg-accent px-3 py-2 rounded-lg text-center text-sm border border-border shadow-sm">
              <div className="font-medium">{branch.label}</div>
              {branch.children && branch.children.length > 0 && (
                <div className="text-xs text-muted-foreground mt-1">
                  {branch.children.slice(0, 2).join(', ')}
                  {branch.children.length > 2 && '...'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {data.branches?.slice(0, 4).map((_, index) => {
          const positions = [
            { x1: '50%', y1: '15%', x2: '25%', y2: '60%' },
            { x1: '50%', y1: '15%', x2: '75%', y2: '60%' },
            { x1: '50%', y1: '15%', x2: '25%', y2: '85%' },
            { x1: '50%', y1: '15%', x2: '75%', y2: '85%' },
          ];
          const pos = positions[index];
          return pos ? (
            <line
              key={index}
              x1={pos.x1}
              y1={pos.y1}
              x2={pos.x2}
              y2={pos.y2}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              opacity="0.6"
            />
          ) : null;
        })}
      </svg>
    </div>
  );
}
