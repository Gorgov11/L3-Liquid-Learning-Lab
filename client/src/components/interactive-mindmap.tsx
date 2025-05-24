import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Edit3, Trash2, Save, X, Brain, Sparkles, ZoomIn, ZoomOut, RotateCcw, Download, Share2, Maximize, Move, Eye, EyeOff, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MindMapData } from '@/lib/types';

interface InteractiveMindMapProps {
  data: MindMapData;
  onUpdate?: (updatedData: MindMapData) => void;
  className?: string;
}

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  isEditing: boolean;
  isMainTopic?: boolean;
  children: string[];
  color: string;
  isDragging?: boolean;
  isVisible?: boolean;
  size?: 'small' | 'medium' | 'large';
  connections?: number;
}

export function InteractiveMindMap({ data, onUpdate, className = "" }: InteractiveMindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showConnections, setShowConnections] = useState(true);
  const [viewMode, setViewMode] = useState<'radial' | 'hierarchical' | 'organic'>('radial');
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set());

  // Enhanced color palette for mind map nodes
  const colors = [
    '#3B82F6', '#8B5CF6', '#06B6D4', '#10B981', 
    '#F59E0B', '#EF4444', '#EC4899', '#14B8A6',
    '#6366F1', '#8B5CF6', '#F97316', '#84CC16'
  ];

  // Mouse event handlers for drag and drop
  const handleMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    setDraggedNode(nodeId);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedNode) return;
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / zoom + pan.x;
    const y = (e.clientY - rect.top) / zoom + pan.y;

    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x, y, isDragging: true }
        : node
    ));
  }, [isDragging, draggedNode, zoom, pan]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedNode(null);
    setNodes(prev => prev.map(node => ({ ...node, isDragging: false })));
  }, []);

  // Export functionality
  const exportMindMap = useCallback((format: 'png' | 'svg' | 'json') => {
    if (format === 'json') {
      const exportData = {
        data,
        nodes,
        zoom,
        pan,
        timestamp: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mindmap-${data.centralTopic.replace(/\s+/g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [data, nodes, zoom, pan]);

  // Initialize nodes from mind map data
  useEffect(() => {
    const centerX = 400;
    const centerY = 300;
    const radius = 180;

    const newNodes: Node[] = [];
    
    // Central topic
    newNodes.push({
      id: 'central',
      text: data.centralTopic,
      x: centerX,
      y: centerY,
      isEditing: false,
      isMainTopic: true,
      children: data.branches.map((_, i) => `branch-${i}`),
      color: colors[0]
    });

    // Branch nodes
    data.branches.forEach((branch, branchIndex) => {
      const angle = (branchIndex * 360) / data.branches.length;
      const radians = (angle * Math.PI) / 180;
      const branchX = centerX + Math.cos(radians) * radius;
      const branchY = centerY + Math.sin(radians) * radius;

      newNodes.push({
        id: `branch-${branchIndex}`,
        text: branch.label,
        x: branchX,
        y: branchY,
        isEditing: false,
        children: branch.children.map((_, i) => `child-${branchIndex}-${i}`),
        color: colors[(branchIndex + 1) % colors.length]
      });

      // Child nodes
      branch.children.forEach((child, childIndex) => {
        const childAngle = angle + (childIndex - (branch.children.length - 1) / 2) * 30;
        const childRadians = (childAngle * Math.PI) / 180;
        const childRadius = radius + 120;
        const childX = centerX + Math.cos(childRadians) * childRadius;
        const childY = centerY + Math.sin(childRadians) * childRadius;

        newNodes.push({
          id: `child-${branchIndex}-${childIndex}`,
          text: child,
          x: childX,
          y: childY,
          isEditing: false,
          children: [],
          color: colors[(branchIndex + childIndex + 2) % colors.length]
        });
      });
    });

    setNodes(newNodes);
  }, [data]);

  const handleNodeClick = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setEditingNode(nodeId);
    setEditText(node.text);
  };

  const handleSaveEdit = () => {
    if (!editingNode) return;

    setNodes(prev => prev.map(node => 
      node.id === editingNode 
        ? { ...node, text: editText }
        : node
    ));
    setEditingNode(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingNode(null);
    setEditText('');
  };

  const addChildNode = (parentId: string) => {
    const parent = nodes.find(n => n.id === parentId);
    if (!parent) return;

    const newNodeId = `new-${Date.now()}`;
    const childIndex = parent.children.length;
    const angle = Math.atan2(parent.y - 300, parent.x - 400) * 180 / Math.PI;
    const childAngle = angle + (childIndex - parent.children.length / 2) * 20;
    const childRadians = (childAngle * Math.PI) / 180;
    const childX = parent.x + Math.cos(childRadians) * 100;
    const childY = parent.y + Math.sin(childRadians) * 100;

    const newNode: Node = {
      id: newNodeId,
      text: 'New Topic',
      x: childX,
      y: childY,
      isEditing: false,
      children: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setNodes(prev => [
      ...prev,
      newNode,
      ...prev.map(node => 
        node.id === parentId 
          ? { ...node, children: [...node.children, newNodeId] }
          : node
      ).slice(1)
    ]);
  };

  const deleteNode = (nodeId: string) => {
    if (nodeId === 'central') return; // Don't delete central node
    
    setNodes(prev => prev.filter(node => {
      if (node.id === nodeId) return false;
      if (node.children.includes(nodeId)) {
        node.children = node.children.filter(id => id !== nodeId);
      }
      return true;
    }));
  };

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-float" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Interactive Mind Map</h3>
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" />
        </div>
        
        {/* Enhanced Controls */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 mr-2">
            <Badge variant="outline" className="text-xs">
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </Badge>
          </div>
          
          {/* Connection Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConnections(!showConnections)}
            className={`h-8 w-8 p-0 svg-animate ${showConnections ? 'bg-primary/10' : ''}`}
            title="Toggle connections"
          >
            {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          
          {/* Export Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportMindMap('json')}
            className="h-8 w-8 p-0 svg-animate"
            title="Export mind map"
          >
            <Download className="w-4 h-4 svg-bounce" />
          </Button>
          
          {/* Zoom Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            className="h-8 w-8 p-0 svg-animate"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="h-8 w-8 p-0 svg-animate"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            className="h-8 w-8 p-0 svg-animate"
            title="Reset view"
          >
            <RotateCcw className="w-4 h-4 svg-spin-glow" />
          </Button>
          
          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 svg-animate"
            title="Expand view"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Mind Map SVG */}
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-inner">
        <svg
          ref={svgRef}
          width="100%"
          height="600"
          viewBox={`${-pan.x} ${-pan.y} ${800 / zoom} ${600 / zoom}`}
          className={`transition-all duration-300 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Gradient Definitions */}
          <defs>
            <radialGradient id="nodeGradient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#000000" stopOpacity="0.1"/>
            </radialGradient>
            <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3"/>
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Enhanced Connections */}
          {showConnections && (
            <g className="connections-layer">
              {nodes.map(node => 
                node.children.map(childId => {
                  const child = nodes.find(n => n.id === childId);
                  if (!child) return null;
                  
                  return (
                    <g key={`connection-${node.id}-${childId}`}>
                      {/* Connection line with gradient */}
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={child.x}
                        y2={child.y}
                        stroke={`url(#gradient-${node.id})`}
                        strokeWidth="3"
                        opacity="0.7"
                        className="transition-all duration-500 hover:opacity-100"
                        filter="url(#dropShadow)"
                      />
                      {/* Animated connection pulse */}
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={child.x}
                        y2={child.y}
                        stroke={node.color}
                        strokeWidth="1"
                        opacity="0.4"
                        className="animate-pulse"
                        strokeDasharray="5,5"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          values="0;10"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </line>
                    </g>
                  );
                })
              )}
              
              {/* Dynamic gradients for connections */}
              <defs>
                {nodes.map(node => (
                  <linearGradient key={`gradient-${node.id}`} id={`gradient-${node.id}`}>
                    <stop offset="0%" stopColor={node.color} stopOpacity="0.8"/>
                    <stop offset="100%" stopColor={node.color} stopOpacity="0.3"/>
                  </linearGradient>
                ))}
              </defs>
            </g>
          )}

          {/* Nodes */}
          <g>
            {nodes.map(node => (
              <g key={node.id}>
                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.isMainTopic ? 40 : 30}
                  fill={node.color}
                  stroke="#fff"
                  strokeWidth="3"
                  className={`cursor-pointer transition-all duration-300 ${
                    hoveredNode === node.id ? 'animate-pulse-glow' : ''
                  } ${node.isMainTopic ? 'animate-float' : ''}`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                />

                {/* Node Text */}
                {editingNode === node.id ? (
                  <foreignObject
                    x={node.x - 60}
                    y={node.y - 10}
                    width="120"
                    height="20"
                  >
                    <div className="flex items-center space-x-1">
                      <Input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="h-6 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <Button size="sm" className="h-6 w-6 p-0" onClick={handleSaveEdit}>
                        <Save className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 w-6 p-0" onClick={handleCancelEdit}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </foreignObject>
                ) : (
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={node.isMainTopic ? "14" : "12"}
                    fontWeight={node.isMainTopic ? "bold" : "normal"}
                    className="pointer-events-none select-none"
                  >
                    {node.text.length > 12 ? `${node.text.slice(0, 12)}...` : node.text}
                  </text>
                )}

                {/* Action Buttons */}
                {hoveredNode === node.id && editingNode !== node.id && (
                  <g>
                    <circle
                      cx={node.x + 35}
                      cy={node.y - 15}
                      r="12"
                      fill="#10b981"
                      className="cursor-pointer animate-bounce-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        addChildNode(node.id);
                      }}
                    />
                    <Plus
                      x={node.x + 35 - 6}
                      y={node.y - 15 - 6}
                      width="12"
                      height="12"
                      fill="white"
                      className="pointer-events-none"
                    />

                    {!node.isMainTopic && (
                      <>
                        <circle
                          cx={node.x + 35}
                          cy={node.y + 15}
                          r="12"
                          fill="#ef4444"
                          className="cursor-pointer animate-bounce-in"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNode(node.id);
                          }}
                        />
                        <Trash2
                          x={node.x + 35 - 6}
                          y={node.y + 15 - 6}
                          width="12"
                          height="12"
                          fill="white"
                          className="pointer-events-none"
                        />
                      </>
                    )}
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/20 rounded-lg p-2">
        <p className="flex items-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span><strong>Click</strong> any node to edit • <strong>Hover</strong> to see action buttons • <strong>Green +</strong> adds child topics • <strong>Red trash</strong> deletes nodes</span>
        </p>
      </div>
    </div>
  );
}