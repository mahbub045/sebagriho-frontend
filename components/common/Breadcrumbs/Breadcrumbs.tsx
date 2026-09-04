'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Home, RotateCw } from 'lucide-react';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className='mb-6 flex items-center justify-between'>
      <div className='border-border bg-background inline-flex items-center rounded-lg border p-0.5 shadow-sm'>
        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 rounded-md transition-colors'
          onClick={() => window.history.back()}
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 rounded-md transition-colors'
          onClick={() => window.history.forward()}
        >
          <ChevronRight className='h-4 w-4' />
        </Button>

        <div className='bg-border mx-0.5 h-4 w-px' />

        <Button
          variant='ghost'
          size='icon'
          className='text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 rounded-md transition-colors duration-300 active:rotate-180'
          onClick={() => window.location.reload()}
        >
          <RotateCw className='h-4 w-4' />
        </Button>
      </div>
      
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === items.length - 1 || !item.href ? (
                <BreadcrumbPage className='flex items-center gap-2'>
                  {index === 0 && <Home className='h-4 w-4' />}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href={item.href}
                  className='flex items-center gap-2'
                >
                  {index === 0 && <Home className='h-4 w-4' />}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
