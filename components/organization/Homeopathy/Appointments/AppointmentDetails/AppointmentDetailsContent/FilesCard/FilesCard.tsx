import { Card } from '@/components/ui/card';
import { FilesCardProps } from '@/types/Organization/Homeopathy/Appointments/AppointmentsType';
import { formatDateAndTime } from '@/utils/formatters';
import { Download, FileText } from 'lucide-react';

const FilesCard: React.FC<FilesCardProps> = ({ files }) => {
  return (
    <Card className='border-border/60 flex flex-col gap-0 overflow-hidden p-0 shadow-sm'>
      <div className='border-border/60 flex items-center gap-2 border-b p-4'>
        <FileText className='text-warning h-4 w-4' />

        <p className='text-sm font-semibold'>
          Files {files.length > 0 && `(${files.length})`}
        </p>
      </div>

      {files.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-1.5 px-4 py-10 text-center'>
          <FileText className='text-muted-foreground/30 h-7 w-7' />

          <p className='text-muted-foreground text-xs'>
            No files attached to this appointment.
          </p>
        </div>
      ) : (
        <div className='divide-border/60 divide-y'>
          {files.map((file) => (
            <a
              key={file.uid}
              href={file.file}
              download={file.file}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:bg-muted/40 flex items-center justify-between gap-3 p-4 text-sm transition-colors'
            >
              <div className='flex w-full min-w-0 items-center gap-2'>
                <FileText className='text-muted-foreground h-3.5 w-3.5 shrink-0' />

                <p className='min-w-0 flex-1 truncate font-medium'>
                  {file.name}
                </p>

                <Download className='text-primary ml-auto h-3.5 w-3.5 shrink-0' />
              </div>

              {file.uploaded_at && (
                <span className='text-muted-foreground shrink-0 text-xs'>
                  {formatDateAndTime(file.uploaded_at)}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FilesCard;
