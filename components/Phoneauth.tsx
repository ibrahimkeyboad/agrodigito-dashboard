'use client';

import { useState, useEffect } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';

export default function PhoneAuth() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize reCAPTCHA
    if (!recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
      });
      setRecaptchaVerifier(verifier);
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  }, [recaptchaVerifier]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier,
      );
      setConfirmationResult(confirmation);
      setStep('otp');
      setError('');
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send OTP. Please try again.');

      // Reset reCAPTCHA on error
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        const newVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        setRecaptchaVerifier(newVerifier);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!confirmationResult) {
        throw new Error('No confirmation result');
      }

      await confirmationResult.confirm(otp);
      // User is now signed in, AuthContext will handle the state update
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError('Invalid code. Please try again.');
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setStep('phone');
    setConfirmationResult(null);
    setError('');
  };

  return (
    <div className='w-full max-w-md'>
      <div id='recaptcha-container'></div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className='space-y-6'>
          <div className='space-y-2'>
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-white/90'>
              Phone Number
            </label>
            <input
              id='phone'
              type='tel'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder='+1234567890'
              disabled={loading}
              className='w-full px-4 py-3 bg-white/5 border-2 border-white/20 rounded-xl
                       text-white placeholder-white/40 focus:border-cyan-400 focus:ring-2 
                       focus:ring-cyan-400/20 transition-all duration-200 outline-none
                       backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed'
              autoComplete='tel'
            />
            <p className='text-xs text-white/60'>
              Include country code (e.g., +1 for US)
            </p>
          </div>

          {error && (
            <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading || !phoneNumber}
            className='w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white 
                     font-semibold rounded-xl transition-all duration-300 
                     hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     disabled:hover:shadow-none'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Verification Code'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className='space-y-6'>
          <div className='text-center space-y-4'>
            <div className='space-y-2'>
              <h3 className='text-xl font-semibold text-white'>
                Enter Verification Code
              </h3>
              <p className='text-sm text-white/60'>
                We sent a code to {phoneNumber}
              </p>
            </div>

            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              disabled={loading}>
              <InputOTPGroup className='gap-2'>
                {[...Array(6)].map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className='w-12 h-14 text-xl bg-white/5 border-2 border-white/20 rounded-xl text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center'>
              {error}
            </div>
          )}

          <button
            type='submit'
            disabled={loading || otp.length !== 6}
            className='w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white 
                     font-semibold rounded-xl transition-all duration-300 
                     hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-[1.02]
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     disabled:hover:shadow-none'>
            {loading ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </button>

          <button
            type='button'
            onClick={handleResendOTP}
            disabled={loading}
            className='w-full text-sm text-cyan-400 hover:text-cyan-300 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed'>
            Didn't receive the code? Try again
          </button>
        </form>
      )}
    </div>
  );
}
