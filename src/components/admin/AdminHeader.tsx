import { ReactNode } from 'react';
import { Separator } from '@/components/ui/separator';

interface AdminHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

const AdminHeader = ({ title, description, actions }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-ancient text-4xl text-ancient-gold tracking-wider mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-ancient-gold/60 text-base font-order tracking-wide">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
      <Separator className="mt-6 bg-ancient-gold/20" />
    </div>
  );
};

export default AdminHeader;
