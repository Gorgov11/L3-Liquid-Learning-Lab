import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye, Plus, ChevronRight, History, Bookmark } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { MindMapData } from '@/lib/types';

interface DynamicVisualPanelProps {
  currentImage?: string | null;
  currentMindMap?: MindMapData | null;
  onClose?: () => void;
  conversationId?: number | null;
}

interface SavedVisual {
  id: string;
  type: 'image' | 'mindmap';
  data: string | MindMapData;
  title: string;
  timestamp: Date;
}

export function DynamicVisualPanel({ currentImage, currentMindMap, onClose, conversationId }: DynamicVisualPanelProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [savedVisuals, setSavedVisuals] = useState<SavedVisual[]>([]);
  const [imageZoom, setImageZoom] = useState(1);
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

  // Interactive Mind Map Component
  const InteractiveMindMap = ({ data }: { data: MindMapData }) => {
    const exploreNode = (nodeText: string) => {
      exploreMindMapNode.mutate(nodeText);
    };

    return (
      <div className="p-6 space-y-6">
        {/* Central Topic */}
        <div className="text-center">
          <div 
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-pulse"
            onClick={() => exploreNode(data.centralTopic)}
            style={{ animation: 'fadeIn 0.8s ease-out' }}
          >
            {data.centralTopic}
            <div className="text-xs opacity-75 mt-1">Click to explore deeper</div>
          </div>
        </div>

        {/* Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.branches.map((branch, index) => (
            <div 
              key={index}
              className="bg-card border rounded-xl p-4 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
              style={{
                animation: `slideInUp 0.6s ease-out ${index * 150}ms forwards`,
                opacity: 0
              }}
            >
              {/* Branch Header */}
              <div 
                className="flex items-center justify-between mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                onClick={() => exploreNode(branch.label)}
              >
                <span className="font-semibold text-blue-600 dark:text-blue-400">{branch.label}</span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    exploreNode(branch.label);
                  }}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Branch Children */}
              <div className="space-y-2">
                {branch.children.map((child, childIndex) => (
                  <div
                    key={childIndex}
                    className="text-sm bg-muted/50 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted hover:shadow-sm transform transition-all duration-200 hover:translate-x-2 flex items-center justify-between group"
                    onClick={() => exploreNode(child)}
                  >
                    <span>• {child}</span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {exploreMindMapNode.isPending && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Exploring deeper...</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Enhanced Image Viewer
  const EnhancedImageViewer = ({ imageUrl }: { imageUrl: string }) => {
    return (
      <div className="relative bg-muted/30 rounded-lg overflow-hidden group">
        {/* Image Controls */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 backdrop-blur-sm bg-white/90 shadow-lg"
              onClick={() => downloadImage(imageUrl, `learning-image-${Date.now()}.png`)}
            >
              <Download className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 backdrop-blur-sm bg-white/90 shadow-lg"
              onClick={() => window.open(imageUrl, '_blank')}
            >
              <Eye className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 backdrop-blur-sm bg-white/90 shadow-lg"
              onClick={() => saveToMemory('image', imageUrl, `Image - ${new Date().toLocaleString()}`)}
            >
              <Bookmark className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="flex items-center justify-center min-h-[300px] p-4">
          <img
            src={imageUrl}
            alt="Learning visual"
            className="max-w-full h-auto transition-transform duration-300 cursor-zoom-in shadow-lg rounded-lg hover:scale-105"
            onClick={() => window.open(imageUrl, '_blank')}
          />
        </div>

        {/* Hover hint */}
        <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white px-2 py-1 rounded text-xs">
          Click to enlarge • Hover for options
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-card rounded-lg shadow-xl border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">🎨 Dynamic Visual Hub</h3>
          <div className="flex items-center space-x-2">
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
              History ({savedVisuals.length})
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-96">
        <div className="p-6">
          {activeTab === 'current' ? (
            <div className="space-y-6">
              {/* Current Image */}
              {currentImage && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">🖼️ Generated Image</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveToMemory('image', currentImage, `Image - ${new Date().toLocaleString()}`)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save to Memory
                    </Button>
                  </div>
                  <EnhancedImageViewer imageUrl={currentImage} />
                </div>
              )}

              {/* Current Mind Map */}
              {currentMindMap && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">🧠 Interactive Mind Map</h4>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => saveToMemory('mindmap', currentMindMap, `Mind Map - ${currentMindMap.centralTopic}`)}
                    >
                      <Bookmark className="h-3 w-3 mr-1" />
                      Save to Memory
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-background via-muted/30 to-background rounded-lg relative">
                    <InteractiveMindMap data={currentMindMap} />
                  </div>
                </div>
              )}

              {!currentImage && !currentMindMap && (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-4">🎨</div>
                  <p>No visuals yet. Ask a question to generate images and mind maps!</p>
                </div>
              )}
            </div>
          ) : (
            /* History Tab */
            <div className="space-y-4">
              <h4 className="font-medium">📚 Saved Visual Library</h4>
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
                        <div className="relative group cursor-pointer">
                          <img 
                            src={visual.data as string} 
                            alt={visual.title}
                            className="w-full h-32 object-cover rounded"
                            onClick={() => window.open(visual.data as string, '_blank')}
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="secondary"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadImage(visual.data as string, `saved-image-${visual.id}.png`);
                              }}
                            >
                              <Download className="h-2 w-2" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted/30 p-3 rounded text-sm cursor-pointer hover:bg-muted/50 transition-colors">
                          <strong>Mind Map:</strong> {(visual.data as MindMapData).centralTopic}
                          <div className="text-xs text-muted-foreground mt-1">
                            {(visual.data as MindMapData).branches.length} branches
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="text-3xl mb-2">📚</div>
                  <p>No saved visuals yet</p>
                  <p className="text-xs">Save visuals from the Current tab to build your library</p>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>


    </div>
  );
}