
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { MapPin, Clock, Star, ChevronRight, Shield, Award } from "lucide-react";
import { toast } from "sonner";

interface HelperCardProps {
  request: {
    id: string;
    service: string;
    location: string;
    distance: string;
    time: string;
    price: number;
    status: 'available' | 'accepted' | 'completed';
  };
}

const HelperCard: React.FC<HelperCardProps> = ({ request }) => {
  const handleAccept = () => {
    toast.success(`You've accepted the request for ${request.service}`);
  };

  const handleView = () => {
    toast.info(`Viewing details for ${request.service} request`);
  };

  const statusClasses = {
    available: "bg-primary/10 text-primary",
    accepted: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700"
  };

  const statusText = {
    available: "Available",
    accepted: "In Progress",
    completed: "Completed"
  };

  return (
    <Card className="transition-all duration-300 hover:shadow-md animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{request.service}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin size={14} className="mr-1" /> {request.location}
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[request.status]}`}>
            {statusText[request.status]}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock size={14} className="mr-2" />
            <span>{request.time} away</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin size={14} className="mr-2" />
            <span>{request.distance}</span>
          </div>
        </div>
        <div className="mt-2 p-3 bg-secondary/50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Payment</span>
            <span className="font-semibold">${request.price.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        {request.status === 'available' ? (
          <>
            <Button variant="outline" size="sm" onClick={handleView}>
              Details
            </Button>
            <Button size="sm" onClick={handleAccept}>
              Accept Request
            </Button>
          </>
        ) : (
          <Button className="w-full" variant="outline" size="sm" onClick={handleView}>
            View Details
            <ChevronRight size={16} className="ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HelperCard;
