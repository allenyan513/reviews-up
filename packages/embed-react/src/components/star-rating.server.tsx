import { StarServer } from './star.server';

export function StarRatingServer(props: {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[...Array(5)].map((_, i) => (
        <StarServer key={i} isActive={props.value > i} size={props.size} />
      ))}
    </div>
  );
}
