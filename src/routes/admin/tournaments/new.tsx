import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { createTournament } from '@/services/tournament';

// Update the schema to match backend expectations
export const tournamentSchema = z
  .object({
    game: z.enum(['BGMI', 'FREEFIRE'], {
      required_error: 'Game selection is required',
    }),
    name: z.string().min(1, 'Tournament name is required').max(50, 'Name must be less than 50 characters'),
    description: z.string().max(250, 'Description must be less than 250 characters').optional(),
    roomId: z.string().regex(/^\d*$/, 'Room ID must contain only numeric characters').optional(),
    roomPassword: z.string().max(50, 'Room password must be less than 50 characters').optional(),
    entryFee: z.coerce.number().int('Entry fee must be a valid integer').nonnegative('Entry fee must be non-negative'),
    prize: z.coerce.number().int('Prize must be a valid integer').nonnegative('Prize must be non-negative'),
    perKillPrize: z.coerce
      .number()
      .int('Per kill prize must be a valid integer')
      .nonnegative('Per kill prize must be non-negative'),
    maxParticipants: z.coerce
      .number()
      .int('Max participants must be a valid integer')
      .positive('Maximum participants must be positive'),
    // Keep these for form handling but don't include in final output
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
  })
  .refine(
    (data) => {
      const now = new Date();
      const tournamentDateTime = new Date(`${data.date}T${data.time}`);
      return !isNaN(tournamentDateTime.getTime()) && tournamentDateTime > now;
    },
    {
      message: 'Tournament date and time must be in the future',
      path: ['date', 'time'],
    },
  );

export const Route = createFileRoute('/admin/tournaments/new')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      game: search.game,
    };
  },
});

