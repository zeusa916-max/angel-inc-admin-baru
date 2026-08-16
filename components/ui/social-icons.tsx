import React from 'react';

interface SocialIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

export function InstagramIcon({ className = 'h-4 w-4', size, ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = 'h-4 w-4', size, ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.71a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-.88-.09z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = 'h-4 w-4', size, ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
      {...props}
    >
      <path d="M17.472 14.382c-.301-.15-1.782-.88-2.058-.98-.277-.1-.478-.15-.68.15-.202.3-.782.98-.958 1.18-.177.2-.353.226-.654.075s-1.272-.469-2.423-1.496c-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.352.452-.528.15-.176.2-.301.301-.502.1-.2.05-.377-.025-.528-.075-.15-.68-1.637-.931-2.245-.245-.592-.494-.512-.68-.521-.176-.009-.377-.01-.578-.01-.2 0-.528.075-.804.377-.276.301-1.055 1.03-1.055 2.511 0 1.482 1.08 2.912 1.231 3.113.151.2 2.126 3.246 5.15 4.553.72.311 1.282.497 1.72.636.723.23 1.381.197 1.902.12.58-.087 1.782-.728 2.033-1.431.251-.703.251-1.306.176-1.431-.076-.126-.277-.201-.578-.352z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12c0 1.892.524 3.662 1.437 5.176L2.1 21.9l4.872-1.305A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.616 0-3.13-.456-4.42-1.248l-.317-.193-2.887.773.77-2.812-.208-.332A8.163 8.163 0 0 1 3.8 12c0-4.529 3.671-8.2 8.2-8.2s8.2 3.671 8.2 8.2-3.671 8.2-8.2 8.2z"
      />
    </svg>
  );
}
