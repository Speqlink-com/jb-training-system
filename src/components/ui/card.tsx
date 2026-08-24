import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "primary" | "success" | "warning" | "info" | "neutral";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border transition-all duration-200",
        variant === "default" && "bg-card text-card-foreground border-border shadow-md hover:shadow-lg",
        variant === "elevated" && "admin-card",
        variant === "primary" && "card-primary",
        variant === "success" && "card-success",
        variant === "warning" && "card-warning", 
        variant === "info" && "card-info",
        variant === "neutral" && "card-neutral",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "elevated" | "colored" }
>(({ className, variant = "default", ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "flex flex-col space-y-1.5 p-6",
      variant === "elevated" && "admin-card-header",
      variant === "colored" && "text-white",
      className
    )} 
    {...props} 
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & { variant?: "default" | "colored" }
>(({ className, variant = "default", ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-semibold leading-none tracking-tight text-lg", 
      variant === "colored" && "text-white",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { variant?: "default" | "colored" }
>(({ className, variant = "default", ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm", 
      variant === "colored" ? "text-white/90" : "text-muted-foreground",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "colored" }
>(({ className, variant = "default", ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "p-6 pt-0", 
      variant === "colored" && "text-white/95",
      className
    )} 
    {...props} 
  />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "colored" }
>(({ className, variant = "default", ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "flex items-center p-6 pt-0", 
      variant === "colored" && "text-white/95",
      className
    )} 
    {...props} 
  />
));
CardFooter.displayName = "CardFooter";

// Specialized card components for easy use
const ElevatedCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="elevated"
      className={className}
      {...props}
    />
  )
);
ElevatedCard.displayName = "ElevatedCard";

const PrimaryCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="primary"
      className={className}
      {...props}
    />
  )
);
PrimaryCard.displayName = "PrimaryCard";

const SuccessCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  ({ className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="success"
      className={className}
      {...props}
    />
  )
);
SuccessCard.displayName = "SuccessCard";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  ElevatedCard,
  PrimaryCard,
  SuccessCard
};