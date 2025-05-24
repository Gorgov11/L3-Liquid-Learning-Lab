import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { BarChart3, X, BookOpen, Palette, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { UserStats, LearningProgressData } from '@/lib/types';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export function DashboardModal({ isOpen, onClose, currentUserId }: DashboardModalProps) {
  // Fetch user progress and stats
  const { data: progressData } = useQuery<{
    progress: LearningProgressData[];
    stats: UserStats;
  }>({
    queryKey: [`/api/users/${currentUserId}/progress`],
    enabled: !!currentUserId && isOpen,
  });

  const stats = progressData?.stats || {
    overallProgress: 0,
    learningStreak: 0,
    visualsGenerated: 0,
    topicsExplored: 0,
  };

  const progress = progressData?.progress || [];

  // Calculate progress ring circumference
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.overallProgress / 100) * circumference;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>Learning Dashboard</span>
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="gradient-border">
                <div className="gradient-border-inner text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 progress-ring">
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="hsl(var(--primary))"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="progress-ring-fill"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{stats.overallProgress}%</span>
                    </div>
                  </div>
                  <p className="font-medium">Overall Progress</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.topicsExplored} topics explored
                  </p>
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.learningStreak}
                  </div>
                  <p className="font-medium">Day Streak</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.learningStreak > 0 ? 'Keep it up!' : 'Start learning today!'}
                  </p>
                </div>
              </div>

              <div className="gradient-border">
                <div className="gradient-border-inner text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.visualsGenerated}
                  </div>
                  <p className="font-medium">Visuals Created</p>
                  <p className="text-sm text-muted-foreground">Total generated</p>
                </div>
              </div>
            </div>

            {/* Learning Categories */}
            <div>
              <h4 className="font-semibold mb-4">Learning Progress by Topic</h4>
              <div className="space-y-3">
                {progress.length > 0 ? (
                  progress.map((item, index) => {
                    const colors = [
                      'hsl(var(--primary))',
                      'hsl(var(--chart-3))',
                      'hsl(var(--chart-4))',
                      'hsl(var(--chart-5))',
                    ];
                    const color = colors[index % colors.length];
                    
                    return (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-medium">{item.topic}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Progress 
                            value={item.progressPercentage} 
                            className="w-24" 
                          />
                          <span className="text-sm text-muted-foreground min-w-[3rem]">
                            {item.progressPercentage}%
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Start a conversation to see your progress!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h4 className="font-semibold mb-4">Recent Learning Activity</h4>
              <div className="space-y-3">
                {progress.slice(0, 3).map((item, index) => (
                  <div key={item.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-chart-2 rounded-full flex items-center justify-center flex-shrink-0">
                      {index === 0 ? (
                        <BookOpen className="w-4 h-4 text-primary-foreground" />
                      ) : index === 1 ? (
                        <Palette className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <TrendingUp className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Explored {item.topic}</p>
                      <p className="text-xs text-muted-foreground">
                        Generated {item.visualsGenerated} visual{item.visualsGenerated !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {progress.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity yet. Start learning to see your progress!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
