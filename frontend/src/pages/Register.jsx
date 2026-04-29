import { useNavigate } from 'react-router-dom';
import Form from "../components/Form";

function Register() {
    const navigate = useNavigate();
  
    const handleSuccess = () => {
      navigate('/login');
    };
  
    return <Form route="/api/register/" method="register" onSuccess={handleSuccess} />;
}

export default Register;
