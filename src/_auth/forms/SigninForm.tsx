import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Loader from '@/components/shared/Loader';

import { SigninValidation } from '@/lib/validation';
import { useSignInAccount } from '@/lib/react-query/queries';
import { useUserContext } from '@/context/AuthContext';

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // Queries
  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  // Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handler
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {
    const session = await signInAccount(user);

    // Check if session indicates user exists
    if (!session) {
      // User does not exist or login failed
      toast({
        title:
          'User does not exist or login failed. Please check your credentials.',
      });

      return;
    }

    // Check if user is authenticated after signing in
    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      // Handle other cases where login might fail
      toast({ title: 'Login failed. Please try again.' });
      
      return;
    }
  };

  return (
    <Form {...form}>
      <div className='sm:w-420 flex-center flex-col'>
        <img src='/assets/images/logo.svg' alt='logo' />

        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
          Log in to your account
        </h2>
        <p className='text-light-3 small-medium md:base-regular mt-2'>
          Welcome back! Please enter your details.
        </p>

        <form
          onSubmit={form.handleSubmit(handleSignin)}
          className='flex flex-col gap-5 w-full mt-4'
        >
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Email</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='Enter your email'
                    {...field}
                    className='shad-input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='shad-form_label'>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                    className='shad-input'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='shad-button_primary'>
            {isPending || isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : (
              'Log in'
            )}
          </Button>

          <p className='text-small-regular text-light-2 text-center mt-2'>
            Don&apos;t have an account?
            <Link
              to='/sign-up'
              className='text-primary-500 text-small-semibold ml-1'
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SigninForm;