function RouteComponent() {
  const { game: gameParam } = Route.useSearch();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // If URL has a valid game parameter, use it; otherwise leave it empty for user to select
  const initialGame =
    gameParam && ['BGMI', 'FREEFIRE'].includes(gameParam.toString().toUpperCase())
      ? (gameParam.toString().toUpperCase() as 'BGMI' | 'FREEFIRE')
      : '';

  const [tournamentData, setTournamentData] = useState({
    game: initialGame,
    name: 'test name ',
    description: 'something',
    roomId: '',
    roomPassword: '',
    entryFee: '50',
    prize: '500',
    perKillPrize: '10',
    maxParticipants: '20',
    date: '',
    time: '',
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['createTournament'],
    mutationFn: createTournament,
    onSuccess: (data) => {
      if (data.isAlert) {
        toast.error(data.message! || 'Some error occurred');
        console.error('Error creating tournament:', data);
        return;
      }
      toast.success('Tournament created successfully!', {
        duration: 4000,
      });

      // /admin/tournaments/$gameName/$tournamentsId'
      // Redirect to the tournament details page
      const tournamentId = data.tournament.id;
      navigate({
        to: `/admin/tournaments/${tournamentId}`,
      });

      console.log();
    },
    onError: (error) => {
      toast.error('Failed to create tournament. Please check your inputs.', {
        duration: 4000,
      });
      console.error('Error creating tournament:', error);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTournamentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTournamentData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setTournamentData((prev) => ({ ...prev, date: formattedDate }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // First validate the form data with our frontend schema
      const validated = tournamentSchema.parse(tournamentData);

      // Then transform to match backend schema by combining date and time
      const backendData = {
        game: validated.game,
        name: validated.name,
        description: validated.description,
        roomId: validated.roomId?.toString(),
        roomPassword: validated.roomPassword,
        entryFee: validated.entryFee,
        prize: validated.prize,
        perKillPrize: validated.perKillPrize,
        maxParticipants: validated.maxParticipants,
        scheduledAt: `${validated.date}T${validated.time}:00Z`, // Format as ISO string for backend
      };

      console.log('Sending tournament data:', backendData);

      // Send the transformed data to match backend expectations
      mutate(backendData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format zod errors into a more usable object
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            if (Array.isArray(err.path)) {
              err.path.forEach((path) => {
                formattedErrors[path] = err.message;
              });
            } else {
              formattedErrors[err.path[0]] = err.message;
            }
          }
        });
        setErrors(formattedErrors);

        toast.error('Please correct the validation errors', {
          duration: 4000,
        });
      } else {
        toast.error('Failed to create tournament. Please check your inputs.', {
          duration: 4000,
        });
      }
      console.error('Error submitting tournament data:', error);
    }
  };

  return (
    <div className='mx-auto max-w-3xl p-4'>
      <div className='space-y-2.5'>
        <p className='text-2xl font-bold'>Create New Tournament</p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Basic Info Section */}
          <div className='rounded-lg border border-gray-800 p-4'>
            <h3 className='mb-4 text-lg font-medium'>Basic Information</h3>

            {/* Game and Tournament Name - side by side on all screens */}
            <div className='grid grid-cols-1 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='game' className='text-sm font-medium'>
                  Game*
                </label>
                <Select
                  name='game'
                  value={tournamentData.game}
                  onValueChange={(value) => handleSelectChange('game', value)}
                >
                  <SelectTrigger className={`w-full ${errors.game ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder='Select game' />
                  </SelectTrigger>
                  <SelectContent className='dark'>
                    <SelectItem value='BGMI'>BGMI</SelectItem>
                    <SelectItem value='FREEFIRE'>FREEFIRE</SelectItem>
                  </SelectContent>
                </Select>
                {errors.game && <p className='mt-1 text-xs text-red-500'>{errors.game}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='name' className='text-sm font-medium'>
                  Tournament Name*
                </label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  value={tournamentData.name}
                  onChange={handleChange}
                  maxLength={255}
                  className={errors.name ? 'border-red-500' : ''}
                  required
                />
                {errors.name && <p className='mt-1 text-xs text-red-500'>{errors.name}</p>}
              </div>
            </div>

            {/* Description - full width */}
            <div className='mt-4 flex flex-col gap-1'>
              <label htmlFor='description' className='text-sm font-medium'>
                Description
              </label>
              <Input
                type='text'
                id='description'
                name='description'
                value={tournamentData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Prize & Participation Section */}
          <div className='rounded-lg border border-gray-800 p-4'>
            <h3 className='mb-4 text-lg font-medium'>Prize & Participation</h3>

            {/* Entry Fee and Prize Pool - side by side on all screens */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='entryFee' className='text-sm font-medium'>
                  Entry Fee ($)*
                </label>
                <Input
                  type='number'
                  id='entryFee'
                  name='entryFee'
                  min='0'
                  step='1'
                  value={tournamentData.entryFee}
                  onChange={handleChange}
                  className={errors.entryFee ? 'border-red-500' : ''}
                  required
                />
                {errors.entryFee && <p className='mt-1 text-xs text-red-500'>{errors.entryFee}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='prize' className='text-sm font-medium'>
                  Prize Pool ($)*
                </label>
                <Input
                  type='number'
                  id='prize'
                  name='prize'
                  min='0'
                  step='1'
                  value={tournamentData.prize}
                  onChange={handleChange}
                  className={errors.prize ? 'border-red-500' : ''}
                  required
                />
                {errors.prize && <p className='mt-1 text-xs text-red-500'>{errors.prize}</p>}
              </div>
            </div>

            {/* Max Participants and Per Kill Prize - side by side on all screens */}
            <div className='mt-4 grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='maxParticipants' className='text-sm font-medium'>
                  Max Participants*
                </label>
                <Input
                  type='number'
                  id='maxParticipants'
                  name='maxParticipants'
                  min='2'
                  step='1'
                  value={tournamentData.maxParticipants}
                  onChange={handleChange}
                  className={errors.maxParticipants ? 'border-red-500' : ''}
                  required
                />
                {errors.maxParticipants && <p className='mt-1 text-xs text-red-500'>{errors.maxParticipants}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='perKillPrize' className='text-sm font-medium'>
                  Prize/Kill ($)*
                </label>
                <Input
                  type='number'
                  id='perKillPrize'
                  name='perKillPrize'
                  min='0'
                  step='1'
                  value={tournamentData.perKillPrize}
                  onChange={handleChange}
                  className={errors.perKillPrize ? 'border-red-500' : ''}
                  required
                />
                {errors.perKillPrize && <p className='mt-1 text-xs text-red-500'>{errors.perKillPrize}</p>}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className='rounded-lg border border-gray-800 p-4'>
            <h3 className='mb-4 text-lg font-medium'>Schedule</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='date' className='text-sm font-medium'>
                  Date*
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='date'
                      variant={'outline'}
                      className={`w-full justify-start text-left text-xs font-normal sm:text-sm ${!selectedDate && 'text-muted-foreground'} ${errors.date ? 'border-red-500' : ''}`}
                    >
                      <CalendarIcon className='mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4' />
                      {selectedDate ? format(selectedDate, 'PP') : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='dark w-auto p-0' align='start'>
                    <Calendar mode='single' selected={selectedDate} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
                <Input type='hidden' id='dateHidden' name='date' value={tournamentData.date} required />
                {errors.date && <p className='mt-1 text-xs text-red-500'>{errors.date}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='time' className='text-sm font-medium'>
                  Time*
                </label>
                <Input
                  type='time'
                  id='time'
                  name='time'
                  value={tournamentData.time}
                  onChange={handleChange}
                  className={errors.time ? 'border-red-500' : ''}
                  required
                />
                {errors.time && <p className='mt-1 text-xs text-red-500'>{errors.time}</p>}
              </div>
            </div>
          </div>

          {/* Room Details Section */}
          <div className='rounded-lg border border-gray-800 p-4'>
            <h3 className='mb-4 text-lg font-medium'>Room Details</h3>
            <div className='grid grid-cols-1 gap-4'>
              <div className='flex flex-col gap-1'>
                <label htmlFor='roomId' className='text-sm font-medium'>
                  Room ID
                </label>
                <Input
                  type='number'
                  id='roomId'
                  name='roomId'
                  value={tournamentData.roomId}
                  onChange={handleChange}
                  className={errors.roomId ? 'border-red-500' : ''}
                />
                {errors.roomId && <p className='mt-1 text-xs text-red-500'>{errors.roomId}</p>}
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='roomPassword' className='text-sm font-medium'>
                  Room Password
                </label>
                <Input
                  type='text'
                  id='roomPassword'
                  name='roomPassword'
                  value={tournamentData.roomPassword}
                  onChange={handleChange}
                  className={errors.roomPassword ? 'border-red-500' : ''}
                />
                {errors.roomPassword && <p className='mt-1 text-xs text-red-500'>{errors.roomPassword}</p>}
              </div>
            </div>
          </div>

          <div className='text-sm text-gray-500'>* Required fields</div>

          <div className='flex w-full items-center justify-end pb-4'>
            <Button
              type='submit'
              disabled={isPending}
              className={`w-full ${isPending ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              {isPending ? (
                <>
                  <svg
                    className='text-primary mr-2 -ml-1 h-4 w-4 animate-spin'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Tournament'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
