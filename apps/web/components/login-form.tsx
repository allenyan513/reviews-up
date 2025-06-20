'use client';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {BsGithub, BsGoogle, BsTwitterX} from 'react-icons/bs';
import {useUserContext} from '@/context/UserProvider';
import {useState} from 'react';
import toast from 'react-hot-toast';

export function LoginForm(props: {
  redirect?: string;
  className?: string;
}) {
  const {className, redirect} = props;
  const {googleSignIn, githubSignIn , twitterSignIn, sendMagicLink} = useUserContext();
  const [submitForm, setSubmitForm] = useState<{
    email: string;
  }>({
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitForm.email) return;
    sendMagicLink(submitForm.email, redirect)
      .then(() => {
        toast.success('Magic link sent to your email!');
        setSubmitForm({email: ''});
      })
      .catch((error) => {
        console.error(error);
        toast.error('Failed to send magic link. Please try again.');
      });
  };

  return (
    <form className={cn('flex flex-col gap-6', className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        {/*<p className="text-muted-foreground text-sm text-balance">*/}
        {/*  Enter your email below to login to your account*/}
        {/*</p>*/}
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={submitForm.email}
            onChange={(e) =>
              setSubmitForm({...submitForm, email: e.target.value})
            }
            placeholder="john.smith@gmail.com"
            required
          />
        </div>
        {/*<div className="grid gap-3">*/}
        {/*  <div className="flex items-center">*/}
        {/*    <Label htmlFor="password">Password</Label>*/}
        {/*    <a*/}
        {/*      href="#"*/}
        {/*      className="ml-auto text-sm underline-offset-4 hover:underline"*/}
        {/*    >*/}
        {/*      Forgot your password?*/}
        {/*    </a>*/}
        {/*  </div>*/}
        {/*  <Input id="password" type="password" required />*/}
        {/*</div>*/}
        <Button onClick={handleSubmit} type="submit" className="w-full">
          Send Magic Link
        </Button>
        <div
          className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button onClick={() => {
          googleSignIn(redirect);
        }} variant="outline" className="w-full">
          <BsGoogle/>
          Continue with Google
        </Button>
        <Button onClick={() => {
          twitterSignIn(redirect);
        }} variant="outline" className="w-full">
          <BsTwitterX/>
          Continue with Twitter/X
        </Button>
        <Button onClick={() => {
          githubSignIn(redirect);
        }} variant="outline" className="w-full">
          <BsGithub/>
          Continue with GitHub
        </Button>
      </div>
      {/*<div className="text-center text-sm">*/}
      {/*  Don&apos;t have an account?{' '}*/}
      {/*  <a href="#" className="underline underline-offset-4">*/}
      {/*    Sign up*/}
      {/*  </a>*/}
      {/*</div>*/}
    </form>
  );
}
