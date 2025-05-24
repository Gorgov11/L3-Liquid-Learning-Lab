import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { LearningDashboard } from './learning-dashboard';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

export function DashboardModal({ isOpen, onClose, currentUserId }: DashboardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Learning Dashboard</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto px-6 py-4">
          <LearningDashboard currentUserId={currentUserId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}