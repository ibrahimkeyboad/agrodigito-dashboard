'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Phone,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { toast } from 'sonner';

import { auth } from '@/lib/firebase/client';
import { createSession } from '@/app/auth/actions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

// 1. DEFINE VARIABLE OUTSIDE COMPONENT
// This ensures it survives re-renders and Strict Mode
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  // Use a ref to store the verifier so it doesn't get lost on re-renders
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Add this REF to track if the widget is currently solving
  // 2. CLEANUP ON LOAD
  useEffect(() => {
    // Force reset on page load
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container) container.innerHTML = '';
  }, []);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      // Re-create the verifier only if it doesn't exist
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {
            console.log('Recaptcha Resolved');
          },
          'expired-callback': () => {
            toast.error('Captcha expired');
            window.recaptchaVerifier?.clear();
            window.recaptchaVerifier = null;
          },
        },
      );
    }
    return window.recaptchaVerifier;
  };
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formattedPhone = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+255${phoneNumber.replace(/^0+/, '')}`;

      // 3. INITIALIZE VERIFIER
      const appVerifier = onCaptchVerify();

      // 4. SEND SMS
      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        appVerifier,
      );

      setConfirmationResult(result);
      setStep('otp');
      toast.success('Code sent!');
    } catch (error: any) {
      console.error(error);
      // Force Reset on Error
      window.recaptchaVerifier?.clear();
      window.recaptchaVerifier = null;
      document.getElementById('recaptcha-container')!.innerHTML = '';

      if (error.code === 'auth/invalid-app-credential') {
        toast.error('Security Blocked: Check Firebase App Check settings.');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many attempts. Wait 15 minutes.');
      } else {
        toast.error('Failed to send code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error('No session');
      const result = await confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      await createSession(idToken);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid Code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#F2F5F3] p-4'>
      {/* CRITICAL: This div must exist for Recaptcha to attach to. 
        It is hidden but must be present in the DOM. 
      */}
      <div id='recaptcha-container'></div>

      <div className='w-full max-w-md'>
        <div className='mb-8 text-center space-y-2'>
          <div className='h-12 w-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-green-600/20'>
            <ShieldCheck className='h-6 w-6 text-white' />
          </div>
          <h1 className='text-2xl font-bold text-slate-900'>
            AgroDigito Admin
          </h1>
          <p className='text-slate-500'>Secure access for shop owners</p>
        </div>

        <Card className='border-slate-200 shadow-xl shadow-slate-200/50'>
          <CardContent className='pt-6'>
            <AnimatePresence mode='wait'>
              {step === 'phone' && (
                <motion.form
                  key='step-phone'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                  onSubmit={handleSendOtp}>
                  <div className='space-y-2 text-center mb-6'>
                    <h2 className='text-lg font-semibold'>Welcome Back</h2>
                    <p className='text-sm text-slate-500'>
                      Enter your phone number to sign in
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <div className='relative'>
                      <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
                      <Input
                        type='tel'
                        placeholder='Phone Number (e.g. 0629...)'
                        className='pl-10 h-11 text-lg tracking-wide'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <Button
                    type='submit'
                    className='w-full h-11 bg-green-600 hover:bg-green-700 text-base'
                    disabled={loading || !phoneNumber}>
                    {loading ? (
                      <Loader2 className='h-5 w-5 animate-spin' />
                    ) : (
                      <>
                        Send Code <ArrowRight className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.div
                  key='step-otp'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className='space-y-6'>
                  <div className='space-y-2 text-center mb-2'>
                    <h2 className='text-lg font-semibold'>Verify OTP</h2>
                    <p className='text-sm text-slate-500'>
                      Enter the 6-digit code sent to your phone
                    </p>
                  </div>

                  <div className='flex justify-center py-4'>
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => {
                        setOtp(value);
                        if (value.length === 6) handleVerifyOtp();
                      }}
                      disabled={loading}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={0}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                        <InputOTPSlot
                          index={1}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                        <InputOTPSlot
                          index={2}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                      </InputOTPGroup>
                      <div className='w-4' />
                      <InputOTPGroup>
                        <InputOTPSlot
                          index={3}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                        <InputOTPSlot
                          index={4}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                        <InputOTPSlot
                          index={5}
                          className='h-12 w-12 text-lg border-slate-200'
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    className='w-full h-11 bg-green-600 hover:bg-green-700 text-base'
                    disabled={loading || otp.length !== 6}>
                    {loading ? (
                      <Loader2 className='h-5 w-5 animate-spin' />
                    ) : (
                      <>
                        Verify & Login <CheckCircle2 className='ml-2 h-4 w-4' />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
