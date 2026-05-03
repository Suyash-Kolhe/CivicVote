import { memo } from 'react';
import { type Message } from '../data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatMessage = memo(({ message }: { message: Message }) => {
  const isAssistant = message.role === 'assistant';
  return (
    <div 
      className={cn("flex w-full mb-4", isAssistant ? "justify-start" : "justify-end")}
      role="log"
      aria-live="polite"
    >
      <div className={cn(
        "max-w-[80%] rounded-2xl px-5 py-4 text-sm shadow-sm transition-all duration-300",
        isAssistant 
          ? "bg-white border border-cv-dark/10 text-cv-dark rounded-tl-none" 
          : "bg-cv-blue text-white rounded-tr-none shadow-cv-blue/20"
      )}>
        <p className="leading-relaxed font-bold italic tracking-tight">{message.content}</p>
      </div>
    </div>
  );
});
