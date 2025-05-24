import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, Target, TrendingUp, Clock, X } from "lucide-react";

interface KnowledgeTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testData: any;
}

export function KnowledgeTestModal({ isOpen, onClose, testData }: KnowledgeTestModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!testData?.assessment) return null;

  const { assessment } = testData;
  const questions = assessment.assessmentQuestions || [];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q: any, index: number) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Knowledge Assessment</span>
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        {!showResults ? (
          /* Question Phase */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-32" />
            </div>

            {questions[currentQuestion] && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {questions[currentQuestion].question}
                  </CardTitle>
                  <CardDescription>
                    Topic: {questions[currentQuestion].topic}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option: string, index: number) => (
                      <Button
                        key={index}
                        variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                        className="w-full justify-start text-left h-auto p-4"
                        onClick={() => handleAnswerSelect(index)}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === questions.length - 1 ? "Finish Assessment" : "Next"}
              </Button>
            </div>
          </div>
        ) : (
          /* Results Phase */
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-primary">{calculateScore()}%</div>
                <Badge className={getLevelColor(assessment.currentLevel)}>
                  {assessment.currentLevel.charAt(0).toUpperCase() + assessment.currentLevel.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Strength Areas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessment.strengthAreas?.map((area: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Improvement Areas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {assessment.improvementAreas?.map((area: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-200" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Recommended Learning Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessment.learningGoals?.map((goal: any, index: number) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{goal.goal}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={goal.difficulty === 'easy' ? 'default' : goal.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                            {goal.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{goal.estimatedTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personalized Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button onClick={onClose} className="px-8">
                Continue Learning
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}