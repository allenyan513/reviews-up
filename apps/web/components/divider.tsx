export function Divider(props: { className?: string }) {
  return (
    <div className={props.className}>
      <div className={'divider border-gray-200 w-full border-t'}></div>
    </div>
  );
}
