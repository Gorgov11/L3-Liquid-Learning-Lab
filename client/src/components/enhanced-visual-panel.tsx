import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Download, History, Plus, ChevronRight, ZoomIn, ZoomOut, RotateCcw, X, Eye, Bookmark, Share2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { MindMapData } from '@/lib/types';

interface EnhancedVisualPanelProps {
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

export function EnhancedVisualPanel({ currentImage, currentMindMap, onClose, conversationId, currentUserId }: EnhancedVisualPanelProps) {
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

  // Interactive Mind Map Component with animations
  const InteractiveMindMap = ({ data }: { data: MindMapData }) => {
    const toggleBranch = (branchLabel: string) => {
      setExpandedBranches(prev => {
        const newSet = new Set(prev);
        if (newSet.has(branchLabel)) {
          newSet.delete(branchLabel);
        } else {
          newSet.add(branchLabel);
        }
        return newSet;
      });
    };

    const exploreNode = (nodeText: string) => {
      setSelectedMindMapNode(nodeText);
      exploreMindMapNode.mutate(nodeText);
    };

    return (
      <div className="relative p-6 bg-gradient-to-br from-background via-muted/30 to-background rounded-lg">
        {/* Central Topic */}
        <div className="flex justify-center mb-8">
          <div 
            className="bg-primary text-primary-foreground px-6 py-4 rounded-full text-lg font-bold shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => exploreNode(data.centralTopic)}
          >
            {data.centralTopic}
          </div>
        </div>

        {/* Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.branches.map((branch, index) => (
            <div 
              key={index}
              className="group transform transition-all duration-500 hover:-translate-y-1"
              style={{
                animationDelay: `${index * 150}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
              }}
            >
              {/* Branch Header */}
              <div 
                className="bg-chart-2 text-chart-2-foreground px-4 py-3 rounded-t-lg cursor-pointer flex items-center justify-between shadow-md transition-all duration-300 hover:bg-chart-2/90"
                onClick={() => toggleBranch(branch.label)}
              >
                <span className="font-semibold">{branch.label}</span>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-chart-2-foreground hover:bg-chart-2-foreground/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      exploreNode(branch.label);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform duration-300 ${
                      expandedBranches.has(branch.label) ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Branch Children */}
              <div className={`overflow-hidden transition-all duration-500 ${
                expandedBranches.has(branch.label) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="bg-card border border-chart-2/20 rounded-b-lg p-3 space-y-2">
                  {branch.children.map((child, childIndex) => (
                    <div
                      key={childIndex}
                      className="bg-muted/50 px-3 py-2 rounded-md cursor-pointer transition-all duration-200 hover:bg-muted hover:shadow-sm flex items-center justify-between group/child"
                      onClick={() => exploreNode(child)}
                      style={{
                        animationDelay: `${(index * 150) + (childIndex * 100)}ms`,
                        animation: expandedBranches.has(branch.label) ? 'slideInRight 0.4s ease-out forwards' : '',
                      }}
                    >
                      <span className="text-sm">{child}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 opacity-0 group-hover/child:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          exploreNode(child);
                        }}
                      >
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {exploreMindMapNode.isPending && selectedMindMapNode && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">
                Exploring: {selectedMindMapNode}...
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Image Viewer with zoom and controls
  const EnhancedImageViewer = ({ imageUrl }: { imageUrl: string }) => {
    return (
      <div className="relative bg-muted/30 rounded-lg overflow-hidden">
        {/* Image Controls */}
        <div className="absolute top-4 right-4 z-10 flex space-x-2">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 backdrop-blur-sm bg-background/80"
            onClick={() => setImageZoom(prev => Math.min(prev + 0.25, 3))}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 backdrop-blur-sm bg-background/80"
            onClick={() => setImageZoom(prev => Math.max(prev - 0.25, 0.5))}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 backdrop-blur-sm bg-background/80"
            onClick={() => setImageZoom(1)}
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 backdrop-blur-sm bg-background/80"
            onClick={() => downloadImage(imageUrl, `learning-image-${Date.now()}.png`)}
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center min-h-[300px] p-4">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Learning visual"
            className="max-w-full h-auto transition-transform duration-300 cursor-zoom-in shadow-lg rounded-lg"
            style={{
              transform: `scale(${imageZoom})`,
              transformOrigin: 'center',
            }}
            onClick={() => setImageZoom(prev => prev === 1 ? 1.5 : 1)}
          />
        </div>

        {/* Zoom indicator */}
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
          {Math.round(imageZoom * 100)}%
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-card rounded-lg shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Visual Learning Hub
          </h3>
          <div className="flex items-center space-x-2">
            {/* Tab buttons */}
            <Button
              variant={activeTab === 'current' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('current')}
            >
              Current
            </Button>
            <Button
              variant={activeTab === 'history' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('history')}
            >
              <History className="h-3 w-3 mr-1" />
              History
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'current' ? (
          <div className="space-y-6">
            {/* Current Image */}
            {currentImage && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    🖼️ Generated Image
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveToMemory('image', currentImage, `Image - ${new Date().toLocaleString()}`)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigator.share?.({ url: currentImage })}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                <EnhancedImageViewer imageUrl={currentImage} />
              </div>
            )}

            {/* Current Mind Map */}
            {currentMindMap && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium flex items-center">
                    🧠 Interactive Mind Map
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveToMemory('mindmap', currentMindMap, `Mind Map - ${currentMindMap.centralTopic}`)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setExpandedBranches(new Set(currentMindMap.branches.map(b => b.label)))}
                    >
                      Expand All
                    </Button>
                  </div>
                </div>
                <InteractiveMindMap data={currentMindMap} />
              </div>
            )}

            {!currentImage && !currentMindMap && (
              <div className="text-center py-12 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No visuals yet. Ask a question to generate images and mind maps!</p>
              </div>
            )}
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-4">
            <h4 className="font-medium">Saved Visuals</h4>
            {savedVisuals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedVisuals.map((visual) => (
                  <div key={visual.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{visual.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {visual.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    {visual.type === 'image' ? (
                      <img 
                        src={visual.data as string} 
                        alt={visual.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="bg-muted/30 p-3 rounded text-sm">
                        Mind Map: {(visual.data as MindMapData).centralTopic}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No saved visuals yet</p>
              </div>
            )}
          </div>
        )}
      </div>


    </div>
  );
}