import { Container } from '@mui/material';
import { Box, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function EmailSent() {
    const navigate = useNavigate();
    
    return (
        <Container>
            <Box className='auth-container items-center text-center'>
                <img src='../../public/illustrations/checkemail.png' alt='Check email illustration' className='mb-8 max-w-xs' />
                <Typography variant='h3' className='mb-4'>Check your email</Typography>
                <Typography variant='body1' className='mb-8'>
                    We have sent a verification code to your email.
                </Typography>
                <Button 
                    variant='contained' 
                    size='large'
                    onClick={() => navigate('/auth/verify-code')}
                    className='w-full h-12 mb-4'
                >
                    Enter Verification Code
                </Button>
                <Link to='/auth/sign-in' className='text-center text-sm text-primary mb-4 block'>
                    Skip, I'll confirm later
                </Link>
                <Typography variant='body2' className='text-center'>
                    Did not receive the email? Check your Spam folder or{' '}
                    <Link to='/auth/forgot-password' className='text-primary'>
                        try another email address
                    </Link>
                    .
                </Typography>
            </Box>
        </Container>
    );
}

export default EmailSent;
