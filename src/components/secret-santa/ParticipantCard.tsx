'use client';

import { Participant } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface ParticipantCardProps {
  participant: Participant;
  assignedTo?: Participant;
  showAssignment?: boolean;
}

export function ParticipantCard({ participant, assignedTo, showAssignment = false }: ParticipantCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-red-200 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-linear-to-br from-red-500 to-green-500">
            <AvatarFallback className="bg-transparent text-white font-semibold">
              {getInitials(participant.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg text-gray-900">{participant.name}</CardTitle>
            <CardDescription className="text-sm">{participant.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {showAssignment && assignedTo && (
        <CardContent className="pt-0">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 font-medium mb-1">Le toca regalar a:</p>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <p className="font-semibold text-green-800">{assignedTo.name}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
