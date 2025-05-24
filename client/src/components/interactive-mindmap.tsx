import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Brain, Sparkles, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
}

export function InteractiveMindMap({ data, onUpdate, className = "" }: InteractiveMindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Color palette for mind map nodes
  const colors = [
    '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', 
    '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'
  ];

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
        
        {/* Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.min(prev + 0.2, 2))}
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))}
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetZoom}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Mind Map SVG */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <svg
          ref={svgRef}
          width="100%"
          height="500"
          viewBox={`${-pan.x} ${-pan.y} ${800 / zoom} ${500 / zoom}`}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* Connections */}
          <g>
            {nodes.map(node => 
              node.children.map(childId => {
                const child = nodes.find(n => n.id === childId);
                if (!child) return null;
                
                return (
                  <line
                    key={`${node.id}-${childId}`}
                    x1={node.x}
                    y1={node.y}
                    x2={child.x}
                    y2={child.y}
                    stroke={node.color}
                    strokeWidth="2"
                    opacity="0.6"
                    className="animate-pulse"
                  />
                );
              })
            )}
          </g>

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