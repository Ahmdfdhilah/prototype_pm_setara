import { Button } from '@/components/ui/button';
import Logo from '../../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import LoginSvg from '../../assets/loginSvg.svg';
import GoogleIcon from '../../assets/googleIcon.svg';
import Navbar from '@/components/Navbar';

const Login = () => {
    const navigate = useNavigate();

    const handleSubmit = async () => {
        // For prototype, just redirect
        navigate('/dashboard');
    };

    return (
        <>
            <Navbar/>
            <div className="min-h-screen bg-white dark:bg-gray-900">
                <div className="flex flex-wrap items-center min-h-screen">
                    {/* Left Side - Illustration */}
                    <div className="hidden w-full xl:w-1/2 md:block">
                        <div className="py-17.5 px-26 text-center flex flex-col justify-center items-center h-full">
                            <img
                                src={Logo}
                                alt="Company Logo"
                                className="h-32 w-32 mb-8"
                            />
                            <img src={LoginSvg} alt="Login Illustration" className="w-96 h-auto" />

                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full xl:w-1/2 px-8 pt-6 md:pt-4">
                        <div className="max-w-md mx-auto">
                            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
                                Login SSO
                            </h2>

                            <div className="w-full">
                                <div className="space-y-6">
                                    {/* Login Message */}
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Login to access the ABI systems
                                    </p>

                                    {/* Google Login Button */}
                                    <Button
                                        onClick={handleSubmit}
                                        className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300
              dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:border-gray-600
              transition-colors duration-300"
                                    >
                                        <div className="flex justify-center space-x-3">
                                            <img src={GoogleIcon} className='w-5 h-5' alt="" />
                                            <span className="text-sm font-medium">Continue with Google</span>
                                        </div>
                                    </Button>

                                    {/* Additional Information */}
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                                        By continuing, you agree to our Terms of Service and Privacy Policy
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;