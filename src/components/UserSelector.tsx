import { ChevronDown, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/Popover';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { cn } from '../lib/cn';

const roleIcons: Record<string, React.ReactNode> = {
  'Administrator': <ShieldCheck className="h-4 w-4 text-green-400" />,
  'HR + Engineering Lead': <Shield className="h-4 w-4 text-blue-400" />,
  'Engineering Team Member': <ShieldAlert className="h-4 w-4 text-yellow-400" />,
};

export function UserSelector() {
  const [open, setOpen] = useState(false);
  const { currentUser, setCurrentUser, availableUsers } = useUser();

  const handleSelectUser = (userId: string) => {
    setCurrentUser(userId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg',
            'bg-surface-2 border border-border',
            'hover:bg-surface-3 hover:border-border-hover',
            'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-sm font-medium text-accent">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-text-primary">
              {currentUser.name}
            </div>
            <div className="text-xs text-text-tertiary">
              {currentUser.role}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-text-tertiary ml-2" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-2" align="end">
        <div className="mb-2 px-2 py-1">
          <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
            Switch User (Demo)
          </p>
        </div>
        <div className="space-y-1">
          {availableUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={cn(
                'w-full flex items-start gap-3 px-3 py-2.5 rounded-md text-left',
                'transition-colors',
                user.id === currentUser.id
                  ? 'bg-accent/10 text-text-primary'
                  : 'hover:bg-surface-3 text-text-secondary'
              )}
            >
              <div className={cn(
                'h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium shrink-0',
                user.id === currentUser.id
                  ? 'bg-accent/20 text-accent'
                  : 'bg-surface-3 text-text-secondary'
              )}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'font-medium',
                    user.id === currentUser.id && 'text-accent'
                  )}>
                    {user.name}
                  </span>
                  {roleIcons[user.role]}
                </div>
                <div className="text-xs text-text-tertiary mt-0.5">
                  {user.role}
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  {user.description}
                </div>
                <div className="text-xs text-text-tertiary mt-1">
                  {user.scopes.length} scope{user.scopes.length !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

