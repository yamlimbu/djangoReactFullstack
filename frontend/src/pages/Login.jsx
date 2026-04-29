import Form from "../components/Form";

import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
  
    const handleSuccess = () => {
      navigate('/dashboard');
    };
  
    return <Form route="/api/token/" method="login" onSuccess={handleSuccess} />;
  }

  export default Login;
