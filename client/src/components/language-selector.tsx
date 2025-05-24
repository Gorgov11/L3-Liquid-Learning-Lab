import React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Globe, Check } from 'lucide-react';

const languages = {
  en: { code: 'en', name: 'English', flag: '🇺🇸' },
  es: { code: 'es', name: 'Español', flag: '🇪🇸' },
  fr: { code: 'fr', name: 'Français', flag: '🇫🇷' },
  zh: { code: 'zh', name: '中文', flag: '🇨🇳' },
  ja: { code: 'ja', name: '日本語', flag: '🇯🇵' },
  de: { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  pt: { code: 'pt', name: 'Português', flag: '🇧🇷' },
  ar: { code: 'ar', name: 'العربية', flag: '🇸🇦' },
};

export function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = React.useState('en');
  const [open, setOpen] = React.useState(false);

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLanguage(languageCode);
    setOpen(false);
    // Here you would typically save to localStorage and trigger re-renders
    localStorage.setItem('language', languageCode);
  };

  const currentLang = languages[currentLanguage as keyof typeof languages] || languages.en;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start h-10 px-3 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <Globe className="w-4 h-4 mr-3" />
          <span className="flex items-center gap-2">
            <span>{currentLang.flag}</span>
            <span>{currentLang.name}</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-sm font-semibold">Choose Language</div>
          {Object.entries(languages).map(([code, lang]) => (
            <Button
              key={code}
              variant={currentLanguage === code ? "secondary" : "ghost"}
              className="w-full justify-start h-9 px-2 font-normal"
              onClick={() => handleLanguageChange(code)}
            >
              <span className="text-base mr-3">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {currentLanguage === code && (
                <Check className="w-4 h-4" />
              )}
            </Button>
          ))}
          <div className="border-t pt-2 mt-2">
            <p className="text-xs text-muted-foreground px-2">
              🌍 Learning for everyone worldwide
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}